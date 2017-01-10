import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AboutPageComponent} from './about-page/about-page.component';
import {W11kInfoComponent} from './w11k-info/w11k-info.component';
import {MaterialModule} from "@angular/material";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [AboutPageComponent, W11kInfoComponent],
  exports: [W11kInfoComponent],
})
export class AboutModule {
}
