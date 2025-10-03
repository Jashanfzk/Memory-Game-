window.onload=function(){

    // Get DOM elements
    const startbutn = document.getElementById("startbutn");
    const speedSelector = document.getElementById("speed");
    const message = document.getElementById("message");
    const scoreDisplay = document.getElementById("score");

    // Defensive null checks
    if (!startbutn || !speedSelector || !message || !scoreDisplay) {
        console.error('Required DOM elements not found.');
        return;
    }

    //Game variables
    let ChoosedAnimal = null;
    let score = 0;
    let Nowshuffling = false;
    let awaitingGuess = false; // true when user should click to guess

    // initialize UI
    scoreDisplay.textContent = "Score: " + score;


    //Card data
    const animalCards = [
        {name: "cat", cardID: "card-cat", imgID: "cat", imgSrc: "cat.jpg"},
        {name: "dog", cardID: "card-dog", imgID: "dog", imgSrc: "dog.jpg"},
        {name: "tiger", cardID: "card-tiger", imgID: "tiger", imgSrc: "tiger.jpg"},
        {name: "lion", cardID: "card-lion", imgID: "lion", imgSrc: "lion.jpg"}
    ];

    // Single click listener per card: acts as selection before shuffle, and as guess during guessing
    animalCards.forEach(function (card) {
        const cardElement = document.getElementById(card.cardID);
        if (!cardElement) return;
        cardElement.addEventListener('click', function cardClickHandler() {
            if (Nowshuffling) return;
            if (awaitingGuess) {
                // handle guess
                awaitingGuess = false; // prevent further guesses
                const imgEl = document.getElementById(card.imgID);
                checkGuess(card.name, imgEl, cardElement);
                return;
            }
            // handle selection
            ChoosedAnimal = card.name;
            clearBorders();
            cardElement.style.border = "3px solid green";
            message.textContent = "You picked " + card.name + ". Click Start!";
        });
        // keyboard activation: Enter or Space
        cardElement.addEventListener('keydown', function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                cardElement.click();
            }
        });
    });

    //start button event
    startbutn.addEventListener('click', function () {
        if (!ChoosedAnimal) {
            message.textContent = "Please pick the animal first";
            return;
        }
        startShuffle(); //shuffle call
    });


    function startShuffle(){    // Function to shuffle the cards.
        // Prevent double-start
        if (Nowshuffling) return;
    Nowshuffling = true;
    // Disable start button while shuffling
    if (startbutn) startbutn.disabled = true;
    message.textContent = "Shuffling...";

    const speed = parseInt(speedSelector.value, 10) || 1000; //Speed specified read here.
    const shuffledList = animalCards.slice(); // copy array to shuffle.

    // Set interval loop
        const interval = setInterval(function () {
            shuffledList.sort(() => 0.5 - Math.random()); //Random shuffle
            for (let i = 0; i < shuffledList.length; i++) {
                const img = document.getElementById(animalCards[i].imgID);
                if (img) {
                    img.src = shuffledList[i].imgSrc;
                    img.alt = shuffledList[i].name;
                }
                const cardEl = document.getElementById(animalCards[i].cardID);
                if (cardEl) cardEl.classList.add("shuffling");
            }
        }, speed);

        setTimeout(function () { // stop shuffling after 5 seconds
            clearInterval(interval);
            // remove shuffling class
            animalCards.forEach(function (card) {
                document.getElementById(card.cardID).classList.remove("shuffling");
            });
            hidecards();
            Nowshuffling = false;
            // Re-enable start button
            if (startbutn) startbutn.disabled = false;
            // Enable guessing
            awaitingGuess = true;
            message.textContent = "Now find your animal";
        }, 5000);
    }
    
    function hidecards(){ //image hiding function
        animalCards.forEach(function(card){
            const img = document.getElementById(card.imgID);
            if (img) img.style.visibility = "hidden";
            // do not attach guess handlers here — the card click handler handles selection vs guess
        });
    }
    
    function checkGuess(guess,img, cardElement){ // guess function
        // reveal all images and highlight which are correct/incorrect
        animalCards.forEach(function(c){
            var elImg = document.getElementById(c.imgID);
            if (elImg) elImg.style.visibility = 'visible';
            var elCard = document.getElementById(c.cardID);
            if (!elCard) return;
            if (c.name === ChoosedAnimal){
                elCard.style.border = '3px solid green';
            } else {
                elCard.style.border = '3px solid red';
            }
        });

        if (guess === ChoosedAnimal){
            message.textContent = "Correct!";
            score++;
        } else {
            message.textContent = "Wrong. That was a " + guess + ".";
        }
        scoreDisplay.textContent = "Score: " + score;

        setTimeout(resetGame, 3000); //Game reset call
    }

    function resetGame(){ // reset game function
        ChoosedAnimal = null;
        message.textContent = "Select an animal and then click Start!";

        animalCards.forEach(function (card){
            var img = document.getElementById(card.imgID);
            img.src = card.imgSrc;
            img.alt = card.name;
            img.style.visibility = "visible";

            var cardElement = document.getElementById(card.cardID);
            // reset border
            if (cardElement) cardElement.style.border = "2px solid black";
        });
    }

    function clearBorders(){ //add borders to the shuffle images
        animalCards.forEach(function (card){
            const el = document.getElementById(card.cardID);
            if (el) el.style.border = "2px solid black";
        });
    }
};