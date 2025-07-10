/**
 * This is a Node.js server that acts as a bridge between your batch file
 * and a web page. The batch file POSTs a script and username to the server,
 * and the web page GETs them to update the display.
 */

// --- 1. SETUP ---
const express = require('express');
const path = require('path');
const cors = require('cors'); // Import the CORS middleware
const app = express();

// The port the server will run on.
const PORT = 8080;

// This object will act as in-memory storage for the user actions (script + username).
// It stores an array of actions for each gameId.
let userActions = {};

// --- 2. MIDDLEWARE ---
// Enable CORS for all routes
app.use(cors());

// This serves static files (like index.html, style.css) from the root directory.
app.use(express.static(__dirname));

// This parses the JSON data sent by the batch file's `curl` command.
app.use(express.json());


// --- 3. API ENDPOINTS ---

/**
 * POST /key/:id
 * LISTENS for requests from your BATCH SCRIPT.
 * When the batch file sends a script and username, this endpoint stores them.
 */
app.post('/key/:id', (req, res) => {
    const gameId = req.params.id;
    const { username, script } = req.body;

    // Basic validation
    if (!gameId) {
        return res.status(400).send('Error: No Game ID was specified.');
    }
    if (!script || !username) {
        console.error("Request received, but 'script' or 'username' was not found.");
        return res.status(400).send("Error: Request body must contain 'script' and 'username' fields.");
    }

    // If no actions are stored for this gameId yet, initialize an empty array.
    if (!userActions[gameId]) {
        userActions[gameId] = [];
    }

    // Store the new action (username and script).
    userActions[gameId].push({ username, script });

    // Log to the server console to confirm receipt.
    console.log("========================================");
    console.log(`✅ Action Received & Stored for gameID: ${gameId}`);
    console.log(`   Username: ${username}`);
    console.log(`   Script: ${script}`);
    console.log("========================================");

    // Send a success message back to the batch file.
    res.status(200).send({ message: 'Action stored successfully. Awaiting fetch.' });
});


/**
 * GET /key/:id
 * LISTENS for requests from your WEB PAGE.
 * When the web page asks for actions, this endpoint sends the list
 * and then immediately clears it to prevent re-processing.
 */
app.get('/key/:id', (req, res) => {
    const gameId = req.params.id;
    const actions = userActions[gameId] || [];

    if (actions.length > 0) {
        // Send the list of actions to the web page.
        res.json(actions);

        // Clear the actions for this gameId after they've been fetched.
        delete userActions[gameId];

        console.log(`\n✅ ${actions.length} action(s) for gameID ${gameId} were fetched and have been cleared.\n`);
    } else {
        // No actions are waiting. Send back an empty array.
        res.json([]);
    }
});


// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log("Waiting for requests from your batch tool and web page...");
});