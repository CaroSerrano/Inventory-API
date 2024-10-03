import authService from "./authService.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado");
  const form = document.getElementById("signinForm"); //document es el html

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevenir que el formulario se envíe por defecto

      // Obtener los valores de los campos de email y password al enviar el formulario
      const emailInput = document.getElementById("emailField");
      const email = emailInput.value;
      const passwordInput = document.getElementById("passwordField");
      const password = passwordInput.value;

      console.log("email:", email);
      console.log("password:", password);

      // Validar el formulario y autenticar
      await setTokenAndRelocate(email, password);
    });

    function validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,7}$/;
      return regex.test(email);
    }

    async function authenticate(email, password) {
      const data = {
        email: email,
        password: password,
      };
      console.log("datos: ", data);
      
      try {
        const auth = await fetch(`http://localhost:3001/api/sessions/signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

      } catch (error) {
        console.error("Error en la autenticación:", error);
        throw error;
      }
    }

    async function setTokenAndRelocate(email, password) {
      console.log("Validando formulario...");

      if (!validateEmail(email)) {
        alert("Please, enter a valid email.");
        return;
      }

      const authUser = await authenticate(email, password);
      console.log(authUser);
      console.log("userEmail: ", authUser.data.user.email);
      authService.setToken(authUser.data.token);
      if(authUser) alert("Succesfully logged in!")
      if(email != "superadmin@example.com") {
        const role = authUser.data.user.role_id.name
      }

    }
  } else {
    console.error("No se pudo acceder al formulario");
  }
});
