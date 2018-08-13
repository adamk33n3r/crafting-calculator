export interface IIngredient {
  count: number;
  itemID: string;
}

export interface IBaseRecipe {
  count: number;
  outputCount: number;
  itemID: string;
}

export interface IItem {
  id: string;
  name: string;
  icon?: string;
  recipe?: IRecipe;
  baseIngredients?: IIngredient[];
  baseRecipes?: IBaseRecipe[];
}

export interface IRecipe {
  outputCount: number;
  ingredients: IIngredient[];
}

import BUILTINS from './item-builtins';

class Storage {
  private data: Map<string, string> = new Map();

  public getItem(key: string): string | null {
    return this.data.get(key) || null;
  }

  public setItem(key: string, value: string) {
    this.data.set(key, value);
  }

  public removeItem(key: string): void {
    this.data.delete(key);
  }
}

const localStorage = new Storage();

export class ItemDatabase {

  private items: IItem[] = [];

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
    // const builtins = this.getBuiltins();
    // this.items = ([] as any).concat(
    //   this.getBuiltins(),
    //   this.getLocalStorage(),
    // );
  }

  public all(): IItem[] {
    return this.items;
  }

  public add(item: IItem) {
    const base = this.calculateBaseIngredients(item);
    if (base) {
      console.log(`Setting base ingredients for ${item.id} to:`, base[0]);
      console.log(`Setting base ingredients2 for ${item.id} to:`, base[1]);
      item.baseIngredients = base[0];
      item.baseRecipes = base[1];
    }

    const idx = this.items.findIndex((i) => i.id === item.id);
    if (idx === -1) {
      this.items.push(item);
    } else {
      this.items[idx] = item;
    }

    //console.log(JSON.stringify(this.items, null, 2));

    this.saveItems();
    return item;
  }

  public import(text: string): void {
    localStorage.setItem('items', text);
    this.refreshDB();
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

  public resetToDefault(): void {
    localStorage.removeItem('items');
    this.refreshDB();
  }

  public getItemByID(id: string): IItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  private getBuiltins(): IItem[] {
    const builtins = BUILTINS as IItem[];
    return BUILTINS;
  }

  private getLocalStorage(): IItem[] {
    return JSON.parse(localStorage.getItem('items')!) || [];
  }

  private saveItems(): void {
    localStorage.setItem('items', JSON.stringify(this.items));
  }

  public getBaseIngredients(item: IItem, count: number = 1): IIngredient[] {
    const base = item.baseIngredients || [];
    const base2 = item.baseRecipes || [];
    console.log('base:', base, base2);
    const baseMap = new Map<string, number>();
    base2.forEach((base2Ing) => {
      console.log('processing base:', base2Ing);
      const howManyRecipesToMake = (this.roundToMult(count, base2Ing.outputCount) / base2Ing.outputCount) * base2Ing.count;
      console.log(count, base2Ing.outputCount, howManyRecipesToMake, base2Ing.count);
      const previousCount = baseMap.get(base2Ing.itemID) || 0;
      baseMap.set(base2Ing.itemID, previousCount + howManyRecipesToMake);
    });
    return base.map((ingredient, i) => {
      const mult = baseMap.get(ingredient.itemID)!;
      //return ingredient;
      console.log('things:', ingredient.count, count, ingredient.count * count, mult);
      console.log(ingredient.itemID, this.roundToMult(ingredient.count * count, mult));
      return {
        // count: Math.ceil(ingredient.count * count),
        count: this.roundToMult((ingredient.count * count), mult),
        itemID: ingredient.itemID,
      };
    });
  }

  private calculateBaseIngredients(item: IItem): [IIngredient[], IBaseRecipe[]] | undefined {
    console.log('===================================');
    console.log('Calculating base for:', item.id);
    console.log('===================================');

    if (item.baseIngredients) {
      return [item.baseIngredients!, item.baseRecipes!];
    }

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
          console.log('IS BASE ITEM:', subItem.id);
          const count = ingredient.count / item.recipe!.outputCount;
          const previousCount = baseMap.get(subItem.id) || 0;
          baseMap.set(subItem.id, previousCount + count);
          //const previousCount2 = baseMap2.get(subItem.id) || 0;
          //baseMap2.set(subItem.id, previousCount2 + ingredient.count);
          baseRecipes.push({ count: ingredient.count, itemID: subItem.id, outputCount: item.recipe!.outputCount });
        } else {
          // Has base ingredients
          console.log('IS NOT BASE ITEM:', subItem.id);

          subItem.baseIngredients.forEach((baseIngredient, i) => {
            const baseIngredient2 = subItem.baseRecipes![i];
            console.log(`${baseIngredient.count * subItem.recipe!.outputCount} ${baseIngredient.itemID} makes ${subItem.recipe!.outputCount} ${subItem.id}`);
            console.log(`We need ${ingredient.count} ${subItem.id}`);
            const count = (ingredient.count / item.recipe!.outputCount) * baseIngredient.count;
            console.log(`So therefore we need ${count} ${baseIngredient.itemID}`);
            const previousCount = baseMap.get(baseIngredient.itemID) || 0;
            baseMap.set(baseIngredient.itemID, previousCount + count);
            //const previousCount2 = baseMap2.get(baseIngredient.itemID) || 0;
            //baseMap2.set(baseIngredient.itemID, previousCount2 + baseIngredient2.count);
            baseRecipes.push({ count: baseIngredient2.count, itemID: baseIngredient.itemID, outputCount: subItem.recipe!.outputCount });
          });
        }
      });
    } else {
      return;
    }

    baseMap.forEach((count, itemID) => {
      baseIngredients.push({ count, itemID });
    });
    //baseMap2.forEach((count, itemID) => {
    //  baseRecipes.push({ count, itemID });
    //});
    console.log();
    return [baseIngredients, baseRecipes];
  }

  private roundToMult(num: number, mult: number): number {
    if (num === 0) {
      return mult;
    }

    return mult * Math.ceil(num / mult);
  }

}


