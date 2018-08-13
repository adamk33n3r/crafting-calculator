import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MfSelectModule } from '@myfarms/mf-select';

import { AppComponent } from './app.component';
import { ItemComponent } from './components/item/item.component';

import { AppRoutingModule } from './app-routing.module';
import { ItemsComponent } from './routes/items/items.component';
import { ItemDetailComponent } from './routes/item-detail/item-detail.component';
import { ItemDatabase } from './item-database.service';
import { CalculatorComponent } from './routes/calculator/calculator.component';
import { IconComponent } from './components/icon/icon.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MfSelectModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    ItemComponent,
    ItemsComponent,
    ItemDetailComponent,
    CalculatorComponent,
    IconComponent,
  ],
  bootstrap:    [ AppComponent ],
  providers:    [ ItemDatabase ]
})
export class AppModule { }
