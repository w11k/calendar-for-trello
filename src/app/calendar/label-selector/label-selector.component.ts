import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Label} from '../../models/label';
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
  labelsMap: { [name: string]: string; } = {}; // Feature: filtro per etichetta - DONE: 25.06.18
  labelCtrl: FormControl;

  constructor(private settingsActions: SettingsActions, private tHttp: TrelloHttpService) {
  }

  ngOnInit() {
    console.log('ciaou1');
    // Feature: filtro per etichetta - DONE: 25.06.18
    // Recupero le label di tutte le board tramite la funzione di pull e recupero i nomi e i loro id
    // siccome le label hanno più id associati, devo accorpare per ogni voce tutti gli id delle label e non mostrare duplicati.
    // tutti gli id sono concatenati da una virgola.
    this.labels$.takeUntil(componentDestroyed(this)).subscribe(
        labels => {
          this.labelsMap['Tutti'] = '';
          for (let key of Object.keys(labels)) {
            let name = labels[key].name;
              if (name in this.labelsMap) {
                this.labelsMap[name] = this.labelsMap[name] + ',' + labels[key].id;
              } else {
                this.labelsMap[name] = labels[key].id;
              }

              console.log('CIAO: ' + this.labelsMap[name]);
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

  // Quando cambia il valore della "LABEL" scelta lo recupera e aggiorna le card da mostrare.
  update(labelId) {
    this.settingsActions.setFilterForLabel(labelId);
  }

  ngOnDestroy() {
  }
}
