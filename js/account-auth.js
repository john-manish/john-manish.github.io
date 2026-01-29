document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const msg = document.getElementById("msg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.textContent = "";
    msg.className = "";

    const formData = new FormData(form);

    try {
      const res = await fetch(
        "https://manish8090101.page.gd/signup.php",
        {
          method: "POST",
          body: formData
        }
      );

      const text = await res.text();

      if (text.toLowerCase().includes("success")) {
        msg.textContent = "Account created successfully!";
        msg.className = "success";

        setTimeout(() => {
          window.location.href = "login.html";
        }, 1200);
      } else {
        msg.textContent = text;
        msg.className = "error";
      }

    } catch (err) {
      msg.textContent = "Server error. Please try again.";
      msg.className = "error";
    }
  });
});
