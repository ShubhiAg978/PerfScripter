# API Scripter

API Scripter is a powerful tool designed to automate the generation of performance testing scripts for APIs. By taking a CSV input that specifies API details and correlations, API Scripter outputs ready-to-use scripts for JMeter (JMX), Scala (Gatling), and K6, simplifying and streamlining your performance testing process.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Features](#features)

## Prerequisites

Before running API Scripter, make sure your system meets the following requirements:

- **Node.js**: Install the latest version of [Node.js](https://nodejs.org) to run the backend and frontend applications.
- **npm**: Ensure that `npm` (Node Package Manager) is installed for dependency management.

## Getting Started

To get started with API Scripter, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/ShubhiAg978/PerfScripter.git
   ```

2. **Navigate to the cloned directory**:

   ```bash
   cd PerfScripter
   ```

3. **Install dependencies for both the backend and frontend**:

   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

## Usage

To run the API Scripter, use the following commands:

1. **Run the application**:

   To concurrently start both the backend server and the frontend (which includes a Material-UI interface), execute:

   ```bash
   npm run dev
   ```

   This command will run both components and give you access to the API script generation interface in your browser.

2. **Navigate to the application**:

   Open your browser and visit:

   ```
   http://localhost:8000
   ```

   This will display the frontend interface for API Scripter where you can upload CSV files, manage API scripts, and more.

## Features

- **CSV Input Processing**: API Scripter reads and processes CSV files that include detailed API specifications (e.g., endpoint URLs, methods, headers, and parameters), ensuring quick and easy script generation.
- **Multi-Tool Script Generation**: Generate performance testing scripts for industry-standard tools like:

  - JMeter (JMX)
  - Scala (Gatling)
  - K6

- **User Authentication**: API Scripter includes a secure registration and login system using JSON Web Tokens (JWT) for session management and `bcrypt` for password hashing.

- **Material-UI Interface**: A responsive frontend built using Material-UI for an intuitive and modern user experience, allowing users to upload CSV files, view generated scripts, and manage settings.

- **Scalability and Modularity**: The application is designed to scale, with a modular architecture that makes it easy to extend functionality or integrate additional performance testing tools.

## Demo Video

https://github.com/user-attachments/assets/f6a9f174-f27f-4377-b3b0-d8f40cc69aa9


