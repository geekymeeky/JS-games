$(document).ready(function(){
	const LEVEL = {
		easy: {
			count: 6,
			name: 'easy'
		},
		medium: {
			count: 12,
			name: 'medium',
		},
		hard: {
			count: 26,
			name: 'hard'
		}
	}
	
	const allPairings = () => {
		const COLORS = ['red', 'black'];
		const NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8','9', '10', 'J', 'Q', 'K'];
		let arr=[]
		for (let i=0;i<NUMBERS.length;i++){
			for (let j=0; j<COLORS.length; j++){
				arr.push([NUMBERS[i], COLORS[j]]);
			}
		}
		return arr;
	
	}

	const initialisePositions = (numOfPairs) => {
		let arr = Array.apply(null, Array(numOfPairs*2));
		return arr.map(function(x,i){ return String(i) });
	}
	
	// GLOBAL VARIABLES
	let playingCards = [];
	let score = 0;
	let numClicks = 0;

	const setUp = (numOfPairs) => {
		numClicks = 0;
		score = 0;
		playingCards = [];

		let cards = [];
		let pos = initialisePositions(numOfPairs);
		let pairs = allPairings();

		for (let i=0; i<numOfPairs; i++) {
			pairs_index = Math.floor(Math.random()*pairs.length);
			for (let j=0; j<2; j++) {
				pos_index = Math.floor(Math.random()*pos.length);
				let card = {
					color: pairs[pairs_index][1],
					number: pairs[pairs_index][0],
					position: pos[pos_index]
				}
				cards.push(card);
				pos.splice(pos_index, 1);
			}
			pairs.splice(pairs_index,1);
		}
		let sortedByPos = cards.slice(0);
		sortedByPos.sort(function(a,b) {
			return a.position - b.position;
		});
		return sortedByPos;
	}

	const setUpDOM = (level) => {
		playingCards = setUp(level.count);
		const body = document.getElementById('cards-area');
		body.setAttribute('data-level', level.name)
		for (let i=0; i<playingCards.length; i++) {
			let e = document.createElement('div');
			e.id = playingCards[i].position;
			e.className = "card";
			body.append(e);		
		}
	}

	const clearDOM = () => {
		$('.card').remove();
		$('#high-scores').html('');
	}

	const checkPair = () => {
		let cards = $('.open');
		const first = playingCards[cards[0].id];
		const second = playingCards[cards[1].id];
		if (first.color == second.color && first.number == second.number) {
			return true;
		} 
		return false;
	}

	const openCard = (thisCard) => {
		let card = playingCards[thisCard.id];
		$(thisCard).addClass('open');
		thisCard.setAttribute('data-color', card.color);
		$(thisCard).text(card.number);
	}

	const closeCards = () => {
		$('.open').each(function(){
			$(this).removeClass('open');
			this.removeAttribute('data-color');
			$(this).text(" ");
		})
	}

	const removePair = () => {
		$('.open').each(function(){
			$(this).removeClass('open');
			$(this).css('visibility', 'hidden');
		})
	}

	$('#app').on('click', '.card', function(e){
		e.preventDefault();
		numClicks++;

		if (running == false) {
			startStopWatch();
		}		

		if (numClicks==1) {
			openCard(this);
			
		} else if (numClicks==2) {
			openCard(this);

			if (checkPair()) {
				score++;

				if (score == levelChoice.count){
					endStopWatch();
					alert("you solved it!");
					window.location.href = "index.html";
				}
			}

		} else {			
			numClicks = 1;
			checkPair() ? removePair() : closeCards()
			openCard(this);
		}
	})

	$('#app').on('click', '#level-easy-btn', function(e){
		e.preventDefault();
		clearDOM();
		levelChoice = LEVEL.easy;
		setUpDOM(levelChoice);
		resetStopWatch();
	})

	$('#app').on('click', '#level-medium-btn', function(e){
		e.preventDefault();
		clearDOM();
		levelChoice = LEVEL.medium;
		setUpDOM(levelChoice);
		resetStopWatch();
	})

	$('#app').on('click', '#level-hard-btn', function(e){
		e.preventDefault();
		clearDOM();
		levelChoice = LEVEL.hard;
		setUpDOM(levelChoice);
		resetStopWatch();
	})

	//https://stackoverflow.com/questions/26329900/how-do-i-display-millisecond-in-my-stopwatch
	let startTime = null,
		endTime = null,
		running = false,
		started = null,
		duration = 0;

	const startStopWatch = () => {
		startTime = getTime();
		running = true;
		started = setInterval(clockRunning, 10);
	}

	const endStopWatch = () => {
		endTime = getTime();
		clearInterval(started);
		running = false;
		saveToLocalStorage(endTime - startTime);
	}

	const resetStopWatch = () => {
		clearInterval(started);
		running = false;
		currentTime = null;
		endTime = null;
		$('#stopwatch').html("00:00:00");
	}

	const clockRunning = () => {
		const currentTime = getTime();
		$('#stopwatch').html(showTime(currentTime - startTime)); 
	}


	const getTime = () => {
		return new Date().getTime();
	}

	const saveToLocalStorage = (score) => {
		let today = new Date().setHours(0,0,0,0);
		let scoreItem = {
			'date': today,
			'score': score
		}
		let scores_array = null;
		if (localStorage.getItem(levelChoice.name) == null){
			scores_array = JSON.stringify([JSON.stringify(scoreItem)]);
		} else {
			scores_array = JSON.parse(localStorage.getItem(levelChoice.name));
			for(let i=0;i<scores_array.length;i++){
				scores_array[i] = JSON.parse(scores_array[i]);
			}
			scores_array.push(scoreItem);
			scores_array.sort((a, b) => a.score - b.score);
			for(let i=0;i<Math.min(3,scores_array.length);i++){
				scores_array[i] = JSON.stringify(scores_array[i])
			}
			scores_array = JSON.stringify(scores_array);
			
		}
		localStorage.setItem(levelChoice.name, scores_array);
		console.log(localStorage);
	}

	const showTime = (datetime) => {
		const timeElapsed = new Date(datetime),
			  hour = timeElapsed.getUTCHours(),
			  min = timeElapsed.getUTCMinutes(),
			  sec = timeElapsed.getUTCSeconds();
		return (hour > 9 ? hour : "0" + hour) + ":" + 
        (min > 9 ? min : "0" + min) + ":" + 
        (sec > 9 ? sec : "0" + sec) 
	}

	const showDate = (date) => {
		return
	}

	$('#app').on('click', '#personal-best', function(){
		clearDOM();
		const no_scores = "There are no scores";
		const body = document.getElementById('high-scores');

		Object.keys(LEVEL).forEach(function(key){
			let title = document.createElement('h3');
			title.innerHTML = LEVEL[key].name;
			body.append(title);
			if (localStorage.getItem(LEVEL[key].name) != null){
				let scores = JSON.parse(localStorage.getItem(LEVEL[key].name));
			
				for(let i=0;i<scores.length;i++){
					scores[i] = JSON.parse(scores[i]);
					let div = document.createElement('div');
					let date_field = document.createElement('p');
					let score_field = document.createElement('p');
					date_field.innerHTML = new Date(scores[i].date).toDateString();
					score_field.innerHTML = showTime(scores[i].score);
					
					div.append(date_field);
					div.append(score_field);
					body.append(div);
				}		
			} else {
				let text = document.createElement('p');
				text.innerHTML = no_scores;
				body.append(text);
			}
		})
		
	})

	let levelChoice = LEVEL.easy;
	setUpDOM(levelChoice);

})