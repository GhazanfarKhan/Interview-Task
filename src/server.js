const express = require('express');
const bodyParser = require('body-parser');
const title = require('./routes/title');
const path = require('path');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world')
});

//Add pug engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use('/I/want', title);

const port = process.env.PORT || 5000;

/// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
        },
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});