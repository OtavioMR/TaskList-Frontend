document.addEventListener("DOMContentLoaded", () => {
    listarTasks();
});

const taskList = document.getElementById("task-list");
const tituloInput = document.getElementById("titulo-criar");
const descricaoInput = document.getElementById("descricao-criar");


async function listarTasks() {
    try {
        const response = await fetch("http://localhost:24680/api/tasks/listar");

        if (!response.ok) {
            throw new Error("Erro ao buscar tasks");
        }

        const tasks = await response.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${task.titulo}</strong>: ${task.descricao}`;
            taskList.appendChild(li);
        });

    } catch (err) {
        console.error("Erro ao buscar dados da API:", err);
    }
}


async function CriarTask() {

    const tituloTask = tituloInput.value;
    const descricaoTask = descricaoInput.value;

    try {
        const response = await fetch("http://localhost:24680/api/tasks/criar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: tituloTask,
                descricao: descricaoTask
            })
        });

        if (!response.ok) {
            throw new Error("Erro ao criar task");
        }

        const data = await response.json();
        console.log("Tasl criada: ", data);

        tituloInput.value = "";
        descricaoInput.value = "";
        listarTasks();

    } catch (err) {
        console.error("Erro: ", err);
    }
}