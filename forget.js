
const forgotForm = document.getElementById("forgotForm");
const emailInput = document.getElementById("email");
const message = document.getElementById("message");

forgotForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (email === "") {
        message.style.color = "red";
        message.textContent = "Please enter your email address.";
        return;
    }

    if (!emailInput.checkValidity()) {
        message.style.color = "red";
        message.textContent = "Please enter a valid email address.";
        return;
    }

    message.style.color = "green";
    message.textContent =
        "Request submitted! Connect your backend to send a reset link.";

    forgotForm.reset();
});
