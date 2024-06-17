document.addEventListener("DOMContentLoaded", (event)=> {
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let isTimerRunning = false;

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
            // only update if timer is running 
            if (isTimerRunning){
                elapsedTime = Date.now() - startTime;
                timerDisplay.textContent = timeToString(elapsedTime)
            }
        }, 1000)
        isTimerRunning = true
        showButton("PAUSE")
        // save the state when starting the timer
        saveState()
    }

    function pauseTimer(){
        clearInterval(timerInterval)
        // set timer state to paused
        isTimerRunning = false
        showButton("PLAY")
        saveState()
    }

    function stopTimer(){
        clearInterval(timerInterval)
        const workDay = document.getElementById("workday").value
        const taskName = document.getElementById("taskName").value
        const taskLabel1 = document.getElementById("taskLabel").value
        const timeSpent = timeToString(elapsedTime)

        saveTask(workDay, taskName, taskLabel1, timeSpent)

        elapsedTime = 0;
        timerDisplay.textContent = "0.00.00";
        isTimerRunning = false
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

    function saveTask(day, name, label, timeSpent){
        const task = { day, name, label, timeSpent, date: new Date().toLocaleDateString() }
        console.log(task)
        let tasks = JSON.parse(localStorage.getItem("tasks")) || []
        tasks.push(task)
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

    document.addEventListener("DOMContentLoaded", () => {
        displayTasks()
    })


    function saveState(){
        localStorage.setItem("elapsedTime", elapsedTime)
        localStorage.setItem("startTime", startTime)
        localStorage.setItem("isTimerRunning", isTimerRunning)
    }

    function clearState(){
        localStorage.removeItem("elapsedTime")
        localStorage.removeItem("startTime")
        localStorage.removeItem("isTimerRunning")
    }

    function loadState() {
        if (localStorage.getItem('elapsedTime')) {
            elapsedTime = parseInt(localStorage.getItem('elapsedTime'), 10);
            timerDisplay.textContent = timeToString(elapsedTime);
        }
        if (localStorage.getItem('startTime')) {
            startTime = parseInt(localStorage.getItem('startTime'), 10);
            if (!isNaN(startTime)) {
                // if timer was running, resume it
                if (isTimerRunning){
                    startTimer()
                }
            }
        }
    }

    function exportToCSV() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if (tasks.length === 0) {
            alert('No tasks to export.');
            return;
        }

        const headers = ['Date',"Day", 'Task Name', 'Task Label', 'Time Spent'];
        const rows = tasks.map(task => [task.date, task.day, task.name, task.label, task.timeSpent]);

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

function displayTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []
    const tableBody = document.getElementById("tableData")
    tableBody.innerHTML = ""
    tasks.forEach((task) => {
        const tableRow = `<tr>
          <td>${task.date}</td>
          <td>${task.day}</td>
          <td>${task.name}</td>
          <td>${task.label}</td>
          <td>${task.timeSpent}</td>
        </tr>`;
        tableBody.innerHTML += tableRow;
    })
}
