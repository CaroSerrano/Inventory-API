async function logout() {
  try {
    await fetch("http://localhost:3001/api/sessions/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    alert("Successfully logged out");
  } catch (error) {
    alert("An error ocurred: ", error.message);
    console.error("Log out error: ", error);
    window.location.href = "#";
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("admin DOM completamente cargado");
  const logoutbtn = document.querySelector("#logout");

  if (logoutbtn) {
    logoutbtn.addEventListener("click", async (event) => {
      event.preventDefault();
      const confirmation = confirm("Are you sure you want to log out?");
      if (confirmation) {
        await logout();
        window.location.href = "/api";
      }
    });
  }
});

const adminMenu = document.querySelector(".dropbtn");
  const dropdownContent = document.querySelector(".dropdown-content")
  if(adminMenu){
    adminMenu.addEventListener("click", function (event) {
      dropdownContent.classList.toggle("show");
    })
    // Cierra el menú si se hace clic fuera de él
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        const openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
        }
      }
    }
  };
  }
