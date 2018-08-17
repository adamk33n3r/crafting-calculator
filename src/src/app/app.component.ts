import { Component } from '@angular/core';

import { ItemDatabase } from './item-database.service';

@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  public constructor(public itemDB: ItemDatabase) {
    // parser.parse(`
    // - 1 electronic circuit
    //   - 2 redstone
    //   - 1 iron plate
    //   - 6 insulated copper cable
    // `);

    (window as any).DB = this.itemDB;

    (Storage.prototype as any).size = function(units: string) {
        'use strict';
        units = units ? units.toUpperCase() : 'MB';
        const size = (window as any).unescape(encodeURIComponent(JSON.stringify(this))).length;
        switch (units) {
            case 'B': return [size, 'B'].join(' ');
            case 'KB': return [+(size / 1024).toFixed(3), 'KB'].join(' ');
            default: return [+(size / 1024 / 1024).toFixed(3), 'MB'].join(' ');
        }
    };
  }

}
