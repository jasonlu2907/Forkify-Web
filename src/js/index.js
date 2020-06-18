// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/ShoppingList';
import Like from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, Loader, removeLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list obj
 * - Liked recipes
 */
const state = {};
window.state = state;

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
            console.log(error);
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
        //if we set data-hello instead data-goto, we would write dataset.hello

        searchView.clearResult();
        searchView.renderResult(state.search.result, goToPage);
    }

});

/**RECIPE CONTROLLER */
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', ''); // window.location = url and as this is a string so we use replace instead splice as I was thinking
    console.log(id);

    if (id) { 
        // 1. Prepare the UI for changes
        recipeView.clearRecipe();
        Loader(elements.recipe);
    
        // 1b. Hightlight
        if (state.search) searchView.highlightSelected(id);
    
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
            // console.log(state.recipe);
            removeLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            
        } catch(error) {
            console.log(error);
            alert('Loi recipe');
        }
    }
    
};

// window.addEventListener('hashchange', controlRecipe);
/**Assuming when the user bookmarked the page with the same id and nothing happen
/* cause the #id must be changed first. That's why we use the 'load' event.
*/
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**SHOPPING LIST CONTROLLER */
const controlList = () => {
    // Create a new List
    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredient to the list and the UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

/* Handle delete and update Shopping list items */
elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    console.log(id);
    // Delete
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.removeItem(id);
        
        // Delete from UI
        listView.removeItem(id)

        // Handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**LIKED LIST CONTROLLER */
const controlLike = () => {
    if(!state.likes) state.likes = new Like();
    
    const curID = state.recipe.id;
    // Users has NOT liked
    if(!state.likes.isLiked(curID)) {
        // Add like to the state
        const newLike = state.likes.addLike(curID,
                                            state.recipe.author, 
                                            state.recipe.title, 
                                            state.recipe.img);

        // Toggle like button
        likesView.toggleLikeBtn(true);
        // UI
        likesView.renderLike(newLike);
        
        // Users HAS liked
    } else {
        // Delete like from the state
        state.likes.deleteLike(curID);

        // Toggle like button
        likesView.toggleLikeBtn(false);

        // UI
        likesView.deleteLike(curID);
    }

    likesView.toggleLikeMenu(state.likes.numLikes());
};

// Restore liked recipes when page load
window.addEventListener('load', () => {
    // This explains for if statement in line 159
    state.likes = new Like();
    
    // Restore likes
    state.likes.readStorage();
    
    // Toggle Like Menu Button
    likesView.toggleLikeMenu(state.likes.numLikes());

    // Render the Menu
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

/* Handling recipe buttons */
elements.recipe.addEventListener('click', e => {
    // Not closest, use matches because there's alotof btns that we might hit in
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease serving button is clicked
        if(state.recipe.serving > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase serving button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
})


