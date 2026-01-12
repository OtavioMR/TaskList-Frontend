document.addEventListener("DOMContentLoaded", () => {
    listarTasks();
});

const taskList = document.getElementById("task-list");
const tituloInput = document.getElementById("titulo-criar");
const descricaoInput = document.getElementById("descricao-criar");

const BASE_URL = "http://localhost:24680/api/tasks";

async function listarTasks() {
    try {
        const response = await fetch(`${BASE_URL}/listar`);
        if (!response.ok) {
            throw new Error("Erro ao buscar tasks");
        }

        const tasks = await response.json();
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");

            li.innerHTML = `
                <input type="checkbox" ${task.tarefaConcluida ? "checked" : ""}>
                <strong>${task.titulo}</strong>: ${task.descricao}
            `;

            // aplica classe visual
            li.classList.toggle("tarefaConcluida", task.tarefaConcluida);

            const checkbox = li.querySelector("input");

            checkbox.addEventListener("change", async () => {
                await marcarConcluida(task.id, checkbox.checked);
                li.classList.toggle("tarefaConcluida", checkbox.checked);
            });

            taskList.appendChild(li);
        });

    } catch (err) {
        console.error("Erro:", err.message);
    }
}

async function CriarTask() {
    const titulo = tituloInput.value.trim();
    const descricao = descricaoInput.value.trim();

    if (!titulo || !descricao) {
        alert("Preencha tudo, gênio.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/criar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, descricao })
        });

        if (!response.ok) {
            throw new Error("Erro ao criar task");
        }

        tituloInput.value = "";
        descricaoInput.value = "";
        listarTasks();

    } catch (err) {
        console.error(err.message);
    }
}

async function marcarConcluida(id, concluida) {
    try {
        const response = await fetch(`${BASE_URL}/concluir/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tarefaConcluida: concluida })
        });

        if (!response.ok) {
            throw new Error("Erro ao atualizar task");
        }

    } catch (err) {
        console.error(err.message);
        alert("Falha ao atualizar task");
    }
}
