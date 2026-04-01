import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vehicle } from '../../vehicles/vehicle.model';
import { VehicleService } from '../../vehicles/vehicle.service';
import { Record } from '../record.model';
import { RecordService } from '../record.service';

@Component({
  selector: 'cmm-record-list',
  standalone: false,
  templateUrl: './record-list.html',
  styleUrl: './record-list.css',
})
export class RecordList {
  records: Record[] = [];
  filteredRecords: Record[] = [];
  vehicles: Vehicle[] = [];
  selectedVehicleId = '';
  private recordSubscription?: Subscription;
  private vehicleSubscription?: Subscription;

  constructor(
    private recordService: RecordService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.records = this.recordService.getRecords();
    this.vehicles = this.vehicleService.getVehicles();
    this.applyVehicleFilter();

    this.recordSubscription = this.recordService.recordListChangedEvent.subscribe(
      (records: Record[]) => {
        this.records = records;
        this.applyVehicleFilter();
      }
    );

    this.vehicleSubscription = this.vehicleService.vehicleListChangedEvent.subscribe(
      (vehicles: Vehicle[]) => {
        this.vehicles = vehicles;
        this.ensureFilterIsValid();
        this.applyVehicleFilter();
      }
    );
  }

  onVehicleFilterChange(vehicleId: string): void {
    this.selectedVehicleId = vehicleId;
    this.applyVehicleFilter();
  }

  getVehicleLabel(vehicleId: string): string {
    const selectedVehicle = this.vehicles.find((vehicle) => vehicle.id === vehicleId);
    if (!selectedVehicle) {
      return 'Unknown Vehicle';
    }

    return `${selectedVehicle.make} ${selectedVehicle.model}`;
  }

  ngOnDestroy(): void {
    this.recordSubscription?.unsubscribe();
    this.vehicleSubscription?.unsubscribe();
  }

  private applyVehicleFilter(): void {
    if (!this.selectedVehicleId) {
      this.filteredRecords = this.records.slice();
      return;
    }

    this.filteredRecords = this.records.filter(
      (record) => record.vehicleId === this.selectedVehicleId
    );
  }

  private ensureFilterIsValid(): void {
    if (!this.selectedVehicleId) {
      return;
    }

    const selectedVehicleStillExists = this.vehicles.some(
      (vehicle) => vehicle.id === this.selectedVehicleId
    );

    if (!selectedVehicleStillExists) {
      this.selectedVehicleId = '';
    }
  }
}
