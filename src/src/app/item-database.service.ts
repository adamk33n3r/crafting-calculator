import { Injectable } from '@angular/core';

import { IItem, IIngredient, IBaseRecipe } from './types';

import BUILTINS from './item-builtins';

@Injectable()
export class ItemDatabase {

  private items: IItem[] = [];
  private get DEBUG(): boolean {
    return !!JSON.parse(localStorage.getItem('debug')!);
  }

  constructor() {
    this.refreshDB();
  }

  public refreshDB(): void {
    const local = this.getLocalStorage();
    if (local.length) {
      this.items = local;
    } else {
      this.items = this.getBuiltins();
    }
  }

  public all(): IItem[] {
    return this.items.slice();
  }

  public add(item: IItem) {
    const base = this.calculateBaseIngredients(item);
    if (base) {
      this.debug(`Setting base ingredients for ${item.id} to:`, base[0]);
      this.debug(`Setting base recipe for ${item.id} to:`, base[1]);
      item.baseIngredients = base[0];
      item.baseRecipes = base[1];
    }

    const idx = this.items.findIndex((i) => i.id === item.id);
    if (idx === -1) {
      this.items.push(item);
    } else {
      this.items[idx] = item;
    }

    // this.debug(JSON.stringify(this.items, null, 2));

    this.saveItems();
    return item;
  }

  public import(text: string): void {
    try {
      this.debug('going to parse:', text);
      const parsed = JSON.parse(text);
      this.debug('parsed');
      localStorage.setItem('items', text);
      this.refreshDB();
    } catch (e) {
      console.error('Could not parse clipboard data as JSON!', e);
      alert('Could not parse clipboard data as JSON!');
    }
  }

  public remove(item: IItem): void {
    this.removeByID(item.id);
  }

  public removeByID(id: string): void {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx) {
      this.items.splice(idx, 1);
    }

