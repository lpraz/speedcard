function onLoad() {
    // TODO: implement images
    var cards = [];
    
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
    
    addButtons(cards);
}

function addButtons(cards) {
    var buttons = document.getElementById('buttons');
    var template = 
        '<li class="button" onClick="onClickButton()">\n' +
        '   <p class="button-number">\n'+
        '       0\n' +
        '   </p>\n' +
        '   <p>\n' +
        '       Placeholder\n' +
        '   </p>\n' +
        '</li>';
    
    for (var i = 0; i < cards.length; i++) {
        buttons.innerHTML += template;
    }
}

function onClickButton(id) {
    document.getElementById('flashcard-text').innerHTML = "Clicked " + id;
}