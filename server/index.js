// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const responseMiddleware = require('./middleware/response')

// CREATE OUR SERVER
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({extended: true}))

// CORS
const whitelist = ["localhost", "127.0.0.1", "192.168.0.108"];
app.use(cors({
    // https://www.npmjs.com/package/cors#configuring-cors-w-dynamic-origin
    origin: function (origin, callback) {
        // console.log(origin)
        if (origin) {
            const url = new URL(origin);
            // console.log(url)
            const hostname = url.hostname;
            // console.log(hostname)

            // if (whitelist.indexOf(origin) !== -1) {
            if (whitelist.indexOf(hostname) !== -1) {
                return callback(null, true);
            }
        }
        callback(new Error("Not allowed by CORS"));
    },
    // origin: ["http://localhost:3000"],
    // origin: ["http://localhost:3001"],
    credentials: true
}))

app.use(express.json())

app.use(cookieParser())

app.use(responseMiddleware)

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const top5listsRouter = require('./routes/top5lists-router')
app.use('/api', top5listsRouter)


// 404
app.get('*', function (req, res, next) {
    // res.status(301).redirect('/not-found');
    res.status(404).send('404 Not Found');
});

// error logger middleware
// const errorLogger = (err, req, res, next) => {
//     console.error('\x1b[31m', err) // adding some color to our logs
//     next(err) // calling next middleware
// }
// app.use(errorLogger)

// error handler
app.use((error, req, res, next) => {
    if (!error.statusCode) error.statusCode = 500;
    return res.status(error.statusCode)
        .json({
            // error: error.toString()
            error: error.message,
        });

    // return res.internal({
    //     message: error.message
    // })
});


// INITIALIZE OUR DATABASE OBJECT
const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// PUT THE SERVER IN LISTENING MODE
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))


