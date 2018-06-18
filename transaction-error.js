
/**
 * A transaction error that may be encountered while handling an HTTP transaction.
 * 
 * @constructor
 * @extends Error
 * 
 * @argument {Error} [err]
 * @argument {string} msg
 * @argument {object|number} [details]
 * @argument {number} [details.status] HTTP response status
 */
let TransactionError = function (err, msg, details) {
    //Error.call(this, msg);
    if (typeof err === "string") {
        details = msg;
        msg = err;
        err = null;
    }
    this.message = msg;

    if (typeof details === "number") {
        details = {status: details};
    }
    details = details || {};
    if (details.status) {
        this.status = details.status;
    } else if (err && err.status) {
        this.status = err.status;
    } else {
        this.status = 500;
    }

    if (err) {
        if (err.tstack) {
            this.tstack = err.tstack;
            delete err.tstack;
        } else {
            this.tstack = [];
        }
        this.tstack.unshift(err);
    }
};
//TransactionError.prototype = Object.create(Error.prototype);
TransactionError.prototype.toJSON = function () {
    return {
        message: this.message,
        status: this.status,
        stack: this.tstack && this.tstack.map(function (err) {
            return (err.toJSON && err.toJSON()) || {message: err.message};
        })
    };
};
TransactionError.prototype.toString = function () {
    return this.status + " - " + this.message + (this.tstack ? ("\n\t" + this.tstack.map(function (err) {
        return err.toString();
    }).join("\n\t")) : "");
};

module.exports = TransactionError;

