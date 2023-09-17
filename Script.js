let attempts = 0;
let correctGrouping = {};
let timerStarted = false;
let timerInterval;
let elapsedSeconds = 0;


// Generate random actor groupings for the game
function generateGroupings() {
    let actors = ['actor1', 'actor2', 'actor3', 'actor4', 'actor5', 'actor6', 'actor7', 'actor8', 'actor9', 'actor10', 'actor11', 'actor12', 'actor13', 'actor14', 'actor15', 'actor16', 'actor17', 'actor18', 'actor19', 'actor20', 'actor21', 'actor22', 'actor23', 'actor24', 'actor25'];
    for (let i = 1; i <= 5; i++) {
        correctGrouping['group' + i] = [];
        for (let j = 0; j < 5; j++) {
            let randomIndex = Math.floor(Math.random() * actors.length);
            correctGrouping['group' + i].push(actors[randomIndex]);
            actors.splice(randomIndex, 1);
        }
    }
}
// Timer funcions
function startTimer() {
    if (!timerStarted) {
        timerStarted = true;
        timerInterval = setInterval(function() {
            elapsedSeconds++;
            displayTimer();
        }, 1000);
    }
}

function displayTimer() {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    document.getElementById('timer').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Drag and drop functions
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    // Store the actor's original parent element for reversing the drop
    event.dataTransfer.setData("originalParent", event.target.parentElement.id);

    // Create a div to hold the rounded image
    const dragDiv = document.createElement('div');
    dragDiv.style.width = `${event.target.width}px`;
    dragDiv.style.height = `${event.target.height}px`;
    dragDiv.style.backgroundImage = `url(${event.target.src})`;
    dragDiv.style.backgroundSize = 'cover';
    dragDiv.style.borderRadius = '50%';
    dragDiv.style.position = 'fixed'; // This ensures the div doesn't affect the layout
    dragDiv.style.top = '-200%'; // Position it off-screen

    document.body.appendChild(dragDiv);

    // Use the div as the drag image
    event.dataTransfer.setDragImage(dragDiv, event.target.width / 2, event.target.height / 2);

    // Clean up after the drag operation is complete
    dragDiv.addEventListener('dragend', () => {
        document.body.removeChild(dragDiv);
    });
}

function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let draggedActor = document.getElementById(data);
    
    // Check if the target is a valid group container or another actor
    if (event.target.classList.contains('group')) {
        event.target.appendChild(draggedActor);
    } else if (event.target.parentElement.classList.contains('group')) {
        event.target.parentElement.insertBefore(draggedActor, event.target.nextSibling);
    } else {
        // If it's dropped outside a valid group, position it where it was dropped
        draggedActor.style.position = 'fixed';
        draggedActor.style.left = event.clientX - (draggedActor.offsetWidth / 2) + 'px';
        draggedActor.style.top = event.clientY - (draggedActor.offsetHeight / 2) + 'px';
        document.body.appendChild(draggedActor);
    }

    startTimer();
}

function returnToOriginalPosition(event) {
    const actor = event.target;
    const actorsContainer = document.getElementById("actors");
    actorsContainer.appendChild(actor);
}

// Check the player's grouping against the correct grouping
function confirmGuess() {
    attempts++;
    let groupCorrectCounts = {};
    let feedbackMessages = [];

    for (let i = 1; i <= 5; i++) {
        let correctCountForGroup = 0;
        let group = document.getElementById('group' + i);
        let children = group.getElementsByTagName('img');

        for (let j = 0; j < children.length; j++) {
            if (correctGrouping['group' + i].includes(children[j].id)) {
                correctCountForGroup++;
            }
        }
        
        groupCorrectCounts['group' + i] = correctCountForGroup;
        feedbackMessages.push('Grupo ' + i + ': ' + correctCountForGroup);
    }

    document.getElementById('attempts').innerText = attempts;

    // Join all feedback messages and display them
    document.getElementById('feedback').innerText = feedbackMessages.join('\n');
}


function stopTimer() {
    clearInterval(timerInterval);
}


// Initialize the game
document.getElementById('actor1').addEventListener('dragstart', drag);
document.getElementById('actor2').addEventListener('dragstart', drag);
document.getElementById('actor3').addEventListener('dragstart', drag);
document.getElementById('actor4').addEventListener('dragstart', drag);
document.getElementById('actor5').addEventListener('dragstart', drag);
document.getElementById('actor6').addEventListener('dragstart', drag);
document.getElementById('actor7').addEventListener('dragstart', drag);
document.getElementById('actor8').addEventListener('dragstart', drag);
document.getElementById('actor9').addEventListener('dragstart', drag);
document.getElementById('actor10').addEventListener('dragstart', drag);
document.getElementById('actor11').addEventListener('dragstart', drag);
document.getElementById('actor12').addEventListener('dragstart', drag);
document.getElementById('actor13').addEventListener('dragstart', drag);
document.getElementById('actor14').addEventListener('dragstart', drag);
document.getElementById('actor15').addEventListener('dragstart', drag);
document.getElementById('actor16').addEventListener('dragstart', drag);
document.getElementById('actor17').addEventListener('dragstart', drag);
document.getElementById('actor18').addEventListener('dragstart', drag);
document.getElementById('actor19').addEventListener('dragstart', drag);
document.getElementById('actor20').addEventListener('dragstart', drag);
document.getElementById('actor21').addEventListener('dragstart', drag);
document.getElementById('actor22').addEventListener('dragstart', drag);
document.getElementById('actor23').addEventListener('dragstart', drag);
document.getElementById('actor24').addEventListener('dragstart', drag);
document.getElementById('actor25').addEventListener('dragstart', drag);


document.getElementById('actor1').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor2').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor3').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor4').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor5').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor6').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor7').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor8').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor9').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor10').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor11').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor12').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor13').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor14').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor15').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor16').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor17').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor18').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor19').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor20').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor21').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor22').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor23').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor24').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor25').addEventListener('dblclick', returnToOriginalPosition);

document.body.addEventListener('dragover', allowDrop);

generateGroupings();

let scrollInterval;

function handleDragOver(event) {
    const buffer = 50;  // pixels from edge for scroll to start
    const scrollSpeed = 5;  // pixels per interval

    if (event.clientY < buffer) {
        // Scroll up
        if (!scrollInterval) {
            scrollInterval = setInterval(() => {
                window.scrollBy(0, -scrollSpeed);
            }, 20);  // 20ms interval for smoother scrolling
        }
    } else if (window.innerHeight - event.clientY < buffer) {
        // Scroll down
        if (!scrollInterval) {
            scrollInterval = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            }, 20);
        }
    } else {
        // Stop scrolling
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
}

function stopScrolling() {
    clearInterval(scrollInterval);
    scrollInterval = null;
}

document.addEventListener('dragover', handleDragOver);
document.addEventListener('dragend', stopScrolling);