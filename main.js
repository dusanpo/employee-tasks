const listsContainer = document.querySelector(".task-list");
const listDisplayContainer = document.querySelector(".data-list-display");
const listTitleElement = document.querySelector(".active-employee");
const listCountElement = document.querySelector(".task-count");
const tasksContainer = document.querySelector(".data-tasks");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector(".new-task-form");
const newTaskInput = document.querySelector(".new-task");
const taskDescription = document.querySelector(".task-description");
const dueDateTask = document.querySelector(".task-due-date");
const clearCompleteTasksButton = document.querySelector(
  ".clear-complete-tasks"
);
const deleteListButton = document.querySelector(".delete-marked-employee");
let changeName = document.querySelector(".change-name");
let changeEmail = document.querySelector(".change-email");
let changePhone = document.querySelector(".change-phone");
let changeSalary = document.querySelector(".change-salary");
let changeDateOfBirth = document.querySelector(".change-date-of-birth");

let data = JSON.parse(localStorage.getItem("data")) || [];
let selectedListId = localStorage.getItem("selectedListId");

listsContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    saveAndRender();
  }
});

tasksContainer.addEventListener("click", e => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = data.find(list => list.id == selectedListId);
    const selectedTask = selectedList.tasks.find(
      task => task.id == e.target.id
    );
    selectedTask.complete = e.target.checked;
    save();
    renderTaskCount(selectedList);
  }
});

deleteListButton.addEventListener("click", e => {
  e.preventDefault();
  data = data.filter(list => list.id != selectedListId);
  selectedListId = null;
  readAll();
  saveAndRender();
});

function readAll() {
  let tableData = document.querySelector(".data_table");
  let elements = "";
  data.map(
    record =>
      (elements += `
        <tr>
          <td>${record.fullname}</td>
          <td>${record.email}</td>
          <td>${record.phone}</td>
          <td>${record.dateOfBirth}</td>
          <td>${record.salary}</td>
          <td>
            <button class="btn btn-info" onclick={edit(${record.id})}>Edit</button>
            <button class="btn btn-danger" onclick={deleteUser(${record.id})}>Delete</button>
          </td>
        </tr>
        `)
  );
  tableData.innerHTML = elements;
  saveAndRender();
}

clearCompleteTasksButton.addEventListener("click", () => {
  const selectedList = data.find(list => list.id == selectedListId);
  selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
  saveAndRender();
});

newTaskForm.addEventListener("submit", e => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  const description = taskDescription.value;
  const dueDate = dueDateTask.value;
  if (
    taskName == null ||
    description == null ||
    dueDate == null ||
    taskName === "" ||
    description === "" ||
    dueDate === ""
  )
    return;
  const task = createTask(taskName, description, dueDate);
  newTaskInput.value = null;
  taskDescription.value = null;
  dueDateTask.value = null;
  const selectedList = data.find(list => list.id == selectedListId);
  selectedList.tasks.push(task);

  saveAndRender();
});

function createTask(fname, descript, deadline) {
  return {
    id: Date.now().toString(),
    fname: fname,
    descript: descript,
    deadline: deadline,
    complete: false,
  };
}

function saveAndRender() {
  save();
  render();
}
function save() {
  localStorage.setItem("data", JSON.stringify(data));
  localStorage.setItem("selectedListId", selectedListId);
}

function create() {
  document.querySelector(".create_form").style.display = "block";
  document.querySelector(".add_div").style.display = "none";
}

function add() {
  let fullname = document.querySelector(".full-name").value;
  let email = document.querySelector(".email").value;
  let phone = document.querySelector(".phone").value;
  let dateOfBirth = document.querySelector(".date-of-birth").value;
  let salary = document.querySelector(".salary").value;
 
  let newObj = {
    id: Date.now().toString(),
    fullname: fullname,
    email: email,
    phone: phone,
    dateOfBirth: dateOfBirth,
    salary: salary,
    tasks: [],
  };
  data.push(newObj);

  document.querySelector(".create_form").style.display = "none";
  document.querySelector(".add_div").style.display = "block";
  readAll();
}

function edit(id) {
  document.querySelector(".update_form").style.display = "block";
  document.querySelector(".add_div").style.display = "none";

  let obj = data.find(rec => rec.id == id);

  document.querySelector(".id-form").value = obj.id;
  changeName.value = obj.fullname;
  changeEmail.value = obj.email;
  changePhone.value = obj.phone;
  changeSalary.value = obj.salary;
  changeDateOfBirth.value = obj.dateOfBirth;
}

function update() {
  let id = parseInt(document.querySelector(".id-form").value);
  let fullname = changeName.value;
  let email = changeEmail.value;
  let phone = changePhone.value;
  let salary = changeSalary.value;
  let dateOfBirth = changeDateOfBirth.value;

  let index = data.findIndex(rec => rec.id == id);
  data[index] = { id, fullname, email, phone, salary, dateOfBirth };

  document.querySelector(".update_form").style.display = "none";
  document.querySelector(".add_div").style.display = "block";
  readAll();
}

function deleteUser(id) {
  data = data.filter(rec => rec.id != id);
  readAll();
}

function render() {
  clearElement(listsContainer);
  renderLists();
  const selectedList = data.find(list => list.id == selectedListId);
  if (selectedListId == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitleElement.innerText = selectedList.fullname;
    renderTaskCount(selectedList);
    clearElement(tasksContainer);
    renderTasks(selectedList);
  }
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach(task => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(`${task.fname} -- ${task.descript} -- ${task.deadline}`);
    tasksContainer.appendChild(taskElement);
  });
}

function renderTaskCount(selectedList) {
  const completeTaskCount = selectedList.tasks.filter(
    task => task.complete
  ).length;
  const taskString = completeTaskCount === 1 ? "task" : "tasks";
  listCountElement.innerText = `${completeTaskCount} ${taskString} completed`;
}

function renderLists() {
  data.forEach(list => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.fullname;
    if (list.id == selectedListId) {
      listElement.classList.add("active-list");
    }
    listsContainer.appendChild(listElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

readAll();
