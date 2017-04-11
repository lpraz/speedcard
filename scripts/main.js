String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

var cards = [];
var activeCard;

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
    
    setTimeout(flash, 3000);
}

function onClickButton(id) {
    var message = document.getElementById('message');
    
    if (id == activeCard)
        message.innerHTML = 'Correct!';
    else
        message.innerHTML = 'Wrong, try again!';
}