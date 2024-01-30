// Variables
const getItemForm = document.getElementById("item-form");
const getItemInput = document.getElementById("item-input");
const getInputInvalid = document.getElementById("input-invalid");
const getUl = document.getElementById("item-list");
const getItemsClear = document.getElementById("items-clear");
const getFilterInput = document.getElementById("filter");
const formBtn = document.querySelector("#btnAddOrEdit");
let isEditMode = false;

// Event Listeners
getItemForm.addEventListener("submit", AddToDo);
getUl.addEventListener("click", RemoveToDo);
getItemsClear.addEventListener("click", RemoveAllToDo);
getFilterInput.addEventListener("input", Filter);
document.addEventListener("DOMContentLoaded", DisplayItems);
CheckUi();

// Functions
function GetItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("lists") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("lists"));
  }

  return itemsFromStorage;
}

function DisplayItems() {
  let itemsFromStorage = GetItemsFromStorage();

  itemsFromStorage.forEach((item) => CreateListItem(item));
  CheckUi();
}

function AddToDo(e) {
  e.preventDefault();
  const getValueFromUser = getItemInput.value;

  if (getValueFromUser == "") {
    getInputInvalid.innerText = "Please Enter Something ...";
  } else {
    if (isEditMode) {
      const itemToEdit = getUl.querySelector(".edit-mode");
      RemoveItemFromStorage(itemToEdit.textContent);
      itemToEdit.remove();
      formBtn.innerHTML = "<i class='bi bi-plus'></i> Add Item";
      formBtn.classList.replace("btn-primary", "btn-dark");
      isEditMode = false;
    } else {
      if (checkIfItemsExists(getValueFromUser)) {
        getInputInvalid.innerHTML = "That item already exists!";
        return;
      } else {
        getItemInput.innerHTML = "";
      }
    }
    getInputInvalid.innerText = "";
    getItemInput.value = "";
    CreateListItem(getValueFromUser);
    AddListItemToStorage(getValueFromUser);
    CheckUi();
  }
}

function checkIfItemsExists(item) {
  const itemsFromStorage = GetItemsFromStorage();

  return itemsFromStorage.includes(item);
}

function AddListItemToStorage(item) {
  let itemsFromStorage = GetItemsFromStorage();

  itemsFromStorage.push(item);
  localStorage.setItem("lists", JSON.stringify(itemsFromStorage));
}

function CreateListItem(valueUser) {
  const createLi = document.createElement("li");
  createLi.className = "list-item";
  createLi.textContent = valueUser;

  const createIconTag = document.createElement("i");
  createIconTag.className = "bi bi-x fs-5 text-danger";

  createLi.appendChild(createIconTag);

  getUl.appendChild(createLi);
}

function RemoveToDo(e) {
  if (e.target.classList.contains("text-danger")) {
    e.target.parentElement.remove();
    RemoveItemFromStorage(e.target.parentElement.textContent);
    CheckUi();
  } else {
    isEditMode = true;
    getUl
      .querySelectorAll("li")
      .forEach((item) => item.classList.remove("edit-mode"));
    e.target.classList.add("edit-mode");
    getItemInput.value = e.target.textContent;
    formBtn.innerHTML = "<i class='bi bi-pencil-fill'></i> Update Item";
    formBtn.classList.replace("btn-dark", "btn-primary");
  }
}

function RemoveItemFromStorage(item) {
  let itemsFromStorage = GetItemsFromStorage();

  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  localStorage.setItem("lists", JSON.stringify(itemsFromStorage));
}

function RemoveAllToDo() {
  getUl.innerHTML = "";
  localStorage.removeItem("lists");
  CheckUi();
}

function CheckUi() {
  const getListItem = getUl.querySelectorAll(".list-item");
  if (getListItem.length === 0) {
    getFilterInput.style.display = "none";
    getItemsClear.style.display = "none";
  } else {
    getFilterInput.style.display = "block";
    getItemsClear.style.display = "block";
  }
}

function Filter(e) {
  const getValueFilter = e.target.value.toLowerCase();
  const getListItem = getUl.querySelectorAll(".list-item");

  getListItem.forEach((item) => {
    const itemValue = item.firstChild.textContent.toLowerCase();
    if (itemValue.indexOf(getValueFilter) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
