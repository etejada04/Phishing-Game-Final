/**
 * Temp quick app_old
 */


/**
 * Set consts
 * @type {*|createApplication}
 */
const https = require('https');
const express = require('express');
const app_old = express();
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const port = 8081;        //PROD: 8080
const sslPort = 8080;    //PROD 443
const fileID = '1569313348';
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, "/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "/cert.pem"))
};

/**
 * Set framework options
 */
app_old.set('view engine', 'html');
app_old.engine('html', ejs.renderFile);
app_old.set('views', path.join(__dirname, '/'));
app_old.use(express.static(path.join(__dirname, '/')));
app_old.use(express.static(path.join(__dirname, '/data')));


/**
 * IsEmpty validation
 * @param obj
 * @returns {boolean}
 */
var isEmpty = function (obj) {
    return Object.keys(obj).length === 0;
}


/**
 * Make random INT
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Read TSV file
 * @param callback
 */
function readTsv(callback) {
    var items = [];
    var rand = [];
    var amazonExists = false;

    var data = fs.readFileSync(path.join(__dirname, './data/data/' + fileID + '_valid_pairs_of_images_for_processing.tsv'), 'utf8');
    var content = data.split("\n");

    for (var value = 0; value <= 1000; value++) {
        rand.push(getRandomInt(0, content.length));
    }

    rand.forEach((item) => {
        var con = content[item].split('\t');
        let status = getRandomInt(0, 1);
        con = con.slice(0, 3);
        con[3] = status;

        if (fs.existsSync(path.join(__dirname, '/data/data/images/' + con[status] + '.png')) ) {
            if (items.length > 4) {
                return true;
            }
            if (con[2].includes('amazon.') || !amazonExists ) {
                amazonExists = true;
            }
            else{
                items.push(con);
            }
        }
    });

    callback(items);
};


/**
 * Parse JSON file
 * @param hash
 * @param callback
 */
function readJson(hash, callback) {
    var data = fs.readFileSync(path.join(__dirname, './data/data/' + fileID + '_targetset.json'), 'utf8');
    var content = data.split('\n');

    content.forEach((item) => {
        if (!isEmpty(item)) {
            try {
                var json = JSON.parse(item);
                if (json.img_hash == hash) {
                    callback(json);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    });
};


/**
 * Handle homepage URL
 */
app_old.get('/', function (req, res) {
    params = {
        items: [],
        jsonData: {}
    };

    readTsv(function (data) {
        data.forEach((item) => {
            //readJson(item[1], function (data) {
            params.items.push({
                'img': '/data/images/' + item[item[3]] + '.png',
                'status': item[3],
                'url': item[2]
            })
            //});
        })
    });

    params.jsonData = JSON.stringify(params.items);

    res.render('app_old', params);
});


/**
 * Run server and listen on port
 */
app_old.listen(port, () => console.log(`Example app listening on port ${sslPort}!`));

https.createServer(sslOptions, app_old).listen(sslPort);