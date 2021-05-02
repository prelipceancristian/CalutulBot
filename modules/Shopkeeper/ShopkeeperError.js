class ShopkeeperError extends Error{
    constructor(message) {
        super(message);
        this.name = 'ShopkeeperError';
    }
}

module.exports = ShopkeeperError;