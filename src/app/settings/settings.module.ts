import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {EditBoardComponent} from './edit-board/edit-board.component';
import {FormsModule} from '@angular/forms';
import {
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatListModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatSelectModule,
    MatRadioModule,
    FlexLayoutModule,
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  declarations: [
    SettingsComponent,
    EditBoardComponent
  ]
})
export class SettingsModule {
}
