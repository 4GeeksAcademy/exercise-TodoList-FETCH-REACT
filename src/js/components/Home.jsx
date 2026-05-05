import React, { useState, useEffect } from "react";

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [tasks, setTasks] = useState([]);

	const userName = "Megustoestetema";
	const baseUrl = `https://playground.4geeks.com/todo`;

	const getTasks = () => {
		fetch(`${baseUrl}/users/${userName}`)
			.then((resp) => {
				if (resp.status === 404) {
					createUser();
				}
				return resp.json();
			})
			.then((data) => {
				if (data.todos) setTasks(data.todos);
			})
			.catch((error) => console.log("Error al cargar:", error));
	};

	const createUser = () => {
		fetch(`${baseUrl}/users/${userName}`, {
			method: "POST"
		})
			.then((resp) => {
				if (resp.ok) getTasks();
			})
			.catch((error) => console.log("Error al crear usuario:", error));
	};

	const addTask = (label) => {
		fetch(`${baseUrl}/todos/${userName}`, {
			method: "POST",
			body: JSON.stringify({
				label: label,
				is_done: false
			}),
			headers: { "Content-Type": "application/json" }
		})
			.then((resp) => {
				if (resp.ok) getTasks();
			})
			.catch((error) => console.log("Error al añadir:", error));
	};

	// 4. ELIMINAR TAREA (DELETE)
	const deleteTask = (todoId) => {
		fetch(`${baseUrl}/todos/${todoId}`, {
			method: "DELETE"
		})
			.then((resp) => {
				if (resp.ok) getTasks(); // Refrescamos la lista tras eliminar
			})
			.catch((error) => console.log("Error al eliminar:", error));
	};

	const clearAll = () => {
		fetch(`${baseUrl}/users/${userName}`, {
			method: "DELETE"
		})
			.then((resp) => {
				if (resp.ok) {
					setTasks([]);
					createUser();
				}
			})
			.catch((error) => console.log("Error al limpiar:", error));
	};

	useEffect(() => {
		getTasks();
	}, []);

	return (
		<div className="container mt-5" style={{ maxWidth: "600px" }}>
			<h1 className="text-center display-1 text-danger opacity-25">Todo-List</h1>

			<div className="shadow-lg bg-white border">
				<ul className="list-group list-group-flush">
					<li className="list-group-item p-3">
						<input
							type="text"
							className="form-control border-0 fs-4"
							placeholder="What needs to be done?"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && inputValue.trim() !== "") {
									addTask(inputValue);
									setInputValue("");
								}
							}}
						/>
					</li>

					{tasks.length === 0 ? (
						<li className="list-group-item text-muted p-3 fs-5">
							There is no homework.
						</li>
					) : (
						tasks.map((task) => (
							<li key={task.id} className="list-group-item d-flex justify-content-between align-items-center task-item p-3 fs-5 text-secondary">
								{task.label}
								<span className="delete-icon text-danger" onClick={() => deleteTask(task.id)} style={{ cursor: "pointer" }}>
									<i className="fas fa-times"></i>
								</span>
							</li>
						))
					)}
				</ul>

				<div className="p-2 border-top d-flex justify-content-between align-items-center text-muted" style={{ fontSize: "14px" }}>
					<span>{tasks.length} {tasks.length === 1 ? "item" : "items"} left</span>
					<button className="btn btn-sm btn-outline-danger border-0" onClick={clearAll}>
						Clear all tasks
					</button>
				</div>
			</div>

			<div className="mx-auto border bg-white shadow-sm" style={{ height: "5px", width: "98%" }}></div>
			<div className="mx-auto border bg-white shadow-sm" style={{ height: "5px", width: "96%" }}></div>
		</div>
	);
};

export default Home;