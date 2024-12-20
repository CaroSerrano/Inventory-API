const baseUrl = 'http://localhost:8080/api/suppliers';

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
      popup.getAttribute("data-supplier-id") ===
      clickedBtn.getAttribute("data-supplier-id")
  );
  
  if (popup) {
    // Show popup
    popup.style.visibility = "visible";
    popup.style.opacity = "1";
    popup.style.pointerEvents = "auto";

    popup.querySelector("#popup-close").focus();
  }
}
async function relocate(supplierData) {  
  try {
    const supplier = await createSupplier(supplierData);
    if (supplier) {
      window.location.href = "/api/admins/suppliers";
    } else {
      alert("Error creating supplier");
      window.location.href = "/api/admins/suppliers";
    }
  } catch (error) {
    console.error("recolate error: ", error.message);
  }
}

async function createSupplier(supplierData) {
  try {    
    let response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplierData),
    });

    if (response.ok) {
      const newSupplier = await response.json();
      return newSupplier ? newSupplier : null;
    } else {
      alert("Error creating supplier: ", response.statusText);
      console.log("Error creating supplier: ", response);
      return;
    }
  } catch (error) {
    console.error("Creating supplier error:", error);
    throw error;
  }
}

//############################# Update supplier #########################################
async function updateSupplier(supplierId , supplierData) {
    try {
      let response = await fetch(
        `${baseUrl}/${supplierId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(supplierData),
        }
      );
      const updatedSupplier = await response.json();
      return updatedSupplier ? updatedSupplier : null;
    } catch (error) {
      console.error("Updating supplier error:", error);
      throw error;
    }
}

async function updateAndRelocate(supplierId, supplierData) {
    try {
      const supplier = await updateSupplier(supplierId, supplierData);
      if (supplier) {
        window.location.href = "/api/admins/suppliers";
      } else {
        alert("Error updating supplier");
        window.location.href = "/api/admins/update-supplier";
      }
    } catch (error) {
      console.error("recolate error: ", error.message);
    }
}

async function deleteSupplier(supplierId) {
  try {
    await fetch(`${baseUrl}/${supplierId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Deleting supplier error:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("SupplierDOM completamente cargado");
  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    filterForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(filterForm);
      const queryString = new URLSearchParams(formData).toString();
      const response = await fetch(`/api/admins/suppliers?${queryString}`, {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (!response.ok) {
        // Manejo de errores si la respuesta no es correcta
        console.error("Error fetching suppliers: ", response.statusText);
        return;
      }
      const html = await response.text();
      document.querySelector(".suppliers-container").innerHTML = html;
    });
  }
  const suppliers_container = document.querySelector(".suppliers-container");
  if (suppliers_container) {
    suppliers_container.addEventListener("click", async function (event) {   
      if (event.target.classList.contains("delete_supplier")) {
        const supplierID = event.target.getAttribute("data-supplier-id");        
        const confirmation = confirm(`Delete supplier?`);
        if (confirmation) {
          try {
            await deleteSupplier(supplierID);
            window.location.href = "/api/admins/suppliers";
          } catch (error) {
            console.error("Deleting supplier error:", error);
          }
        }
      }
      if (event.target.classList.contains("update_supplier")) {
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
        const supplierName = visiblePopup.querySelector("#name").value
        const supplierData = {
          name: supplierName.trim()
        };
        
        try {
          if(clickedbtn.textContent === "Add supplier"){
            await relocate(supplierData);
          }
          if(clickedbtn.textContent === "Update supplier"){
            const supplierId = visiblePopup.getAttribute("data-supplier-id")
            await updateAndRelocate(supplierId, supplierData);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  //############################# Create supplier #########################################
  const uploadSupplier = document.querySelector(".add-supplier");

  if (uploadSupplier) {
    uploadSupplier.addEventListener("click", async function (event) {
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
