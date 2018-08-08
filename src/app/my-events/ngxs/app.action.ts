import { Card } from '../../models/card';

export class AddInbox {
    static readonly type = '[inbox] add inbox';
    constructor(public payload: any) { }
}
export class ClearInbox {
    static readonly type = '[inbox] clear inbox';
    constructor() { }
}

export class AddOutbox {
    static readonly type = '[outbox] add outbox';
    constructor(public payload: any) { }
}
export class ClearOutbox {
    static readonly type = '[outbox] clear outbox';
    constructor() { }
}
export class UpdateLastUpdate {
  static readonly type = '[my-events] update LastUpdate';

  constructor(public payload: Date = new Date()) {
  }
}

export class HideHelp {
  static readonly type = '[my-events] hide help';

  constructor(public payload: boolean = true) {
  }
}
