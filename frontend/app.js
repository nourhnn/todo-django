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
    tasks.forEach((task) => {
        const item = document.createElement("li");
        const title = document.createElement("span");
        title.textContent = task.title;
        const button = document.createElement("button");
        button.textContent = "Supprimer";
        button.addEventListener("click", () => deleteTask(task.id));
        item.append(title, button);
        taskList.appendChild(item);
    });
}
async function addTask(title) {
    await fetch("/api/tasks/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
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
    }
});
loadTasks();
