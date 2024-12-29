const taskInput = document.querySelector("#task-input");
const dueDateInput = document.querySelector("#due-date");
const addTaskBtn = document.querySelector("#add-task");
const taskList = document.querySelector("#task-list");
const notifications = document.querySelector("#notifications p");

addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText && dueDate) {
        const taskItem = document.createElement("li");
        const taskItemText = document.createElement("span");
        const taskItemDeleteBtn = document.createElement("button");

        taskItemText.textContent = `${taskText} (Due Date: ${dueDate})`;
        taskItemDeleteBtn.textContent = "Delete";

        taskItem.appendChild(taskItemText);
        taskItem.appendChild(taskItemDeleteBtn);
        taskList.appendChild(taskItem);

        taskInput.value = "";
        dueDateInput.value = "";

        // Dispatch taskUpdated event
        const updateTask = new CustomEvent("updateTask", {
            detail: {action: "add", task: taskText, dueDate: dueDate},
        });
        document.dispatchEvent(updateTask);

        // Dispatch alertOverdue event
        if (new Date(dueDate) < new Date())  {
            const alertOverdue = new CustomEvent("alertOverdue", {
                detail: {task: taskText, dueDate: dueDate},
            });
            document.dispatchEvent(alertOverdue);
        }

        // Delete task item
        taskItemDeleteBtn.addEventListener("click", ()=>{
            taskList.removeChild(taskItem);
            notifications.textContent = `Task "${taskText}" is deleted.`;
        });
    }

    taskInput.focus();
}

document.addEventListener("updateTask", (event) => {
    console.log("updateTask fired");
    notifications.textContent = `Task "${event.detail.task}" was ${event.detail.action}ed.`
});

document.addEventListener("alertOverdue", (event) => {
    const { task, dueDate } = event.detail;
    alert(`Task "${task}" is overdue! Due date: ${dueDate}`);
})