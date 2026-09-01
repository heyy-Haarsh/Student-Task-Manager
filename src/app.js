const taskInput = document.getElementById("taskInput");
<<<<<<< HEAD
const taskList = document.getElementById("taskList");

function addTask() {
    const task = taskInput.value.trim();

    if (!task) {
        return;
    }

    const li = document.createElement("li");
    li.textContent = task;

    li.onclick = () => {
        li.style.textDecoration =
            li.style.textDecoration === "line-through"
                ? "none"
                : "line-through";
    };

    taskList.appendChild(li);
    taskInput.value = "";
}
=======
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const taskSummary = document.getElementById("taskSummary");
const emptyState = document.getElementById("emptyState");


// ======================================
// DISPLAY TASKS
// ======================================

function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const card = document.createElement("div");

        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }

        card.innerHTML = `

            <div class="task-main">

                <button
                    class="check ${task.completed ? "checked" : ""}"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed ? "✓" : ""}
                </button>

                <div class="task-info">

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <span class="priority ${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>

                </div>

            </div>


            <div class="actions">

                <button
                    class="edit"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>

                <button
                    class="delete"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        `;

        taskList.appendChild(card);
    });


    updateSummary();
}


// ======================================
// ADD TASK
// ======================================

function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {

        taskInput.focus();

        return;
    }


    const newTask = {

        id: Date.now(),

        title: title,

        priority: priorityInput.value,

        completed: false

    };


    tasks.push(newTask);


    taskInput.value = "";

    priorityInput.value = "Medium";


    renderTasks();

    taskInput.focus();
}


// ======================================
// ENTER KEY
// ======================================

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ======================================
// COMPLETE TASK
// ======================================

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;


    task.completed = !task.completed;


    renderTasks();
}


// ======================================
// DELETE TASK
// ======================================

function deleteTask(id) {

    const card = [...taskList.children].find(
        card => card.querySelector(".delete")
            .getAttribute("onclick") === `deleteTask(${id})`
    );


    if (card) {

        card.classList.add("deleting");


        setTimeout(() => {

            const index = tasks.findIndex(
                task => task.id === id
            );


            if (index !== -1) {

                tasks.splice(index, 1);

            }


            renderTasks();

        }, 450);

    }
}


// ======================================
// MODIFY TASK
// ======================================

function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;


    const newTitle = prompt(
        "Modify task",
        task.title
    );


    if (newTitle === null) return;


    const title = newTitle.trim();


    if (title !== "") {

        task.title = title;

    }


    const newPriority = prompt(
        "Priority: High, Medium or Low",
        task.priority
    );


    if (newPriority !== null) {

        const value = newPriority
            .trim()
            .toLowerCase();


        if (
            value === "high" ||
            value === "medium" ||
            value === "low"
        ) {

            task.priority =
                value.charAt(0).toUpperCase() +
                value.slice(1);

        }

    }


    renderTasks();
}


// ======================================
// SUMMARY
// ======================================

function updateSummary() {

    const pending =
        tasks.filter(task => !task.completed).length;


    taskSummary.textContent =
        `${pending} pending`;


    if (tasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }
}


// ======================================
// SECURITY
// ======================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ======================================
// DATE
// ======================================

document.getElementById("date").textContent =
    new Date().toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );


// ======================================
// INITIAL LOAD
// ======================================

renderTasks();
>>>>>>> UI-Updations
