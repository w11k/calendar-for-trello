import {Card} from '../../models/card';

export class AddInbox {
  static readonly type = '[inbox] add inbox';

  constructor(public payload: Card) {
  }
}

export class ClearInbox {
  static readonly type = '[inbox] clear inbox';

  constructor() {
  }
}

export class AddOutbox {
  static readonly type = '[outbox] add outbox';

  constructor(public payload: Card) {
  }
}

export class ClearOutbox {
  static readonly type = '[outbox] clear outbox';

  constructor() {
  }
}

export class UpdateLastUpdate {
  static readonly type = '[conversations] update LastUpdate';

  constructor(public payload: Date = new Date()) {
  }
}

export class HideHelp {
  static readonly type = '[conversations] hide help';

  constructor(public payload: boolean = true) {
  }
}

export class HideLoadButton {
  static readonly type = '[conversations] hide load button';

  constructor(public payload: boolean = false) {
  }
}
