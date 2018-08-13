import { Component, OnInit, Input } from '@angular/core';

import { IItem } from '../../types';

@Component({
  selector: 'icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent implements OnInit {

  @Input()
  public item: IItem;

  constructor() { }

  ngOnInit() {
  }

}