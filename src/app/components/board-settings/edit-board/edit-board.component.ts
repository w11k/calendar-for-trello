import {Component, OnInit, Input} from '@angular/core';
import {Board} from "../../../models/board";
import {SettingsActions} from "../../../redux/actions/settings-actions";
import {Observable} from "rxjs";
import {select} from "ng2-redux";

@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit {

  @select(state => state.settings.boardColorPrefs) public boardColorPrefs$: Observable<Object>;

  public colors = [
    {
      key: "",
      name: "Default"
    },
    {
      key: "blue",
      "name": "Blue"
    },
    {
      key: "red",
      "name": "Red"
    },
    {
      key: "green",
      "name": "Green"
    }
  ];
  public color: string;

  @Input() board: Board;

  constructor(private settingsActions: SettingsActions) {
  }

  updateColor(color: string) {
    this.settingsActions.setBoardColor(this.board.id, color);
  }

  ngOnInit() {
    this.boardColorPrefs$.subscribe(
      prefs => {
        if (prefs[this.board.id]) {
          console.log(prefs[this.board.id]);
          this.color = prefs[this.board.id]
        } else {
          this.color = "";
        }
      }
    );
  }
}
