// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, Loader, removeLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list obj
 * - Liked recipes
 */
const state = {};

/**SEARCH CONTROLLER */
const controlSearch = async () => {
    // 1. Get the query from the view
    const query = searchView.getInput();
    // console.log(query)

    if (query) {
        // 2. New search obj and add to state
        state.search = new Search(query);
        
        // 3. Prepare UI for results like clear the old result
        searchView.clearInput();
        searchView.clearResult();
        Loader(elements.searchResult);
        
        try {
            // 4. Search for recipes
            await state.search.getResult();
    
            // 5. Render result to UI
            removeLoader(); // have to wait for the result to come and then remove Loader
            searchView.renderResult(state.search.result);
        } catch(error) {
            alert('Loi Search');
        }
    
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

//TESTING PURPOSE
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });


// Khong chac ket qua se > 10 nen lam sao de tao eventHandler khi no chua xuat hien tren hTML?
// => Delegation in JS
elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // Tim chinh xac btn with element method Closest
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // Read more about data attribute
        //if we set data-hello instead data-goto, we will write sataset.hello

        searchView.clearResult();
        searchView.renderResult(state.search.result, goToPage);
    }

});

/**RECIPE CONTROLLER */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', ''); // window.location = url and as this is a string so we use replace instead splice as I was thinking
    console.log(id);

    // 1. Prepare the UI for changes

    // 2. Create new Recipe obj
    state.recipe = new Recipe(id);
    // window.r = state.recipe;

    // 3. Get the recipe
    try {
        // GET recipe data and parse Ingredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();

        // 3.1 Calculate cooking time and serving number
        state.recipe.calcTime();
        state.recipe.calcServing();
    
        // 4. Render it to view
        console.log(state.recipe);
    } catch(error) {
        alert('Loi recipe');
    }
    
};

// window.addEventListener('hashchange', controlRecipe);
/**Assuming when the user bookmarked the page with the same id and nothing happen
/* cause the #id must be changed first. That's why we use the 'load' event.
*/
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));