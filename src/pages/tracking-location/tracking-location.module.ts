import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { TrackingLocationPage } from './tracking-location';

@NgModule({
  declarations: [
    TrackingLocationPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackingLocationPage)
  ],
  exports: [
    TrackingLocationPage
  ]
})
export class TrackingLocationPageModule { }