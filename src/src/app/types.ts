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

export enum PageState {
  NEW, EDIT,
}
