import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImprintComponent} from './imprint/imprint.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {MatCardModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
  ],
  declarations: [ImprintComponent, PrivacyComponent]
})
export class LegalModule {
}
