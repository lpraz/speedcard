// String formatter
String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

var cards = [];
var activeCard;

var started = false;
var enabled = false;

var startTime = new Date().getTime();
var timerEvent;
var time;
var waitEvent;

var answered = 0;
var correct = 0;
var streak = 0;
var timeAvg = 0;

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
    populateButtons(cards);
    populateEditDialog(cards);
}

function reset() {
    time = 0;
    answered = 0;
    correct = 0;
    streak = 0;
    timeAvg = 0;
    
    document.getElementById('timer').innerHTML = 'Time: 0s';
    document.getElementById('record').innerHTML = 'Correct: 0/0 (0%)';
    document.getElementById('streak').innerHTML = 'Streak: 0';
    document.getElementById('avg-time').innerHTML = 'Average time: 0s';
    document.getElementById('flashcard-text').innerHTML = '';
}

window.onkeydown = function(e) {
    if (document.activeElement == document.getElementById('autofail'))
        return;
    
    var key = e.keyCode ? e.keyCode : e.which;
    key -= 49;
    
    var button = document.getElementById('buttons')
            .getElementsByTagName("LI")[key];
    
    if (key >= 0 && key < cards.length) {
        onClickButton(key);
        button.style.border = '1px inset #999';
    }
}

window.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
    key -= 49;
    
    var button = document.getElementById('buttons')
            .getElementsByTagName("LI")[key];
    
    if (key >= 0 && key < cards.length)
        button.style.border = '1px outset #999';
}

function populateButtons(cards) {
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
    buttons.innerHTML = '';
    
    for (var i = 0; i < cards.length; i++)
        buttons.innerHTML += TEMPLATE.format(i, i + 1, cards[i].answer);
}

function populateEditDialog(cards) {
    var TEMPLATE =
        '<li class="edit-card-entry">\n' +
        '    Name: <input><br>\n' +
        '    Correct response to: <input><br>\n' +
        '    <input type="button" value="Remove">\n' +
        '</li>';
    
    var entries = document.getElementById('edit-cards-container');
    entries.innerHTML = '';
    
    for (var i = 0; i < cards.length; i++)
        entries.innerHTML += TEMPLATE.format();
}

function flash() {
    var text = document.getElementById('flashcard-text');
    
    activeCard = Math.floor(Math.random() * cards.length);
    text.innerHTML = cards[activeCard].text;
    
    time = 0;
    enabled = true;
    startTime = new Date().getTime();
    document.getElementById('message').innerHTML = 'Wait for it...'
    timerEvent = setInterval(timerCountUp, 1);
}

function timerCountUp() {
    var TEMPLATE = 'Time: {0}s';
    var autoFail = document.getElementById('autofail');
    
    time = new Date().getTime() - startTime;
    document.getElementById('timer').innerHTML = TEMPLATE.format(time / 1000);
    
    if (autoFail.value && autoFail.value * 1000 < time) {
        clearInterval(timerEvent);
        onClickButton(-1);
    }
}

function onClickStart() {
    var startButton = document.getElementById('start');
    var message = document.getElementById('message');
    started = !started;
    
    if (started) {
        flash();
        start.value = 'Stop';
    } else {
        clearInterval(timerEvent);
        clearInterval(waitEvent);
        enabled = false;
        start.value = 'Start';
        message.innerHTML = 'Click "Start"!';
    }
}

function openEditDialog() {
    document.getElementById('edit-dialog').style.visibility = 'visible';
}

function closeEditDialog() {
    document.getElementById('edit-dialog').style.visibility = 'hidden';
}

function onClickButton(id) {
    // Format string templates
    var CORRECT_TEMPLATE = 'Correct: {0}/{1} ({2}%)';
    var STREAK_TEMPLATE = 'Streak: {0}';
    var TIME_AVG_TEMPLATE = 'Average time: {0}s';
    
    // HTML elements
    var message = document.getElementById('message');
    var recordMessage = document.getElementById('record');
    var streakMessage = document.getElementById('streak');
    var timeAvgMessage = document.getElementById('avg-time');
    
    // Do nothing if button input disabled
    if (!enabled)
        return;
    
    clearInterval(timerEvent);
    
    // Disable further input from the buttons
    enabled = false;
    
    // Stats that update regardless of correct answer
    answered++;
    timeAvg = (timeAvg + time) / answered;
    
    // If correct button (not) pressed, update necessary stats/elements
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
    
    // Update HTML elements containing stats
    recordMessage.innerHTML = CORRECT_TEMPLATE.format(correct, answered, 
            parseInt(correct * 10000 / answered) / 100);
    streakMessage.innerHTML = STREAK_TEMPLATE.format(streak);
    timeAvgMessage.innerHTML = TIME_AVG_TEMPLATE.format(
            parseInt(timeAvg) / 1000);
    
    // Wait 1 second before flashing the next card
    waitEvent = setTimeout(flash, 1000);
}