"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = [];
let allExpelled = [];
let allBloodLines = [];
let isHacked = false;

const Student = {
  //Creating the prototype template
  firstname: "",
  lastname: "",
  middlename: "null",
  nickname: "null",
  gender: "",
  house: "",
  enrollment: true,
  prefect: false,
  bloodstatus: "",
  member: false,
  imageSrc: "null",
};

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "asc",
};

function start() {
  console.log("ready");
  registerButtons();
  loadJSON("https://petlatkea.dk/2021/hogwarts/students.json", prepareObjects);
  loadJSON("https://petlatkea.dk/2021/hogwarts/families.json", defineBloodStatus);
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));

  //search
  document.querySelector(".search").addEventListener("input", startSearch);
}

function startSearch(event) {
  let input = document.querySelector(".search").value;

  let searchList = allStudents.filter((student) => {
    let name = "";

    if (student.lastName === null) {
      name = student.firstName;
    } else {
      name = student.firstName + " " + student.lastName;
    }

    return name.toLowerCase().includes(event.target.value);
  });

  //Show number of students
  let numberOfStudents = document.querySelector("#count .totalCurrent");
  numberOfStudents.textContent = `Students: ${searchList.length}`;
  displayList(searchList);
}

async function loadJSON(url, event) {
  //Fetching json data
  const respons = await fetch(url);
  const jsonData = await respons.json();
  event(jsonData);

  console.log("Data loaded");
}

function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    // TODO: Create new object with cleaned data - and store that in the allAnimals array

    //Creating the singleStudent object
    const singleStudent = Object.create(Student);

    //Find names by defining the spaces
    const firstSpace = jsonObject.fullname.trim().indexOf(" ");
    const lastSpace = jsonObject.fullname.trim().lastIndexOf(" ");

    //Split string at spaces
    //Seperate fullName in "fornavn, mellemnavn og efternavn"
    // adskil det fulde navn til for, mellem, efternavn
    singleStudent.firstName = jsonObject.fullname.trim().substring(0, firstSpace);
    singleStudent.middleName = jsonObject.fullname.substring(firstSpace, lastSpace);

    //If middleName includes "", it becomes a nickName
    if (singleStudent.middleName.includes('"')) {
      singleStudent.nickName = singleStudent.middleName;
      singleStudent.middleName = "";
    }

    singleStudent.lastName = jsonObject.fullname.trim().substring(lastSpace).trim();

    //Make first letter upperCase and the rest of them lowerCase
    //firstname
    singleStudent.firstNameCapitalized = singleStudent.firstName.substring(0, 1).toUpperCase() + singleStudent.firstName.substring(1, firstSpace).toLowerCase();

    //Middlename
    singleStudent.middleNameCapitalized = singleStudent.middleName.substring(1, 2).toUpperCase() + singleStudent.middleName.substring(2, lastSpace).toLowerCase();

    //Lastname
    singleStudent.lastNameCapitalized = singleStudent.lastName.substring(0, 1).toUpperCase() + singleStudent.lastName.substring(1).toLowerCase(singleStudent.lastName.length);

    //Names with a hyphen, must have the first letter after the hyphen capitalized as well -> one of the student's lastname includes a hyphen
    const ifHyphens = singleStudent.lastName.indexOf("-");

    if (ifHyphens == -1) {
      singleStudent.lastNameCapitalized = singleStudent.lastNameCapitalized.substring(0, 1).toUpperCase() + singleStudent.lastNameCapitalized.substring(1).toLowerCase();
    } else {
      singleStudent.lastNameCapitalized =
        singleStudent.lastName.substring(0, 1).toUpperCase() +
        singleStudent.lastName.substring(1, ifHyphens + 1).toLowerCase() +
        singleStudent.lastName.substring(ifHyphens + 1, ifHyphens + 2).toUpperCase() +
        singleStudent.lastName.substring(ifHyphens + 2).toLowerCase();
    }

    //Gender
    singleStudent.gender = jsonObject.gender.substring(0).trim();
    singleStudent.genderCapitalized = singleStudent.gender.substring(0, 1).toUpperCase() + singleStudent.gender.substring(1).toLowerCase();

    //House
    singleStudent.house = jsonObject.house.substring(0).trim();
    singleStudent.houseCapitalized = singleStudent.house.substring(0, 1).toUpperCase() + singleStudent.house.substring(1).toLowerCase();

    //Insert in prototype -> the array
    singleStudent.firstName = singleStudent.firstNameCapitalized;
    singleStudent.middleName = singleStudent.middleNameCapitalized;
    singleStudent.lastName = singleStudent.lastNameCapitalized;

    //SingleStudent.nickName = singleStudent.nickNameCapitalized;
    singleStudent.gender = singleStudent.genderCapitalized;
    singleStudent.house = singleStudent.houseCapitalized;

    //Adding all the objects into the array
    allStudents.push(singleStudent);
  });
  //Calling the function displayList
  buildList();
  //displayList(allStudents);
}

