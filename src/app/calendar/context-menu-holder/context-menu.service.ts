import {Injectable} from '@angular/core';
import {ContextMenuHolderComponent} from "./context-menu-holder.component";

@Injectable()
export class ContextMenuService {

  registration: ContextMenuHolderComponent;

  constructor() {
  }

  register(contextMenuHolderComponent: ContextMenuHolderComponent) {
    this.registration = contextMenuHolderComponent;
  }
}


/*
 * todo:
 * prevent right click on "backdrop" of opening the real context menu while the menu is open.
 * */
