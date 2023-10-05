document.addEventListener("DOMContentLoaded", function () {
  const usersUrl = "https://jsonplaceholder.typicode.com/users";
  const loginForm = document.querySelector(".log-in-data");
  const loginMessage = document.querySelector(".log-in-msg");
  const usersMap = {};

  if (localStorage.getItem("email")) {
    window.location.href = "home.html";
  } else {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.querySelector(".email").value;

      if (usersMap[email]) {
        localStorage.setItem("name", usersMap[email].name);
        localStorage.setItem("email", email);
        localStorage.setItem("id", usersMap[email].id);
        window.location.href = "home.html";
      } else {
        loginMessage.textContent =
          "Login failed. Please check your email and password.";
      }
    });

    const getAllUsers = async () => {
      const response = await fetch(usersUrl);
      const users = await response.json();
      users.map((user) => {
        if (!usersMap[user.email]) {
          usersMap[user.email] = user;
        }
      });
    };

    getAllUsers();
  }
});
