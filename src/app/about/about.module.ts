import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AboutPageComponent} from './about-page/about-page.component';
import {W11kInfoComponent} from './w11k-info/w11k-info.component';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatCardModule, MatIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [AboutPageComponent, W11kInfoComponent],
  exports: [W11kInfoComponent],
})
export class AboutModule {
}
