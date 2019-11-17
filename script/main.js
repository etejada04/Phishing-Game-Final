/**
 *
 * @author Eder Tejada (ederjair.tejadaortigoza@avast.com)
 *
 */

let score = 0;
let slideIndex = 1;
let step = 0;
let urlContent = null;
let imgContent = null;

/**
 * @brief Load game data
 * @return Load data to the URL bar and image container
 */
function loadData() {
    urlContent = document.getElementById('url-src');
    imgContent = document.getElementsByClassName('img-src');

    urlContent.textContent = jsonData[0].url.substr(0, 60);

    showSlides(slideIndex);
}

/**
 * @brief Toggle function to show elem1 and hide elem2
 * @param elem1 Denotes the first element
 * @param elem2 Denotes the second element
 * @return Hide first element and display the second
 */
function toggle(elem1, elem2) {
    $(elem1).slideToggle('slow');
    $(elem2).slideToggle('slow');
}

/**
 * @brief Function to change current game page
 * @param curr Denotes the current container
 * @param next Denotes the next container
 * @return Modify the content of current container and display the next
 */
function nextPage(curr, next) {
    let header = document.getElementsByTagName('H1')[0];
    let dots = document.getElementsByClassName('dots-container')[0];
    let url = document.getElementsByClassName('url-bar')[0];
    let window = document.getElementById('master');
    let btnReal = document.getElementById('real');
    let btnFake = document.getElementById('fake');
    let score = document.getElementById('score');
    let likeIcon = '<i class=\'fas fa-thumbs-up\'></i>';
    let dislikeIcon = '<i class=\'fas fa-thumbs-down\'></i>';
    let currContainer = document.getElementById(curr);
    let nextContainer = document.getElementById(next);

    if (screen.width <= 1024 && curr === 'welcome-page') {
        curr = 'welcome-page-mobile';
    }
    switch (curr) {
        case 'welcome-page':
            $(header).animate({'font-size': '2.8em', 'margin-bottom': '0.1em'}, 2000);
            $(window).animate({'margin-top': '-11%'}, 2000);
            $(currContainer).fadeOut('slow');
            $(url).fadeIn(3000).css('display', 'inline-block');
            $(dots).fadeIn(3000).css('display', 'inline-block');
            $(score).fadeIn(3000);
            $(nextContainer).fadeIn(3000);
            loadData();
            break;
        case 'welcome-page-mobile':
            btnReal.innerHTML = likeIcon;
            btnFake.innerHTML = dislikeIcon;
            $(currContainer).fadeOut('slow');
            $(url).fadeIn(1000).css('display', 'inline-block');
            $(nextContainer).fadeIn(3000);
            loadData();
            break;
        case 'game-page':
            $(currContainer).fadeOut(1000);
            $(url).fadeOut(1000).css('display', 'inline-block');
            $(nextContainer).fadeIn(3000);
            break;
        default:
    }
}

/**
 * @brief Function to display popup window
 * @return Display the popup window
 */
function popIt() {
    let popup = document.getElementById('popup');
    let headerMaster = document.getElementById('header-master');
    let headerPopup = document.getElementById('header-popup');
    let close = document.getElementsByClassName('close')[0];

    if (popup.style.display === '' || popup.style.display === 'none') {
        headerMaster.style.display = 'none';
        headerPopup.style.display = 'block';
        popup.style.display = 'block';
    } else {
        headerPopup.style.display = 'none';
        popup.style.display = 'none';
        headerMaster.style.display = 'block';
    }

    close.onclick = function () {
        popup.style.display = 'none';
    }
}

/**
 * @brief This function retrieves the final result to the summary page based on final score
 * @return Update results of the summary page according to the score
 */
function getResults() {
    let header = document.getElementsByClassName('results')[0];
    let subheader = document.getElementsByClassName('results')[1];
    let bulb = '<a onclick="popIt()" style="cursor:pointer;">'
        + '<span class="highlight"><i class=\'far fa-lightbulb\'></i></span>'
        + '</a>';

    if (score >= 400) {
        header.textContent = 'Perfect!';
        subheader.textContent = 'There\'s no fooling you.';
        dataLayer.push({'event': 'Results', 'status': 'Perfect'});
    } else if (score >= 200) {
        header.textContent = 'OK, you know a few things to look out for.';
        subheader.innerHTML = 'Take a look ' + bulb + ' so you know what to look out for next time!';
        dataLayer.push({'event': 'Results', 'status': 'Ok'});
    } else {
        header.textContent = 'Ouch, you’ve been hacked!';
        subheader.innerHTML = 'Take a look ' + bulb + ' so you know what to look out for next time!';
        dataLayer.push({'event': 'Results', 'status': 'Disaster'});
    }
}

