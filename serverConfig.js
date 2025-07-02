const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('redis');
const { MongoClient } = require('mongodb');
const router = express.Router();
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN.split(','),
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const redisClient = createClient({
    url: process.env.REDIS_URI,
});

redisClient.on('error', (err) => console.error('Redis connection error:', err));

const connectToRedis = async () => {
    await redisClient.connect();
    console.log('Connected to Redis successfully!');
};


const uri = `mongodb+srv://antonijenojic01:${process.env.DB_PASSWORD}@testingtool.6oc6s.mongodb.net/?retryWrites=true&w=majority&appName=TestingTool`;

const mongoClient = new MongoClient(uri);

const connectToMongo = async () => {
    await mongoClient.connect();
    console.log('Connected to MongoDB successfully!');
};

const port = process.env.PORT || 4000;

module.exports = {
    app,
    fs,
    router,
    path,
    port,
    redisClient,
    mongoClient,
    connectToRedis,
    connectToMongo,
    enviromentVar: process.env.ENVIRONMENT,
};
