'use strict';
// Login functionality for Tajweed Web Application
// Author: Nour
// Description: Handles user authentication, form validation, and user experience enhancements

const initializeLogin = () => {
  // Get form elements
  const loginForm = document.querySelector(".login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("remember");
  const loginButton = document.querySelector(".btn-login");
  const forgotPasswordLink = document.querySelector(".forgot-password");
  const registerLink = document.querySelector(".register-link");

  // TODO: Integrate with backend authentication API here.

  // Form validation rules
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

  // Add event listeners
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

  // Load saved username if remember me was checked
  loadSavedCredentials();

  // Add input animations
  addInputAnimations();

  // Handle login form submission
  const handleLogin = (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;

    // Clear previous errors
    clearAllErrors();

    // Validate form
    if (!validateForm()) {
      showError("Please fix the errors above and try again.");
      return;
    }

    // Show loading state
    setLoadingState(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = authenticateUser(username, password);

      if (user) {
        handleSuccessfulLogin(user, remember);
      } else {
        handleFailedLogin();
      }

      setLoadingState(false);
    }, 1500);
  };

  // Validate individual field
  const validateField = (fieldName) => {
    const input = document.getElementById(fieldName);
    const value = input.value.trim();
    const rules = validationRules[fieldName];

    // Clear previous error
    clearFieldError(input);

    // Check if field is empty
    if (!value) {
      showFieldError(
        input,
        `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
      );
      return false;
    }

    // Check minimum length
    if (rules.minLength && value.length < rules.minLength) {
      showFieldError(
        input,
        `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${rules.minLength} characters`
      );
      return false;
    }

    // Check maximum length
    if (rules.maxLength && value.length > rules.maxLength) {
      showFieldError(
        input,
        `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must not exceed ${rules.maxLength} characters`
      );
      return false;
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      showFieldError(input, rules.message);
      return false;
    }

    // Show success state
    showFieldSuccess(input);
    return true;
  };

  // Validate entire form
  const validateForm = () => {
    const usernameValid = validateField("username");
    const passwordValid = validateField("password");
    return usernameValid && passwordValid;
  };

  // Authenticate user (replace with real backend call)
  const authenticateUser = (username, password) => {
    // TODO: Replace with real backend authentication logic
    return null;
  };

  // Handle successful login
  const handleSuccessfulLogin = (user, remember) => {
    // Save credentials if remember me is checked
    if (remember) {
      localStorage.setItem("rememberedUsername", user.username);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberMe");
      sessionStorage.setItem("sessionUsername", username);
      sessionStorage.setItem("sessionPassword", password);
    }

    // Save user session
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    sessionStorage.setItem("loginTime", new Date().toISOString());

    // Show success message
    showSuccessMessage(`Welcome back, ${user.name}! Redirecting...`);

    // Redirect after delay
    setTimeout(() => {
      // In a real app, redirect to dashboard or main page
      window.location.href = "../html/index.html";
    }, 2000);
  };

  // Handle failed login
  const handleFailedLogin = () => {
    showError("Invalid username or password. Please try again.");

    // Add shake animation to form
    const formSection = document.querySelector(".form-section");
    formSection.classList.add("shake");
    setTimeout(() => {
      formSection.classList.remove("shake");
    }, 600);

    // Clear password field
    passwordInput.value = "";
    passwordInput.focus();
  };

  // Handle password keypress (Enter to submit)
  const handlePasswordKeypress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loginForm.dispatchEvent(new Event("submit"));
    }
  };

  // Handle forgot password click
  const handleForgotPassword = (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    if (!username) {
      showInfo(
        'Please enter your username first, then click "Forgot password?"'
      );
      usernameInput.focus();
      return;
    }

    // Simulate password reset
    showInfo(
      `Password reset instructions have been sent to the email associated with "${username}".`
    );
  };

  // Handle register link click
  const handleRegisterClick = (event) => {
    event.preventDefault();
    showInfo(
      "Registration feature coming soon!"
    );
  };

  // Load saved credentials
  const loadSavedCredentials = () => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    if (rememberMe && rememberedUsername) {
      usernameInput.value = rememberedUsername;
      rememberCheckbox.checked = true;
    }
  };

  // Add input animations and enhancements
  const addInputAnimations = () => {
    const inputs = document.querySelectorAll(".form-control");

    inputs.forEach((input) => {
      // Add floating label effect
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused");
        }
      });

      // Check if input has value on load
      if (input.value) {
        input.parentElement.classList.add("focused");
      }
    });
  };

  // Set loading state
  const setLoadingState = (loading) => {
    const btnText = loginButton.querySelector(".btn-text");
    const btnIcon = loginButton.querySelector(".btn-icon");

    if (loading) {
      loginButton.disabled = true;
      loginButton.classList.add("loading");
      btnText.textContent = "Signing In...";
      btnIcon.textContent = "⏳";
    } else {
      loginButton.disabled = false;
      loginButton.classList.remove("loading");
      btnText.textContent = "Sign In";
      btnIcon.textContent = "→";
    }
  };

  // Show field error
  const showFieldError = (input, message) => {
    input.classList.add("error");
    input.classList.remove("success");

    // Remove existing error message
    const existingError = input.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
  };

  // Show field success
  const showFieldSuccess = (input) => {
    input.classList.add("success");
    input.classList.remove("error");

    // Remove error message
    const errorMessage = input.parentElement.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  };

  // Clear field error
  const clearFieldError = (input) => {
    if (input.target) input = input.target; // Handle event object

    input.classList.remove("error", "success");
    const errorMessage = input.parentElement.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  };

  // Clear all errors
  const clearAllErrors = () => {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());

    const errorInputs = document.querySelectorAll(".form-control.error");
    errorInputs.forEach((input) => input.classList.remove("error"));

    const alertMessages = document.querySelectorAll(".alert-message");
    alertMessages.forEach((msg) => msg.remove());
  };

  // Show error message
  const showError = (message) => {
    showAlert(message, "error");
  };

  // Show success message
  const showSuccessMessage = (message) => {
    showAlert(message, "success");
  };

  // Show info message
  const showInfo = (message) => {
    showAlert(message, "info");
  };

  // Show alert message
  const showAlert = (message, type) => {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll(".alert-message");
    existingAlerts.forEach((alert) => alert.remove());

    // Create alert element
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-message alert-${type}`;
    alertDiv.innerHTML = `
            <span class="alert-icon">${getAlertIcon(type)}</span>
            <span class="alert-text">${message}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;

    // Insert alert at the top of the form
    const formSection = document.querySelector(".form-section");
    formSection.insertBefore(alertDiv, formSection.firstChild);

    // Auto-remove after delay (except for success messages)
    if (type !== "success") {
      setTimeout(() => {
        if (alertDiv.parentElement) {
          alertDiv.remove();
        }
      }, 5000);
    }
  };

  // Get alert icon based on type
  const getAlertIcon = (type) => {
    const icons = {
      error: "❌",
      success: "✅",
      info: "ℹ️",
      warning: "⚠️",
    };
    return icons[type] || "ℹ️";
  };
};

document.addEventListener("DOMContentLoaded", function () {
  // Initialize login functionality
  initializeLogin();
});
  // Get form elements
  const loginForm = document.querySelector(".login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("remember");
  const loginButton = document.querySelector(".btn-login");
  const forgotPasswordLink = document.querySelector(".forgot-password");
  const registerLink = document.querySelector(".register-link");

  // TODO: Integrate with backend authentication API here.

  // Form validation rules
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

  // Add event listeners
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

  // Load saved username if remember me was checked
  loadSavedCredentials();

  // Add input animations
  addInputAnimations();

  // Handle login form submission
  const handleLogin = function(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheckbox.checked;

    // Clear previous errors
    clearAllErrors();

    // Validate form
    if (!validateForm()) {
      showError("Please fix the errors above and try again.");
      return;
    }

    // Show loading state
    setLoadingState(true);

    // Simulate API call delay
    setTimeout(() => {
      const user = authenticateUser(username, password);

      if (user) {
        handleSuccessfulLogin(user, remember);
      } else {
        handleFailedLogin();
      }

      setLoadingState(false);
    }, 1500);
  };

  // Validate individual field
  const validateField = function(fieldName) {
    const input = document.getElementById(fieldName);
    const value = input.value.trim();
    const rules = validationRules[fieldName];

    // Clear previous error
    clearFieldError(input);

    // Check if field is empty
    if (!value) {
      showFieldError(
        input,
        `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`
      );
      return false;
    }

    // Check minimum length
    if (rules.minLength && value.length < rules.minLength) {
      showFieldError(
        input,
        `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${rules.minLength} characters`
      );
      return false;
    }

    // Check maximum length
    if (rules.maxLength && value.length > rules.maxLength) {
      showFieldError(
        input,
        `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must not exceed ${rules.maxLength} characters`
      );
      return false;
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      showFieldError(input, rules.message);
      return false;
    }

    // Show success state
    showFieldSuccess(input);
    return true;
  };

  // Validate entire form
  const validateForm = function() {
    const usernameValid = validateField("username");
    const passwordValid = validateField("password");
    return usernameValid && passwordValid;
  };

  // Authenticate user (replace with real backend call)
  const authenticateUser = function(username, password) {
    // TODO: Replace with real backend authentication logic
    return null;
  };

  // Handle successful login
  const handleSuccessfulLogin = function(user, remember) {
    // Save credentials if remember me is checked
    if (remember) {
      localStorage.setItem("rememberedUsername", user.username);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberMe");
      sessionStorage.setItem("sessionUsername", username);
      sessionStorage.setItem("sessionPassword", password);
    }

    // Save user session
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    sessionStorage.setItem("loginTime", new Date().toISOString());

    // Show success message
    showSuccessMessage(`Welcome back, ${user.name}! Redirecting...`);

    // Redirect after delay
    setTimeout(() => {
      // In a real app, redirect to dashboard or main page
      window.location.href = "../html/index.html";
    }, 2000);
  };

  // Handle failed login
  const handleFailedLogin = function() {
    showError("Invalid username or password. Please try again.");

    // Add shake animation to form
    const formSection = document.querySelector(".form-section");
    formSection.classList.add("shake");
    setTimeout(() => {
      formSection.classList.remove("shake");
    }, 600);

    // Clear password field
    passwordInput.value = "";
    passwordInput.focus();
  };

  // Handle password keypress (Enter to submit)
  const handlePasswordKeypress = function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      loginForm.dispatchEvent(new Event("submit"));
    }
  };

  // Handle forgot password click
  const handleForgotPassword = function(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    if (!username) {
      showInfo(
        'Please enter your username first, then click "Forgot password?"'
      );
      usernameInput.focus();
      return;
    }

    // Simulate password reset
    showInfo(
      `Password reset instructions have been sent to the email associated with "${username}".`
    );
  };

  // Handle register link click
  const handleRegisterClick = function(event) {
    event.preventDefault();
    showInfo(
      "Registration feature coming soon!"
    );
  };

  // Load saved credentials
  const loadSavedCredentials = function() {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    if (rememberMe && rememberedUsername) {
      usernameInput.value = rememberedUsername;
      rememberCheckbox.checked = true;
    }
  };

  // Add input animations and enhancements
  const addInputAnimations = function() {
    const inputs = document.querySelectorAll(".form-control");

    inputs.forEach((input) => {
      // Add floating label effect
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused");
        }
      });

      // Check if input has value on load
      if (input.value) {
        input.parentElement.classList.add("focused");
      }
    });
  };

  // Set loading state
  const setLoadingState = function(loading) {
    const btnText = loginButton.querySelector(".btn-text");
    const btnIcon = loginButton.querySelector(".btn-icon");

    if (loading) {
      loginButton.disabled = true;
      loginButton.classList.add("loading");
      btnText.textContent = "Signing In...";
      btnIcon.textContent = "⏳";
    } else {
      loginButton.disabled = false;
      loginButton.classList.remove("loading");
      btnText.textContent = "Sign In";
      btnIcon.textContent = "→";
    }
  };

  // Show field error
  const showFieldError = function(input, message) {
    input.classList.add("error");
    input.classList.remove("success");

    // Remove existing error message
    const existingError = input.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
  };

  // Show field success
  const showFieldSuccess = function(input) {
    input.classList.add("success");
    input.classList.remove("error");

    // Remove error message
    const errorMessage = input.parentElement.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  };

  // Clear field error
  const clearFieldError = function(input) {
    if (input.target) input = input.target; // Handle event object

    input.classList.remove("error", "success");
    const errorMessage = input.parentElement.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  };

  // Clear all errors
  const clearAllErrors = function() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((msg) => msg.remove());

    const errorInputs = document.querySelectorAll(".form-control.error");
    errorInputs.forEach((input) => input.classList.remove("error"));

    const alertMessages = document.querySelectorAll(".alert-message");
    alertMessages.forEach((msg) => msg.remove());
  };

  // Show error message
  const showError = function(message) {
    showAlert(message, "error");
  };

  // Show success message
  const showSuccessMessage = function(message) {
    showAlert(message, "success");
  };

  // Show info message
  const showInfo = function(message) {
    showAlert(message, "info");
  };

  // Show alert message
  const showAlert = function(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll(".alert-message");
    existingAlerts.forEach((alert) => alert.remove());

    // Create alert element
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert-message alert-${type}`;
    alertDiv.innerHTML = `
            <span class="alert-icon">${getAlertIcon(type)}</span>
            <span class="alert-text">${message}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;

    // Insert alert at the top of the form
    const formSection = document.querySelector(".form-section");
    formSection.insertBefore(alertDiv, formSection.firstChild);

    // Auto-remove after delay (except for success messages)
    if (type !== "success") {
      setTimeout(() => {
        if (alertDiv.parentElement) {
          alertDiv.remove();
        }
      }, 5000);
    }
  };

  // Get alert icon based on type
  const getAlertIcon = function(type) {
    const icons = {
      error: "❌",
      success: "✅",
      info: "ℹ️",
      warning: "⚠��",
    };
    return icons[type] || "ℹ️";
  };
;

// Utility functions for session management
const getCurrentUser = () => {
  const userStr = sessionStorage.getItem("currentUser");
  return userStr ? JSON.parse(userStr) : null;
};

const isUserLoggedIn = () => {
  return getCurrentUser() !== null;
};

const logout = () => {
  sessionStorage.removeItem("currentUser");
  sessionStorage.removeItem("loginTime");
  window.location.href = "Log-in.html";
  sessionStorage.removeItem("sessionUsername");
  sessionStorage.removeItem("sessionPassword");
};

// Check if user is already logged in (redirect if needed)
const checkAuthStatus = () => {
  if (isUserLoggedIn()) {
    const loginTime = new Date(sessionStorage.getItem("loginTime"));
    const now = new Date();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

    // Auto-logout after 24 hours
    if (hoursSinceLogin > 24) {
      logout();
    } else {
      // User is still logged in, redirect to main page
      window.location.href = "../html/index.html";
    }
  }
};

// Call auth check when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Only check auth status if we're on the login page
  if (window.location.pathname.includes("Log-in.html")) {
    checkAuthStatus();
  }
});

// Add CSS styles dynamically for enhanced UX
const addDynamicStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
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
  document.head.appendChild(style);
};

// Add styles when DOM is loaded
document.addEventListener("DOMContentLoaded", addDynamicStyles);
