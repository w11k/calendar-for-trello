export class TrackingEvent {
  category: string;
  action: string;
  label?: string;
  value?: string;

  constructor(category: string, action: string, label?: string, value?: string) {
    this.category = category;
    this.action = action;
    this.label = label;
    this.value = value;
  }
}
