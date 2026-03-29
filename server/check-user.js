const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('MongoDB Connected');
        const users = await User.find({});
        console.log('Users found:', users);
        process.exit();
    })
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
