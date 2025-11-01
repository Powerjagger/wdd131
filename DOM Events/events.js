let tasks = [];

// Render the tasks list
function renderTasks(tasks) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "strike" : "";

    li.innerHTML = `
      <p>${task.detail}</p>
      <div>
        <span data-action="delete">❎</span>
        <span data-action="complete">✅</span>
      </div>
    `;
    todoList.appendChild(li);
  });
}

// Add a new task
function newTask() {
  const todoInput = document.getElementById("todo");
  const taskDetail = todoInput.value.trim();

  if (taskDetail === "") return;

  tasks.push({ detail: taskDetail, completed: false });
  renderTasks(tasks);
  todoInput.value = "";
}

// Remove a task
function removeTask(taskElement) {
  tasks = tasks.filter(
    (task) => task.detail !== taskElement.querySelector("p").innerText
  );
  taskElement.remove();
}

// Complete a task
function completeTask(taskElement) {
  const taskIndex = tasks.findIndex(
    (task) => task.detail === taskElement.querySelector("p").innerText
  );
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  taskElement.classList.toggle("strike");
}

// Event delegation for task actions
function manageTasks(event) {
  const action = event.target.dataset.action;
  if (!action) return;

  const taskElement = event.target.closest("li");

  if (action === "delete") {
    removeTask(taskElement);
  } else if (action === "complete") {
    completeTask(taskElement);
  }
}

// Event listeners
document.getElementById("submitTask").addEventListener("click", newTask);
document.getElementById("todoList").addEventListener("click", manageTasks);
