const baseUrl = 'http://localhost:8080/api/categories';

// Function to handle popup closing
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

async function showPopup(clickedBtn) {
  const popups = document.querySelectorAll(".popup");
  // Find the popup corresponding to the clicked button
  const popup = Array.from(popups).find(
    (popup) =>
      popup.getAttribute("data-category-id") ===
      clickedBtn.getAttribute("data-category-id")
  );
  
  if (popup) {
    // Show popup
    popup.style.visibility = "visible";
    popup.style.opacity = "1";
    popup.style.pointerEvents = "auto";

    popup.querySelector("#popup-close").focus();
  }
}
async function relocate(categoryData) {
  
  try {
    const category = await createCategory(categoryData);
    if (category) {
      window.location.href = "/api/admins/categories";
    } else {
      alert("Error creating category");
      window.location.href = "/api/admins/categories";
    }
  } catch (error) {
    console.error("recolate error: ", error.message);
  }
}

async function createCategory(categoryData) {
  try {    
    let response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (response.ok) {
      const newCategory = await response.json();
      return newCategory ? newCategory : null;
    } else {
      alert("Error creating category: ", response.statusText);
      console.log("Error creating category: ", response);
      return;
    }
  } catch (error) {
    console.error("Creating category error:", error);
    throw error;
  }
}

//############################# Update category #########################################
async function updateCategory(categoryId , categoryData) {
    try {
      let response = await fetch(
        `${baseUrl}/${categoryId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        }
      );
      const updatedCategory = await response.json();
      return updatedCategory ? updatedCategory : null;
    } catch (error) {
      console.error("Updating category error:", error);
      throw error;
    }
}

async function updateAndRelocate(categoryId, categoryData) {
    try {
      const category = await updateCategory(categoryId, categoryData);
      if (category) {
        window.location.href = "/api/admins/categories";
      } else {
        alert("Error updating category");
        window.location.href = "/api/admins/update-category";
      }
    } catch (error) {
      console.error("recolate error: ", error.message);
    }
}

async function deleteCategory(categoryId) {
  try {
    await fetch(`${baseUrl}/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Deleting category error:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("categoryDOM completamente cargado");
  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    filterForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(filterForm);
      const queryString = new URLSearchParams(formData).toString();
      const response = await fetch(`/api/admins/categories?${queryString}`, {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      
      if (!response.ok) {
        // Manejo de errores si la respuesta no es correcta
        console.error("Error fetching categories: ", response.statusText);
        return;
      }
      const html = await response.text();
      document.querySelector(".categories-container").innerHTML = html;
    });
  }
  const categories_container = document.querySelector(".categories-container");
  if (categories_container) {
    categories_container.addEventListener("click", async function (event) {
      
      if (event.target.classList.contains("delete_category")) {
        const categoryID = event.target.getAttribute("data-category-id");
        
        const confirmation = confirm(`Delete category?`);
        if (confirmation) {
          try {
            await deleteCategory(categoryID);
            window.location.href = "/api/admins/categories";
          } catch (error) {
            console.error("Deleting category error:", error);
          }
        }
      }
      if (event.target.classList.contains("update_category")) {
        let clickedbtn = event.target;
        try {
          await showPopup(clickedbtn);
          handlePopupsClose();
        } catch (error) {
          console.error("error en showPopup o handlePopupClose", error);
        }
      }
      if (event.target.classList.contains("send-data")) {
        let clickedbtn = event.target;
        let visiblePopup;
        document.querySelectorAll(".popup").forEach((popup) => {
          if(popup.style.visibility === 'visible') {
            visiblePopup = popup;
          }
        })
        const categoryName = visiblePopup.querySelector("#name").value
        const categoryData = {
          name: categoryName.trim()
        };
        
        try {
          if(clickedbtn.textContent === "Add category"){
            await relocate(categoryData);
          }
          if(clickedbtn.textContent === "Update category"){
            const categoryId = visiblePopup.getAttribute("data-category-id")
            await updateAndRelocate(categoryId, categoryData);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  //############################# Create category #########################################
  const uploadCategory = document.querySelector(".add-category");

  if (uploadCategory) {
    uploadCategory.addEventListener("click", async function (event) {
      let clickedbtn = event.target;
      
      try {
        await showPopup(clickedbtn);
        handlePopupsClose();
      } catch (error) {
        console.error("error en showPopup o handlePopupClose", error);
      }
    });
  }
});
