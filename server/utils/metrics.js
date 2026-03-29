const client = require('prom-client');

const authAttemptsTotal = new client.Counter({
    name: 'ubis_auth_attempts_total',
    help: 'Total number of authentication attempts by result and action',
    labelNames: ['action', 'result']
});

const authOperationDurationMs = new client.Histogram({
    name: 'ubis_auth_operation_duration_ms',
    help: 'Duration of auth operations in milliseconds',
    labelNames: ['action'],
    buckets: [25, 50, 100, 200, 400, 800, 1600, 3200]
});

const verificationRequestsTotal = new client.Counter({
    name: 'ubis_verification_requests_total',
    help: 'Total number of verification API requests by operation and result',
    labelNames: ['operation', 'result']
});

const verificationLookupDurationMs = new client.Histogram({
    name: 'ubis_verification_lookup_duration_ms',
    help: 'Duration of verification lookups in milliseconds',
    labelNames: ['operation'],
    buckets: [10, 25, 50, 100, 200, 400, 800, 1600]
});

module.exports = {
    authAttemptsTotal,
    authOperationDurationMs,
    verificationRequestsTotal,
    verificationLookupDurationMs
};
