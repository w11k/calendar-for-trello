import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {select} from 'ng2-redux';
import {SettingsActions} from '../../redux/actions/settings-actions';
import {Board} from '../../models/board';
import {selectBoardColorPrefs, selectBoardVisibilityPrefs} from '../../redux/store/selects';


@Component({
  selector: 'app-edit-board',
  templateUrl: './edit-board.component.html',
  styleUrls: ['./edit-board.component.scss']
})
export class EditBoardComponent implements OnInit, OnDestroy {

  @select(selectBoardColorPrefs) public boardColorPrefs$: Observable<Object>;
  @select(selectBoardVisibilityPrefs) public boardVisibilityPrefs$: Observable<Object>;

  public colors = [
    {key: 'Navy', name: 'Navy', font: 'rgba(255,255,255,0.75)'},
    {key: 'MediumBlue', name: 'MediumBlue', font: 'rgba(255,255,255,0.75)'},
    {key: 'DarkGreen', name: 'DarkGreen', font: 'rgba(255,255,255,0.75)'},
    {key: 'Green', name: 'Green', font: 'rgba(255,255,255,0.75)'},
    {key: 'Teal', name: 'Teal', font: 'rgba(255,255,255,0.75)'},
    {key: 'DeepSkyBlue', name: 'DeepSkyBlue', font: 'rgba(0,0,0,0.75)'},
    {key: 'Lime', name: 'Lime', font: 'rgba(0,0,0,0.75)'},
    {key: 'DarkSlateGray', name: 'DarkSlateGray', font: 'rgba(255,255,255,0.75)'},
    {key: 'Indigo', name: 'Indigo', font: 'rgba(255,255,255,0.75)'},
    {key: 'DarkRed', name: 'DarkRed', font: 'rgba(255,255,255,0.75)'},
    {key: 'Azure', name: 'Azure', font: 'rgba(0,0,0,0.75)'},
    {key: 'DarkOrange', name: 'DarkOrange', font: 'rgba(0,0,0,0.75)'},
    {key: 'DeepPink', name: 'DeepPink', font: 'rgba(0,0,0,0.75)'},
    {key: 'Pink', name: 'Pink', font: 'rgba(0,0,0,0.75)'},
    {key: 'Yellow', name: 'Yellow', font: 'rgba(0,0,0,0.75)'},
    {key: 'Gold', name: 'Gold', font: 'rgba(0,0,0,0.75)'},
  ];
  public color: string;
  public visibility;
  public visibilities = [
    {
        key: true,
        name: 'Hidden'
    },
    {
        key: false,
        'name': 'Visible'
    },
  ];
  private subscriptions: Subscription[] = [];

  @Input() board: Board;

  constructor(private settingsActions: SettingsActions) {
  }

  updateColor(color: string) {
    this.settingsActions.setBoardColor(this.board.id, color);
  }

  public getColorByKey(key: string) {
    return this.colors.find(color => color.key === key);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.boardColorPrefs$.subscribe(
        prefs => {
          if (prefs[this.board.id]) {
            this.color = prefs[this.board.id];
          } else {
            this.color = '';
          }
        }
      ));
    this.subscriptions.push(
      this.boardVisibilityPrefs$.subscribe(
        prefs => {
          if (prefs[this.board.id]) {
            this.visibility = prefs[this.board.id];
          } else {
            this.visibility = false;
          }
        }
      ));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public updateVisibility(boolStr: boolean) {
    this.settingsActions.setBoardVisibility(this.board.id, boolStr);
  }

}