const DB = new ItemDatabase();

const copperIngot = DB.add({
  id: 'copper_ingot',
  name: 'Copper Ingot',
});
const copperCable = DB.add({
  id: 'copper_cable',
  name: 'Copper Cable',
  recipe: {
    outputCount: 3,
    ingredients: [
      {
        count: 1,
        itemID: 'copper_ingot',
      }
    ],
  }
});

const planks = DB.add({
  id: 'wood_planks',
  name: 'Planks',
  recipe: {
    outputCount: 4,
    ingredients: [
      {
        count: 1,
        itemID: 'wood_log',
      }
    ],
  }
});

const stick = DB.add({
  id: 'stick',
  name: 'Stick',
  recipe: {
    outputCount: 4,
    ingredients: [
      {
        count: 2,
        itemID: 'wood_planks',
      }
    ],
  }
});

const torch = DB.add({
  id: 'torch',
  name: 'Torch',
  recipe: {
    outputCount: 4,
    ingredients: [
      {
        count: 1,
        itemID: 'stick',
      }
    ],
  }
});

const thing = DB.add({
  id: 'thing',
  name: 'Thing',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 32,
        itemID: 'torch',
      }
    ],
  },
});

const circuit = DB.add({
  id: 'circuit',
  name: 'Circuit',
  recipe: {
    outputCount: 2,
    ingredients: [
      {
        count: 3,
        itemID: 'copper_cable',
      },
      {
        count: 2,
        itemID: 'redstone_dust',
      },
    ],
  },
});

const reader = DB.add({
  id: 'reader',
  name: 'Reader',
  recipe: {
    outputCount: 1,
    ingredients: [
      //{
      //  count: 1,
      //  itemID: 'copper_cable',
      //},
      {
        count: 1,
        itemID: 'circuit',
      },
    ],
  },
});

const first = DB.add({
  id: 'first',
  name: 'First',
  recipe: {
    outputCount: 2,
    ingredients: [
      {
        count: 2,
        itemID: 'wood_log',
      },
    ],
  },
});

const second = DB.add({
  id: 'second',
  name: 'Second',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'first',
      },
    ],
  },
});

// 0.5 log per wall
// 2.5 log for 5 wall
const wall = DB.add({
  id: 'wall',
  name: 'Wall',
  recipe: {
    outputCount: 4,
    ingredients: [
      {
        count: 2,
        itemID: 'wood_log',
      },
    ],
  },
});

// TODO: we need to add 2 for wall for every 4 we want to make :(
// TODO: save outputCount and ingred count on item
// TODO: then accumulate and multiply in getBaseIngredients

// 0.6666666666666666 log per ceiling
// 3.3333333333333333 log for 5 ceiling
const ceiling = DB.add({
  id: 'ceiling',
  name: 'Ceiling',
  recipe: {
    outputCount: 6,
    ingredients: [
      {
        count: 4,
        itemID: 'wood_log',
      },
    ],
  },
});

// 1.166666666666 log per other
// 5.833333333333 log for 5 other
const other = DB.add({
  id: 'other',
  name: 'Other',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'wall',
      },
      {
        count: 1,
        itemID: 'ceiling',
      },
    ],
  },
});

console.log();
console.log();
console.log();
console.log(other.baseIngredients);
console.log(other.baseRecipes);
console.log();
console.log();
console.log();

//console.log(JSON.stringify(circuit, null, 2));
//console.log(JSON.stringify(reader, null, 2));
//console.log('Circuit:', JSON.stringify(DB.getBaseIngredients(circuit), null, 2));
//console.log('Reader:', JSON.stringify(DB.getBaseIngredients(reader), null, 2));
//console.log('Torch:', JSON.stringify(DB.getBaseIngredients(torch, 32), null, 2));
//console.log('Thing:', JSON.stringify(DB.getBaseIngredients(thing), null, 2));
console.log('Other:', JSON.stringify(DB.getBaseIngredients(other, 6), null, 2)); // needs 8 logs
//console.log('Other:', JSON.stringify(DB.getBaseIngredients(other, 6), null, 2)); // needs 8 logs
// console.log(JSON.stringify(DB.all(), null, 2));

console.log(JSON.stringify(DB.getItemByID('other'), null, 2));
