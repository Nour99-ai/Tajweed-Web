"use strict";
// Login functionality for Tajweed Web Application
// Author: Nour
// Description: Handles user authentication, form validation, and user experience enhancements

// Global DOM Elements
let loginForm, usernameInput, passwordInput, rememberCheckbox, loginButton;
let forgotPasswordLink, registerLink;

// Constants
const AUTO_LOGOUT_HOURS = 48;
const ALERT_TIMEOUT_MS = 5000;
const REDIRECT_DELAY_MS = 2000;

// Validation Rules
const validationRules = {
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
    message:
      "Username must be 3-20 characters and contain only letters, numbers, and underscores",
  },
  password: {
    minLength: 6,
    maxLength: 50,
    message: "Password must be at least 6 characters long",
  },
};

// Alert Icons
const alertIcons = {
  error: "❌",
  success: "✅",
  info: "ℹ️",
  warning: "⚠️",
};

// Dynamic Styles
const dynamicStyles = `
    /* Enhanced form styles */
    .form-control.error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
    
    .form-control.success {
        border-color: #28a745 !important;
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
    }
    
    .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
        animation: slideDown 0.3s ease-out;
    }
    
    .alert-message {
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideDown 0.3s ease-out;
    }
    
    .alert-error {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
    
    .alert-success {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }
    
    .alert-info {
        background-color: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
        white-space: pre-line;
    }
    
    .alert-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.7;
    }
    
    .alert-close:hover {
        opacity: 1;
    }
    
    .btn-login.loading {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .shake {
        animation: shake 0.6s ease-in-out;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .form-group.focused .form-label {
        color: #1a6c7a;
        transform: translateY(-2px);
    }
`;

// Function declarations
function getCurrentUser() {
  const userStr = localStorage.getItem("currentUser");
  return userStr ? JSON.parse(userStr) : null;
}

function isUserLoggedIn() {
  return getCurrentUser() !== null;
}

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("loginTime");
  window.location.href = "Log-in.html";
  sessionStorage.removeItem("sessionUsername");
  sessionStorage.removeItem("sessionPassword");
}

function checkAuthStatus() {
  if (isUserLoggedIn()) {
    const loginTime = new Date(localStorage.getItem("loginTime"));
    const now = new Date();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

    if (hoursSinceLogin > AUTO_LOGOUT_HOURS) {
      logout();
    } else {
      window.location.href = "../html/index.html";
    }
  }
}

function addDynamicStyles() {
  const style = document.createElement("style");
  style.textContent = dynamicStyles;
  document.head.appendChild(style);
}

function initializeLogin() {
  initializeDOMElements();
  addEventListeners();
  loadSavedCredentials();
  addInputAnimations();
}

function initializeDOMElements() {
  loginForm = document.querySelector(".login-form");
  usernameInput = document.getElementById("username");
  passwordInput = document.getElementById("password");
  rememberCheckbox = document.getElementById("remember");
  loginButton = document.querySelector(".btn-login");
  forgotPasswordLink = document.querySelector(".forgot-password");
  registerLink = document.querySelector(".register-link");
}

function validateField(fieldName) {
  let input;
  if (fieldName === "username") {
    input = usernameInput;
  } else {
    input = passwordInput;
  }
  const rules = validationRules[fieldName];
  const value = input.value.trim();

  if (value.length < rules.minLength || value.length > rules.maxLength) {
    showFieldError(input, rules.message);
    return false;
  }

  if (fieldName === "username" && !rules.pattern.test(value)) {
    showFieldError(input, rules.message);
    return false;
  }

  showFieldSuccess(input);
  return true;
}

function addEventListeners() {
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (usernameInput) {
    usernameInput.addEventListener("input", () => validateField("username"));
    usernameInput.addEventListener("blur", () => validateField("username"));
    usernameInput.addEventListener("focus", clearFieldError);
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", () => validateField("password"));
    passwordInput.addEventListener("blur", () => validateField("password"));
    passwordInput.addEventListener("focus", clearFieldError);
    passwordInput.addEventListener("keypress", handlePasswordKeypress);
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", handleForgotPassword); 
  }

  if (registerLink) {
    registerLink.addEventListener("click", handleRegisterClick);
  }
}

function validateForm() {
  return validateField("username") && validateField("password");
}

function authenticateUser(username, password) {
  // TODO: Implement actual authentication logic
  return Promise.resolve({ username, id: 1 });
}

