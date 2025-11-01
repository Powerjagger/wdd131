// form-demo.js

// Helper function to display errors
function showErrors(errors) {
  const errorEl = document.querySelector(".errors");
  errorEl.innerHTML = errors.map(error => `<p>${error}</p>`).join("");
}

// Form validation handler
function validateForm(event) {
  const form = event.target;
  const errors = [];
  let isValid = true;

  // Example: validate full name is not empty
  if (!form.fullName.value.trim()) {
    isValid = false;
    errors.push("Full Name is required.");
  }

  // Add more validations here if needed

  if (!isValid) {
    event.preventDefault();
    showErrors(errors);
    return false;
  }
}

// Toggle payment details based on selected method
function togglePaymentDetails() {
  const form = document.querySelector("#checkoutForm");
  const creditCardContainer = document.getElementById("creditCardNumberContainer");
  const paypalContainer = document.getElementById("paypalUsernameContainer");

  // Hide all payment containers and disable required fields
  creditCardContainer.classList.add("hide");
  paypalContainer.classList.add("hide");
  form.creditCardNumber.required = false;
  form.paypalUsername.required = false;

  // Show the relevant container based on selection
  if (form.paymentMethod.value === "creditCard") {
    creditCardContainer.classList.remove("hide");
    form.creditCardNumber.required = true;
  } else if (form.paymentMethod.value === "paypal") {
    paypalContainer.classList.remove("hide");
    form.paypalUsername.required = true;
  }
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#checkoutForm");
  form.addEventListener("submit", validateForm);
  document.querySelector("#paymentMethod").addEventListener("change", togglePaymentDetails);
});


// Form validation
function validateForm(event) {
  const form = event.target;
  const errors = [];
  let isValid = true;

  // Validate full name
  if (form.fullName.value.trim() !== "Bob") {
    isValid = false;
    errors.push("Your name is not Bob.");
  }

  // Validate credit card if selected
  if (form.paymentMethod.value === "creditCard") {
    if (form.creditCardNumber.value !== "1234123412341234") {
      isValid = false;
      errors.push("Invalid Credit Card Number.");
    }
  }

  // If there are validation errors, prevent submission and show them
  if (!isValid) {
    event.preventDefault();
    showErrors(errors);
    return false;
  }
}

// Attach the submit event listener
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#checkoutForm").addEventListener("submit", validateForm);
});
