document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM completamente cargado");
    
    async function getRole(role) {    
        try {
          const response = await fetch(
            `http://localhost:3001/api/roles/${role}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const ROLE = await response.json();
          console.log("role en getRole: ", ROLE);
          
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
    };
  
    //############################# Filters #########################################
    const filterForm = document.getElementById('filter-form');
    if (filterForm){
      filterForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(filterForm);
        const queryString = new URLSearchParams(formData).toString();
        const response = await fetch(`/api/admins/users?${queryString}`, {
            method: 'GET',
            headers: {
              "X-Requested-With":"XMLHttpRequest"
            }
        });
        if (!response.ok) {
          // Manejo de errores si la respuesta no es correcta
          console.error("Error fetching users: ", response.statusText);
          return;
      }
        const html = await response.text();      
        document.querySelector('.users-container').innerHTML = html;
      });
    }
    
    
    //############################# Delete user #########################################
    async function deleteUser(userId, userRole) {
      try {
        const role = await getRole(userRole);
        if(role.data.name === "admin" || role.data.name === "basic_user"){
          await fetch(`http://localhost:3001/api/users/${userId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else if (role.data.name === "manager"){
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
  
    document.querySelector(".users-container").addEventListener("click", async function (event) {
        event.preventDefault();
        if (event.target.classList.contains('delete_user')) {
          const userId = event.target.getAttribute("data-user-id");
          const userRole = event.target.getAttribute("data-user-role");
          let confirmation = confirm(`Delete user?`);
          if (confirmation) {
            try {
              await deleteUser(userId, userRole);
              window.location.href = "/api/admins/users";
            } catch (error) {
              console.error("Deleting user error:", error);
              throw error;
            }
          }
        }
        
    })
    

    //############################# Enable fields by role #########################################
    const roleSelect = document.getElementById('roleField');
    const employeeFields = document.getElementById('employeeFields');
    const managerFields = document.getElementById('managerFields');
    if (roleSelect){      
      roleSelect.addEventListener('change', () => {        
        const selectedRole = roleSelect.options[roleSelect.selectedIndex].textContent        
  
        // Reset fields first
        resetFields();
  
        // Show and enable fields
        if (selectedRole === 'employee') {
          employeeFields.classList.remove('hidden');
          employeeFields.querySelector('#position').disabled = false;
          employeeFields.querySelector('#employeeHireDate').disabled = false;
          employeeFields.querySelector('#shiftSchedule').disabled = false;
          employeeFields.querySelector('#salary').disabled = false;
          employeeFields.querySelector('#manager').disabled = false;
          employeeFields.querySelector('#store').disabled = false;

        } else if (selectedRole === 'manager') {
          managerFields.classList.remove('hidden');
          managerFields.querySelector('#management_level').disabled = false;
          managerFields.querySelector('#managerHireDate').disabled = false;
        }
      }); 
  
      // Reset fields
      function resetFields() {
        employeeFields.classList.add('hidden');
        managerFields.classList.add('hidden');
  
        // Disabled fields
        employeeFields.querySelectorAll('input').disabled = true;
        employeeFields.querySelectorAll('select').disabled = true;
        managerFields.querySelectorAll('input').disabled = true;
        managerFields.querySelectorAll('select').disabled = true;
      }
    }
    
    
    //############################# Create User #########################################
    const form = document.getElementById("createUserForm");
  
    if (form) {
      
      form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const fields = form.querySelectorAll("input, select");
        const userData = {};
        fields.forEach((field) => {
            userData[field.name] = field.value.trim();
        });
        console.log("userData en createUser: ", userData);
        const role = await getRole(userData.role_id);
        if(role.data.name === "manager"){
          form.querySelector("button").formAction = "/api/managers"
        } else if (role.data.name === "employee"){
          form.querySelector("button").formAction = "/api/employees"
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
          
          if(role.data.name === "admin" || role.data.name === "basic_user"){
            response = await fetch(`http://localhost:3001/api/users`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            });
          } else if (role.data.name === "manager"){
            response = await fetch(`http://localhost:3001/api/managers`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            });
          } else if (role.data.name === "employee"){
            response = await fetch(`http://localhost:3001/api/employees`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            });
          }
          if(response.ok){
            const newUser = await response.json();
            return newUser ? newUser : null;
          } else {
            alert("Error creating user: ", response.statusText)
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
  
          if(role.data.name === "admin" || role.data.name === "basic_user") {
            response = await fetch(
              `http://localhost:3001/api/users/${userId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
              }
            );
          } else if(role.data.name === "manager") {
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
  });
  