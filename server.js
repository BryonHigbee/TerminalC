/**
 * This is a Node.js server that acts as a bridge between your batch file
 * and a web page. It now handles multiple users simultaneously by using
 * unique keys to manage individual sessions.
 */

// --- 1. SETUP ---
const express = require('express');
const path = require('path');
const cors = require('cors'); // Import CORS middleware
const app = express();

// The port the server will run on.
const PORT = 8080;

// In-memory storage objects.
// `users` stores the mapping of a key to a username. -> { "key123": "UserA" }
// `scripts` stores the script for a specific key. -> { "key123": "print('hello')" }
let users = {};
let scripts = {};


// --- 2. MIDDLEWARE ---
// Enable CORS for all routes to allow cross-origin requests from your web page
app.use(cors());
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
// Parse JSON data from incoming requests
app.use(express.json());


// --- 3. API ENDPOINTS ---

/**
 * POST /user
 * LISTENS for requests from the BATCH SCRIPT after a user authenticates.
 * This endpoint registers a key with a username.
 */
app.post('/user', (req, res) => {
    const { key, username } = req.body;
    if (!key || !username) {
        return res.status(400).send('Error: Request must contain a key and username.');
    }

    users[key] = username;
    console.log(`[+] User Registered: Key ${key} is associated with Username ${username}.`);
    res.status(200).send({ message: 'User registered successfully.' });
});

/**
 * GET /user/:key
 * LISTENS for requests from the WEB PAGE.
 * This endpoint retrieves the username associated with a given key.
 */
app.get('/user/:key', (req, res) => {
    const { key } = req.params;
    const username = users[key];

    if (username) {
        console.log(`[?] Username for key ${key} was requested. Found: ${username}.`);
        res.status(200).send({ username });
    } else {
        console.log(`[?] Username for key ${key} was requested. Not found.`);
        res.status(404).send({ message: 'User not found for this key.' });
    }
});


/**
 * POST /key/:key
 * LISTENS for requests from the BATCH SCRIPT.
 * When the batch file sends a script, this endpoint stores it under the user's unique key.
 */
app.post('/key/:key', (req, res) => {
    const { key } = req.params;
    const { script } = req.body;

    if (!users[key]) {
        return res.status(404).send('Error: Unregistered key. Please authenticate through the batch file first.');
    }
    if (!script) {
        return res.status(400).send("Error: Request body must contain a 'script' field.");
    }

    // Store the script under the user's specific key.
    scripts[key] = script;

    console.log("========================================");
    console.log(`✅ Script Received & Stored for key: ${key}`);
    console.log(`   Username: ${users[key]}`);
    console.log(`   Script: ${script}`);
    console.log("========================================");

    res.status(200).send({ message: 'Script stored successfully. Awaiting fetch.' });
});


/**
 * GET /key/:key
 * LISTENS for requests from the WEB PAGE.
 * Sends the script associated with the key, then deletes it to prevent re-execution.
 */
app.get('/key/:key', (req, res) => {
    const { key } = req.params;

    if (scripts[key]) {
        const scriptToExecute = scripts[key];
        // Delete the script after retrieving it to ensure it's a one-time fetch.
        delete scripts[key];

        console.log(`\n📤 Script for key ${key} was fetched and has now been cleared.\n`);
        res.send({ script: scriptToExecute });
    } else {
        // No script is waiting for this key.
        res.send({ script: '-- No new script to execute. --' });
    }
});


// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log("Waiting for requests from your batch tool and web page...");
});
