import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

// import $ from 'jquery';

declare var $: any;

import { ItemDatabase } from '../../item-database.service';
import { IItem } from '../../types';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  @Input()
  public item: IItem;

  @ViewChild('ingredients')
  public ingredientsEle: ElementRef;

  constructor(private itemDB: ItemDatabase) { }

  public ngOnInit() {
  }

  public itemByID(id: string): IItem {
    return this.itemDB.getItemByID(id);
  }

  public toggleIngredients() {
    $(this.ingredientsEle.nativeElement).collapse('toggle');
  }

}