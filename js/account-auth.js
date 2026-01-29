document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  if (!form) {
    console.error("signupForm not found");
    return;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    fetch("https://manish8090101.page.gd/signup.php", {
      method: "POST",
      body: new FormData(form)
    })
    .then(r => r.json())
    .then(d => {
      const msg = document.getElementById("msg");
      msg.textContent = d.success ? "Account created ✅" : d.error;
      msg.className = d.success ? "success" : "error";
    })
    .catch(err => {
      console.error(err);
    });
  });
});
