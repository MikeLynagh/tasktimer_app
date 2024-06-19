    // Initialize global variables
    let startTime, elapsedTime = 0, timerInterval, isTimerRunning = false;
    let startDayTime, elapsedDayTime = 0, timerDayInterval, isDayTimerRunning = false;
  // this has something to do with issue 
document.addEventListener("DOMContentLoaded", (event) => {

    const timerDisplay = document.getElementById("timer");
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const stopBtn = document.getElementById("stopBtn");
    const taskHistory = document.getElementById("taskHistory");
    const exportBtn = document.getElementById("exportBtn");
    const startDayBtn = document.getElementById("startDayBtn");
    const pauseDayBtn = document.getElementById("pauseDayBtn");
    const stopDayBtn = document.getElementById("stopDayBtn");
    const timerDayDisplay = document.getElementById("daytimer");

    // Button event listeners
    startBtn.addEventListener("click", () => startTimer(timerDisplay));
    pauseBtn.addEventListener("click", () => pauseTimer());
    stopBtn.addEventListener("click", () => stopTimer(timerDisplay));
    startDayBtn.addEventListener("click", () => startDayTimer(timerDayDisplay));
    pauseDayBtn.addEventListener("click", () => pauseDayTimer());
    stopDayBtn.addEventListener("click", () => stopDayTimer(timerDayDisplay));
    exportBtn.addEventListener("click", exportToCSV);
    window.addEventListener("beforeunload", saveState);

    // Load saved state on page load
    loadState(timerDisplay, timerDayDisplay);

    displayTasks();
    showButton("PLAY");
});

// Function to start task timer
function startTimer(timerDisplay) {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        if (isTimerRunning) {
            elapsedTime = Date.now() - startTime;
            timerDisplay.textContent = timeToString(elapsedTime);
        }
    }, 1000);
    isTimerRunning = true;
    showButton("PAUSE");
    saveState();
}

// Function to pause task timer
function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    showButton("PLAY");
    saveState();
}

// Function to stop task timer
function stopTimer(timerDisplay) {
    clearInterval(timerInterval);
    const workDay = document.getElementById("workday").value;
    const taskName = document.getElementById("taskName").value;
    const taskLabel1 = document.getElementById("taskLabel").value;
    const timeSpent = timeToString(elapsedTime);

    saveTask(workDay, taskName, taskLabel1, timeSpent);

    elapsedTime = 0;
    timerDisplay.textContent = "0.00.00";
    isTimerRunning = false;
    showButton("PLAY");
    displayTasks();
    clearState();
}

// Function to start day timer
function startDayTimer(timerDayDisplay) {
    startDayTime = Date.now() - elapsedDayTime;
    timerDayInterval = setInterval(() => {
        if (isDayTimerRunning) {
            elapsedDayTime = Date.now() - startDayTime;
            timerDayDisplay.textContent = timeToString(elapsedDayTime);
        }
    }, 1000);
    isDayTimerRunning = true;
    saveDayState();
}


// Function to pause day timer
function pauseDayTimer() {
    clearInterval(timerDayInterval);
    isDayTimerRunning = false;
    saveDayState();
}

// Function to stop day timer
function stopDayTimer(timerDayDisplay) {
    clearInterval(timerDayInterval);
    const workDay = document.getElementById("mainworkday").value;
    const timeSpent = timeToString(elapsedDayTime);

    saveTask(workDay, "", "", timeSpent);

    elapsedDayTime = 0;
    timerDayDisplay.textContent = "0.00.00";
    isDayTimerRunning = false;
    displayTasks();
    clearDayState();
}

