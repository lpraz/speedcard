String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

var cards = [];
var activeCard;
var enabled = true;

var startTime = new Date().getTime();
var timerEvent, time;

var answered = 0;
var correct = 0;
var streak = 0;
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

window.onkeydown = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    
    key -= 49;
    if (key >= 0 && key < cards.length)
        onClickButton(key);
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
    enabled = true;
    startTime = new Date().getTime();
    timerEvent = setInterval(timerCountUp, 1);
}

function timerCountUp() {
    var TEMPLATE = 'Time: {0}s';
    time = new Date().getTime() - startTime;
    document.getElementById('timer').innerHTML = TEMPLATE.format(time / 1000);
}

function onClickButton(id) {
    var CORRECT_TEMPLATE = 'Correct: {0}/{1} ({2}%)';
    var STREAK_TEMPLATE = 'Streak: {0}';
    // TODO: needs format string
    window.clearInterval(timerEvent);
    
    var message = document.getElementById('message');
    var recordMessage = document.getElementById('record');
    var streakMessage = document.getElementById('streak');
    
    if (!enabled)
        return;
    
    enabled = false;
    answered++;
    
    if (id == activeCard) {
        correct++;
        streak++;
        message.innerHTML = 'Correct!';
        new Audio('sound/correct.wav').play();
    } else {
        streak = 0;
        message.innerHTML = 'Wrong, try again!';
        new Audio('sound/wrong.wav').play();
    }
    
    recordMessage.innerHTML = CORRECT_TEMPLATE.format(correct, answered, 
            parseInt(correct * 10000 / answered) / 100);
    streakMessage.innerHTML = STREAK_TEMPLATE.format(streak);
    
    setTimeout(flash, 500);
}