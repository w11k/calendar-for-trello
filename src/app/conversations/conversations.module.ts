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
import {ConversationsState} from './ngxs/conversationsState';

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
    NgxsStoragePluginModule.forRoot({
      /**
       * Default key to persist. You can pass a string or array of string
       * that can be deeply nested via dot notation.
       */
      key: '@@STATE',

      /**
       * Storage strategy to use. Thie defaults to localStorage but you
       * can pass sessionStorage or anything that implements the localStorage API.
       */
   /*    storage: localStorage, */

      /**
       * Custom deseralizer. Defaults to JSON.parse
       */
      deserialize: JSON.parse,

      /**
       * Custom serializer, defaults to JSON.stringify
       */
      serialize: JSON.stringify,
    })
  ],
  providers: [
    ConversationsService,
  ],
})
export class ConversationsModule {
}
