class ServiceError extends Error{
    constructor(message) {
        super(message);
        this.name = 'ServiceError';
    }
}

module.exports = ServiceError;