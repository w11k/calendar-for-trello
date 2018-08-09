export class TrackingEvent {
  event = 'customEvent';
  category: string;
  action: string;
  value?: string;

  constructor(category: string, action: string, value?: string) {
    this.category = category;
    this.action = action;
    this.value = value;
  }
}
