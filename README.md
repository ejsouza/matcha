# Matcha

### How to build:
  Clone the project<br>
  cd in the new cloned repository<br>
  <br> Run docker in detached mode
  ```
  make build
  ```
  once the build is finished seed the data base: <br>
  ```
  make seed
  ```
  `(ps: if you get ECONNREFUSED error, the database is not ready to accept connection yet, wait a few seconds and try again)`
  <br><br>
  Once the seeder is finished point your browser to: 
  
  ```
  http://localhost:3000/
  ```
  You can also have access to the databse from:
  
  ```
  http://localhost:8080/?pgsql
  ```
  
  ## Development
  For speed during development the front is not being build with the docker compose,  you need to run:
 
  ```
  yarn start
  ```

