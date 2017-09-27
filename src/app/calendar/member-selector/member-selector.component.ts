import {Component, OnDestroy, OnInit} from '@angular/core';
import {select} from '@angular-redux/store';
import {Member} from '../../models/member';
import {Observable, Subscription} from 'rxjs';
import {SettingsActions} from '../../redux/actions/settings-actions';
import {Settings} from '../../models/settings';
import {MemberMap} from '../../redux/reducers/member.reducer';
import {MdSelectChange} from '@angular/material';

@Component({
  selector: 'app-member-selector',
  templateUrl: './member-selector.component.html',
  styleUrls: ['./member-selector.component.scss']
})
export class MemberSelectorComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  @select('members') public members$: Observable<MemberMap>;
  @select('settings') public settings$: Observable<Settings>;
  membersArr: Member[] = [];
  selected: string = null;

  constructor(private settingsActions: SettingsActions) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.settings$.subscribe(
        settings => this.selected = settings.filterForUser
      ));

    this.subscriptions.push(
      this.members$.subscribe(
        members => {
          this.membersArr.push(new Member(null, 'All Members'));
          for (let key of Object.keys(members)) {
            this.membersArr.push(members[key]);
          }
        }
      ));
  }

  update(event: MdSelectChange) {
    this.settingsActions.setFilterForUser(event.value);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
