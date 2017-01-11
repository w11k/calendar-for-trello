import {Component, OnInit} from '@angular/core';
import {select} from "ng2-redux";
import {Observable} from "rxjs";
import {Board} from "../models/board";
import {SettingsActions} from "../redux/actions/settings-actions";
import {Language} from "./language";
import {Settings} from "../models/settings";
import * as moment from "moment";

@Component({
  selector: 'app-board-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public languages: Language[] = [];

  @select("boards") public boards$: Observable<Board[]>;
  boards: Board[];

  @select("settings") public settings$: Observable<Settings>;
  public settings: Settings = new Settings();

  constructor(private settingsActions: SettingsActions) {
    this.languages.push(new Language("de", "Deutsche"));
    this.languages.push(new Language("en", "English"));
    this.languages.push(new Language("fr", "Français"));
  }

  public updateLang(locale: string) {
    this.settingsActions.setLanguage(locale);
  }


  ngOnInit() {
    this.boards$.subscribe(
      boards => {
        this.boards = boards
          .filter(board => !board.closed)
          .map(board => Object.assign({}, board));
      }
    );

    this.settings$.subscribe(
      settings => {
        this.settings = settings;
        moment.locale(settings.language);
      }
    )
  }
}
