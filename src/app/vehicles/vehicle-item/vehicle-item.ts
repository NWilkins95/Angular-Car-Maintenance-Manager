import { Component, Input } from '@angular/core';
import { Vehicle } from '../vehicle.model';

@Component({
  selector: 'cmm-vehicle-item',
  standalone: false,
  templateUrl: './vehicle-item.html',
  styleUrl: './vehicle-item.css',
})
export class VehicleItem {
  @Input() vehicle!: Vehicle;
}
