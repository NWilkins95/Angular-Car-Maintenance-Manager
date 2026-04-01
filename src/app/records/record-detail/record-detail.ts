import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../vehicles/vehicle.service';
import { Record } from '../record.model';
import { RecordService } from '../record.service';

@Component({
  selector: 'cmm-record-detail',
  standalone: false,
  templateUrl: './record-detail.html',
  styleUrl: './record-detail.css',
})
export class RecordDetail {
  record!: Record;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recordService: RecordService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.record = this.recordService.getRecord(id)!;
    });
  }

  onDelete(): void {
    this.recordService.deleteRecord(this.record);
    void this.router.navigate(['/records']);
  }

  getVehicleLabel(): string {
    if (!this.record?.vehicleId) {
      return 'Unknown Vehicle';
    }

    const vehicle = this.vehicleService.getVehicle(this.record.vehicleId);
    if (!vehicle) {
      return 'Unknown Vehicle';
    }

    return `${vehicle.make} ${vehicle.model}`;
  }

}
