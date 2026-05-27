// ==========================================
// MongoDB Initialization Script
// ==========================================
// This script runs ONCE when the MongoDB container is first initialized
// (i.e., when the data volume is empty and MONGO_INITDB_* vars are set).
//
// It creates the "ubis" database and a dedicated application user
// with readWrite permissions, so the Node.js server does not
// connect as the root / admin user.
//
// Required environment variables (set in docker-compose):
//   MONGO_APP_USER     — application-level username
//   MONGO_APP_PASSWORD — application-level password
// ==========================================

const appUser = process.env.MONGO_APP_USER || 'ubis_user';
const appPassword = process.env.MONGO_APP_PASSWORD || 'ubis_dev_password';

const ubisDb = db.getSiblingDB('ubis');

ubisDb.createUser({
  user: appUser,
  pwd: appPassword,
  roles: [
    { role: 'readWrite', db: 'ubis' }
  ]
});

print(`✅ MongoDB init completed — user "${appUser}" created on "ubis" database.`);
