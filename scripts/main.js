String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

var cards = [];
var activeCard;
var timerEvent, time;
var answered = 0;
var correct = 0;
var timeAvg;

function onLoad() {
    // TODO: implement images
    
    // Push cards onto array
    cards.push({
        answer: 'Rock',
        text: 'Scissors'
    });
    
    cards.push({
        answer: 'Paper',
        text: 'Rock'
    });
    
    cards.push({
        answer: 'Scissors',
        text: 'Paper'
    });
    
    // Populate row of buttons based on array
    addButtons(cards);
    
    flash();
}

function addButtons(cards) {
    var TEMPLATE = 
        '<li class="button" onClick="onClickButton({0})">\n' +
        '   <p class="button-number">\n'+
        '       {1}\n' +
        '   </p>\n' +
        '   <p>\n' +
        '       {2}\n' +
        '   </p>\n' +
        '</li>';
    var buttons = document.getElementById('buttons');
    
    for (var i = 0; i < cards.length; i++) {
        buttons.innerHTML += TEMPLATE.format(i, i + 1, cards[i].answer);
    }
}

function flash() {
    var text = document.getElementById('flashcard-text');
    
    activeCard = Math.floor(Math.random() * cards.length);
    text.innerHTML = cards[activeCard].text;
    
    time = 0;
    timerEvent = setInterval(timerCountUp, 1);
}

function timerCountUp() {
    // TODO: needs format string
    time++;
    document.getElementById('timer').innerHTML = 'Time: ' + time / 1000 + 's';
}

function onClickButton(id) {
    // TODO: needs format string
    window.clearInterval(timerEvent);
    
    var message = document.getElementById('message');
    var record = document.getElementById('record');
    
    answered++;
    
    if (id == activeCard) {
        correct++;
        message.innerHTML = 'Correct!';
        new Audio('sound/correct.wav').play();
    } else {
        message.innerHTML = 'Wrong, try again!';
        new Audio('sound/wrong.wav').play();
    }
    
    record.innerHTML = 'Correct: ' + correct + '/' + answered + '(';
    
    setTimeout(flash, 500);
}