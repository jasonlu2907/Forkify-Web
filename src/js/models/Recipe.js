import axios from 'axios';
import {proxy} from '../config'

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/get?rId=${this.id}`)
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.url = res.data.recipe.source_url;
            this.img = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            // console.log(res);

        } catch (error) {
            console.log(error);
            alert('Something must be wrong');
        }
    }

    calcTime() {
        const numIngr = this.ingredients.length;
        const periods = Math.ceil(numIngr / 3);
        this.time = periods * 15; // assuming each 3 ingredients will be cooked in 15m
    }

    calcServing() {
        this.serving = 4; // assuming we always have 4person
    }

    parseIngredients() {
        const unitLongs = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShorts = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShorts, 'kg', 'g']; //destructoring 

        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform units like oz.
            let ingredient = el.toLowerCase(); //ingredient = string
            unitLongs.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShorts[i]);
            });

            // 2. Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. Parse ingredient into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if(unitIndex > -1) {
                // THere's a unit
                // slice(start, end) from s -> e but doesnt include e.
                // Ex: 1 1/2 cups => arrCount = [1, 1/2]
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    //EVAL method. eval("1+1/2") -> 1.5
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if(parseInt(arrIng[0] , 10)) {
                // There's not unit but have a number
                objIng = {
                    count: parseInt(arrIng[0] , 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if (unitIndex === -1) {
                // THere's no unit and no number
                objIng = {
                    count : 1,
                    unit: '',
                    ingredient : ingredient // In ES6, just simply ingredient since they're the same variable name
                }
            }
            
            return objIng;
        });

        this.ingredients = newIngredients; // return an array with new units
    }

    updateServings(type) {
        //Servings
        const newServings = type === 'dec' ? this.serving - 1 : this.serving + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.serving);
        });
        
        this.serving = newServings;

    }
}