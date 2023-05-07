const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");

const {
    MONGO_IP,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASSWORD,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET,
} = require("./config/config");
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}/:${MONGO_PORT}?authSource=admin`;

const app = express();

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
let RedisStore = require("connect-redis")(session);

mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Successfully connected to db..."))
    .catch((e) => {
        console.log(e);
        setTimeout(connect, 3000);
    });

// let redisStore = require("connect-redis").RedisStore;
// let redisClient = redis.createClient({
//     host: REDIS_URL,
//     port: REDIS_PORT,
// });
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
});

app.enable("trust proxy");
app.use(cors({}));
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 60000,
        },
    })
);
app.use(express.json());
app.get("/api/v1", (req, res) => {
    console.log("test");
    res.send("<h2>Hi there!!!!!!</h2>");
});
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

// const port = process.env.PORT || 3000;
const port = process.env.PORT;

app.listen(port, () => console.log(`listening on port ${port}...`));
