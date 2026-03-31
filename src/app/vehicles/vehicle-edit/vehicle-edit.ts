import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Vehicle } from '../vehicle.model';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'cmm-vehicle-edit',
  standalone: false,
  templateUrl: './vehicle-edit.html',
  styleUrl: './vehicle-edit.css',
})
export class VehicleEdit implements OnInit {
  originalVehicle: Vehicle | null = null;
  vehicle: Vehicle = new Vehicle('', '', '', '', '', '');
  editMode = false;
  id = '';

  constructor(
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (!this.id) {
        this.editMode = false;
        return;
      }

      this.editMode = true;
      this.originalVehicle = this.vehicleService.getVehicle(this.id);

      if (!this.originalVehicle) {
        this.onCancel();
        return;
      }

      this.vehicle = new Vehicle(
        this.originalVehicle.id,
        this.originalVehicle.make,
        this.originalVehicle.model,
        this.originalVehicle.year,
        this.originalVehicle.mileage,
        this.originalVehicle.vin
      );
    });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newVehicle = new Vehicle(
      '',
      value.make,
      value.model,
      value.year,
      value.mileage || '',
      value.vin || ''
    );

    if (this.editMode && this.originalVehicle) {
      this.vehicleService.updateVehicle(this.originalVehicle, newVehicle);
    } else {
      this.vehicleService.addVehicle(newVehicle);
    }

    this.onCancel();
  }

  onCancel(): void {
    void this.router.navigate(['/vehicles']);
  }
}
