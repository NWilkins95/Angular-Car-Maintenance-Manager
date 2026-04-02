import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MOCKRECORDS } from './MOCKRECORDS';
import { Record } from './record.model';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  records: Record[] = [];
  maxRecordId = 0;
  recordListChangedEvent = new Subject<Record[]>();
  private recordsUrl = 'http://localhost:3000/records';

  constructor(private http: HttpClient) {
    // Keep constructor empty so server data is attempted first.
  }

  private initializeFromMockData(): void {
    this.records = MOCKRECORDS.map(
      (record) =>
        new Record(
          record.id,
          record.vehicleId,
          record.date,
          record.serviceType,
          record.description,
          record.mileage,
          record.cost
        )
    );
    this.maxRecordId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;

    for (const record of this.records) {
      const currentId = Number(record.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  getRecords(): Record[] {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.get<{ message?: string; records: Record[] }>(this.recordsUrl, { headers }).subscribe(
      (responseData) => {
        this.records = responseData.records || [];
        this.maxRecordId = this.getMaxId();
        this.sortAndSend();
      },
      (error: unknown) => {
        console.error(error);
        this.initializeFromMockData();
        this.sortAndSend();
      }
    );

    return this.records.slice();
  }

  getRecord(id: string): Record | null {
    for (const record of this.records) {
      if (record.id === id) {
        return record;
      }
    }

    return null;
  }

  getRecordsForVehicle(vehicleId: string): Record[] {
    const filteredRecords = this.records.filter((record) => record.vehicleId === vehicleId);
    return this.sortRecords(filteredRecords);
  }

  deleteRecord(record: Record): void {
    if (!record) {
      return;
    }

    const pos = this.records.findIndex((existingRecord) => existingRecord.id === record.id);
    if (pos < 0) {
      return;
    }

    this.http.delete(this.recordsUrl + '/' + record.id).subscribe(
      () => {
        this.records.splice(pos, 1);
        this.sortAndSend();
      },
      (error: unknown) => {
        console.error(error);
        this.records.splice(pos, 1);
        this.sortAndSend();
      }
    );
  }

  addRecord(newRecord: Record): void {
    if (!newRecord) {
      return;
    }

    newRecord.id = '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post<{ message?: string; record: Record }>(this.recordsUrl, newRecord, { headers }).subscribe(
      (responseData) => {
        this.records.push(responseData.record);
        this.sortAndSend();
      },
      (error: unknown) => {
        console.error(error);
        newRecord.id = String(++this.maxRecordId);
        this.records.push(newRecord);
        this.sortAndSend();
      }
    );
  }

  updateRecord(originalRecord: Record, newRecord: Record): void {
    if (!originalRecord || !newRecord) {
      return;
    }

    const pos = this.records.findIndex((existingRecord) => existingRecord.id === originalRecord.id);
    if (pos < 0) {
      return;
    }

    newRecord.id = originalRecord.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.put(this.recordsUrl + '/' + originalRecord.id, newRecord, { headers }).subscribe(
      () => {
        this.records[pos] = newRecord;
        this.sortAndSend();
      },
      (error: unknown) => {
        console.error(error);
        this.records[pos] = newRecord;
        this.sortAndSend();
      }
    );
  }

  deleteRecordsForVehicle(vehicleId: string): void {
    if (!vehicleId) {
      return;
    }

    const associatedRecords = this.records.filter((record) => record.vehicleId === vehicleId);
    if (associatedRecords.length === 0) {
      return;
    }

    for (const record of associatedRecords) {
      this.http.delete(this.recordsUrl + '/' + record.id).subscribe({
        error: (error: unknown) => console.error(error)
      });
    }

    this.records = this.records.filter((record) => record.vehicleId !== vehicleId);
    this.sortAndSend();
  }

  private sortAndSend(): void {
    this.sortRecords();
    this.recordListChangedEvent.next(this.records.slice());
  }

  private sortRecords(recordsToSort: Record[] = this.records): Record[] {
    return recordsToSort.sort((currentRecord: Record, nextRecord: Record) => {
      const currentDate = currentRecord.date || '';
      const nextDate = nextRecord.date || '';

      if (currentDate > nextDate) {
        return -1;
      }

      if (currentDate < nextDate) {
        return 1;
      }

      const currentType = (currentRecord.serviceType || '').toLowerCase();
      const nextType = (nextRecord.serviceType || '').toLowerCase();

      if (currentType < nextType) {
        return -1;
      }

      if (currentType > nextType) {
        return 1;
      }

      return 0;
    });
  }
}