// Function to format time
function timeToString(time) {
    let diffInHrs = time / 3600000;
    let hh = Math.floor(diffInHrs);

    let diffInMin = (diffInHrs - hh) * 60;
    let mm = Math.floor(diffInMin);

    let diffInSec = (diffInMin - mm) * 60;
    let ss = Math.floor(diffInSec);

    let formattedHH = hh.toString().padStart(2, "0");
    let formattedMM = mm.toString().padStart(2, "0");
    let formattedSS = ss.toString().padStart(2, "0");

    return `${formattedHH}:${formattedMM}:${formattedSS}`;
}

// Function to show the correct button
function showButton(buttonKey) {
    const buttonToShow = buttonKey === "PLAY" ? document.getElementById("startBtn") : document.getElementById("pauseBtn");
    const buttonToHide = buttonKey === "PLAY" ? document.getElementById("pauseBtn") : document.getElementById("startBtn");
    buttonToShow.style.display = "block";
    buttonToHide.style.display = "none";
}

// Function to save a task to localStorage
function saveTask(day, name, label, timeSpent) {
    const task = { day, name, label, timeSpent, date: new Date().toLocaleDateString() };
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to delete a task from localStorage
function deleteTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
}

// Function to display tasks in the table
function displayTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const tableBody = document.getElementById("tableData").getElementsByTagName("tbody")[0];

    if (!tableBody) {
        console.error('Table body not found');
        return;
    }

    // Clear existing rows
    tableBody.innerHTML = "";

    tasks.forEach((task, index) => {
        const row = tableBody.insertRow();

        row.insertCell(0).textContent = task.date;
        row.insertCell(1).textContent = task.day;
        row.insertCell(2).textContent = task.name || "N/A";
        row.insertCell(3).textContent = task.label || "N/A";
        row.insertCell(4).textContent = task.timeSpent;

        const actionsCell = row.insertCell(5);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteTask(index);
        actionsCell.appendChild(deleteButton);
    });
}

// Function to save the state
function saveState() {
    localStorage.setItem("elapsedTime", elapsedTime);
    localStorage.setItem("startTime", startTime);
    localStorage.setItem("isTimerRunning", isTimerRunning);
}

// Function to save day state
function saveDayState() {
    localStorage.setItem("elapsedDayTime", elapsedDayTime);
    localStorage.setItem("startDayTime", startDayTime);
    localStorage.setItem("isDayTimerRunning", isDayTimerRunning);
}

// Function to clear state
function clearState() {
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("startTime");
    localStorage.removeItem("isTimerRunning");
}

// Function to clear day state
function clearDayState() {
    localStorage.removeItem("elapsedDayTime");
    localStorage.removeItem("startDayTime");
    localStorage.removeItem("isDayTimerRunning");
}

// Function to load the state
function loadState(timerDisplay, timerDayDisplay) {
    if (localStorage.getItem('elapsedTime')) {
        elapsedTime = parseInt(localStorage.getItem('elapsedTime'), 10);
        timerDisplay.textContent = timeToString(elapsedTime);
    }
    if (localStorage.getItem('startTime')) {
        startTime = parseInt(localStorage.getItem('startTime'), 10);
        if (!isNaN(startTime) && localStorage.getItem('isTimerRunning') === 'true') {
            startTimer(timerDisplay);
        }
    }
    if (localStorage.getItem('elapsedDayTime')) {
        elapsedDayTime = parseInt(localStorage.getItem('elapsedDayTime'), 10);
        timerDayDisplay.textContent = timeToString(elapsedDayTime);
    }
    if (localStorage.getItem('startDayTime')) {
        startDayTime = parseInt(localStorage.getItem('startDayTime'), 10);
        if (!isNaN(startDayTime) && localStorage.getItem('isDayTimerRunning') === 'true') {
            startDayTimer(timerDayDisplay);
        }
    }
}

// Function to export tasks to CSV
function exportToCSV() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (tasks.length === 0) {
        alert('No tasks to export.');
        return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' 
        + 'Date,Day,Task Name,Label,Time Spent\n'
        + tasks.map(task => `${task.date},${task.day},${task.name},${task.label},${task.timeSpent}`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
