let attempts = 0;
let correctGrouping = {};
let timerStarted = false;
let timerInterval;
let elapsedSeconds = 0;
let gameCompleted = false;
const MAX_ACTORS = 7;  // Replace x with the desired maximum number.
const originalActors = ['actor1', 'actor2', 'actor3', 'actor4', 'actor5', 'actor6', 'actor7', 'actor8', 'actor9', 'actor10', 'actor11', 'actor12', 'actor13', 'actor14', 'actor15', 'actor16', 'actor17', 'actor18', 'actor19', 'actor20', 'actor21', 'actor22', 'actor23', 'actor24', 'actor25', 'actor26', 'actor27', 'actor28', 'actor29', 'actor30', 'actor31', 'actor32', 'actor33', 'actor34', 'actor35', 'actor36'];
const buffer = 75;  // Ajustando para 75 pixels da borda para iniciar a rolagem

function generateGroupings() {
    let actors = [...originalActors];  // Cria uma cópia do array original
    for (let i = 1; i <= 6; i++) {
        correctGrouping['group' + i] = [];
        for (let j = 0; j < 6; j++) {
            let randomIndex = Math.floor(Math.random() * actors.length);
            correctGrouping['group' + i].push(actors[randomIndex]);
            actors.splice(randomIndex, 1);
        }
    }
}


function showMessage(text) {
    document.getElementById('messageText').innerText = text;
    document.getElementById('customMessage').classList.remove('hidden');
}

function closeMessage() {
    document.getElementById('customMessage').classList.add('hidden');
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

function updateObjectCount(group) {
    const countSpan = group.querySelector('.object-count');
    // Subtracting 1 because our object-count span is also a child
    const actorCount = group.children.length - 1;
    countSpan.textContent = actorCount;
}

function getPlayerGrouping() {
    let playerGrouping = {};

    // Seleciona todos os grupos
    let groups = document.querySelectorAll('.group');

    // Para cada grupo, obtenha os atores dentro dele
    groups.forEach(group => {
        let groupId = group.id;
        playerGrouping[groupId] = [];

        // Seleciona todas as imagens de atores dentro do grupo atual
        let actorsInGroup = group.querySelectorAll('img');

        actorsInGroup.forEach(actor => {
            playerGrouping[groupId].push(actor.id);
        });
    });

    return playerGrouping;
}


// Drag and drop functions
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
    // Armazene o originalParent como um atributo de "data-" no elemento do ator
    event.target.setAttribute("data-original-parent", event.target.parentElement.id);
    
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

    if (gameCompleted) return;
    });
}

function returnActorToOriginalLocation(actor) {
    // Recupere o originalParent do atributo de "data-" em vez de dataTransfer
    const originalParentId = actor.getAttribute("data-original-parent");
    const originalParent = document.getElementById(originalParentId);
    originalParent.appendChild(actor);
}


function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let draggedActor = document.getElementById(data);
    let targetGroup = null;  // Initialize the target group variable

    startTimer();

    // Check if the target is a valid group container or another actor
    if (event.target.classList.contains('group')) {
        targetGroup = event.target;  // Set the target group
        event.target.appendChild(draggedActor);
    } else if (event.target.parentElement.classList.contains('group')) {
        targetGroup = event.target.parentElement;  // Set the target group
        event.target.parentElement.insertBefore(draggedActor, event.target.nextSibling);
    } else {
        // This is where you handle cases where the drop target is neither an actor nor a group.
        // For instance, if you want to remove actors from groups when dropped outside, handle that here.
    }

    // If the actor was added to a group, then check the maximum actor count
    if (targetGroup) {
        if (targetGroup.children.length - 1 >= MAX_ACTORS) {  // Subtracting 1 to exclude the count span
            showMessage('Opss... apenas 6 por grupo!');
            returnActorToOriginalLocation(draggedActor);
            targetGroup.removeChild(draggedActor);  // Remove the last added actor
            return;  // Exit the function
        } else {
            updateObjectCount(targetGroup);  // Update the count for the group
        }
    if (gameCompleted) return;
}
    
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

    for (let i = 1; i <= 6; i++) {
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

function checkCombination(playerGrouping) {
    for (let group in correctGrouping) {
        // Verifique se todos os atores no grupo do jogador estão no grupo correto
        for (let actor of playerGrouping[group]) {
            if (!correctGrouping[group].includes(actor)) {
                return false;
            }
        }
    }
    
    // Se chegou aqui, significa que a combinação está correta
    gameCompleted = true;
    clearInterval(timerInterval);  // Pare o timer
    showMessage("Parabéns!");  // Mostre a mensagem de conclusão
    return true;
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
document.getElementById('actor26').addEventListener('dragstart', drag);
document.getElementById('actor27').addEventListener('dragstart', drag);
document.getElementById('actor28').addEventListener('dragstart', drag);
document.getElementById('actor29').addEventListener('dragstart', drag);
document.getElementById('actor30').addEventListener('dragstart', drag);
document.getElementById('actor31').addEventListener('dragstart', drag);
document.getElementById('actor32').addEventListener('dragstart', drag);
document.getElementById('actor33').addEventListener('dragstart', drag);
document.getElementById('actor34').addEventListener('dragstart', drag);
document.getElementById('actor35').addEventListener('dragstart', drag);
document.getElementById('actor36').addEventListener('dragstart', drag);



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
document.getElementById('actor26').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor27').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor28').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor29').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor30').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor31').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor32').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor33').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor34').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor35').addEventListener('dblclick', returnToOriginalPosition);
document.getElementById('actor36').addEventListener('dblclick', returnToOriginalPosition);

document.body.addEventListener('dragover', allowDrop);

generateGroupings();

let scrollInterval;

function handleDragOver(event) {
    const scrollSpeed = 5;  // pixels por intervalo

    if (event.clientY < buffer) {
        // Rolar para cima
        if (!scrollInterval) {
            scrollInterval = setInterval(() => {
                window.scrollBy(0, -scrollSpeed);
            }, 20);  // Intervalo de 20ms para uma rolagem mais suave
        }
    } else if (window.innerHeight - event.clientY < buffer) {
        // Rolar para baixo
        if (!scrollInterval) {
            scrollInterval = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            }, 20);
        }
    } else {
        // Parar rolagem
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
