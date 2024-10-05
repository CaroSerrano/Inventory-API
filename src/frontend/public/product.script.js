document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado");
  //auxiliar function to validate that the category exists
  async function validateCategory(category) {
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
      console.log("Lo quue devuelve el fetch de category: ", CATEGORY);

      if (CATEGORY.error === false) {
        return CATEGORY.data.id;
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
  async function validateSupplier(supplier) {
    console.log("en validateSupplier");

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
        return SUPPLIER.data.id;
      } else {
        console.error(SUPPLIER.message);
        return null;
      }
    } catch (error) {
      console.error("Validate Supplier error:", error);
      throw error;
    }
  }
  const form = document.getElementById("createProductForm");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevenir que el formulario se envíe por defecto
      const inputs = form.querySelectorAll("input");
      const productData = {};
      inputs.forEach((input) => {
        productData[input.name] = input.value.trim();
      });

      // Relocate invocates createProduct() and reloads products page with the new product in it.
      relocate(productData);
    });

    async function createProduct(productData) {
      try {
        const category_id = await validateCategory(productData.category);
        console.log("Cateogory_id en createProduct: ", category_id);

        if (!category_id) {
          alert("Category not found");
          window.location.href = "/api/admins/create-product";
        }
        const supplier_id = await validateSupplier(productData.supplier);
        if (!supplier_id) {
          alert("Supplier not found");
          window.location.href = "/api/admins/create-product";
        }

        const bodyData = {
          name: productData.name,
          description: productData.description,
          unit_price: productData.unit_price,
          units_in_stock: productData.units_in_stock,
          category_id: category_id,
          supplier_id: supplier_id,
        };

        const response = await fetch(`http://localhost:3001/api/products`, {
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

  const updateForm = document.getElementById("updateProductForm"); //document es el html

  if (updateForm) {
    const productId = updateForm.getAttribute("data-product-id");
    updateForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevenir que el formulario se envíe por defecto

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
        if (productData.category) {
         let categoryId = await validateCategory(productData.category);

          if (!categoryId) {
            alert("Category not found");
            window.location.href = `/api/admins/update-product/${productId}`;
          }
        }

        if (productData.supplier) {
          let supplierId = await validateSupplier(productData.supplier);
          if (!supplierId) {
            alert("Supplier not found");
            window.location.href = `/api/admins/update-product/${productId}`;
          }
        }

        let bodyData = {};
        for(const key in productData){
          bodyData[key] = productData[key]
        }

        const response = await fetch(
          `http://localhost:3001/api/products/${productId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
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
