const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

// ==============================
// PROVIDER SERVICE DROPDOWN LOGIC
// ==============================
const userRole = document.getElementById("userRole");
const providerWrapper = document.getElementById("providerServicesWrapper");

userRole.addEventListener("change", () => {

    if(userRole.value === "provider") {
        providerWrapper.style.display = "block";
    } else {
        providerWrapper.style.display = "none";
    }

});

// SHOW / HIDE PASSWORD
const toggles = document.querySelectorAll(".togglePassword");

toggles.forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.getAttribute("data-target"));

    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
});

registerBtn.addEventListener('click', () =>{
    container.classList.add('active');
});

loginBtn.addEventListener('click', () =>{
    container.classList.remove('active');
});

// ==============================
// MOBILE LAYOUT SWITCH CONTROLLER
// ==============================
// Mobile screen context me navigation links inject karne ke liye engine logic
document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.querySelector('.form-container.sign-in form');
    const signUpForm = document.querySelector('.form-container.sign-up form');

    if (signInForm && signUpForm) {
        // Sign-in view ke bottom me Sign up trigger link creation
        const toSignUpLink = document.createElement('div');
        toSignUpLink.className = 'mobile-switch-btn';
        toSignUpLink.innerText = "Don't have an account? Sign Up";
        toSignUpLink.addEventListener('click', () => {
            container.classList.add('active');
        });
        signInForm.appendChild(toSignUpLink);

        // Sign-up view ke bottom me Sign in trigger link creation
        const toSignInLink = document.createElement('div');
        toSignInLink.className = 'mobile-switch-btn';
        toSignInLink.innerText = "Already have an account? Sign In";
        toSignInLink.addEventListener('click', () => {
            container.classList.remove('active');
        });
        signUpForm.appendChild(toSignInLink);
    }
});

// --- REAL-TIME PASSWORD STRENGTH CHECKER ---
const signupPassword = document.getElementById('signupPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

signupPassword.addEventListener('input', () => {
    const val = signupPassword.value;
    let score = 0;

    if (val.length === 0) {
        strengthBar.style.width = "0%";
        strengthBar.style.backgroundColor = "#ddd";
        strengthText.innerText = "";
        return;
    }

    // Conditions check
    if (val.length >= 6) score++;                 // Minimum length check
    if (/[a-zA-Z]/.test(val)) score++;            // Contains Text
    if (/[0-9]/.test(val)) score++;               // Contains Number
    if (/[^a-zA-Z0-9]/.test(val)) score++;        // Contains Special Character

    // Dynamic Updates based on UI score
    if (score <= 2) {
        strengthBar.style.width = "33%";
        strengthBar.style.backgroundColor = "#ff4d4d"; // Red
        strengthText.innerText = "Weak";
        strengthText.style.color = "#ff4d4d";
    } else if (score === 3) {
        strengthBar.style.width = "66%";
        strengthBar.style.backgroundColor = "#ffa500"; // Orange
        strengthText.innerText = "Average";
        strengthText.style.color = "#ffa500";
    } else if (score === 4) {
        strengthBar.style.width = "100%";
        strengthBar.style.backgroundColor = "#2ecc71"; // Green
        strengthText.innerText = "Strong";
        strengthText.style.color = "#2ecc71";
    }
});


// --- SIGNUP FORM SUBMISSION (Separating Provider & Seeker Storage) ---
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Default submit refresh rokne ke liye

    const selectedRole = document.getElementById('userRole').value;
    const providerType = document.getElementById('providerService').value;
    if (selectedRole === "provider") {

    console.log("Provider Type:", providerType);

    alert(`Success! ${providerType} account created successfully.`);

}
    
    // Aapke actual dynamic storage logic ke liye framework:
    if (selectedRole === "provider") {
        console.log("Storing data in Provider's database/table...");
        alert("Success! Provider account created successfully.");
        // Yahan aap provider ka data save karne ka functions handle kareinge.
    } else if (selectedRole === "seeker") {
        console.log("Storing data in Seeker's database/table...");
        alert("Success! Seeker account created successfully.");
        // Yahan aap seeker ka data save karne ka functions handle kareinge.
    }
});

// --- SIGNUP FORM SUBMISSION (Saving real user data) ---
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault(); 

    const signupInputs = document.querySelectorAll('.form-container.sign-up input');
    const name = signupInputs[0].value.trim();
    const email = signupInputs[1].value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const selectedRole = document.getElementById('userRole').value;

    if (!name || !email || !password) {
        alert("Please fill all required fields.");
        return;
    }

    // Existing users list nikalna
    let users = JSON.parse(localStorage.getItem("servsite_users")) || [];

    // Check agar email pehle se registered hai
    const existingUser = users.find(u => u.email === email);
    if(existingUser) {
        alert("This email is already registered! Please sign in.");
        return;
    }

    // New user object
    const newUser = {
        name: name,
        email: email,
        phone: "Not Provided", // Ya agar phone field ho toh wahan se le sakte hain
        password: password,
        role: selectedRole,
        profileImg: "../images/ramupload.jpg"
    };

    users.push(newUser);
    localStorage.setItem("servsite_users", JSON.stringify(users));
    // Current active logged-in user set karein
    localStorage.setItem("servsite_current_user", JSON.stringify(newUser));

    alert("Account created successfully!");
    window.location.href = "customer.html";
});


// --- LOGIN FORM SUBMISSION (Matching registered user) ---
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const signinInputs = document.querySelectorAll('.form-container.sign-in input');
    const email = signinInputs[0].value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    let users = JSON.parse(localStorage.getItem("servsite_users")) || [];

    // User find karna jo match kare
    const foundUser = users.find(u => u.email === email && u.password === password);

    if(foundUser) {
        localStorage.setItem("servsite_current_user", JSON.stringify(foundUser));
        alert(`Welcome back, ${foundUser.name}!`);
        window.location.href = "customer.html";
    } else {
        alert("Invalid email or password! Please check your details or sign up first.");
    }
});