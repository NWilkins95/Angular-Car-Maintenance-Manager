import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vehicle } from '../vehicle.model';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'cmm-vehicle-list',
  standalone: false,
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  private subscription?: Subscription;

  constructor(private vehicleService: VehicleService) {}

  ngOnInit(): void {
    this.vehicles = this.vehicleService.getVehicles();
    this.subscription = this.vehicleService.vehicleListChangedEvent.subscribe(
      (vehicles: Vehicle[]) => {
        this.vehicles = vehicles;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
