import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TrackingService} from './tracking.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
})
export class TrackingModule {

  static forRoot() {
    return {
      ngModule: TrackingModule,
      providers: [TrackingService]
    };
  }

}