    this.saveItems();
  }

  public clear(): void {
    localStorage.setItem('items', '[]');
  }

  public resetToDefault(): void {
    localStorage.removeItem('items');
    this.refreshDB();
  }

  public recalculate(): void {
    this.items.filter(item => item.recipe).forEach(item => this.add(item));
  }

  public getItemByID(id: string): IItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  public getBaseIngredients(item: IItem, count: number = 1): IIngredient[] {
    const baseIngredients = item.baseIngredients || [];
    const baseRecipes = item.baseRecipes || [];
    this.debug('baseIngredients:', baseIngredients);
    this.debug('baseRecipes:', baseRecipes);
    const baseRecipesMap = new Map<string, number>();

    this.debug();
    this.debug('Aggregating all baseRecipes...');
    baseRecipes.forEach((baseRecipe) => {
      this.debug('processing baseRecipe:', baseRecipe);

      const howManyToMake = (
        this.roundToMult(baseRecipe.needed * count, baseRecipe.outputCount
      ) / baseRecipe.outputCount) * baseRecipe.count;

      this.debug(count, baseRecipe.outputCount, howManyToMake, baseRecipe.count);
      const previousCount = baseRecipesMap.get(baseRecipe.itemID) || 0;
      baseRecipesMap.set(baseRecipe.itemID, previousCount + howManyToMake);
    });
    this.debug('Final map:', baseRecipesMap);
    this.debug();

    return baseIngredients.map((ingredient, i) => {
      const multiplier = baseRecipesMap.get(ingredient.itemID)!;
      this.debug('things:', ingredient.count, count, ingredient.count * count, multiplier);
      this.debug('setting base to:', ingredient.itemID, this.roundToMult(ingredient.count, multiplier));
      this.debug(ingredient.count, multiplier, this.roundToMult(ingredient.count, multiplier));
      return {
        // count: Math.ceil(ingredient.count * count),
        count: this.roundToMult((ingredient.count), multiplier),
        itemID: ingredient.itemID,
      };
    });
  }

  private getBuiltins(): IItem[] {
    const builtins = BUILTINS as IItem[];
    return builtins;
  }

  private getLocalStorage(): IItem[] {
    try {
      return JSON.parse(localStorage.getItem('items')!) || [];
    } catch (e) {
      console.error('Could not parse stored JSON', e);
      this.debug(localStorage.getItem('items'));
      if (confirm('Could not parse stored JSON. Click OK to reset or click Cancel to try and fix it yourself.\
Items are stored in localStorage["items"]')) {
        this.resetToDefault();
      }

      return [];
    }
  }

  private saveItems(): void {
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  private calculateBaseIngredients(item: IItem): [IIngredient[], IBaseRecipe[]] | undefined {
    this.debug('===================================');
    this.debug('Calculating base for:', item.id);
    this.debug('===================================');

    // if (item.baseIngredients && item.baseRecipes) {
    //   return [item.baseIngredients, item.baseRecipes];
    // }

    const baseIngredients: IIngredient[] = [];
    const baseRecipes: IBaseRecipe[] = [];
    const baseMap: Map<string, number> = new Map();

    if (item.recipe) {
      item.recipe.ingredients.forEach((ingredient) => {
        const subItem = this.getItemByID(ingredient.itemID)!;

        if (!subItem) {
          throw new Error(`Can't find item with ID: ${ingredient.itemID}`);
        }

        if (!subItem.baseIngredients) {
          // Is base item
          this.debug('IS BASE ITEM:', subItem.id);
          const count = ingredient.count / item.recipe!.outputCount;
          const previousCount = baseMap.get(subItem.id) || 0;
          baseMap.set(subItem.id, previousCount + count);
          // const previousCount2 = baseMap2.get(subItem.id) || 0;
          // baseMap2.set(subItem.id, previousCount2 + ingredient.count);
          baseRecipes.push({
            count: ingredient.count,
            itemID: ingredient.itemID,
            outputCount: item.recipe!.outputCount,
            needed: 1,
          });
        } else {
          // Has base ingredients
          this.debug('IS NOT BASE ITEM:', subItem.id);

          subItem.baseIngredients.forEach((baseIngredient, i) => {
            this.debug(`${baseIngredient.count * subItem.recipe!.outputCount}\
 ${baseIngredient.itemID} makes ${subItem.recipe!.outputCount} ${subItem.id}`);
            this.debug(`We need ${ingredient.count} ${subItem.id}`);
            const count = (ingredient.count / item.recipe!.outputCount) * baseIngredient.count;
            this.debug(`So therefore we need ${count} ${baseIngredient.itemID}`);
            const previousCount = baseMap.get(baseIngredient.itemID) || 0;
            baseMap.set(baseIngredient.itemID, previousCount + count);
            // const previousCount2 = baseMap2.get(baseIngredient.itemID) || 0;
            // baseMap2.set(baseIngredient.itemID, previousCount2 + baseIngredient2.count);

            // const baseIngredient2 = subItem.baseRecipes![i];
            // baseRecipes.push({
            //   count: baseIngredient2.count,
            //   itemID: baseIngredient.itemID,
            //   outputCount: subItem.recipe!.outputCount,
            //   needed: ingredient.count,
            // });
          });

          this.debug('doing:', ingredient);
          subItem.baseRecipes!.forEach((baseRecipe) => {
            this.debug('THINGSGASDFSADF:', baseRecipe);
            this.debug(baseRecipe.needed, ingredient.count);
            baseRecipes.push({
              count: baseRecipe.count,
              itemID: baseRecipe.itemID,
              outputCount: baseRecipe.outputCount,
              // needed: ingredient.count, // maybe need to accum?
              needed: baseRecipe.needed * ingredient.count / item.recipe!.outputCount,
            });
          });
          this.debug('after');
        }
      });
    } else {
      return;
    }

    baseMap.forEach((count, itemID) => {
      baseIngredients.push({ count, itemID });
    });
    // baseMap2.forEach((count, itemID) => {
    //  baseRecipes.push({ count, itemID });
    // });
    this.debug();
    return [baseIngredients, baseRecipes];
  }

  private roundToMult(num: number, mult: number): number {
    if (num === 0) {
      return mult;
    }

    return mult * Math.ceil(num / mult);
  }

  private debug(...data: any[]) {
    if (!this.DEBUG) {
      return;
    }

    console.log.apply(console, data);
  }

}
