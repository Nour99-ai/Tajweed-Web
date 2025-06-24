const createAccBtn = document.getElementById("btn btn-login");
const main = () => {
  document.addEventListener("DOMContentLoaded", function () {
    // Check if any user exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length > 0) {
      alert("You already have an account! Please try again after 10 minutes.");
      // Optionally, redirect or disable the registration form here
      // window.location.assign("/html/Log-in.html");
      setTimeout(() => {
        window.location.assign("/html/Log-in.html");
      }, 10000);
      return;
    }

    // Get the form element
    const form = document.querySelector(".register-form");

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent form from submitting normally

      // Get form values
      const createAccBtn = document.getElementById("btn btn-login");
      const username = document.getElementById("reg-username").value;
      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm").value;

      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Create user object
      const user = {
        username: username,
        email: email,
        password: password,
      };

      // Get existing users or initialize empty array
      let users = JSON.parse(localStorage.getItem("users")) || [];
      if (!Array.isArray(users)) users = [];
      users.push(user);

      // Save updated users array
      localStorage.setItem("users", JSON.stringify(users));

      // Also save current user separately for easy access
      localStorage.setItem("currentUser", JSON.stringify(user));

      // Redirect to login page

      createAccBtn.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.assign("/html/Log-in.html");
      });
    });
    createAccBtn.addEventListener("click", function (event) {
      event.preventDefault();
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.assign("/html/Log-in.html");
      CreateAccBtn.classList.add("success");
    });
  });
};
