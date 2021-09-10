## About The Project
This is a simple POS that I created for my Free Company in Final Fantasy XIV to address their roleplaying needs. Roleplaying should be more fun and engaging and less like work, so having a tool to keep track of menu items and customer orders makes it easy for anyone to participate without the need of manually keeping track of orders and calculating totals.

### Built With
* [Node](https://nodejs.org/en/)
* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Bootstrap](https://getbootstrap.com/)

## Getting Started
To get a local copy up and running, follow these steps.

### Prerequisites
* npm
  ```
  npm install -g npm@latest
  ```
* yarn
  ```
  npm install -g yarn
  ```
* Follow instructions [here](https://docs.mongodb.com/manual/installation/) to install and set up MongoDB.

### Installation
  1. Clone the repo
    ```
    git clone https://github.com/keihsu/Faerie-Cafe-Simple-POS.git
    ```
  2. Navigate to the `Faerie-Cafe-Server` directory
  3. Install Packages
    ```
    yarn install
    ```
  4. Modify `example.env` with your MongoDB credentials and the desired port for the server to listen on and rename the file to `.env`
  5. Navigate to the `Faerie-Cafe` directory
  6. Install Packages
    ```
    yarn install
    ```
  7. Navigate to `src/config/config.example.js` and modify `API_URL` with the port the server will be running on and rename the file to `config.js`

## Usage
  To run the POS, navigate to the `Faerie-Cafe-Server` directory and run the command:
  ```
  yarn start
  ```
  then navigate to the `Faerie-Cafe` directory and run the command:
  ```
  yarn start
  ```
  You can access the POS by opening http://localhost/{PORT} in your browser.