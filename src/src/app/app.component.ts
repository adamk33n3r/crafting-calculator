import { Component } from '@angular/core';

import { ItemDatabase } from './item-database.service';

@Component({
  selector: 'my-app',
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

    Storage.prototype.size = function(units) {
        'use strict';
        units = units ? units.toUpperCase() : 'MB';
        var size = (window as any).unescape(encodeURIComponent(JSON.stringify(this))).length;
        switch (units) {
            case 'B': return [size,'B'].join(' ');
            case 'KB': return [+(size / 1024).toFixed(3),'KB'].join(' ');
            default: return [+(size / 1024 / 1024).toFixed(3),'MB'].join(' ');
        }
    };
  }

}
