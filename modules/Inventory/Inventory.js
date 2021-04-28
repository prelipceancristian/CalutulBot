// I might do something very illegal here by making a hashmap on ids and arrays. Which kinda reminds me of tables that are not in the 1NF. Which is a BIG yikes.
// Also, I do not want to implement anything more complicated for what will probably be no longer than 50 text files.
// So yeah, sorry not sorry.
const KeyError = require('../CalutulBank/Errors/KeyError');

class Inventory{
    
    constructor(){
        this.transactions = new Map();
    }

    /**
     * The function creates a new shop account for the userId
     * @param {number} idUser 
     */
    create(idUser){
        if(this.transactions.has(idUser))
            throw new KeyError("There already is a shop account under this id!");
        this.transactions.set(idUser, {});
    }

    /**
     * The function adds a new item to the user's list of items
     * @param {number} idUser 
     * @param {number} idItem 
     */
    add(idUser, idItem){
        if(!(this.transactions.has(idUser)))
            throw new KeyError("There is no shop account under this id!");
        
        let currentItems = this.transactions.get(idUser);
        if(currentItems.indexOf(idItem) != -1)
            throw new KeyError("The item is already in the user's inventory");
        
        currentItems.push(idItem);
        this.transactions.set(idUser, currentItems);
    }

    /**
     * The function gets the list of the user's items
     * @param {number} idUser 
     * @returns {Array|number} - the ids of the items in the user's possesion
     */
    read(idUser){
        if(!(this.transactions.has(idUser)))
            throw new KeyError("There is no shop account under this id!");
        return this.transactions.get(idUser);
    }

    /**
     * The function checks if the user with the given id has the item with the given id
     * @param {number} idUser 
     * @param {number} idItem 
     * @returns {boolean} if the user has the item or not
     */
    hasItem(idUser, idItem){
        if(!(this.transactions.has(idUser)))
            throw new KeyError("There is no shop account under this id!");
        return this.transactions.get(idUser).indexOf(idItem);
    }

    /**
     * Sets a new list of items for the user with this id
     * @param {number} idUser 
     * @param {Array|number} newTransactionArray 
     */
    update(idUser, newTransactionArray){
        if(!(this.transactions.has(idUser)))
            throw new KeyError("There is no shop account under this id!");
        this.transactions.set(idUser, newTransactionArray);
    }

    /**
     * The function completly deletes an user's shop account
     * @param {number} idUser 
     * @returns {bool} the value of the delete() function
     */
    delete(idUser){
        if(!(this.transactions.has(idUser)))
            throw new KeyError("There is no shop account under this id!");
        return this.transactions.delete(idUser);
    }

    /**
     * The function removes the item from the user shop account
     * @param {number} idUser 
     * @param {number} idItem 
     */
    remove(idUser, idItem){
        if(!(this.transactions.has(idUser)))
            throw new KeyError("There is no shop account under this id!");
        let currentItems = this.transactions.get(idUser);

        if(currentItems.indexOf(idItem) == -1)
            throw new KeyError("The item is not part of the user's inventory");

        const index = currentItems.indexOf(idItem);
        currentItems.splice(index, 1);
    }
}

module.exports = Inventory;