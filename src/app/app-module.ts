import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Vehicles } from './vehicles/vehicles';
import { VehicleDetail } from './vehicles/vehicle-detail/vehicle-detail';
import { VehicleEdit } from './vehicles/vehicle-edit/vehicle-edit';
import { VehicleItem } from './vehicles/vehicle-item/vehicle-item';
import { VehicleList } from './vehicles/vehicle-list/vehicle-list';
import { Records } from './records/records';
import { RecordDetail } from './records/record-detail/record-detail';
import { RecordEdit } from './records/record-edit/record-edit';
import { RecordItem } from './records/record-item/record-item';
import { RecordList } from './records/record-list/record-list';
import { Header } from './header';

@NgModule({
  declarations: [
    App,
    Vehicles,
    VehicleDetail,
    VehicleEdit,
    VehicleItem,
    VehicleList,
    Records,
    RecordDetail,
    RecordEdit,
    RecordItem,
    RecordList,
    Header
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
