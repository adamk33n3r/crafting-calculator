import { ItemDatabase } from './item-database.service';

class Storage {

  private data: Map<string, string> = new Map();

  public getItem(key: string): string | null {
    const value = this.data.get(key);
    return value === undefined ? null : value;
  }

  public setItem(key: string, value: string) {
    this.data.set(key, value);
  }

}

(global as any).localStorage = new Storage();

const DB = new ItemDatabase();

DB.add({
  id: 'iron_ingot',
  name: 'Iron Ingot',
});

DB.add({
  id: 'tin_ingot',
  name: 'Tin Ingot',
});

DB.add({
  id: 'bronze_ingot',
  name: 'Bronze Ingot',
});

DB.add({
  id: 'copper_ingot',
  name: 'copper Ingot',
});

DB.add({
  id: 'gold_ingot',
  name: 'Gold Ingot',
});

DB.add({
  id: 'iron_bars',
  name: 'Iron Bars',
  recipe: {
    outputCount: 16,
    ingredients: [
      {
        count: 6,
        itemID: 'iron_ingot',
      },
    ],
  },
});

DB.add({
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
  },
});

DB.add({
  id: 'coil',
  name: 'Coil',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'iron_ingot',
      },
      {
        count: 8,
        itemID: 'copper_cable',
      }
    ]
  }
});

DB.add({
  id: 'tin_plate',
  name: 'Tin Plate',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'tin_ingot',
      }
    ]
  }
});

DB.add({
  id: 'tin_item_casing',
  name: 'Tin Item Casing',
  recipe: {
    outputCount: 2,
    ingredients: [
      {
        count: 1,
        itemID: 'tin_plate',
      }
    ]
  }
});

DB.add({
  id: 'electric_motor',
  name: 'Electric Motor',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'iron_ingot',
      },
      {
        count: 2,
        itemID: 'tin_item_casing',
      },
      {
        count: 2,
        itemID: 'coil',
      },
    ],
  },
});

DB.add({
  id: 'iron_plate',
  name: 'Iron Plate',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'iron_ingot',
      },
    ],
  },
});

DB.add({
  id: 'copper_plate',
  name: 'copper Plate',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'copper_ingot',
      },
    ],
  },
});

DB.add({
  id: 'gold_plate',
  name: 'Gold Plate',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'gold_ingot',
      },
    ],
  },
});

DB.add({
  id: 'bronze_plate',
  name: 'Bronze Plate',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'bronze_ingot',
      },
    ],
  },
});

const heatVent = DB.add({
  id: 'heat_vent',
  name: 'Heat Vent',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'electric_motor',
      },
      {
        count: 4,
        itemID: 'iron_plate',
      },
      {
        count: 4,
        itemID: 'iron_bars',
      },
    ],
  },
});

const reactorHeatVent = DB.add({
  id: 'reactor_heat_vent',
  name: 'Reactor Heat Vent',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 8,
        itemID: 'copper_plate',
      },
      {
        count: 1,
        itemID: 'heat_vent',
      },
    ],
  },
});

const overclockedHeatVent = DB.add({
  id: 'overclocked_heat_vent',
  name: 'Overclocked Heat Vent',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 4,
        itemID: 'gold_plate',
      },
      {
        count: 1,
        itemID: 'reactor_heat_vent',
      },
    ],
  },
});

const mixedMetalIngot = DB.add({
  id: 'mixed_metal_ingot',
  name: 'Mixed Metal Ingot',
  recipe: {
    outputCount: 2,
    ingredients: [
      {
        count: 3,
        itemID: 'iron_plate',
      },
      {
        count: 3,
        itemID: 'bronze_plate',
      },
      {
        count: 3,
        itemID: 'tin_plate',
      },
    ],
  },
});

localStorage.setItem('debug', 'true');
const advancedAlloy = DB.add({
  id: 'advanced_alloy',
  name: 'Advanced Alloy',
  recipe: {
    outputCount: 1,
    ingredients: [
      {
        count: 1,
        itemID: 'mixed_metal_ingot',
      }
    ],
  },
});
localStorage.setItem('debug', 'false');

// console.log(JSON.stringify(heatVent, null, 2));
console.log();
console.log('===========NEW RUN===========');
console.log();
// console.log(DB.getBaseIngredients(heatVent, 1));
console.log();
// console.log(DB.getBaseIngredients(heatVent, 5));
// console.log();
// console.log(DB.getBaseIngredients(reactorHeatVent, 1));
// console.log();
// console.log(DB.getBaseIngredients(overclockedHeatVent, 1));



// 4 ingots for plates
// 1 ingot for motor and 2 ingots for 2 coils
// 6 ingots make 16 bars
// can make 4 heat vents with 1 bars recipe

// 1 - 13
// 2 - 20
// 3 - 27
// 4 - 34

// 5 - 47
// 6 - 54
// 7 - 61
// 8 - 68

// 9 - 81


localStorage.setItem('debug', 'true');

console.log(DB.getBaseIngredients(advancedAlloy, 3));
// console.log(DB.getBaseIngredients(advancedAlloy, 2));

localStorage.setItem('debug', 'false');

const NUMVALS = 100;

const heatVentTestValues: { [idx: string]: number[] } = {
  copper_ingot: [],
  iron_ingot: [],
  tin_ingot: [],
};
for (let i = 1; i <= NUMVALS; i++) {
  heatVentTestValues.iron_ingot.push((4 * i) + (1 * i) + (2 * i) + (6 * Math.ceil(i / 4)));
  heatVentTestValues.tin_ingot.push(i);
  heatVentTestValues.copper_ingot.push(Math.ceil((16 * i) / 3));
}

// for (const itemID in heatVentTestValues) {
//   if (heatVentTestValues.hasOwnProperty(itemID)) {
//     console.log(`Checking ${itemID}`);
//     for (let i = 0; i < NUMVALS; i++) {
//       const base = DB.getBaseIngredients(heatVent, i + 1);
//       const count = base.find((ingredient) => ingredient.itemID === itemID)!.count;
//       const val = heatVentTestValues[itemID][i];
//       // console.log(count, val);
//       if (count !== val) {
//         throw new Error(`ERROR! Got ${count} should be ${val}`);
//       }
//     }
//   }
// }

const mixedMetalIngotTestValues: { [idx: string]: number[] } = {
  bronze_ingot: [],
  iron_ingot: [],
  tin_ingot: [],
};
for (let i = 1; i <= NUMVALS; i++) {
  mixedMetalIngotTestValues.iron_ingot.push(3 * Math.ceil(i / 2));
  mixedMetalIngotTestValues.tin_ingot.push(3 * Math.ceil(i / 2));
  mixedMetalIngotTestValues.bronze_ingot.push(3 * Math.ceil(i / 2));
}

for (const itemID in mixedMetalIngotTestValues) {
  if (mixedMetalIngotTestValues.hasOwnProperty(itemID)) {
    console.log(`Checking ${itemID}`);
    for (let i = 0; i < NUMVALS; i++) {
      const base = DB.getBaseIngredients(mixedMetalIngot, i + 1);
      const count = base.find((ingredient) => ingredient.itemID === itemID)!.count;
      const val = mixedMetalIngotTestValues[itemID][i];
      // console.log(count, val);
      if (count !== val) {
        throw new Error(`ERROR! ${count} !== ${val}`);
      }
    }
  }
}

console.log('All tests passed!');