function handleSuccessfulLogin(user, remember) {
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("loginTime", new Date().toISOString());

  if (remember) {
    localStorage.setItem("savedUsername", user.username);
    localStorage.setItem("savedPassword", btoa(passwordInput.value));
  } else {
    localStorage.removeItem("savedUsername");
    localStorage.removeItem("savedPassword");
  }

  showSuccessMessage("Login successful! Redirecting...");

  setTimeout(() => {
    window.location.href = "../html/index.html";
  }, REDIRECT_DELAY_MS);
}

function handleFailedLogin() {
  setLoadingState(false);
  showError("Invalid username or password");
  passwordInput.value = "";
  loginForm.classList.add("shake");

  setTimeout(() => {
    loginForm.classList.remove("shake");
  }, 600);
}

function handlePasswordKeypress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    loginButton.click();
  }
}

function handleForgotPassword(event) {
  event.preventDefault();
  showInfo(`To reset your password:
1. Contact support at support@tajweed.com
2. Provide your username
3. Follow the instructions in the reset email`);
}

function handleRegisterClick(event) {
  event.preventDefault();
  showInfo(
    "Registration is currently by invitation only. Please contact an administrator."
  );
}

function loadSavedCredentials() {
  const savedUsername = localStorage.getItem("savedUsername");
  const savedPassword = localStorage.getItem("savedPassword");

  if (savedUsername && savedPassword) {
    usernameInput.value = savedUsername;
    passwordInput.value = atob(savedPassword);
    rememberCheckbox.checked = true;
  }
}

function addInputAnimations() {
  const formGroups = document.querySelectorAll(".form-group");

  formGroups.forEach((group) => {
    const input = group.querySelector(".form-control");
    const label = group.querySelector(".form-label");

    if (input && label) {
      input.addEventListener("focus", () => {
        group.classList.add("focused");
      });

      input.addEventListener("blur", () => {
        if (!input.value) {
          group.classList.remove("focused");
        }
      });

      // Set initial state
      if (input.value) {
        group.classList.add("focused");
      }
    }
  });
}

function setLoadingState(loading) {
  if (loading) {
    loginButton.disabled = true;
    loginButton.classList.add("loading");
    loginButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Logging in...
        `;
  } else {
    loginButton.disabled = false;
    loginButton.classList.remove("loading");
    loginButton.innerHTML = "Log In";
  }
}

function showFieldError(input, message) {
  const formGroup = input.closest(".form-group");
  input.classList.remove("success");
  input.classList.add("error");

  let errorMessage = formGroup.querySelector(".error-message");
  if (!errorMessage) {
    errorMessage = document.createElement("span");
    errorMessage.className = "error-message";
    formGroup.appendChild(errorMessage);
  }
  errorMessage.textContent = message;
}

function showFieldSuccess(input) {
  const formGroup = input.closest(".form-group");
  input.classList.remove("error");
  input.classList.add("success");

  const errorMessage = formGroup.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

function clearFieldError() {
  const input = this;
  const formGroup = input.closest(".form-group");

  input.classList.remove("error", "success");
  const errorMessage = formGroup.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

function clearAllErrors() {
  const inputs = loginForm.querySelectorAll(".form-control");
  inputs.forEach((input) => {
    input.classList.remove("error", "success");
    const formGroup = input.closest(".form-group");
    const errorMessage = formGroup.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  });
}

function showError(message) {
  showAlert(message, "error");
}

function showSuccessMessage(message) {
  showAlert(message, "success");
}

function showInfo(message) {
  showAlert(message, "info");
}

function showAlert(message, type) {
  const existingAlert = document.querySelector(".alert-message");
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement("div");
  alert.className = `alert-message alert-${type}`;
  alert.innerHTML = `
        ${getAlertIcon(type)}
        <span>${message}</span>
        <button class="alert-close" aria-label="Close">×</button>
    `;

  loginForm.insertAdjacentElement("beforebegin", alert);

  const closeButton = alert.querySelector(".alert-close");
  closeButton.addEventListener("click", () => alert.remove());

  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, ALERT_TIMEOUT_MS);
}

function getAlertIcon(type) {
  return alertIcons[type] || "";
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  initializeLogin();
  addDynamicStyles();
  if (window.location.pathname.includes("Log-in.html")) {
    checkAuthStatus();
  }
});
