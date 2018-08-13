import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemsComponent } from './routes/items/items.component';
import { ItemDetailComponent } from './routes/item-detail/item-detail.component';
import { CalculatorComponent } from './routes/calculator/calculator.component';
import { PageState } from './types';

const routes: Routes = [
  { path: '', component: CalculatorComponent },
  // { path: '', redirectTo: 'items', pathMatch: 'full' },
  { path: 'items', component: ItemsComponent },
  { path: 'items/new', component: ItemDetailComponent, data: { state: PageState.NEW } },
  { path: 'items/:id', component: ItemDetailComponent, data: { state: PageState.EDIT } },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}