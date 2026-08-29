require("dotenv").config();

const app = require("./app");
const dbConnection = require("./config/db");

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await dbConnection;

        app.listen(port, () => {
            console.log("Server running on", port);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();