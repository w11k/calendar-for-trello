import {Component, OnInit, Input} from '@angular/core';
import {Observable} from "rxjs";
import {select} from "ng2-redux";
import {SettingsActions} from "../../redux/actions/settings-actions";
import {Board} from "../../models/board";
import {selectBoardColorPrefs, selectBoardVisibilityPrefs} from "../../redux/store/selects";


@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit {

  @select(selectBoardColorPrefs) public boardColorPrefs$: Observable<Object>;
  @select(selectBoardVisibilityPrefs) public boardVisibilityPrefs$: Observable<Object>;

  public colors = [
    {key: "Navy", name: "Navy"},
    {key: "MediumBlue", name: "MediumBlue"},
    {key: "DarkGreen", name: "DarkGreen"},
    {key: "Green", name: "Green"},
    {key: "Teal", name: "Teal"},
    {key: "DeepSkyBlue", name: "DeepSkyBlue"},
    {key: "Lime", name: "Lime"},
    {key: "DarkSlateGray", name: "DarkSlateGray"},
    {key: "Indigo", name: "Indigo"},
    {key: "DarkRed", name: "DarkRed"},
    {key: "Azure", name: "Azure"},
    {key: "DarkOrange", name: "DarkOrange"},
    {key: "DeepPink", name: "DeepPink"},
    {key: "Pink", name: "Pink"},
    {key: "Yellow", name: "Yellow"},
    {key: "Gold", name: "Gold"},
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
          this.color = prefs[this.board.id]
        } else {
          this.color = "";
        }
      }
    );

    this.boardVisibilityPrefs$.subscribe(
      prefs => {
        if (prefs[this.board.id]) {
          this.visibility = prefs[this.board.id]
        } else {
          this.visibility = false;
        }
      }
    );
  }

  public visibility;
  public visibilities = [
    {
      key: true,
      name: "Hidden"
    },
    {
      key: false,
      "name": "Visible"
    },
  ];

  public updateVisibility(boolStr: string) {
    this.settingsActions.setBoardVisibility(this.board.id, (boolStr === "true"));
  }

}
