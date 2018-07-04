import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Observable} from 'rxjs';
import {SettingsActions} from '../../redux/actions/settings-actions';
import {Settings} from '../../models/settings';
import {LabelMap} from '../../redux/reducers/label.reducer';
import {FormControl} from '@angular/forms';
import {componentDestroyed} from 'ng2-rx-componentdestroyed';

import {TrelloHttpService} from '../../services/trello-http.service';

@Component({
  selector: 'app-label-selector',
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.scss']
})
export class LabelSelectorComponent implements OnInit, OnDestroy {

  @select('labels') public labels$: Observable<LabelMap>;
  @select('settings') public settings$: Observable<Settings>;
  labelsMap: { [name: string]: string; } = {};
  labelCtrl: FormControl;

  constructor(private settingsActions: SettingsActions, private tHttp: TrelloHttpService) {
  }

  ngOnInit() {
    this.labels$.takeUntil(componentDestroyed(this)).subscribe(
        labels => {
          this.labelsMap['All labels'] = '';
          for (let key of Object.keys(labels)) {
            let name = labels[key].name;
              if (name in this.labelsMap) {
                this.labelsMap[name] = this.labelsMap[name] + ',' + labels[key].id;
              } else {
                this.labelsMap[name] = labels[key].id;
              }
          }
    });

    this.labelCtrl = new FormControl();

    this.settings$.takeUntil(componentDestroyed(this))
        .subscribe(settings => this.labelCtrl
        .patchValue(settings.filterForLabel, {onlySelf: true, emitEvent: false}));

    this.labelCtrl.valueChanges
        .takeUntil(componentDestroyed((this)))
        .subscribe(res => this.update(res));
  }

  update(labelId) {
    this.settingsActions.setFilterForLabel(labelId);
  }

  ngOnDestroy() {
  }
}
