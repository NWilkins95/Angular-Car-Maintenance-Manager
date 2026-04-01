import { Component, Input } from '@angular/core';
import { Record } from '../record.model';

@Component({
  selector: 'cmm-record-item',
  standalone: false,
  templateUrl: './record-item.html',
  styleUrl: './record-item.css',
})
export class RecordItem {
  @Input() record!: Record;
  @Input() vehicleLabel = '';
}
