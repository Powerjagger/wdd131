// Define the course object
const aCourse = {
  code: "CSE121b",
  name: "Javascript Language",

  // Add the sections array
  sections: [
    { sectionNum: 1, roomNum: "STC 353", enrolled: 26, days: "TTh", instructor: "Bro T" },
    { sectionNum: 2, roomNum: "STC 347", enrolled: 28, days: "TTh", instructor: "Sis A" }
  ],

  // Method to enroll a student
  enrollStudent: function (sectionNum) {
    const sectionIndex = this.sections.findIndex(
      (section) => section.sectionNum == sectionNum
    );
    if (sectionIndex >= 0) {
      this.sections[sectionIndex].enrolled++;
      renderSections(this.sections);
    }
  },

  // Method to drop a student
  dropStudent: function (sectionNum) {
    const sectionIndex = this.sections.findIndex(
      (section) => section.sectionNum == sectionNum
    );
    if (sectionIndex >= 0 && this.sections[sectionIndex].enrolled > 0) {
      this.sections[sectionIndex].enrolled--;
      renderSections(this.sections);
    }
  },
};

// Display course info in the HTML
function setCourseInfo(course) {
  document.querySelector("#courseName").textContent = course.name;
  document.querySelector("#courseCode").textContent = course.code;
}

// Render all sections in the table
function renderSections(sections) {
  const tableBody = document.querySelector("#sections");
  tableBody.innerHTML = ""; // Clear existing rows

  sections.forEach((section) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${section.sectionNum}</td>
      <td>${section.roomNum}</td>
      <td>${section.enrolled}</td>
      <td>${section.days}</td>
      <td>${section.instructor}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Initialize course display
setCourseInfo(aCourse);
renderSections(aCourse.sections);

// Event listeners for buttons
document.querySelector("#enrollStudent").addEventListener("click", () => {
  const sectionNum = document.querySelector("#sectionNumber").value;
  aCourse.enrollStudent(sectionNum);
});

document.querySelector("#dropStudent").addEventListener("click", () => {
  const sectionNum = document.querySelector("#sectionNumber").value;
  aCourse.dropStudent(sectionNum);
});
