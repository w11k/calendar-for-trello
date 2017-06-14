import {Component, OnInit, HostBinding, ViewChild} from '@angular/core';
import {MdMenuTrigger, MdMenu} from '@angular/material';
import {ContextMenuService} from './context-menu.service';

@Component({
  selector: 'app-context-menu-holder',
  templateUrl: './context-menu-holder.component.html',
  styleUrls: ['./context-menu-holder.component.scss']
})
export class ContextMenuHolderComponent implements OnInit {

  constructor(private contextMenuService: ContextMenuService) {
    this.contextMenuService.register(this);
  }

  ngOnInit() {
  }

  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;
  @ViewChild(MdMenu) menu: MdMenu;


  @HostBinding('style.top') top: string = '200px';
  @HostBinding('style.left') left: string = '200px';


  move = (left, top) => {
    this.top = top + 'px';
    this.left = left + 'px';
    setTimeout(() => {
      this.trigger.openMenu();

    }, 0);
  }

}
