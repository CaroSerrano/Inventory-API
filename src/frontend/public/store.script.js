//Get geographic coordinates from store adress
async function getCoordinates(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await response.json();
    if (data.length > 0) {
      const coordinates = {
        lat: data[0].lat,
        lng: data[0].lon,
      };
      return coordinates;
    } else {
      console.log("No results found");
    }
  } catch (error) {
    console.error(error);
  }
}
let currentMap = null;
//Leaflet api configuration for displaying maps
function initMap(coordinates, popup) {
  try {
    // Create new map container to avoid Leaflet conflicts.
    const mapContainer = document.createElement("div");
    mapContainer.id = "map";
    mapContainer.style.width = "100%";
    mapContainer.style.height = "300px";

    // Insert container in corresponding popup
    const popupMapContainer = popup.querySelector(".popup-map-container");
    popupMapContainer.innerHTML = ""; // Clean previous container
    popupMapContainer.appendChild(mapContainer);
    let map = L.map(mapContainer).setView(coordinates, 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    L.marker(coordinates).addTo(map);
    return map
  } catch (error) {
    console.error("Error initializing map: ", error);
    
  }
}

function removeMap() {  
  if(currentMap){
    currentMap.remove()
    // Reinitialize map container
    const mapContainer = document.getElementById("map");
    if (mapContainer) {
      mapContainer.innerHTML = "";
    }
    currentMap = null;
  }
}

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
        removeMap();
      });
    });
  });
  
}
async function showPopup(clickedBtn) {
  const popups = document.querySelectorAll(".popup");
  // Find the popup corresponding to the clicked button
  const popup = Array.from(popups).find(
    (popup) =>
      popup.getAttribute("data-store-id") === clickedBtn.getAttribute("data-store-id") &&
      popup.getAttribute("data-store-address") === clickedBtn.getAttribute("data-store-address")
  );
  if (popup) {
    const address = popup.getAttribute("data-store-address");
    const coordinates = await getCoordinates(address);

    if (coordinates) {
      removeMap(); // Remove previous map if exists
      // Show popup
      popup.style.visibility = "visible";
      popup.style.opacity = "1";
      popup.style.pointerEvents = "auto";
      //Create new map
      currentMap = initMap(coordinates, popup);

      popup.querySelector("#popup-close").focus();

    }
  }
}

async function deleteStore(storeId) {
  try {
    await fetch(`http://localhost:3001/api/stores/${storeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Deleting store error:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", () => {  
  const stores_container = document.querySelector(".table-container");
  if (stores_container) {
    stores_container.addEventListener("click", async function (event) {
      if (event.target.classList.contains("delete_store")) {
        const storeId = event.target.getAttribute("data-store-id");

        const confirmation = confirm(`Delete store?`);
        if (confirmation) {
          try {
            await deleteStore(storeId);
            window.location.href = "/api/admins/stores";
          } catch (error) {
            console.error("Deleting store error:", error);
          }
        }
      }
      if(event.target.closest(".view-on-map")){
        const btnViewOnMap = event.target;
        try {
          await showPopup(btnViewOnMap);
          handlePopupsClose()
          
        } catch (error) {
          console.error("error en showPopup o handlePopupClose", error);
        }
      }
    });
  }
});