function defineBloodStatus(jsonData) {
  console.log("defining bloodstatus for students");
  allStudents.forEach((student) => {
    if (jsonData.half.includes(student.lastName)) {
      student.bloodstatus = "Half-Blood";
    } else if (jsonData.pure.includes(student.lastName)) {
      student.bloodstatus = "Pure-Blood";
    } else {
      student.bloodstatus = "Muggleborn";
    }
  });
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  //let filteredList = allStudents;
  if (settings.filterBy === "gryffindor") {
    //create a filter of only gryff
    filteredList = allStudents.filter(isGryf);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(isHuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(isRave);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(isSlyt);
  } else if (settings.filterBy === "enrolled") {
    filteredList = allStudents.filter(isEnrolled);
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
  }

  //showing the student numbers
  document.querySelector(".totalGryf").textContent = allStudents.filter(isGryf).length;
  document.querySelector(".totalRave").textContent = allStudents.filter(isRave).length;
  document.querySelector(".totalSlyt").textContent = allStudents.filter(isSlyt).length;
  document.querySelector(".totalHuff").textContent = allStudents.filter(isHuff).length;

  return filteredList;
}

function isEnrolled(status) {
  return status.house === "Enrolled";
}

function isExpelled(status) {
  return status.house === "Expelled";
}

function isGryf(house) {
  return house.house === "Gryffindor";
}

function isHuff(house) {
  return house.house === "Hufflepuff";
}

function isRave(house) {
  return house.house === "Ravenclaw";
}

function isSlyt(house) {
  return house.house === "Slytherin";
}

function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  //TO DO: FÅ SORTING PILE TIL AT VIRKE

  //  //find "old" sortby element, and remove .sortBy
  //  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  //  oldElement.classList.remove("sortby");

  //  //indicate active sort
  //  event.target.classList.add("sortby");

  // toggle the direction!
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  //let sortedList = allStudents;
  let direction = 1; // 1 is normal direction.
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

function displayList(studentList) {
  //Clear the list
  document.querySelector("#list").innerHTML = "";

  //Build a new list
  studentList.forEach(displayStudent);
}

function displayStudent(student) {
  //Create clone
  document.querySelector(".totalEnrolled").textContent = allStudents.length;
  const clone = document.querySelector("template#hogwarts_student").content.cloneNode(true);

  //Set clone data
  clone.querySelector("[data-field=image] img").src = `images/${student.lastName}_${student.firstName.charAt(0)}.png`;
  clone.querySelector("[data-field=fullname]").textContent = `${student.firstName} ${student.lastName}`;
  clone.querySelector("[data-field=gender]").textContent = `Gender: ${student.gender}`;
  clone.querySelector("[data-field=house]").textContent = `House: ${student.house}`;

  //buildList(); //updating the list view

  //tilføj klik til popop modal
  clone.querySelector("article").addEventListener("click", () => displayModal(student));

  //Append clone to list
  document.querySelector("#list").appendChild(clone);
}

function displayModal(student) {
  const modal = document.querySelector("#modal");
  // //removing hide too see pop op modal
  const modalBg = document.querySelector(".modal-bg");
  modalBg.classList.remove("hide");

  console.log("open popup");

  //Når vi klikker udviser vi den studerende
  document.querySelector(".expelBtn").onclick = () => {
    expelStudent(student);
  };

  modal.querySelector("[data-field=firstname]").textContent = `Firstname: ${student.firstName}`;
  modal.querySelector("[data-field=middlename]").textContent = `Middlename: ${student.middleName}`;
  modal.querySelector("[data-field=lastname]").textContent = `Lastname: ${student.lastName}`;
  modal.querySelector("[data-field=nickname]").textContent = `Nickname: ${student.nickName}`;
  modal.querySelector("[data-field=gender]").textContent = `Gender: ${student.gender}`;
  modal.querySelector("[data-field=house]").textContent = `House: ${student.house}`;
  modal.querySelector("[data-field=blood]").textContent = `Blood: ${student.bloodstatus}`;
  modal.querySelector("[data-field=image] img").src = `images/${student.lastName}_${student.firstName.charAt(0)}.png`;

  //toggle student enrollment
  if (student.enrollment === true) {
    modal.querySelector("[data-field=enrollment]").textContent = "Status: Enrolled";
    modal.querySelector(".expelBtn").textContent = "Expel student";
  } else {
    modal.querySelector("[data-field=enrollment]").textContent = "Status: Expelled";
    modal.querySelector(".expelBtn").textContent = "Enroll student";
  }

  // Hvis der bliver klikket på knappen ændres student enrollment
  //Expel student
  function expelStudent(student) {
    console.log(student);
    if (student.enrollment === true) {
      student.enrollment = false;
      //showExpelledStudent(student);
    } else {
      console.log("Enroled");
      student.enrollment = true;
    }
    displayModal(student);
    //buildList();
  }

  //TO DO: Hvor skal det her hen?
  //

  //prefects
  //toggle student enrollment
  if (student.prefect === true) {
    modal.querySelector("[data-field=prefectstatus]").textContent = "This student is a prefect ";
    modal.querySelector("[data-field=prefect]").textContent = "Remove as prefect";
  } else {
    modal.querySelector("[data-field=prefectstatus]").textContent = "This student is not a prefect";
    modal.querySelector("[data-field=prefect]").textContent = "Make a prefect";
  }

  modal.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  modal.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);
  function clickPrefect() {
    if (student.prefect === true) {
      console.log("student prefect false");
      student.prefect = false;
    } else {
      console.log("try to make");
      tryToMakeAPrefect(student);
    }

    displayModal(student);
  }

  //Housecrests and article color change so it matches the house that the student belongs to

  if (student.house === "Gryffindor") {
    console.log("This student belongs to Gryffindor");
    //Housecrests change so it matches the house that the student belongs to
    modal.querySelector("#housecrest img").src = `images/Gryffindor-Crest-Outline.png`;

    //Popup background color matches the house that the student belongs to
    modal.querySelector("#modal-header").style.backgroundColor = "#d33d3d";
  }

  if (student.house === "Slytherin") {
    console.log("This student belongs to Slytherin");
    modal.querySelector("#housecrest img").src = `images/Slytherin-Crest-Outline.png`;

    modal.querySelector("#modal-header").style.backgroundColor = "#4b9b66";
  }

  if (student.house === "Hufflepuff") {
    console.log("This student belongs to Hufflepuff");
    modal.querySelector("#housecrest img").src = `images/Hufflepuff-Outline.png`;

    modal.querySelector("#modal-header").style.backgroundColor = "#f1de6f";
  }

  if (student.house === "Ravenclaw") {
    console.log("This student belongs to Ravenclaw");
    modal.querySelector("#housecrest img").src = `images/Ravenclaw-Crest-Outline.png`;

    modal.querySelector("#modal-header").style.backgroundColor = "#4960ac";
  }

  //luk modal
  modal.querySelector("#close").addEventListener("click", closeModal);

  function closeModal() {
    modalBg.classList.add("hide");
    modal.querySelector("#close").removeEventListener("click", closeModal);

    //TO DO? remove all eventlisteners
  }
}

