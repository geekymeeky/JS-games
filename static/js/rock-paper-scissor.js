var compScore = 0, pScore = 0;
function play(pMove) {
    var compMove = Math.floor(Math.random() * 3) + 1;
    document.getElementById('pImg').src = 'static/images/rock-paper-scissor/' + pMove + '.png';
    document.getElementById('cImg').src = 'static/images/rock-paper-scissor/' + compMove + '.png';
    if (pMove != compMove) {

        if (pMove == 1 && compMove == 3) pScore++;
        else if (pMove == 1 && compMove == 2) compScore++;
        else if (pMove == 2 && compMove == 3) compScore++;
        else if (pMove == 2 && compMove == 1) pScore++;
        else if (pMove == 3 && compMove == 2) pScore++;
        else if (pMove == 3 && compMove == 1) compScore++;
    }
    console.log(pScore);
    document.getElementById('p1Score').innerHTML = pScore.toString();
    document.getElementById('p2Score').innerHTML = compScore.toString();
}
function reset() {
    pScore = 0;
    compScore = 0;
    document.getElementById('p1Score').innerHTML = pScore.toString();
    document.getElementById('p2Score').innerHTML = compScore.toString();
    alert('Done')
}