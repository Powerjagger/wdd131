let participantCount = 1;

document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.querySelector("#addParticipant");
  addButton.addEventListener("click", addParticipant);
});

function addParticipant() {
  participantCount++;
  const addButton = document.querySelector("#addParticipant");
  addButton.insertAdjacentHTML("beforebegin", participantTemplate(participantCount));
}

function participantTemplate(count) {
  return `
  <section class="participant${count}">
    <h3>Participant ${count}</h3>
    <label for="fname${count}">First Name:</label>
    <input id="fname${count}" name="fname${count}" type="text" required>

    <label for="age${count}">Age:</label>
    <input id="age${count}" name="age${count}" type="number" required>

    <label for="fee${count}">Fee:</label>
    <input id="fee${count}" name="fee${count}" type="number" value="0" required>
  </section>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", submitForm);
});

function submitForm(event) {
  event.preventDefault();

  const total = totalFees();
  const name = document.querySelector("#adult_name").value;
  const form = document.querySelector("form");
  const summary = document.querySelector("#summary");

  form.style.display = "none"; // hides form
  summary.innerHTML = successTemplate({
    name: name,
    count: participantCount,
    total: total
  });
  summary.style.display = "block";
}

function totalFees() {
  let feeElements = document.querySelectorAll("[id^=fee]");
  feeElements = [...feeElements];
  const total = feeElements.reduce((sum, el) => sum + Number(el.value || 0), 0);
  return total;
}

function successTemplate(info) {
  return `
    <h2>Thank you, ${info.name}!</h2>
    <p>You have registered ${info.count} participant${info.count > 1 ? "s" : ""}.</p>
    <p>Total Fees Owed: $${info.total}</p>
  `;
}
