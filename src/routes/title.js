const express = require('express');
const validateAddress = require('../middlewares/validateAddress');
const router = express.Router();
const request = require('request')
const cheerio = require('cheerio');
const async = require('async');


// Task 1: Using plain callbacks

router.get('/title', validateAddress, (req, res) => {
    let data = [...req.data];
    for (let i = 0; i < data.length; i++) {
        if (data[i].valid) {
            request(data[i].url, function (error, response, body) {
                if (error) {
                    return res.render('error', { message: error.message });
                }
                else {
                    const $ = cheerio.load(body);
                    const title = $("title").text();
                    data[i].text = title;
                    data[i].pending = false;
                    if (isUrlProcessed(data)) {
                        res.render("response", { data: data });
                    }
                }
            });
        }
        else {
            data[i].pending = false;
            if (isUrlProcessed(data)) {
                res.render("response", { data: data });
            }
        }
    }
});

// Task 3: Using Promises

router.get('/title1', validateAddress, async (req, res) => {
    let data = [...req.data];
    for (let i = 0; i < data.length; i++) {
        if (data[i].valid) {
            try {
                const title = await asyncFunctionCall(data[i].url);
                data[i].text = title;
                data[i].pending = false;

            } catch (error) {
                return res.render('error', { message: error });
            }
        }
        else {
            data[i].pending = false;
        }
        if (isUrlProcessed(data)) {
            res.render("response", { data: data });
        }
    }
});

// Task 2: Using async.js 

router.get('/title2', validateAddress, (req, res) => {
    let data = [...req.data];
    const tasks = [];
    for (let i = 0; i < data.length; i++) {
        tasks.push(function (callback) {
            if (data[i].valid) {
                request(data[i].url, function (error, response, body) {
                    if (error) {
                        throw error;
                    }
                    else {
                        const $ = cheerio.load(body);
                        const title = $("title").text();
                        console.log(title);
                        callback(null, { index: i, title });
                    }
                });
            }
            else {
                callback(null, { index: i, title: '' });
            }
        });
    }
    async.parallel(tasks,
        function (err, results) {
            if (err) {
                return res.render('error', { message: err.message });
            }
            results.forEach(x => {
                data[x.index].text = x.title;
                data[x.index].pending = false;
            })
            res.render("response", { data: data });
        });
});



const isUrlProcessed = (data) => {
    if (data.filter(x => x.pending == false).length === data.length) {
        return true;
    }
    return false;
}
const asyncFunctionCall = (url) => {
    return new Promise((resolve, reject) => {
        request(url, function (error, response, body) {
            if (error) {
                reject('Some error occurred while processing your request')
            }
            else {
                const $ = cheerio.load(body);
                const title = $("title").text();
                resolve(title);
            }
        });
    });
}


module.exports = router;