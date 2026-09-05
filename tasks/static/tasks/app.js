"use strict";
const taskList = document.querySelector("#task-list");
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-title");
async function loadTasks() {
    const response = await fetch("/api/tasks/");
    const tasks = await response.json();
    if (!taskList) {
        return;
    }
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <li class="empty">
                Aucune tâche pour le moment.
            </li>
        `;
        return;
    }
    tasks.forEach((task) => {
        const item = document.createElement("li");
        item.className = task.completed ? "task completed" : "task";
        const left = document.createElement("div");
        left.className = "task-content";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", async () => {
            await updateTask(task.id, {
                completed: checkbox.checked
            });
        });
        const title = document.createElement("span");
        title.textContent = task.title;
        title.className = "task-title";
        left.append(checkbox, title);
        const actions = document.createElement("div");
        actions.className = "actions";
        const editButton = document.createElement("button");
        editButton.textContent = "Modifier";
        editButton.className = "edit-button";
        editButton.addEventListener("click", async () => {
            const newTitle = prompt("Modifier la tâche :", task.title);
            if (!newTitle || newTitle.trim() === "") {
                return;
            }
            await updateTask(task.id, {
                title: newTitle.trim()
            });
        });
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Supprimer";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", async () => {
            await deleteTask(task.id);
        });
        actions.append(editButton, deleteButton);
        item.append(left, actions);
        taskList.appendChild(item);
    });
}
async function addTask(title) {
    await fetch("/api/tasks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            completed: false
        })
    });
    await loadTasks();
}
async function updateTask(id, data) {
    await fetch(`/api/tasks/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    await loadTasks();
}
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}/`, {
        method: "DELETE"
    });
    await loadTasks();
}
form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = input?.value.trim();
    if (!title) {
        return;
    }
    await addTask(title);
    if (input) {
        input.value = "";
        input.focus();
    }
});
loadTasks();
