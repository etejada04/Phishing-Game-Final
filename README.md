# Avast Phishing Game

## Table of Contents

1. [Requirements](#requirements)
2. [How to run the app on server](#how-to-run-the-app-on-server)
3. [Data source](#data-source)
3. [Data Layer](#data-layer)
5. [Other links](#other-links)

## Requirements
The game is required to showcase the following information:
*  Images and URLs (max. 5 for each game) of different sites hosted in Avast CDN. The data has to be shown uniquely and randomly.
*  Information if the image is real or fake (combine real and fake - i.e. not only real images in one game).
* Highlight errors in images.

## How to run the app on server
```console
cd C:\Users\Public\app
node ./node_modules/nodemon/bin/nodemon.js src/app.js
```
Modify variable **sslPort** in **app.js** file for local development or production.
```javascript
const sslPort = 8081;    //PROD 443 , DEV 8081
```
Accessible from: https://localhost:8081/ 

Nodemon info https://nodemon.io/

## Data Source
The file **source-pairs.tsv** contains the hashes of images to be used. The structure of the file is the following:
```tsv
fake-image  real-image  fake-url  real-url  type
```
To select real or fake content on each particular record a random integer, between 0 and 1, is attached at the end of each record. The array for each record look like this:
```javascript
var con = ['015b6cc46e11bec4176cb20429be0b43',
           '489e387b47fcee4bcf9f506dac6edb52',
           'https://www.paypal-transfertcompte.com/b/',
           'https://www.paypal.com/us/signin',
           'paypal',
           '1' ];
```
Then this record is pushed to the final set of items:
```javascript
var items = [];  /*Max. 5 items*/ 
items.push(con);
```
All these items are read by the **readTsv()** function:
```javascript
readTsv(function (data) {
        data.forEach((item) => {
            params.items.push({
                'img': '/data/images/' + item[item[5]] + '.jpg',
                'status': item[5],
                'url': item[item[5] + 2]
            })
        })
    });
```
And displayed to the HTML file:
```html
<% items.forEach( item => { %>
 <div class="mySlides">
      <span class="img-src" data-status="<%=item.status%>" >
            <img alt="source-img" src="<%=item.img%>">
       </span>
  </div>
<% }) %>
```
## Data Layer
Google Tag Manager (GTM) tags are used to send data of the game to GA. Some examples can be found on the **/script/main.js** file, specifically in the **getResults()** function:
```javascript
function getResults() { 
    if (score >= 400) {
        dataLayer.push({'event': 'Results', 'status': 'Perfect'});
    } 
}

```
Other use cases of GTM tags are the download button by **data-role** in the HTML file:
```html
<a id="download" class="bi-download-link"
   href="https://www.avast.com/" 
   data-role="download-link"> download avast
</a>
```
## Other links

Repository of visualization tool created by Tomas Trnka: [link](https://git.int.avast.com/trnkat/crumbs/tree/master/phishing_game) (Accessible only from Avast internal Git repository).

Source data: [link](https://drive.google.com/file/d/1XjausBSNNXjtUD2vy1LWzcpUxaS0CyIy/view).
