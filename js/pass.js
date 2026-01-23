
  
    async function sha256(text) {
      const data = new TextEncoder().encode(text);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
    }

    async function check() {
      const input = document.getElementById("pwd").value;
      const hash = await sha256(input);

      // CHANGE THIS HASH ONLY
      const correct =
        "c2a7a056ddbf0555350aed698b983c858b46cd2d0f5ce756ded408b197632483";

      if (hash === correct) {
        sessionStorage.setItem("auth", "yes");
        window.location.href = "gallery.html";
      } else {
        alert("Wrong password");
      }
    }




    


function toggle() {
  const pwd = document.getElementById("pwd");
  const eye = document.getElementById("eye");

  if (pwd.type === "password") {
    pwd.type = "text";
    eye.textContent = "🙈";
  } else {
    pwd.type = "password";
    eye.textContent = "👁️";
  }
}
