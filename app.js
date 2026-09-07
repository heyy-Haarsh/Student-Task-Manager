const taskInput = document.getElementById("taskInput");
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
