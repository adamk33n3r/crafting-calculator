import { Component, OnInit } from '@angular/core';

import { IItem } from '../../types';
import { ItemDatabase } from '../../item-database.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {

  public items: IItem[];

  public sortCreatedReverse: boolean = false;
  public sortNameReverse: boolean = false;

  constructor(private itemDB: ItemDatabase) {
    this.items = this.itemDB.all();
  }

  public ngOnInit() {
    this.sortByCreated();
  }

  public sortByCreated() {
    this.sortNameReverse = false;
    this.sortCreatedReverse = !this.sortCreatedReverse;

    this.items = this.itemDB.all();
    if (this.sortCreatedReverse) {
      this.items.reverse();
    }
  }

  public sortByName() {
    // if (this.sortCreatedReverse)
    this.sortNameReverse = !this.sortNameReverse;
    this.sortCreatedReverse = false;

    this.items = this.itemDB.all().sort((a, b) => {
      if (this.sortNameReverse) {
        return b.name.localeCompare(a.name);
      }
      return a.name.localeCompare(b.name);
    });
  }

  public search(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.items = searchTerm ? this.itemDB.all().filter((item) => {
      return item.name.toUpperCase().indexOf(searchTerm.toUpperCase()) > -1;
    }) : this.itemDB.all();
  }

  public dump() {
    (navigator as any).clipboard.writeText(JSON.stringify(this.itemDB.all(), null, 2));
  }

  public import() {
    if (!confirm('Importing will erase your current saved recipes. If you wish to keep them, make a backup first.')) {
      return;
    }

    (navigator as any).clipboard.readText().then((text: string) => {
      console.log(text);
      this.itemDB.import(text);
      this.items = this.itemDB.all();
    }).catch((err: any) => {
      console.error(err);
      alert('You have blocked clipboard permissions. \
You will not be able to import recipes. If you changed your mind, give clipboard permissions to this site.');
    });
  }

  public reset(full?: boolean) {
    if (full) {
      if (confirm('Are you sure you want to delete all items?')) {
        this.itemDB.clear();
        this.items = this.itemDB.all();
      }
    } else if (confirm('Are you sure you want to reset all items to default?')) {
      this.itemDB.resetToDefault();
      this.items = this.itemDB.all();
    }
  }

}
