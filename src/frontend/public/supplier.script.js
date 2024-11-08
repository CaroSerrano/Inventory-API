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

async function createSupplier(supplierData) {
  try {
    let response = await fetch(`http://localhost:3001/api/suppliers`, {
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

async function deleteSupplier(supplierId) {
  try {
    await fetch(`http://localhost:3001/api/suppliers/${supplierId}`, {
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
      if (event.target.classList.contains(".update_supplier")) {
        const clickedbtn = event.target;
        try {
          await showPopup(clickedbtn);
          handlePopupsClose();
        } catch (error) {
          console.error("error en showPopup o handlePopupClose", error);
        }
      }
    });
  }

  //############################# Create supplier #########################################
  const uploadSupplier = document.querySelector(".uploadSupplier");

  if (uploadSupplier) {
    uploadSupplier.addEventListener("submit", async function (event) {
      event.preventDefault();
      const clickedbtn = event.target;
      try {
        await showPopup(clickedbtn);
        handlePopupsClose();
      } catch (error) {
        console.error("error en showPopup o handlePopupClose", error);
      }
      const fields = Array.from(form.querySelectorAll("input, select"));
      const storeData = {};
      let number;
      let street;
      let city;
      fields.forEach((field) => {
        if (field.name === "street") {
          street = field.value;
          return;
        }
        if (field.name === "number") {
          number = field.value;
          return;
        }
        if (field.name === "city") {
          city = field.value;
          return;
        }
        storeData[field.name] = field.value.trim();
      });
      storeData["address"] = number + " " + street + ", " + city;
      console.log("storeData en createStore: ", storeData);
      // Relocate invocates createSupplier() and reloads suppliers page with the new supplier in it.
      relocate(storeData);
    });
  }

  //############################# Update supplier #########################################
  const updateForm = document.getElementById("updateStoreForm");
  if (updateForm) {
    const storeId = updateForm.getAttribute("data-store-id");
    const updateAddress = document.getElementById("updateAddress");
    const streetField = document.getElementById("streetField");
    const numberField = document.getElementById("numberField");
    const cityField = document.getElementById("cityField");

    updateForm.addEventListener("change", () => {
      if (updateAddress.checked) {
        streetField.disabled = false;
        numberField.disabled = false;
        cityField.disabled = false;
      }
      if (!updateAddress.checked) {
        streetField.disabled = true;
        numberField.disabled = true;
        cityField.disabled = true;
      }
    });

    updateForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const fields = updateForm.querySelectorAll("input, select");
      //Filter empty fields
      const filledFields = Array.from(fields).filter(
        (field) => field.value.trim() !== ""
      );
      // Create object with filled fields
      const storeData = {};
      let number;
      let street;
      let city;
      filledFields.forEach((field) => {
        if (field.name === "street") {
          street = field.value;
          return;
        }
        if (field.name === "number") {
          number = field.value;
          return;
        }
        if (field.name === "city") {
          city = field.value;
          return;
        }
        storeData[field.name] = field.value.trim();
      });
      if (number != "" && street != "" && city != "")
        storeData["address"] = number + " " + street + ", " + city;
      console.log("storeData: ", storeData);

      //updateAndRelocate invocates updateStore() and reloads user page with the updated store in it.
      updateAndRelocate(storeData);
    });

    async function updateStore(storeData) {
      try {
        let response = await fetch(
          `http://localhost:3001/api/stores/${storeId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(storeData),
          }
        );
        const updatedStore = await response.json();
        return updatedStore ? updatedStore : null;
      } catch (error) {
        console.error("Updating store error:", error);
        throw error;
      }
    }

    async function updateAndRelocate(storeData) {
      try {
        const store = await updateStore(storeData);
        if (store) {
          window.location.href = "/api/admins/stores";
        } else {
          alert("Error updating store");
          window.location.href = "/api/admins/update-store";
        }
      } catch (error) {
        console.error("recolate error: ", error.message);
      }
    }
  }
});
