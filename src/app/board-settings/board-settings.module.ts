import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardSettingsComponent} from './board-settings.component';
import {EditBoardComponent} from "./edit-board/edit-board.component";
import {FormsModule} from "@angular/forms";
import {MdListModule, MdSelectModule, MdCardModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdListModule,
    MdSelectModule,
    FlexLayoutModule,
    MdCardModule,
  ],
  declarations: [
    BoardSettingsComponent,
    EditBoardComponent
  ]
})
export class BoardSettingsModule {
}
