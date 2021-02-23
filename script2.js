"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudents = []; //Creating empty array

const Student = { //Creating the prototype template
  firstname: "",
  lastname: "",
  middlename: "null",
  nickname: "null",
  gender: "",
  house: "",
  imageSrc: "null"
};

function start() {
  console.log("ready");
  registerButtons();
  loadJSON();
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach(button => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach(button => button.addEventListener("click", selectSort));
}

function loadJSON() { //Fetching json data
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then(response => response.json())
    .then(jsonData => {
      //When loaded, prepare objects
      prepareObjects(jsonData);
    });
  console.log("JSON data loaded");
}

function prepareObjects(jsonData) {
  jsonData.forEach(jsonObject => {
    // TODO: Create new object with cleaned data - and store that in the allAnimals array

    //Creating the singleStudent object
    const singleStudent = Object.create(Student);

    //Find names by defining the spaces
    const firstSpace = jsonObject.fullname.trim().indexOf(" ");
    const lastSpace = jsonObject.fullname.trim().lastIndexOf(" ");

    //Split string at spaces
    //Seperate fullName in "fornavn, mellemnavn og efternavn"
    // adskil det fulde navn til for, mellem, efternavn
    singleStudent.firstName = jsonObject.fullname
      .trim()
      .substring(0, firstSpace);
    singleStudent.middleName = jsonObject.fullname.substring(
      firstSpace,
      lastSpace
    );

    //If middleName includes "", it becomes a nickName
    if (singleStudent.middleName.includes('"')) {
      singleStudent.nickName = singleStudent.middleName;
      singleStudent.middleName = "";
    }

    singleStudent.lastName = jsonObject.fullname
      .trim()
      .substring(lastSpace)
      .trim();

    //Make first letter upperCase and the rest of them lowerCase
    //firstname
    singleStudent.firstNameCapitalized =
      singleStudent.firstName.substring(0, 1).toUpperCase() +
      singleStudent.firstName.substring(1, firstSpace).toLowerCase();

    //Middlename
    singleStudent.middleNameCapitalized =
      singleStudent.middleName.substring(1, 2).toUpperCase() +
      singleStudent.middleName.substring(2, lastSpace).toLowerCase();

    //Lastname
    singleStudent.lastNameCapitalized =
      singleStudent.lastName.substring(0, 1).toUpperCase() +
      singleStudent.lastName
        .substring(1)
        .toLowerCase(singleStudent.lastName.length);

    //Names with a hyphen, must have the first letter after the hyphen capitalized as well -> one of the student's lastname includes a hyphen
    const ifHyphens = singleStudent.lastName.indexOf("-");

    if (ifHyphens == -1) {
      singleStudent.lastNameCapitalized =
        singleStudent.lastNameCapitalized.substring(0, 1).toUpperCase() +
        singleStudent.lastNameCapitalized.substring(1).toLowerCase();
    } else {
      singleStudent.lastNameCapitalized =
        singleStudent.lastName.substring(0, 1).toUpperCase() +
        singleStudent.lastName.substring(1, ifHyphens + 1).toLowerCase() +
        singleStudent.lastName
          .substring(ifHyphens + 1, ifHyphens + 2)
          .toUpperCase() +
        singleStudent.lastName.substring(ifHyphens + 2).toLowerCase();
    }

    //Gender
    singleStudent.gender = jsonObject.gender.substring(0).trim();
    singleStudent.genderCapitalized =
      singleStudent.gender.substring(0, 1).toUpperCase() +
      singleStudent.gender.substring(1).toLowerCase();

    //House
    singleStudent.house = jsonObject.house.substring(0).trim();
    singleStudent.houseCapitalized =
      singleStudent.house.substring(0, 1).toUpperCase() +
      singleStudent.house.substring(1).toLowerCase();

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
  displayList(allStudents);
} 

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  filterList(filter);
}

function filterList(filterBy) {
  let filteredList = allStudents;
    if (filterBy === "gryffindor") {
  //create a filter of only cats
  filteredList = allStudents.filter(isGryf);
    } else if (filterBy === "hufflepuff") {
  filteredList = allStudents.filter(isHuff);
    } else if (filterBy  === "ravenclaw") {
  filteredList = allStudents.filter(isRave);
    }else if (filterBy  === "slytherin") {
  filteredList = allStudents.filter(isSlyt);
}
console.table(filteredList);
  displayList(filteredList); 
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
  
  // toggle the direction!
  if (sortDir === "asc") {
      event.target.dataset.sortDirection = "desc";
  } else {
      event.target.dataset.sortDirection = "asc";
  }
  console.log(`User selected ${sortBy} - ${sortDir}`);
    sortList(sortBy, sortDir);
}

function sortList(sortBy, sortDir) {
  let sortedList = allStudents;
  let direction = 1; // 1 is normal direction.
  if(sortDir === "desc") {
      direction = -1;
  } else {
      direction= 1;
  }

      sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA,studentB) {
   console.log(`sortBy is ${sortBy}`);
      if (studentA[sortBy] < studentB[sortBy]) {
          return -1 * direction;
      } else {
          return 1 * direction;
      }
  }
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
  const clone = document
    .querySelector("template#hogwarts_student")
    .content.cloneNode(true);

  //Set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  clone.querySelector("[data-field=middlename]").textContent = student.middleName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=image] img").src = `images/${student.lastName}_${student.firstName.charAt(0)}.png`;

  //Append clone to list
  document.querySelector("#list").appendChild(clone);

  //TODO: FÅ POP OP TIL AT VIRKE
//   //When u click on a student the modal will pop up
//   clone.querySelector("article").addEventListener("click", () => visDetaljer(student));
}




// // function showStudentModal(student) {
// //     console.log(student);
// //     const modal = document.querySelector("#modal");

// //     modal.querySelector("[data-field=firstname]").textContent = student.firstname;
// //     modal.querySelector("[data-field=lastname]").textContent = student.lastname;
// //     modal.querySelector("[data-field=middlename]").textContent = student.middlename;
// //     modal.querySelector("[data-field=nickname]").textContent = student.nickname;
// //     modal.querySelector("[data-field=gender]").textContent = student.gender;
// //     modal.querySelector("[data-field=house]").textContent = student.house;

    

// // }
// const popop = document.querySelector("#popop");

// function visDetaljer(ret) {
//     console.log(ret);
    
//     modal.querySelector("[data-field=firstname]").textContent = student.firstName;
//     modal.querySelector("[data-field=middlename]").textContent = student.middleName;
//     popop.style.display = "block";


// }

// document.querySelector("#luk").addEventListener("click", () => popop.style.display = "none");

// function addEventListenersToButtons() {
//     document.querySelectorAll(".filter").forEach((btn) => {
//         btn.addEventListener("click", filterBTNs);
//     })