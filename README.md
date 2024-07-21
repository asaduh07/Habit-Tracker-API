# Habit Tracker API

## Overview

The Habit Tracker API is a RESTful service that allows users to manage their habits. Users can create, read, update, and delete habits, track their progress, and manage their favorite habits.

## Features

- **Habit Management**: Create, update, and delete habits.
- **Scheduling**: Set and update schedules for habits.
- **Favorite Habits**: Mark habits as favorite.
- **Progress Tracking**: Track the streak and progress of habits.
- **User Authentication**: Sign up, sign in, and manage user profiles.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (for database)

### Installation

1. **Clone the repository:**

   git clone https://github.com/your-username/habit-tracker-api.git
   cd habit-tracker-api
2. **Install dependencies:** 
npm install

3. **Set up environment variables:**

Create a .env file in the root directory and add the following environment variables:


PORT=3100
DB_URL=mongodb://localhost:27017/habit-tracker
JWT_SECRET=your-key

4. **Run the application:**
npm start

## Contributing
Contributions are welcome! Please follow the contributing guidelines for details on how to contribute to this project.

## License
This project is licensed under the MIT License - see the LICENSE file for details.