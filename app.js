/**
 * @brief NodeJS application
 * @author Eder Tejada (ederjair.tejadaortigoza@avast.com)
 */

/**
 * Set const variables
 * @type {*|createApplication}
 */
const https = require('https');
const express = require('express');
const app = express();
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const port = 8080;        //PROD: 8080
const sslPort = 443;    //PROD 443 , DEV 8081
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "/cert.pem"))
};

/**
 * @brief Set framework options
 */
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, '/'));
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, '/data')));

/**
 * @brief Generate a random integer within a given range
 * @param min Denotes the minimum value
 * @param max Denotes the maximum value
 * @return Random integer
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @brief Read TSV file
 * @param callback
 * @return Array items[] which stores the final set of images
 */
function readTsv(callback) {
    var items = [];
    var rand = [];
    var tmp = [];
    var data = fs.readFileSync(path.join(__dirname, './src-pairs.tsv'), 'utf8');
    var content = data.split("\n");

    for (var value = 0; value <= 45; value++) {
        rand.push(getRandomInt(0, content.length));
    }

    rand.forEach((item) => {
        if (content[item] !== undefined) {
            var con = content[item].split('\t');
            let status = getRandomInt(0, 1);
            con[5] = status;

            if (fs.existsSync(path.join(__dirname, '/data/images/' + con[status] + '.jpg'))) {
                if (items.length > 4) {
                    return true;
                }
                if (!tmp.includes(con[4])) {
                    items.push(con);
                    tmp.push(con[4]);
                }
            }
        }
    });

    callback(items);
}

/**
 * @brief Handle images and URL retrieved to the HTML file
 */
app.get('/', function (req, res) {
    params = {
        items: [],
        jsonData: {}
    };

    readTsv(function (data) {
        data.forEach((item) => {
            params.items.push({
                'img': '/data/images/' + item[item[5]] + '.jpg',
                'status': item[5],
                'url': item[item[5] + 2]
            })
        })
    });

    params.jsonData = JSON.stringify(params.items);

    res.render('app', params);
});


/**
 * @brief Run server and listen on port
 */
app.listen(port, () => console.log(`Example app listening on port ${sslPort}!`));

https.createServer(sslOptions, app).listen(sslPort);
