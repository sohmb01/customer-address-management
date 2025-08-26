***Technology Stack***
Frontend: React.js, Material-UI, Axios
Backend: Spring Boot, Spring Data JPA, Hibernate
Database: MySQL
Build Tools: Maven, npm

***Prerequisites***
Before running this application, ensure you have the following installed:
Java 17 or higher
Node.js
MySQL
Maven
Git

***Instructions to setup***
#Clone repository
1. In your terminal run "git clone <repository-url>"
2. Once cloned, run "cd customer-address-management"

#Create Database Schema
3. mysql -u <your_username> -p < db/create_schema.sql  
  if password required use - mysql -u <your_username> -p <your_password> < db/create_schema.sql

  If you want to add sample dummy data - mysql -u <your_username> -p <your_password> < db/insert_dummy_data.sql

#Install dependencies and start java spring boot backend
4. Go into backend directory - "cd backend"
5. Install dependencies using - "mvn clean install"
6. After installing dependencies, run the spring boot app using - "mvn spring-boot:run" or "mvn clean spring-boot:run" if fails. The backend should start running in few seconds on http://localhost:8080

#Install dependencies and start react frontend
7. In a new terminal window, go to the frontend directory under the main project. i.e - cd customer-address-management/frontend
8. Install dependencies using - "npm install"
6. After installing dependencies, run the react app using - "npm start". The frontend should start running in few seconds on http://localhost:5173

