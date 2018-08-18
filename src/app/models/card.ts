import {Label} from './label';

export class Card {

  constructor(public id?: string,
              public name?: string,
              public due?: Date | string,
              public closed?: boolean,
              public dateLastActivity?: Date,
              public desc?: string,
              public idMembers?: string[],
              public email?: string,
              public idBoard?: string,
              public idShort?: number,
              public labels?: Label[],
              public idLabels?: string[],
              public pos?: number,
              public shortLink?: string,
              public shortUrl?: string,
              public subscribed?: boolean,
              public url?: string,
              public idChecklists?: any[],
              public idList?: string,
              public idMembersVoted?: string[],
              public idAttachmentCover?: any,
              public manualCoverAttachment?: any,
              public badges?: any,
              public descData?: any,
              public checkItemStates?: any,
              public dueComplete?: boolean) {
  }
}
