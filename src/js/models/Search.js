//Gonna use ES6 classes in order to describe the data model for Search
import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    
    async getResult() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        try {
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            // I used axios instead of fetch because 1. fetch may prohibit from older browsers
            // 2. fetch takes 2 step to get the json file
            this.result = res.data.recipes;
            // console.log(this.res);
    
        } catch(error) {
            alert(error);
        }
    }

}
