import {Board} from "./board";
export interface Prefs {
  sendSummaries: boolean;
  minutesBetweenSummaries: number;
  minutesBeforeDeadlineToNotify: number;
  colorBlind: boolean;
  locale: string;
}


export class User {
  id: string;
  url: string;
  idBoards: string[];
  initials: string;
  avatarHash?: any;
  bio: string;
  bioData?: any;
  confirmed: boolean;
  fullName: string;
  idPremOrgsAdmin: any[];
  memberType: string;
  products: any[];
  status: string;
  username: string;
  avatarSource: string;
  email: string;
  gravatarHash: string;
  idEnterprise?: any;
  idOrganizations: string[];
  idEnterprisesAdmin: any[];
  loginTypes: string[];
  oneTimeMessagesDismissed: string[];
  prefs: Prefs;
  trophies: any[];
  uploadedAvatarHash?: any;
  premiumFeatures: any[];
  idBoardsPinned?: any;
}
