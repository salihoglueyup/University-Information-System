class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Only allow safe comparison operators
        const allowedOperators = ['gte', 'gt', 'lte', 'lt'];
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => {
            if (allowedOperators.includes(match)) return `$${match}`;
            return match;
        });

        // Reject any remaining MongoDB operators that shouldn't be in user input
        const parsed = JSON.parse(queryStr);
        const sanitize = (obj) => {
            for (const key of Object.keys(obj)) {
                if (key.startsWith('$') && !['$gte', '$gt', '$lte', '$lt'].includes(key)) {
                    delete obj[key];
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitize(obj[key]);
                }
            }
        };
        sanitize(parsed);

        this.query = this.query.find(parsed);

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            // Whitelist: only allow alphanumeric field names, dashes (for -field desc), commas
            const sortBy = this.queryString.sort
                .split(',')
                .filter(f => /^-?[a-zA-Z_][a-zA-Z0-9_.]*$/.test(f.trim()))
                .join(' ');
            this.query = this.query.sort(sortBy || '-createdAt');
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            // Whitelist: only allow alphanumeric field names, no $ operators
            const fields = this.queryString.fields
                .split(',')
                .filter(f => /^-?[a-zA-Z_][a-zA-Z0-9_.]*$/.test(f.trim()))
                .join(' ');
            this.query = this.query.select(fields || '-__v');
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = Math.max(1, this.queryString.page * 1 || 1);
        const limit = Math.min(100, Math.max(1, this.queryString.limit * 1 || 50));
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = ApiFeatures;
