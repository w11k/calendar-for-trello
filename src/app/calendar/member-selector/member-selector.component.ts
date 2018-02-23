import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Member} from '../../models/member';
import {Observable} from 'rxjs';
import {SettingsActions} from '../../redux/actions/settings-actions';
import {Settings} from '../../models/settings';
import {MemberMap} from '../../redux/reducers/member.reducer';
import {FormControl} from '@angular/forms';
import {componentDestroyed} from 'ng2-rx-componentdestroyed';

@Component({
  selector: 'app-member-selector',
  templateUrl: './member-selector.component.html',
  styleUrls: ['./member-selector.component.scss']
})
export class MemberSelectorComponent implements OnInit, OnDestroy {

  @select('members') public members$: Observable<MemberMap>;
  @select('settings') public settings$: Observable<Settings>;
  membersArr: Member[] = [];
  memberCtrl: FormControl;

  constructor(private settingsActions: SettingsActions) {
  }

  ngOnInit() {

    this.members$
        .takeUntil(componentDestroyed(this))
        .subscribe(
        members => {
          this.membersArr.push(new Member(null, 'All Members'));
          for (let key of Object.keys(members)) {
            this.membersArr.push(members[key]);
          }
        });

    this.memberCtrl = new FormControl();


    this.settings$.takeUntil(componentDestroyed(this))
        .subscribe(settings => this.memberCtrl
        .patchValue(settings.filterForUser, {onlySelf: true, emitEvent: false}));

    this.memberCtrl.valueChanges
        .takeUntil(componentDestroyed((this)))
        .subscribe(res => this.update(res));
  }


  update(memberId) {
    this.settingsActions.setFilterForUser(memberId);
  }

  ngOnDestroy() {
  }
}
