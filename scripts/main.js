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

var fileReader;

function onLoad() {
    // Push default cards onto array
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
    
    // Init file reader
    fileReader = new FileReader();
    fileReader.onload = function(loadEvent) {
        document.getElementById('flashcard-image').src
                = loadEvent.target.result;
    };
    
    // Populate row of buttons based on array
    populateButtons();
    populateEditDialog();
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

function populateButtons() {
    var TEMPLATE = 
        '<li class="button" onClick="onClickButton({0})">\n' +
        '   <p class="button-number">\n'+
        '       {1}\n' +
        '   </p>\n' +
        '   <p class="button-answer">\n' +
        '       {2}\n' +
        '   </p>\n' +
        '</li>';
    var buttons = document.getElementById('buttons');
    buttons.innerHTML = '';
    
    for (var i = 0; i < cards.length; i++)
        buttons.innerHTML += TEMPLATE.format(i, i + 1, cards[i].answer);
}

function populateEditDialog() {
    var TEMPLATE =
        '<li class="edit-card-entry" draggable="true" ' +
                'ondragstart="onDragStart(event, {0})" ' +
                'ondragover="onDragOver(event, this)" ' +
                'ondragleave="onDragLeave(event, this)" ' +
                'ondrop="onDragDrop(event, {0})">\n' +
        '    Answer: <input value="{1}" ' +
                'onchange="updateCardAnswer({0}, this.value)"><br>\n' +
        '    Question text: <input value="{2}" ' +
                'onchange="updateCardText({0}, this.value)"><br>\n' +
        '    Question image: <input type="file" ' +
                'onchange="updateCardImage(event, {0})"><br>\n' +
        '    <input type="button" value="Remove" ' +
                'onClick="removeCard({0})">\n' +
        '</li>';
    
    var entries = document.getElementById('edit-cards-container');
    entries.innerHTML = '';
    
    for (var i = 0; i < cards.length; i++)
        entries.innerHTML += TEMPLATE.format(
                i, cards[i].answer, cards[i].text);
}

function addCard() {
    cards.splice(cards.length, 0, {
        answer: '',
        text: ''
    });
    
    populateButtons();
    populateEditDialog();
}

function removeCard(id) {
    cards.splice(id, 1);
    populateButtons();
    populateEditDialog();
}

function updateCardAnswer(id, newString) {
    cards[id].answer = newString;
    populateButtons();
    populateEditDialog();
}

function updateCardText(id, newString) {
    cards[id].text = newString;
    populateButtons();
    populateEditDialog();
}

function updateCardImage(event, id) {
    var file = event.target.files[0];
    cards[id].image = file;
}

function onDragStart(event, id) {
    event.dataTransfer.setData("draggedId", id);
}

function onDragOver(event, card) {
    event.preventDefault();
    card.style.borderTop = '1px solid #666';
}

function onDragLeave(event, card) {
    event.preventDefault();
    card.style.borderTop = '1px solid rgba(255, 255, 255, 0)';
}

function onDragDrop(event, id) {
    event.preventDefault();
    var removed = cards.splice(event.dataTransfer.getData("draggedId"), 1)
            .pop();
    cards.splice(id, 0, removed);
    populateButtons();
    populateEditDialog();
}

function flash() {
    var text = document.getElementById('flashcard-text');
    var image = document.getElementById('flashcard-image');
    
    activeCard = Math.floor(Math.random() * cards.length);
    
    // UI
    if (cards[activeCard].image) {
        fileReader.readAsDataURL(cards[activeCard].image);
        text.innerHTML = '';
    } else {
        image.src = '';
        text.innerHTML = cards[activeCard].text;
    }
        
    document.getElementById('message').innerHTML = 'Press a button!'
    
    if (document.getElementById('sound').checked)
        new Audio('sound/flash.wav').play();
    
    document.body.style.background = '#fff';
    
    // Timer
    time = 0;
    enabled = true;
    startTime = new Date().getTime();
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
    
    // If started, stop. If stopped, start.
    started = !started;
    
    // If we're (not) starting...
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

function showEditCards() {
    document.getElementById('edit-cards-pane').style.display
            = 'inline';
    document.getElementById('edit-settings-pane').style.display
            = 'none';
}

function showSettings() {
    document.getElementById('edit-cards-pane').style.display
            = 'none';
    document.getElementById('edit-settings-pane').style.display
            = 'inline';
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
    var soundEnable = document.getElementById('sound');
    var backgroundEnable = document.getElementById('background');
    
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
        
        if (soundEnable.checked)
            new Audio('sound/correct.wav').play();
        
        if (backgroundEnable.checked)
            document.body.style.background = '#9f9';
    } else {
        streak = 0;
        message.innerHTML = 'Incorrect, try again! (answer: {0})'
                .format(cards[activeCard].answer);
        
        if (soundEnable.checked)
            new Audio('sound/wrong.wav').play();
        
        if (backgroundEnable.checked)
            document.body.style.background = '#f99';
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