document.getElementById("signupForm").addEventListener("submit", e => {
  e.preventDefault();

  fetch("https://manish8090101.page.gd/signup.php", {
    method: "POST",
    body: new FormData(e.target)
  })
  .then(r => r.json())
  .then(d => {
    document.getElementById("msg").textContent =
      d.success ? "Account created ✅" : d.error;
  });
});