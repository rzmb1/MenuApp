class HTTPError extends Error {
    constructor(code, msg) {
        super();
        this.code = code;
        this.message = msg;
    }
}

class BadRequest extends HTTPError{
    constructor(msg = "bad request") {
        super(400, msg);
    }
}

class Unauthorized extends HTTPError{
    constructor(msg = "unauthorized") {
        super(401, msg);
    }
}

class Forbidden extends HTTPError{
    constructor(msg = "forbidden") {
        super(403, msg);
    }
}

class NotFound extends HTTPError{
    constructor(msg = "not found") {
        super(404, msg);
    }
}

class InternalServerError extends HTTPError{
    constructor() {
        super(500, 'Internal server Error');
    }
}

module.exports = {HTTPError, BadRequest, NotFound, InternalServerError, Unauthorized, Forbidden};