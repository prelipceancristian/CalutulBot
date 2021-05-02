class ShopkeeperError extends Error{
    constructor(message) {
        super(message);
        this.name = 'ShopkeepError';
    }
}

module.exports = ShopkeeperError;