/**
 * @brief Function to update the score counter
 * @return Update the score
 */
function getScore(val) {
    let points = document.getElementsByClassName('score-cnt');
    score += val;
    for (let i = 0; i < points.length; i++) {
        points[i].textContent = score;
    }
}

/**
 * @brief Function to move to the next image based on current index
 * @param n Denotes the slide index
 */
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName('mySlides');
    let dots = document.getElementsByClassName('dot');

    if (n > slides.length) {
        nextPage('game-page', 'summary-page');
        getResults();
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    for (i = 0; i < slides.length; i++) {
        dots[i].className = dots[i].className.replace(' active', '');
        dots[i + 5].className = dots[i].className.replace(' active', '');
    }

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].className += ' active';
    dots[5 + slideIndex - 1].className += ' active';
}

/**
 * @brief Function to handle game answers based on data status
 * @return Handle the input provided by the buttons during the game and display appropriate dialogue
 */
function isPhishing(answer) {
    let dialogueWindow = document.getElementById('dialogue');
    let dialogueImg = document.getElementById('dialogue-img');
    let dialogueAns = document.getElementById('dialogue-ans');
    let dialogueScore = document.getElementById('dialogue-score');
    let imageWindow = document.getElementById('img-container');
    let btnReal = document.getElementById('real');
    let btnFake = document.getElementById('fake');
    let correct = '<i class=\'fas fa-thumbs-up\' style="color: #160E53; font-size: 8em;"></i>';
    let incorrect = '<i class=\'fas fa-thumbs-down\' style="color: #160E53; font-size: 8em;"></i>';
    let currStatus = imgContent[step].getAttribute('data-status') === '1';

    $(btnReal).fadeOut(100);
    $(btnFake).fadeOut(100);


    let img = imgContent[step].getElementsByTagName('img')[0];
    let urlbar = document.getElementsByClassName('url-bar')[0];
    let imgPath = img.src.substring(0,img.src.length - 4);
    let newSrc = imgPath + '_err.jpg';

    if (answer === currStatus) {
        dialogueImg.innerHTML = correct;
        dialogueAns.textContent = 'Good job!';
        dialogueScore.innerHTML = '<h3>You scored: <span class="highlight">100 points</span></h3>';
        toggle(imageWindow, dialogueWindow);
        getScore(100);
    } else {
        if (currStatus) {
            dialogueImg.innerHTML = incorrect;
            dialogueAns.textContent = 'Oops..';
            dialogueScore.innerHTML = '<h3>You scored: <span class="highlight">0 points</span></h3>';
            toggle(imageWindow, dialogueWindow);
            getScore(0);
        } else {
            $(imageWindow).fadeOut(500, function() {
                $(img).attr('src',newSrc);
            }).fadeIn(1000);
            $(urlbar).css({'background-color': '#f69ab3'});
            setTimeout(function(){
                $(urlbar).css({'background-color' : '#f4f3fa'});
                dialogueImg.innerHTML = incorrect;
                dialogueAns.textContent = 'Oops..';
                dialogueScore.innerHTML = '<h3>You scored: <span class="highlight">0 points</span></h3>';
                toggle(imageWindow, dialogueWindow);
                getScore(0);
            }, 6000);
        }
    }
}

/**
 * @brief Function to close current dialogue and move to the next image
 * @return Close dialogue and move to the next image
 */
function move() {
    let dialogue = document.getElementById('dialogue');
    let imageWindow = document.getElementById('img-container');
    let btnReal = document.getElementById('real');
    let btnFake = document.getElementById('fake');

    toggle(dialogue, imageWindow);
    showSlides(slideIndex += 1);

    $(btnReal).fadeIn(2000);
    $(btnFake).fadeIn(2000);

    step++;
    urlContent.textContent = jsonData[step].url.substr(0, 60);
}

