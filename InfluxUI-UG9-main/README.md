# InfluxDB No-Code Solution

## Project Overview
This project aims to develop a user-friendly, no-code interface for InfluxDB, simplifying the process of querying and trending data for users without programming expertise. The tool will also integrate with Grafana, enabling users to save and edit displays.

## Prerequisites
Before you begin, ensure you have the following installed on your system:
- Git
- A text editor (e.g., Visual Studio Code, Sublime Text)

## Setting Up Your Development Environment

### 1. Install Node.js and npm
Node.js is essential for running and developing this project. npm (Node Package Manager) comes bundled with Node.js.

1. Visit the [official Node.js website](https://nodejs.org/).
2. Download the LTS (Long Term Support) version recommended for most users.
3. Run the installer and follow the installation wizard.
4. To verify the installation, open a terminal/command prompt and run:
   ```
   node --version
   npm --version
   ```
   You should see version numbers if the installation was successful.

### 2. Clone the GitHub Repository
1. Open a terminal/command prompt.
2. Navigate to the directory where you want to store the project.
3. Run the following command:
   ```
   git clone https://github.cs.adelaide.edu.au/INFLUXUI-ATYSYS/InfluxUI-UG9.git
   ```
4. Navigate into the project directory:
   ```
   cd InfluxUI-UG9
   ```

### 3. Install Project Dependencies
In the project directory, run:
```
npm install
```
This command installs all necessary dependencies defined in the `package.json` file.

### 4. Start the Server
To start the development server, run:
```
npm start
```
You should see a message indicating which port the server is running on (typically http://localhost:8080).

Alternatively, you can run the server in development mode using this command:
```
npm run dev
```
This command automatically restarts the server when a code modification is detected, thus avoiding the trouble of repeatedly restarting the server during development.

## Managing the GitHub Repository
- To get the latest changes from the repository:
  ```
  git pull origin main
  ```
- To create a new branch for your feature/bugfix:
  ```
  git checkout -b your-branch-name
  ```
- To push your changes:
  ```
  git add .
  git commit -m "Your commit message"
  git push origin your-branch-name
  ```

## Project Structure
(Briefly describe the main directories and files in your project)

## Available Scripts
- `npm start`: Starts the development server