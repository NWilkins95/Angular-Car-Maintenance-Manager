import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Vehicle } from '../vehicle.model';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'cmm-vehicle-detail',
  standalone: false,
  templateUrl: './vehicle-detail.html',
  styleUrl: './vehicle-detail.css',
})
export class VehicleDetail {
  vehicle!: Vehicle;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.vehicle = this.vehicleService.getVehicle(id)!;
    });
  }

  onDelete() {
    this.vehicleService.deleteVehicle(this.vehicle);
    this.router.navigate(['/vehicles']);
  }
}
