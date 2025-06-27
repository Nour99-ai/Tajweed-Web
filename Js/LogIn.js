const main = () => {
  document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    const logInBtn = document.querySelector(".btn.btn-login");

    logInBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const username = usernameInput.value;
      const password = passwordInput.value;

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Find user with matching username and password
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // Save current user and redirect
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.assign("/html/index.html");
      } else {
        alert("Invalid username or password!");
      }
    });
  });
};

main();