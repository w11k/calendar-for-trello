import {Component, HostBinding, OnInit, ViewChild} from '@angular/core';
import {MatMenu, MatMenuTrigger} from '@angular/material';
import {ContextMenuService} from './context-menu.service';

@Component({
  selector: 'app-context-menu-holder',
  templateUrl: './context-menu-holder.component.html',
  styleUrls: ['./context-menu-holder.component.scss']
})
export class ContextMenuHolderComponent implements OnInit {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild(MatMenu) menu: MatMenu;


  @HostBinding('style.top') top = '200px';
  @HostBinding('style.left') left = '200px';

  constructor(private contextMenuService: ContextMenuService) {
    this.contextMenuService.register(this);
  }

  ngOnInit() {
  }

  move = (left, top) => {
    this.top = top + 'px';
    this.left = left + 'px';
    setTimeout(() => {
      this.trigger.openMenu();

    }, 0);
  }

}
