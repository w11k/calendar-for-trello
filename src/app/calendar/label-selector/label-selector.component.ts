import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Settings} from '../../models/settings';
import {SettingsActions} from '../../redux/actions/settings-actions';
import {select} from '@angular-redux/store';
import {untilComponentDestroyed} from 'ng2-rx-componentdestroyed';
import {selectVisibleLabelsInRange} from '../../redux/store/selects';
import {Label} from '../../models/label';

/**
 * This feature was brought to you by https://github.com/JEricaM
 *
 * Thanks for your contribution JEricaM
 * */


@Component({
  selector: 'app-label-selector',
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.scss']
})
export class LabelSelectorComponent implements OnInit, OnDestroy {

  @select(selectVisibleLabelsInRange) public labels$: Observable<Label[]>;
  public selectOptions$: Observable<Label[]>;
  @select('settings') public settings$: Observable<Settings>;
  labelCtrl = new FormControl(null);

  constructor(private settingsActions: SettingsActions) {
    this.selectOptions$ = this.labels$;
  }

  @HostBinding('class.active') get isActive() {
    return this.labelCtrl.value !== null;
  }

  ngOnInit() {

    this.settings$
      .pipe(untilComponentDestroyed(this))
      .subscribe((settings: Settings) => this.labelCtrl.patchValue(settings.filterForLabel, {
        onlySelf: true,
        emitEvent: false
      }));

    this.labelCtrl.valueChanges
      .pipe(untilComponentDestroyed(this))
      .subscribe((res: string) => this.update(res));
  }

  update(labelName: string) {
    this.settingsActions.setFilterForLabel(labelName);
  }

  ngOnDestroy() {
  }

}
