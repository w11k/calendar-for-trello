import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoardSettingsComponent} from './board-settings.component';
import {EditBoardComponent} from "./edit-board/edit-board.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    BoardSettingsComponent,
    EditBoardComponent
  ]
})
export class BoardSettingsModule {
}
