import { Component, OnInit } from '@angular/core';

import { IItem, IIngredient } from '../../types';
import { ItemDatabase } from '../../item-database.service';

interface IItemRow {
  count: number;
  item: IItem | null;
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  public get DEBUG(): boolean {
    return !!JSON.parse(localStorage.getItem('debug')!);
  }
  public items: IItem[];
  public itemRows: IItemRow[];
  private cachedIngredients: IIngredient[] | undefined;

  constructor(private itemDB: ItemDatabase) {
    this.items = itemDB.all().filter((item) => item.recipe).reverse();
    this.itemRows = this.load() || [{ count: 1, item: null }];
  }

  public ngOnInit() {
  }

  public itemByID(id: string): IItem | undefined {
    return this.itemDB.getItemByID(id);
  }

  public asStacks(count: number): string {
    const remainder = count % 64;
    const quotient = Math.floor(count / 64);
    return `[${quotient}x64 + ${remainder}]`;
  }

  public hasItemSelected(): boolean {
    return this.itemRows.some((itemRow) => !!itemRow.item);
  }

  public getBaseIngredients(): IIngredient[] {
    const filtered = this.itemRows.filter((itemRow) => itemRow.item);

    const ingredientMap = new Map<string, number>();
    const ingredients: IIngredient[] = [];
    filtered.forEach((itemRow) => {
      const baseIngredients = this.itemDB.getBaseIngredients(itemRow.item!, itemRow.count);
      baseIngredients.forEach((ingredient) => {
        const previousCount = ingredientMap.get(ingredient.itemID) || 0;
        ingredientMap.set(ingredient.itemID, previousCount + ingredient.count);
      });
    });

    ingredientMap.forEach((count, itemID) => {
      ingredients.push({ count, itemID });
    });

    this.cachedIngredients = ingredients.sort((a, b) => b.count - a.count);
    return this.cachedIngredients;
  }

  public addItem(): void {
    this.itemRows.push({
      count: 1,
      item: null,
    });
  }

  public clear(): void {
    this.itemRows = [];
    this.addItem();
    this.save();
  }

  public export() {
    if (!this.cachedIngredients) {
      return;
    }

    let csv = 'data:text/csv;charset=utf-8,';

    csv += this.ingredientsToCSV(this.cachedIngredients);

    const link = document.createElement('a');
    link.setAttribute('href', csv);
    link.setAttribute('download', 'recipe-calculator-export.csv');
    link.click();
  }

  private ingredientsToCSV(ingredients: IIngredient[]): string {
    let result = 'Count,Stacks,Item\n';

    ingredients.forEach((ingredient) => {
      const name = this.itemByID(ingredient.itemID)!.name;
      result += `${ingredient.count},${this.asStacks(ingredient.count)},${name}\n`;
    });

    return result;
  }

  private load(): IItemRow[] | null {
    const calc = JSON.parse(localStorage.getItem('calculator')!) as IIngredient[];
    if (!calc) {
      return null;
    }

    return calc.map((itemRow) => {
      return {
        count: itemRow.count,
        item: this.itemByID(itemRow.itemID)!,
      };
    });
  }

  private save() {
    const filtered = this.itemRows.filter((itemRow) => itemRow.item);
    localStorage.setItem('calculator', JSON.stringify(filtered.map((itemRow) => {
      return {
        count: itemRow.count,
        itemID: itemRow.item!.id,
      };
    })));
  }

}
