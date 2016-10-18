export class BoardPreferences {

  constructor(public permissionLevel?: string,
              public voting?: string,
              public comments?: string,
              public invitations?: string,
              public selfJoin?: boolean,
              public cardCovers?: boolean,
              public cardAging?: string,
              public calendarFeedEnabled?: boolean,
              public background?: string,
              public backgroundImage?: string,
              public backgroundImageScaled?: string,
              public backgroundTile?: boolean,
              public backgroundBrightness?: string,
              public backgroundColor?: string,
              public canBePublic?: boolean,
              public canBeOrg?: boolean,
              public canBePrivate?: boolean,
              public canInvite?: boolean,) {
  }

}
