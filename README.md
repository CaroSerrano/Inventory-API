# INVENTORY API <!-- omit in toc -->
- [Project description](#project-description)
- [Used technologies](#used-technologies)
- [Relational model](#relational-model)
- [Dev information](#dev-information)

## Project description

This is a RESTful API designed to manage store inventory. It allows users to register with different roles (Admin, Manager, Employee, User) and uses JSON Web Tokens (JWT) for authentication.
    
Depending on the role, you can:
   1. Administrator (Admin):

Has full acces to all functionality. Can create, update and delete products, categories and suppliers.
Manages users, assigns roles and has control over all data in the system.

   2. Manager:

Has access to all inventory operations, but cannot manage users or modify roles.
Can view, add, edit, and delete products and manage inventory.
Can generate inventory reports. 

   3. Employee:

Can view and update inventory.
Can add new products, but cannot delete them.
Has no access to user management or system settings.

   4. Basic User:

Has only permissions to view products in inventory.
Cannot add, edit, or delete any records.

## Used technologies
**Node.js:**  as the runtime environment for building the server-side application.

**Express JS:** to create the RESTful API, providing a robust set of features for routing and middleware handling.

**MySQL:** as the database engine for storing and managing the inventory data.

**Sequelize:** was the chosen ORM to facilitate de database management, allowing easy interaction with MySQL using JavaScript.

**JWT (JSON Web Tokens):** used for authentication, enabling secure token-based user sessions across the application.

## Relational model

![Relational Model](img\inventory_api_relational_model.png)

## Dev information

*Example for request body to delete many products:*

```json
{
  "filter": {
    "category_id": 1
  }
}
```

*Example for request body to update a product:*

```json
{
  "data": {
    "unit_price": 10000
  }
}
```

*Example for request body to create a product:*

```json
{
  "category_id": 1,
  "supplier_id": 3,
  "name": "Notebook",
  "description": "Optional description of the product",
  "unit_price": 950000
}
```