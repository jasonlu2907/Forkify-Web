export default class Like {
    constructor() {
        this.likes = []
    } 
    
    // Whenever we update our likes list, we persist the data

    addLike(id, author, title, img) {
        const like = {
            id : id,
            author : author,
            title : title,
            img : img
        }
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
        // -1 !== -1 -> false : if it hasn't been liked
        // có lẽ là tác giả muốn nó return true false chứ kf index
    }

    deleteLike(id) {
        const idx = this.likes.findIndex(el => el.id === id);
        this.likes.splice(idx, 1);

        // Persist data in localStorage
        this.persistData();
    }

    numLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restore likes from the localStorage
        if (storage) this.likes = storage;
    }
}