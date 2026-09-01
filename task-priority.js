const tasks = [
  {
    id: 1,
    title: "Complete assignment",
    priority: "High",
    completed: false
  },
  {
    id: 2,
    title: "Attend project meeting",
    priority: "Medium",
    completed: false
  },
  {
    id: 3,
    title: "Review notes",
    priority: "Low",
    completed: true
  }
];

function displayTasks() {
  tasks.forEach(task => {
    const status = task.completed ? "Completed" : "Pending";

    console.log(
      `${task.id}. ${task.title} | Priority: ${task.priority} | Status: ${status}`
    );
  });
}

function changePriority(taskId, newPriority) {
  const task = tasks.find(task => task.id === taskId);

  if (task) {
    task.priority = newPriority;
    console.log(`Priority changed to ${newPriority}`);
  }
}

displayTasks();

changePriority(2, "High");

console.log("\nUpdated Tasks:");
displayTasks();
