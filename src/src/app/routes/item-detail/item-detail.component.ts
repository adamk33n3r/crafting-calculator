import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { IItem, IIngredient, PageState } from '../../types';
import { ItemDatabase } from '../../item-database.service';

@Component({
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {

  // TODO: Mobile can't paste an image...

  @ViewChild('nameInput')
  public nameInput!: ElementRef;

  @ViewChild('iconInput')
  public iconInput!: ElementRef;

  public get DEBUG(): boolean {
    return JSON.parse(localStorage.getItem('debug')!);
  }

  public formGroup: FormGroup;

  public get ingredients(): FormArray {
    return this.formGroup.get('recipe.ingredients') as FormArray;
  }

  public get isBaseItem(): boolean {
    return this.formGroup.get('isBaseItem')!.value;
  }

  public get stateAsName(): string {
    switch (this.route.snapshot.data.state) {
      case PageState.NEW: return 'New';
      case PageState.EDIT: return 'Edit';
      default: return 'ERROR';
    }
  }

  public items: IItem[] = [];

  private currentID: string;

  public constructor(
    private itemDB: ItemDatabase,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.currentID = this.route.snapshot.params.id;
    const item = this.itemDB.getItemByID(this.currentID) || {} as IItem;
    const ingredientArray = this.formBuilder.array([]);
    if (item.recipe) {
      console.log(item);
      item.recipe.ingredients.forEach((ingredient) => {
        ingredientArray.push(this.newIngredient(ingredient));
      });
    } else {
      ingredientArray.push(this.newIngredient());
    }
    this.formGroup = this.formBuilder.group({
      id: [ item.id || '', [
        Validators.required,
        (ctrl: AbstractControl) => {
          if (ctrl.value === this.currentID) {
            return null;
          }

          return this.itemDB.getItemByID(ctrl.value) ? { exists: true } : null;
        }
      ]],
      name: [ item.name || '', Validators.required ],
      icon: [ item.icon || '', Validators.required ],
      recipe: this.formBuilder.group({
        outputCount: (item.recipe && item.recipe.outputCount) || 1,
        ingredients: ingredientArray,
      }),
      isBaseItem: (item.id && !item.recipe) || false,
    });

    this.formGroup.get('isBaseItem')!.valueChanges.subscribe((isBaseItem) => {
      const recipe = this.formGroup.get('recipe')!;
      isBaseItem ? recipe.disable() : recipe.enable();
    });
    if (item.id && !item.recipe) {
      this.formGroup.get('recipe')!.disable();
    }

    const idCtrl = this.formGroup.get('id')!;
    idCtrl.valueChanges.subscribe((id) => {
      if (id === '') {
        idCtrl.markAsPristine();
        idCtrl.markAsUntouched();
      }
    });
    this.formGroup.get('name')!.valueChanges.subscribe((name: string) => {
      if (idCtrl.pristine) {
        name = name.toLowerCase()
          .replace(/\s/g, '_')
          .replace(/-/g, '_')
          .replace(/[()]/g, '')
        ;
        idCtrl.patchValue(name);
        idCtrl.markAsTouched();
      }
    });

    (window as any).DB = this.itemDB;
  }

  public ngOnInit() {
    this.items = this.itemDB.all().slice().reverse();

    const iconInput = (this.iconInput.nativeElement as HTMLInputElement);
    iconInput.addEventListener('paste', (ev: ClipboardEvent) => {
      ev.stopPropagation();
      ev.preventDefault();
      const data = ev.clipboardData;
      for (let i = 0; i < data.items.length; i++) {
        const item = data.items[i];
        if (item.kind !== 'file') {
          continue;
        }

        const file = item.getAsFile();
        if (!file) {
          console.error('file is null');
          alert('Unknown error');
          return;
        }
        console.log('Pasted file:', file);
        if (file.size > 100000) {
          alert('Pasted image is too big');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Img = reader.result;
          this.formGroup.get('icon')!.patchValue(base64Img);
        };
        reader.readAsDataURL(file);
      }
    });

    // this.nameInput.nativeElement.focus();
  }

  public newIngredient(ingredient?: IIngredient): FormGroup {
    let item = null;
    if (ingredient) {
      item = this.itemDB.getItemByID(ingredient.itemID);
    }

    return this.formBuilder.group({
      count: [(ingredient && ingredient.count) || 1, [Validators.min(1), Validators.required]],
      item: [item, Validators.required],
    });
  }

  public add() {
    this.ingredients.push(this.newIngredient());
  }

  public remove(idx: number) {
    this.ingredients.removeAt(idx);
  }

  public save() {
    const data = this.formGroup.value;
    const item: IItem = {
      id: data.id,
      name: data.name,
      icon: data.icon,
      recipe: data.recipe ? {
        outputCount: data.recipe.outputCount,
        ingredients: data.recipe.ingredients.map((ingredient: { count: number, item: IItem }) => {
          return {
            count: ingredient.count,
            itemID: ingredient.item.id,
          };
        }),
      } : undefined,
    };
    const exists = !!this.itemDB.getItemByID(this.currentID);
    if (exists) {
      this.itemDB.removeByID(this.currentID);
    }

    this.itemDB.add(item);
    this.router.navigate([ 'items' ]);
  }

}
