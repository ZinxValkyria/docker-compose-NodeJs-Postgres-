# Node.js and PostgreSQL Docker Compose Project

This project sets up a simple Node.js application with a PostgreSQL database using Docker Compose. The PostgreSQL database is hosted on ElephantSQL, and the Node.js application connects to it using a connection string.

## Prerequisites

- Docker
- Docker Compose
- Node.js
- An ElephantSQL account

## Project Structure

my-project/
│
├── backend/
│ ├── Dockerfile
│ ├── package.json
│ ├── package-lock.json
│ └── server.js
│
├── docker-compose.yml
└── .env

bash


## Setup

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
   cd my-project

    Create a .env file in the root of the project directory and add your ElephantSQL connection string:

    env

DATABASE_URL=postgres://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>

Replace <USERNAME>, <PASSWORD>, <HOST>, <PORT>, and <DATABASE> with your actual ElephantSQL credentials.

Build and start the Docker containers:

sh

    docker-compose up --build

    Access the application:

    Open your browser and go to http://localhost:3000. You should see a welcome message and the current database time.

API Endpoints
1. Create a Table

    URL: /create-table
    Method: POST
    Body: (JSON)

    json

    {
      "tableName": "my_table",
      "columns": [
        { "name": "name", "type": "TEXT" },
        { "name": "age", "type": "INT" }
      ]
    }

2. Insert Data

    URL: /insert-data
    Method: POST
    Body: (JSON)

    json

    {
      "tableName": "my_table",
      "data": {
        "name": "John Doe",
        "age": 30
      }
    }

3. View Tables and Data

    URL: /tables
    Method: GET
    Description: Displays all tables and their data in an HTML format.

Example Usage with Postman

    Create a Table:
        URL: http://localhost:3000/create-table
        Method: POST
        Body: (JSON)

        json

    {
      "tableName": "my_table",
      "columns": [
        { "name": "name", "type": "TEXT" },
        { "name": "age", "type": "INT" }
      ]
    }

Insert Data:

    URL: http://localhost:3000/insert-data
    Method: POST
    Body: (JSON)

    json

        {
          "tableName": "my_table",
          "data": {
            "name": "John Doe",
            "age": 30
          }
        }

    View Tables and Data:
        URL: http://localhost:3000/tables
        Method: GET
        Description: This will display all tables and their data in an HTML format.

Cleaning Up

To stop and remove the Docker containers, run:

sh

docker-compose down

License

This project is licensed under the MIT License.

css


You can save this content in a file named `README.md` in your project directory.
