import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Vehicle } from '../../vehicles/vehicle.model';
import { VehicleService } from '../../vehicles/vehicle.service';
import { Record } from '../record.model';
import { RecordService } from '../record.service';

@Component({
  selector: 'cmm-record-edit',
  standalone: false,
  templateUrl: './record-edit.html',
  styleUrl: './record-edit.css',
})
export class RecordEdit implements OnInit {
  originalRecord: Record | null = null;
  record: Record = new Record('', '', '', '', '', '');
  vehicles: Vehicle[] = [];
  editMode = false;
  id = '';

  constructor(
    private recordService: RecordService,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.vehicles = this.vehicleService.getVehicles();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];

      if (!this.id) {
        this.editMode = false;
        return;
      }

      this.editMode = true;
      this.originalRecord = this.recordService.getRecord(this.id);

      if (!this.originalRecord) {
        this.onCancel();
        return;
      }

      this.record = new Record(
        this.originalRecord.id,
        this.originalRecord.vehicleId,
        this.originalRecord.date,
        this.originalRecord.serviceType,
        this.originalRecord.description,
        this.originalRecord.cost
      );
    });
  }

  onSubmit(form: NgForm): void {
    const value = form.value;
    const newRecord = new Record(
      '',
      value.vehicleId,
      value.date,
      value.serviceType,
      value.description || '',
      value.cost || ''
    );

    if (this.editMode && this.originalRecord) {
      this.recordService.updateRecord(this.originalRecord, newRecord);
    } else {
      this.recordService.addRecord(newRecord);
    }

    this.onCancel();
  }

  onCancel(): void {
    void this.router.navigate(['/records']);
  }
}
