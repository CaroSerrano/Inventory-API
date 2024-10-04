document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado");
  const form = document.getElementById("createProductForm"); //document es el html

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevenir que el formulario se envíe por defecto

      // Obtener los valores de los campos del producto
      const nameInput = document.getElementById("nameField");
      const name = nameInput.value;
      const descriptionInput = document.getElementById("descriptionField");
      const description = descriptionInput.value;
      const unitPriceInput = document.getElementById("unitPriceField");
      const unitPrice = unitPriceInput.value;
      const stockInput = document.getElementById("stockField");
      const stock = stockInput.value;
      const categoryInput = document.getElementById("categoryField");
      const category = categoryInput.value;
      const supplierInput = document.getElementById("supplierField");
      const supplier = supplierInput.value;

      const productData = {
        name,
        description,
        unitPrice,
        stock,
        category,
        supplier
      }

      // Relocate invoca a createProduct() y luego recarga la página con el nuevo producto
      relocate(productData);
    });

    async function validateCategory(category) {
      console.log("en validateCategory");
      
      try {
        const categoryName = category.toLowerCase().trim();
        const response = await fetch(`http://localhost:3001/api/categories/name/${categoryName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            },
          }
        )
        const CATEGORY = await response.json();
        console.log("Lo quue devuelve el fetch de category: ",CATEGORY);
        
        if(CATEGORY.error === false){
          return CATEGORY.data.id;
        } 
        else {
          console.error(CATEGORY.message);
          return null
        }
      } catch (error) {
        console.error("Validate Category error:", error);
        throw error;
      }
    }

    async function validateSupplier(supplier) {
      console.log("en validateSupplier");
      
      try {
        const supplierName = supplier.toLowerCase().trim();
        const response = await fetch(`http://localhost:3001/api/suppliers/name/${supplierName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        const SUPPLIER = await response.json();
        if(SUPPLIER.error === false) {
          return SUPPLIER.data.id
        }else{
          console.error(SUPPLIER.message);
          return null
        }
         
      } catch (error) {
        console.error("Validate Supplier error:", error);
        throw error;
      }
    }

    async function createProduct(productData) {
      try {
        const category_id = await validateCategory(productData.category);
        console.log("Cateogory_id en createProduct: ",category_id);
        
        if(!category_id) {
          alert("Category not found");
          window.location.href = "/api/admins/create-product";
        }
        const supplier_id = await validateSupplier(productData.supplier);
        if(!supplier_id) {
          alert("Supplier not found");
          window.location.href = "/api/admins/create-product";
        }

        const bodyData = {
          name: productData.name,
          description: productData.description,
          unit_price: productData.unitPrice,
          units_in_stock: productData.stock,
          category_id,
          supplier_id
        }

        const response = await fetch(
          `http://localhost:3001/api/products`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );
        const newProduct = await response.json();
        return newProduct? newProduct : null;
      } catch (error) {
        console.error("Creating product error:", error);
        throw error;
      }
    }

    async function relocate(productData) {
      try {
        const product = await createProduct(productData)
        if(product){
          window.location.href = "/api/admins/products" ;
        } else{
          alert("Error creating product")
          window.location.href = "/api/admins/create-product";
        }
      } catch (error) {
        console.error("recolate error: ", error.message);
      }
    }
    
  } else {
    console.error("Formulary access failed");
  }
});
