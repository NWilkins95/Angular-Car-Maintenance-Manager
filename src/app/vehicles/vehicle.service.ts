import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MOCKVEHICLES } from './MOCKVEHICLES';
import { Vehicle } from './vehicle.model';
import { RecordService } from '../records/record.service';

@Injectable({
    providedIn: 'root'
})

export class VehicleService {
    vehicles: Vehicle[] = [];
    maxVehicleId = 0;
    vehicleListChangedEvent = new Subject<Vehicle[]>();
    private vehiclesUrl = 'http://localhost:3000/vehicles';

    constructor(private http: HttpClient, private recordService: RecordService) {
        // Keep constructor empty so server data is attempted first.
    }

    private initializeFromMockData(): void {
        this.vehicles = MOCKVEHICLES.map(
            vehicle => new Vehicle(vehicle.id, vehicle.make, vehicle.model, vehicle.year, vehicle.mileage, vehicle.vin)
        );
        this.maxVehicleId = this.getMaxId();
    }

    getMaxId(): number {
        let maxId = 0;

        for (const vehicle of this.vehicles) {
            const currentId = Number(vehicle.id);
            if (currentId > maxId) {
                maxId = currentId;
            }
        }

        return maxId;
    }

    getVehicles(): Vehicle[] {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        // Keep the first render sorted 
        this.vehicles.sort((currentVehicle: Vehicle, nextVehicle: Vehicle) => {
            const currentLabel = `${currentVehicle.make} ${currentVehicle.model}`.toLowerCase();
            const nextLabel = `${nextVehicle.make} ${nextVehicle.model}`.toLowerCase();

            if (currentLabel < nextLabel) {
                return -1;
            }

            if (currentLabel > nextLabel) {
                return 1;
            }

            return 0;
        });

        this.http.get<{ message?: string; vehicles: Vehicle[] }>(this.vehiclesUrl, { headers }).subscribe(
            (responseData) => {
                this.vehicles = responseData.vehicles || [];
                this.maxVehicleId = this.getMaxId();
                this.sortAndSend();
            },
            (error: any) => {
                console.error(error);
                this.initializeFromMockData();
                this.sortAndSend();
            }
        );

        return this.vehicles.slice();
    }

    getVehicle(id: string): Vehicle | null {
        for (const vehicle of this.vehicles) {
            if (vehicle.id === id) {
                return vehicle;
            }
        }

        return null;
    }

    deleteVehicle(vehicle: Vehicle) {
        if (!vehicle) {
            return;
        }

        const pos = this.vehicles.findIndex(v => v.id === vehicle.id);
        if (pos < 0) {
            return;
        }

        this.http.delete(this.vehiclesUrl + '/' + vehicle.id).subscribe(
            () => {
                this.vehicles.splice(pos, 1);
                this.recordService.deleteRecordsForVehicle(vehicle.id);
                this.sortAndSend();
            },
            (error: any) => {
                console.error(error);
                this.vehicles.splice(pos, 1);
                this.recordService.deleteRecordsForVehicle(vehicle.id);
                this.sortAndSend();
            }
        );
    }

    addVehicle(newVehicle: Vehicle) {
        if (!newVehicle) {
            return;
        }

        newVehicle.id = '';

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        this.http.post<{ message?: string; vehicle: Vehicle }>(this.vehiclesUrl, newVehicle, { headers }).subscribe(
            (responseData) => {
                this.vehicles.push(responseData.vehicle);
                this.sortAndSend();
            },
            (error: any) => {
                console.error(error);
                newVehicle.id = String(++this.maxVehicleId);
                this.vehicles.push(newVehicle);
                this.sortAndSend();
            }
        );
    }

    updateVehicle(originalVehicle: Vehicle, newVehicle: Vehicle) {
        if (!originalVehicle || !newVehicle) {
            return;
        }

        const pos = this.vehicles.findIndex(v => v.id === originalVehicle.id);
        if (pos < 0) {
            return;
        }

        newVehicle.id = originalVehicle.id;

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        this.http.put(this.vehiclesUrl + '/' + originalVehicle.id, newVehicle, { headers }).subscribe(
            () => {
                this.vehicles[pos] = newVehicle;
                this.sortAndSend();
            },
            (error: any) => {
                console.error(error);
                this.vehicles[pos] = newVehicle;
                this.sortAndSend();
            }
        );
    }

    private sortAndSend() {
        this.vehicles.sort((currentVehicle: Vehicle, nextVehicle: Vehicle) => {
            const currentLabel = `${currentVehicle.make} ${currentVehicle.model}`.toLowerCase();
            const nextLabel = `${nextVehicle.make} ${nextVehicle.model}`.toLowerCase();

            if (currentLabel < nextLabel) {
                return -1;
            }

            if (currentLabel > nextLabel) {
                return 1;
            }

            return 0;
        });

        this.vehicleListChangedEvent.next(this.vehicles.slice());
    }
}
