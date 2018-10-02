import { OutboxState } from './ngxs/outbox.state';
import { MatButtonModule, MatCardModule, MatProgressSpinnerModule } from '@angular/material';
import {ConversationsComponent} from './conversations.component';
import { NgModule } from '@angular/core';
import { CalendarModule } from '../calendar/calendar.module';
import {ConversationsService} from './conversations.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { InboxState } from './ngxs/inbox.state';
import {ConversationsState} from './ngxs/conversations.state';

@NgModule({
  declarations: [
    ConversationsComponent,

  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CalendarModule,
    FlexLayoutModule,
    NgxsModule.forRoot([
      InboxState, OutboxState, ConversationsState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot()
  ],
  providers: [
    ConversationsService,
  ],
})
export class ConversationsModule {
}
