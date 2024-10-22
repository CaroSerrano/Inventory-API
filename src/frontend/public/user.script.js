import { format } from "https://cdn.jsdelivr.net/npm/@formkit/tempo@0.1.2/+esm";
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado");
  async function getRole(role) {
    try {
      const response = await fetch(`http://localhost:3001/api/roles/${role}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const ROLE = await response.json();

      if (ROLE.error === false) {
        return ROLE;
      } else {
        console.error(ROLE.message);
        return null;
      }
    } catch (error) {
      console.error("Get role error:", error);
      throw error;
    }
  }
  // Función para manejar el cierre de popups
  function handlePopupsClose() {
    const popupsClose = document.querySelectorAll("#popup-close");
    const popups = document.querySelectorAll(".popup");

    popupsClose.forEach((close) => {
      close.addEventListener("click", () => {
        popups.forEach((popup) => {
          popup.style.visibility = "hidden";
          popup.style.opacity = "0";
          popup.style.pointerEvents = "none";
          close.focus();
        });
      });
    });
  }

  // Función para mostrar botones de "more info" según el rol
  async function showMoreInfoButtons() {
    const btnsMoreInfo = document.querySelectorAll("#more_info");
    const popups = document.querySelectorAll(".popup");

    for (const button of btnsMoreInfo) {
      const roleId = button.getAttribute("data-user-role");

      try {
        const role = await getRole(roleId);
        if (["manager", "employee"].includes(role.data.name)) {
          button.classList.remove("hidden");
        }
      } catch (error) {
        console.error(`Error fetching role: ${error}`);
      }

      button.addEventListener("click", () => {
        popups.forEach((popup) => {
          const popup_userId = popup.getAttribute("data-user-id");
          const popup_role = popup.getAttribute("data-user-role");

          if (
            popup_userId === button.getAttribute("data-user-id") &&
            popup_role === button.getAttribute("data-user-role")
          ) {
            popup.style.visibility = "visible";
            popup.style.opacity = "1";
            popup.style.pointerEvents = "auto";
            const popupClose = popup.querySelector("#popup-close");
            popupClose.focus();
          }
        });
      });
    }
  }
  const btnsMoreInfo = document.querySelectorAll("#more_info");
  const popups = document.querySelectorAll(".popup");
  const popupsClose = document.querySelectorAll("#popup-close");

  //############################# Filters #########################################
  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    filterForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(filterForm);
      const queryString = new URLSearchParams(formData).toString();
      const response = await fetch(`/api/admins/users?${queryString}`, {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (!response.ok) {
        // Manejo de errores si la respuesta no es correcta
        console.error("Error fetching users: ", response.statusText);
        return;
      }
      const html = await response.text();
      document.querySelector(".users-container").innerHTML = html;
    });
  }

  //############################# Delete user #########################################
  async function deleteUser(userId, userRole) {
    try {
      const role = await getRole(userRole);
      if (role.data.name === "admin" || role.data.name === "basic_user") {
        await fetch(`http://localhost:3001/api/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (role.data.name === "manager") {
        await fetch(`http://localhost:3001/api/managers/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (role.data.name === "employee") {
        await fetch(`http://localhost:3001/api/employees/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Deleting user error:", error);
      throw error;
    }
  }

  const users_container = document.querySelector(".users-container");

  if (users_container) {
    // Configuración del evento click en el contenedor
    users_container.addEventListener("click", async function (event) {
      if (event.target.classList.contains("delete_user")) {
        const userId = event.target.getAttribute("data-user-id");
        const userRole = event.target.getAttribute("data-user-role");

        const confirmation = confirm(`Delete user?`);
        if (confirmation) {
          try {
            await deleteUser(userId, userRole);
            window.location.href = "/api/admins/users";
          } catch (error) {
            console.error("Deleting user error:", error);
          }
        }
      }
    });

    // Configuración del observer: qué mutaciones observar
    const config = { childList: true, subtree: true, characterData: true };

    // Función que se ejecuta en cada cambio detectado
    const handleMutations = async (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          handlePopupsClose();
          await showMoreInfoButtons();
        }
      }
    };

    // Crear el observer e iniciar la observación
    const observer = new MutationObserver(handleMutations);
    observer.observe(users_container, config);
  }

  //############################# Enable fields by role #########################################
  const roleSelect = document.getElementById("roleField");
  const employeeFields = document.getElementById("employeeFields");
  const managerFields = document.getElementById("managerFields");
  if (roleSelect) {
    roleSelect.addEventListener("change", () => {
      const selectedRole =
        roleSelect.options[roleSelect.selectedIndex].textContent;

      // Reset fields first
      resetFields();

      // Show and enable fields
      if (selectedRole === "employee") {
        employeeFields.classList.remove("hidden");
        employeeFields.querySelector("#position").disabled = false;
        employeeFields.querySelector("#employeeHireDate").disabled = false;
        employeeFields.querySelector("#shiftSchedule").disabled = false;
        employeeFields.querySelector("#salary").disabled = false;
        employeeFields.querySelector("#manager").disabled = false;
        employeeFields.querySelector("#store").disabled = false;
      } else if (selectedRole === "manager") {
        managerFields.classList.remove("hidden");
        managerFields.querySelector("#management_level").disabled = false;
        managerFields.querySelector("#managerHireDate").disabled = false;
      }
    });

    // Reset fields
    function resetFields() {
      employeeFields.classList.add("hidden");
      managerFields.classList.add("hidden");

      // Disabled fields
      employeeFields.querySelectorAll("input").disabled = true;
      employeeFields.querySelectorAll("select").disabled = true;
      managerFields.querySelectorAll("input").disabled = true;
      managerFields.querySelectorAll("select").disabled = true;
    }
  }

  //############################# Create User #########################################
  const form = document.getElementById("createUserForm");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const fields = Array.from(form.querySelectorAll("input, select")).filter(
        (field) => field.disabled == false
      );
      const userData = {};
      fields.forEach((field) => {
        if (field.name === "hire_date") {
          userData[field.name] = format({
            date: field.value,
            format: "YYYY-MM-DD",
          });
          console.log("hire_date: ", userData[field.name]);

          return;
        }
        userData[field.name] = field.value.trim();
        console.log(userData[field.name]);
      });
      console.log("userData en createUser: ", userData);
      const role = await getRole(userData.role_id);
      if (role.data.name === "manager") {
        form.querySelector("button").formAction = "/api/managers";
      } else if (role.data.name === "employee") {
        form.querySelector("button").formAction = "/api/employees";
      }
      // Relocate invocates createUser() and reloads users page with the new user in it.
      relocate(userData);
    });

    async function createUser(userData) {
      try {
        let response;
        const role = await getRole(userData.role_id);
        if (!role) {
          alert("Role not found");
          window.location.href = "/api/admins/create-user";
        }

        if (role.data.name === "admin" || role.data.name === "basic_user") {
          response = await fetch(`http://localhost:3001/api/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
        } else if (role.data.name === "manager") {
          response = await fetch(`http://localhost:3001/api/managers`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
        } else if (role.data.name === "employee") {
          response = await fetch(`http://localhost:3001/api/employees`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
        }
        if (response.ok) {
          const newUser = await response.json();
          return newUser ? newUser : null;
        } else {
          alert("Error creating user: ", response.statusText);
          console.log("Error creating user: ", response);

          return;
        }
      } catch (error) {
        console.error("Creating user error:", error);
        throw error;
      }
    }

    async function relocate(userData) {
      try {
        const user = await createUser(userData);
        if (user) {
          window.location.href = "/api/admins/users";
        } else {
          alert("Error creating user");
          window.location.href = "/api/admins/create-user";
        }
      } catch (error) {
        console.error("recolate error: ", error.message);
      }
    }
  }

  //############################# Update user #########################################
  const updateForm = document.getElementById("updateUserForm");

  if (updateForm) {
    const userId = updateForm.getAttribute("data-user-id");
    updateForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const fields = updateForm.querySelectorAll("input, select");
      //Filter empty fields
      const filledFields = Array.from(fields).filter(
        (field) => field.value.trim() !== "" && field.disabled == false
      );
      // Create object with filled fields
      const userData = {};
      filledFields.forEach((field) => {
        if (field.name === "hire_date") {
          userData[field.name] = format({
            date: field.value,
            format: "YYYY-MM-DD",
          });
          return;
        }
        userData[field.name] = field.value.trim();
      });
      console.log("userData: ", userData);

      //updateAndRelocate invocates updateUser() and reloads user page with the updated user in it.
      updateAndRelocate(userData);
    });

    async function updateUser(userData) {
      try {
        const role = await getRole(userData.role_id);
        if (!role) {
          alert("role not found");
          window.location.href = `/api/admins/update-user/${userId}`;
        }

        let response;

        if (role.data.name === "admin" || role.data.name === "basic_user") {
          response = await fetch(`http://localhost:3001/api/users/${userId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
        } else if (role.data.name === "manager") {
          response = await fetch(
            `http://localhost:3001/api/managers/${userId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
        } else if (role.data.name === "employee") {
          response = await fetch(
            `http://localhost:3001/api/employees/${userId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );
        }
        const updatedUser = await response.json();
        return updatedUser ? updatedUser : null;
      } catch (error) {
        console.error("Updating user error:", error);
        throw error;
      }
    }

    async function updateAndRelocate(userData) {
      try {
        const user = await updateUser(userData);
        if (user) {
          window.location.href = "/api/admins/users";
        } else {
          alert("Error updating user");
          window.location.href = "/api/admins/update-user";
        }
      } catch (error) {
        console.error("recolate error: ", error.message);
      }
    }
  }

  //############################# More info #########################################

  // Cierra la ventana emergente al hacer clic en ✖
  if (popupsClose) {
    handlePopupsClose()
  }

  //Show "more information" button only if employee or manager
  if (btnsMoreInfo) {
    (async () => await showMoreInfoButtons())();
  }
});
