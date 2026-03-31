import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Vehicles } from './vehicles/vehicles';
import { Records } from './records/records';
import { VehicleEdit } from './vehicles/vehicle-edit/vehicle-edit';
import { VehicleDetail } from './vehicles/vehicle-detail/vehicle-detail';
import { RecordEdit } from './records/record-edit/record-edit';
import { RecordDetail } from './records/record-detail/record-detail';

const appRoutes: Routes = [
  { path: '', redirectTo: '/records', pathMatch: 'full' },
  { path: 'records', component: Records, children: [
      { path: 'new', component: RecordEdit },
      { path: ':id', component: RecordDetail },
      { path: ':id/edit', component: RecordEdit }
  ]},
  { path: 'vehicles', component: Vehicles, children: [
      { path: 'new', component: VehicleEdit },
      { path: ':id', component: VehicleDetail },
      { path: ':id/edit', component: VehicleEdit }
  ] }
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