function showExpelledStudent(student) {
  displayList(); //Hvordan viser jeg expelled?
}

//NY a function inside a function inside a function
function tryToMakeAPrefect(selectedStudent) {
  console.log("we are in the tryToMake function");

  const allPrefects = allStudents.filter((student) => student.prefect); //should give a list of alle the prefects
  const prefects = allPrefects.filter((prefect) => prefect.house === selectedStudent.house);
  console.log(prefects);

  const numbersOfPrefects = prefects.length;
  const other = prefects.filter((prefect) => prefect.house === selectedStudent.house && prefect.gender === selectedStudent.gender).shift();
  console.log(other);

  // if there is another of the same type
  if (other !== undefined) {
    console.log("there can be only one prefect of each type");
    removeOther(other);
  } else if (numbersOfPrefects >= 2) {
    console.log("there can only be two prefects");
    removeAorB(prefects[0], prefects[1]);
    //fjerne denne
  } else {
    makePrefect(selectedStudent);
  }

  function removeOther(other) {
    // ask the user to ignore or remove "other"
    document.querySelector("#remove_other").classList.remove("hide2");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

    //document.querySelector("#remove_other [data-field=otherwinner]").textContent = other.firstName;

    //if ignore - do nothing
    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide2");
      document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
    }

    //if remover other:
    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(selectedStudent);
      buildList();
      //displayModal(student);
      closeDialog();
    }
  }

  function removeAorB(winnerA, winnerB) {
    // ask the user to ignore or remove a or b

    document.querySelector("#remove_aorb").classList.remove("hide2");
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

    //show names on buttons
    document.querySelector("#remove_aorb [data-field=prefectA]").textContent = prefectA.firstName;
    document.querySelector("#remove_aorb [data-field=prefectB]").textContent = prefectB.firstName;

    //if ignore - do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide2");
      document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
    }

    function clickRemoveA() {
      //if removeA:
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      //displayModal(student);
      closeDialog();
    }

    function clickRemoveB() {
      //else - if removeB
      removePrefect(winnerB);
      makePrefect(selectedStudent);
      buildList();
      //displayModal(student);
      closeDialog();
    }
  }

  function removePrefect(prefectStudent) {
    console.log("remove prefect");
    prefectStudent.prefect = false;
  }

  function makePrefect(student) {
    console.log("make prefect");
    student.prefect = true;
  }
}
