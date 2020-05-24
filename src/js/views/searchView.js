import { elements } from './base';

export const getInput = () => elements.searchInput.value;

const renderRecipe = (recipe) => {
    const markup = `
    <li>
        <a class="results__link results__link--active" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

/**Create the markup for next/prev Btn */
const createBtn = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto = "${type === 'prev' ? page - 1 : page + 1}">
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

/**Tao ra 3 trang ket qua */
const renderButtons = (page, resPerPage, numResults) => {
    const pages = Math.ceil(numResults/resPerPage); //round up

    let button;
    if(page === 1 && pages > 1) {
        // Btn go to next page
        button = createBtn(page, 'next');
    } else if (page < pages) {
        // Btn go both next and prev
        button = `
        ${createBtn(page, 'next')}
        ${createBtn(page, 'prev')}
        `;
    } else if (page === pages && pages > 1) {
        // Btn go to previous page
        button = createBtn(page, 'prev');
    };

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResult = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = (page * resPerPage); // slice exacts through the end of sequence
    recipes.slice(start, end).forEach(renderRecipe); // Alternative way of recipes.forEach(el => renderRecipe(el));
    //slice to seperate the array[30] to 10 each page

    // Render pagination Btn
    renderButtons(page, resPerPage, recipes.length);
};

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchResultList.textContent = '';
    elements.searchResultPages.textContent = '';
};
