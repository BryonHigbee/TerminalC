/**
 * Node.js server to manage script execution for multiple users.
 * Each user is identified by a unique key.
 */

// --- 1. SETUP ---
const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080; // The port the server will run on.

// This object will store scripts, with each user's unique key pointing to their script.
// Example: { "user_key_1": "print('hello')", "user_key_2": "wait(5)" }
let userScripts = {};

// --- 2. MIDDLEWARE ---
// Serve static files (index.html, etc.) from the root directory.
app.use(express.static(__dirname));
// Parse JSON data from incoming requests.
app.use(express.json());


// --- 3. API ENDPOINTS ---

/**
 * POST /execute
 * LISTENS for requests from your BATCH SCRIPT.
 * Associates a script with the specific user key that sent it.
 */
app.post('/execute', (req, res) => {
    const { key, script, username } = req.body; // Expect key, script, and username

    if (!key || !script || !username) {
        return res.status(400).send({ error: 'Request must include a key, script, and username.' });
    }

    // Store the script under the user's unique key.
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
 * Fetches the script corresponding to the provided user key.
 */
app.get('/get-script/:key', (req, res) => {
    const { key } = req.params;
    const userData = userScripts[key];

    if (userData) {
        // Script found. Send it to the web page.
        const { script, username } = userData;
        
        // Immediately delete the script to ensure it's a one-time execution.
        delete userScripts[key]; 
        
        console.log(`\n➡️ Script for key ${key} (User: ${username}) was fetched and cleared.\n`);
        
        // Send back the script and username.
        res.send({ script: script, username: username });
    } else {
        // No script waiting for this key.
        res.send({ script: null });
    }
});


// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log("Waiting for script execution requests...");
});
