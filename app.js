document.addEventListener("DOMContentLoaded", (event)=> {
    let startTime;
    let elapsedTime = 0;
    let timerInterval;

    const timerDisplay = document.getElementById("timer")
    const startBtn = document.getElementById("startBtn")
    const pauseBtn = document.getElementById("pauseBtn")
    const stopBtn = document.getElementById("stopBtn")
    const taskHistory = document.getElementById("taskHistory")
    const exportBtn = document.getElementById("exportBtn")
    
    
    startBtn.addEventListener("click", startTimer)
    pauseBtn.addEventListener("click", pauseTimer)
    stopBtn.addEventListener("click", stopTimer)
    exportBtn.addEventListener("click", exportToCSV)
    window.addEventListener("beforeunload", saveState)

    // load the saved state on page load 
    loadState()

    function startTimer(){
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            timerDisplay.textContent = timeToString(elapsedTime)
        }, 1000)
        showButton("PAUSE")
        // save the state when starting the timer
        saveState()
    }

    function pauseTimer(){
        clearInterval(timerInterval)
        showButton("PLAY")
        saveState()
    }

    function stopTimer(){
        clearInterval(timerInterval)
        const taskName = document.getElementById("taskName").value
        const taskLabel1 = document.getElementById("taskLabel").value
        const timeSpent = timeToString(elapsedTime)

        saveTask(taskName, taskLabel1, timeSpent)

        elapsedTime = 0;
        timerDisplay.textContent = "0.00.00";
        showButton("PLAY")
        displayTasks()
        clearState()
    }

    function timeToString(time){
        let diffInHrs = time / 3600000;
        let hh = Math.floor(diffInHrs);

        let diffInMin = (diffInHrs - hh) * 60;
        let mm = Math.floor(diffInMin);

        let diffInSec = (diffInMin - mm) * 60;
        let ss = Math.floor(diffInSec);

        let formattedHH = hh.toString().padStart(2, "0")
        let formattedMM = mm.toString().padStart(2, "0")
        let formattedSS = ss.toString().padStart(2, "0")
        
        return `${formattedHH}:${formattedMM}:${formattedSS}`

    }

    function showButton(buttonKey){
        const buttonToShow = buttonKey === "PLAY" ? startBtn : pauseBtn;
        const buttonToHide = buttonKey === "PLAY" ? pauseBtn : startBtn
        buttonToShow.style.display = "block"
        buttonToHide.style.display = "none"
    }

    function saveTask(name, label, timeSpent){
        const task = { name, label, timeSpent, date: new Date().toLocaleDateString() }
        let tasks = JSON.parse(localStorage.getItem("tasks")) || []
        tasks.push(task)
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

    function displayTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || []
        taskHistory.innerHTML = " "
        tasks.forEach(task => {
            const li = document.createElement("li")
            li.classList.add("list-group-item")
            li.textContent = `${task.date} - ${task.name} [${task.label}]: ${task.timeSpent}`;
            taskHistory.appendChild(li)
        })
    }

    function saveState(){
        localStorage.setItem("elapsedTime", elapsedTime)
        localStorage.setItem("startTime", startTime)
    }

    function clearState(){
        localStorage.removeItem("elapsedTime")
        localStorage.removeItem("startTime")
    }

    function loadState() {
        if (localStorage.getItem('elapsedTime')) {
            elapsedTime = parseInt(localStorage.getItem('elapsedTime'), 10);
            timerDisplay.textContent = timeToString(elapsedTime);
        }
        if (localStorage.getItem('startTime')) {
            startTime = parseInt(localStorage.getItem('startTime'), 10);
            if (!isNaN(startTime)) {
                startTimer();
            }
        }
    }

    function exportToCSV() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (tasks.length === 0) {
            alert('No tasks to export.');
            return;
        }

        const headers = ['Date', 'Task Name', 'Task Label', 'Time Spent'];
        const rows = tasks.map(task => [task.date, task.name, task.label, task.timeSpent]);

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.join(',') + '\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'tasks.csv');
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    }

    displayTasks()
    showButton("PLAY")
})