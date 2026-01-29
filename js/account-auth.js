const form = document.getElementById("signupForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  if (!username || !email || !password) {
    msg.textContent = "All fields are required";
    msg.className = "error";
    return;
  }

  // save user locally
  const user = { username, email, password };
  localStorage.setItem("user", JSON.stringify(user));

  msg.textContent = "Account created successfully!";
  msg.className = "success";

  setTimeout(() => {
    window.location.href = "login.html";
  }, 1200);
});
