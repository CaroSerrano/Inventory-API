const baseUrl = 'http://localhost:8080/api/products'

document.addEventListener("DOMContentLoaded", () => {
  console.log("Product DOM completamente cargado");
  //auxiliar function to validate that the category exists
  async function getCategory(category) {
    console.log("en validateCategory");

    try {
      const categoryName = category.toLowerCase().trim();
      const response = await fetch(
        `http://localhost:3001/api/categories/name/${categoryName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const CATEGORY = await response.json();

      if (CATEGORY.error === false) {
        return CATEGORY;
      } else {
        console.error(CATEGORY.message);
        return null;
      }
    } catch (error) {
      console.error("Validate Category error:", error);
      throw error;
    }
  }
  //auxiliar function to validate that the supplier exists
  async function getSupplier(supplier) {
    try {
      const supplierName = supplier.toLowerCase().trim();
      const response = await fetch(
        `http://localhost:3001/api/suppliers/name/${supplierName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const SUPPLIER = await response.json();
      if (SUPPLIER.error === false) {
        return SUPPLIER;
      } else {
        console.error(SUPPLIER.message);
        return null;
      }
    } catch (error) {
      console.error("Validate Supplier error:", error);
      throw error;
    }
  }

  async function deleteProduct(productId) {
    try {
      await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Deleting product error:", error);
      throw error;
    }
  }

  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    filterForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(filterForm);
      const queryString = new URLSearchParams(formData).toString();
      const response = await fetch(`/api/admins/products?${queryString}`, {
        method: "GET",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      if (!response.ok) {
        // Manejo de errores si la respuesta no es correcta
        console.error("Error fetching products: ", response.statusText);
        return;
      }
      const html = await response.text();
      document.querySelector(".product-container").innerHTML = html;
    });
  }

  const delete_product = document.getElementById("delete_product");
  if (delete_product) {
    delete_product.addEventListener("click", async function (event) {
      event.preventDefault();
      const productId = delete_product.getAttribute("data-product-id");
      let confirmation = confirm(`Delete product?`);
      if (confirmation) {
        try {
          await deleteProduct(productId);
          window.location.href = "/api/admins/products";
        } catch (error) {
          console.error("Deleting product error:", error);
          throw error;
        }
      }
    });
  }

  const form = document.getElementById("createProductForm");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const fields = form.querySelectorAll("input, select");
      const productData = {};
      fields.forEach((field) => {
        productData[field.name] = field.value.trim();
      });

      // Relocate invocates createProduct() and reloads products page with the new product in it.
      relocate(productData);
    });

    async function createProduct(productData) {
      try {
        const bodyData = {
          name: productData.name,
          description: productData.description,
          unit_price: productData.unit_price,
          units_in_stock: productData.units_in_stock,
          category_id: productData.category,
          supplier_id: productData.supplier,
        };

        const response = await fetch(baseUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });
        const newProduct = await response.json();
        return newProduct ? newProduct : null;
      } catch (error) {
        console.error("Creating product error:", error);
        throw error;
      }
    }

    async function relocate(productData) {
      try {
        const product = await createProduct(productData);
        if (product) {
          window.location.href = "/api/admins/products";
        } else {
          alert("Error creating product");
          window.location.href = "/api/admins/create-product";
        }
      } catch (error) {
        console.error("recolate error: ", error.message);
      }
    }
  }

  const updateForm = document.getElementById("updateProductForm");

  if (updateForm) {
    const productId = updateForm.getAttribute("data-product-id");
    updateForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const inputs = updateForm.querySelectorAll("input");
      //Filter empty inputs
      const filledInputs = Array.from(inputs).filter(
        (input) => input.value.trim() !== ""
      );
      // Create object with filled inputs
      const productData = {};
      filledInputs.forEach((input) => {
        productData[input.name] = input.value.trim();
      });

      //updateAndRelocate invocates updateProduct() and reloads products page with the updated product in it.
      updateAndRelocate(productData);
    });

    async function updateProduct(productData) {
      try {
        const response = await fetch(
          `${baseUrl}/${productId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
          }
        );
        const updatedProduct = await response.json();
        return updatedProduct ? updatedProduct : null;
      } catch (error) {
        console.error("Updating product error:", error);
        throw error;
      }
    }

    async function updateAndRelocate(productData) {
      try {
        const product = await updateProduct(productData);
        if (product) {
          window.location.href = "/api/admins/products";
        } else {
          alert("Error updating product");
          window.location.href = "/api/admins/update-product";
        }
      } catch (error) {
        console.error("recolate error: ", error.message);
      }
    }
  }
});
