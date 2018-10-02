import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Member} from '../../models/member';
import {Observable} from 'rxjs';
import {SettingsActions} from '../../redux/actions/settings-actions';
import {Settings} from '../../models/settings';
import {MemberMap} from '../../redux/reducers/member.reducer';
import {FormControl} from '@angular/forms';
import {componentDestroyed} from 'ng2-rx-componentdestroyed';
import {selectVisibleMembers} from '../../redux/store/selects';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-member-selector',
  templateUrl: './member-selector.component.html',
  styleUrls: ['./member-selector.component.scss']
})
export class MemberSelectorComponent implements OnInit, OnDestroy {

  @select(selectVisibleMembers) public members$: Observable<MemberMap>;
  @select('settings') public settings$: Observable<Settings>;
  membersArr: Member[] = [];
  memberCtrl: FormControl;

  constructor(private settingsActions: SettingsActions) {
  }

  @HostBinding('class.active') get isActive() {
    return this.memberCtrl.value !== null;
  }

  ngOnInit() {

    this.members$.pipe(
      takeUntil(componentDestroyed(this))
    ).subscribe(
      members => {
        this.membersArr.push(new Member(null, 'Don\'t Filter'));
        for (const key of Object.keys(members)) {
          this.membersArr.push(members[key]);
        }
      });

    this.memberCtrl = new FormControl(null);

    this.settings$.pipe(takeUntil(componentDestroyed(this)))
      .subscribe(settings => this.memberCtrl
        .patchValue(settings.filterForUser, {onlySelf: true, emitEvent: false}));

    this.memberCtrl.valueChanges.pipe(takeUntil(componentDestroyed((this))))
      .subscribe(res => this.update(res));
  }


  update(memberId) {
    this.settingsActions.setFilterForUser(memberId);
  }

  ngOnDestroy() {
  }
}
