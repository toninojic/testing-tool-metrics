# tt-node-service

This is a tracking Node.js microservice for A/B testing metrics. The project utilizes the Express framework for routing, Redis for fast in-memory storage of metrics, and MongoDB for persistent storage. A built-in cron job flushes data from Redis to MongoDB every 5 minutes to ensure data persistence without overloading the database.

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 22.0 or later)
- [npm](https://www.npmjs.com/) (version 9.x or later)

### Installation

1. **Clone the Repository**  
   Clone the project repository to your local machine and navigate to the project directory.

2. **Install Dependencies**  
   Run the following command to install all required dependencies:
   ```shell
   npm install
    This command installs all packages listed in the package-lock.json file into the local node_modules folder. The .env.example file serves as a template for creating your own .env file.

### Configuration
    Create a .env file in the root of the project (based on the provided .env.example) and configure the following environment variables:

     * MongoDB connection string
     * Redis configuration
     * Other service-specific settings
     * Development
     * To start the development server,npm run nodemon:

### Routes
    The following endpoints are available:

     * /track
        Description: Receives tracking data (clientName, testID, variation) and increments the in-memory Redis counter.
        Access: Only accessible through the AC VPN or designated IP.

    * /get-metric
        Description:Retrieves the persisted metrics from MongoDB for a given client.

### New Features & Changes
    Redis Buffering:
    Metrics are first stored in Redis for fast in-memory counting. This minimizes database writes during high traffic.

    MongoDB Persistence:
    Every 1 minutes, a cron job flushes all Redis counters to MongoDB collections (one per client) and clears Redis keys.

    Scalable Cron Job Structure:    
    All scheduled jobs are centrally managed through a scheduleCronJob function, making it easy to add or modify cron jobs.

    Dynamic Collection Structure:
    Metrics are stored in MongoDB in collections named after the client (e.g., testingapp). Each document summarizes test variation counts.

    Improved Error Handling and Logging:
    The service includes enhanced logging for tracking, flushing, and error events to aid in monitoring and debugging.