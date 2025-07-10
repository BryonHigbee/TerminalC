/**
 * Node.js server to manage script execution for multiple users.
 * Each user is identified by a unique key to prevent conflicts.
 */

// --- 1. SETUP ---
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080; // The port the server will run on

// This object will store scripts, with each user's unique key pointing to their script.
// Example: { "user_key_1": { script: "print('hello')", username: "UserA" } }
let userScripts = {};

// --- 2. MIDDLEWARE ---
// This serves static files (like your index.html) from the same directory.
app.use(express.static(__dirname));
// This parses the JSON data sent from the batch file's `curl` command.
app.use(express.json());


// --- 3. API ENDPOINTS ---

/**
 * POST /execute
 * LISTENS for requests from your BATCH SCRIPT.
 * Associates a script with the specific user key that sent it.
 */
app.post('/execute', (req, res) => {
    // Expect a key, script, and username in the request body
    const { key, script, username } = req.body; 

    if (!key || !script || !username) {
        console.error("❗️ Received incomplete request. Body:", req.body);
        return res.status(400).send({ error: 'Request must include a key, script, and username.' });
    }

    // Store the script and username under the user's unique key.
    userScripts[key] = { script: script, username: username };

    console.log("========================================");
    console.log(`✅ Script stored for key: ${key} (User: ${username})`);
    console.log(`   Script: ${script}`);
    console.log("========================================");

    res.status(200).send({ message: 'Script stored successfully.' });
});

/**
 * GET /get-script/:key
 * LISTENS for requests from the WEB PAGE.
 * Fetches the script corresponding to the provided user key and then deletes it.
 */
app.get('/get-script/:key', (req, res) => {
    const { key } = req.params;
    const userData = userScripts[key];

    if (userData) {
        // A script was found for this key.
        const { script, username } = userData;
        
        // Immediately delete the script to ensure it is a one-time execution.
        delete userScripts[key]; 
        
        console.log(`\n➡️ Script for key ${key} (User: ${username}) was fetched and cleared.\n`);
        
        // Send back the script and username to the web page.
        res.send({ script: script, username: username });
    } else {
        // No script is waiting for this key. Send a null response.
        res.send({ script: null });
    }
});


// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log("Waiting for script execution requests...");
});
