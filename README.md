# Inventory-API 🐱<!-- omit in toc -->
- [Project description](#project-description)
- [Used technologies](#used-technologies)
- [Relational model](#relational-model)

## Project description

This is a personal project created to showcase proficiency in various software development tools, with a particular focus on backend technologies. It features an API designed to manage a store's inventory. It allows users to register with different roles (Admin, Manager, Employee, Basic User) and uses JSON Web Tokens (JWT) for authentication.

A basic user interface was developed to facilitate the API test using templating engine.
    
Depending on the role, you can:
   1. Administrator (Admin):

Has full acces to all functionality. Can create, update and delete products, categories, suppliers and stores.
Manages users, assigns roles and has control over all data in the system.

   1. Manager:

Has access to all inventory operations, but cannot manage users or modify roles.
Can view, add, edit, and delete products and manage inventory. 

   1. Employee:

Can view and update inventory.
Can add new products, but cannot delete them.
Has no access to user management or system settings.

   1. Basic User:

Has only permissions to view products in inventory.
Cannot add, edit, or delete any records.

## Used technologies
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Pug](https://img.shields.io/badge/Pug-E3C29B?style=for-the-badge&logo=pug&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**NodeJs:**  as the runtime environment for building the server-side application.

**Express JS:** to create the RESTful API, providing a robust set of features for routing and middleware handling.

**MySQL:** as the database engine for storing and managing the inventory data.

**Sequelize:** was the chosen ORM to facilitate de database management, allowing easy interaction with MySQL using JavaScript.

**JWT (JSON Web Tokens):** used for authentication, enabling secure token-based user sessions across the application.

**PUG:** the templating engine used for developing user interface.

**Git:** used as a version control system to maintain a more organized record of the changes made to the application, applying the concept of conventional commits.

**Docker:** used to containerize the application along with Docker Compose to link it to the MySQL container and applying the concept of volumes to persist data.

## Relational model

![Relational Model](/src/frontend/public/inventory_api_relational_model.png)
