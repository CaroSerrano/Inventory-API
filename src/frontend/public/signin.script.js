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
      await setToken(email, password);
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
      console.log("data en authenticate() : ", data);
      
      try {
        const response = await fetch(
          `http://localhost:3001/api/sessions/signin`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        const auth = await response.json();
        return auth;
      } catch (error) {
        console.error("Authentication error:", error);
        throw error;
      }
    }

    function relocate(role) {
      try {
        if (role === "admin") {
          window.location.href = "/api/admins/dashboard";
        } else if (role === "manager") {
          window.location.href = "/api/managers/dashboard";
        } else if (role === "employee") {
          window.location.href = "/api/employees/dashboard";
        } else if (role === "basic_user") {
          window.location.href = "/api/users/dashboard";
        } else {
          console.error("Unknown role:", role);
        }
      } catch (error) {
        console.error("recolate error: ", error.message);
      }
    }
    
    async function setToken(email, password) {
      if (!validateEmail(email)) {
        alert("Please, enter a valid email.");
        return;
      }

      const authUser = await authenticate(email, password);
      console.log(authUser);
      if(authUser.error===true){
        alert(authUser.message)
        window.location.href = "/api/sessions/login"
      } else {
        authService.setToken(authUser.data.token);      
        let role;
        if (email != "superadmin@example.com") {
          role = authUser.data.user.role_id.name;
        } else {
          role = "admin";
        }
        alert("Succesfully logged in!")
        relocate(role);
        
      }

    }
  } else {
    console.error("Formulary access failed");
  }
});
