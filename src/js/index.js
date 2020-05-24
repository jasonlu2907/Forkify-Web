// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, Loader, removeLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list obj
 * - Liked recipes
 */
const state = {};

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
        
        // 4. Search for recipes
        await state.search.getResult();

        // 5. Render result to UI
        removeLoader(); // have to wait for the result to come and then remove Loader
        searchView.renderResult(state.search.result);
    
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


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