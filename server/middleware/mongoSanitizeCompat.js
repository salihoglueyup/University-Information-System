const mongoSanitize = require('express-mongo-sanitize');

const SANITIZE_KEYS = ['body', 'params', 'headers', 'query'];

function mongoSanitizeCompat(req, res, next) {
    SANITIZE_KEYS.forEach((key) => {
        const target = req[key];

        if (!target || typeof target !== 'object') {
            return;
        }

        // Express 5 exposes req.query with a getter-only property.
        // Sanitize in place instead of reassigning req[key].
        mongoSanitize.sanitize(target, {
            replaceWith: '_',
        });
    });

    next();
}

module.exports = mongoSanitizeCompat;
