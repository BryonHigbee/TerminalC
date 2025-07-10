/**
 * This is a Node.js server that acts as a bridge between your batch file
 * and a web page. The batch file POSTs a script to the server, and the
 * web page GETs it to execute.
 */

// --- 1. SETUP ---
const express = require('express');
const path = require('path');
const app = express();

// The port the server will run on.
const PORT = 8080;

// This object will act as temporary in-memory storage for the scripts.
// A script is stored here when the batch file sends it, and cleared
// after the web page fetches it.
let scripts = {};


// --- 2. MIDDLEWARE ---
// This serves static files (like index.html, style.css) from a 'public' folder.
// Make sure your web page files are inside a folder named 'public'.
app.use(express.static(path.join(__dirname, 'public')));
// This parses the JSON data sent by the batch file's `curl` command.
app.use(express.json());


// --- 3. API ENDPOINTS ---

/**
 * POST /key/:id
 * LISTENS for requests from your BATCH SCRIPT.
 * When the batch file sends a script, this endpoint catches it and stores it.
 */
app.post('/key/:id', (req, res) => {
    const gameId = req.params.id;
    const { script } = req.body;

    // Basic validation
    if (!gameId) {
        return res.status(400).send('Error: No Game ID was specified.');
    }
    if (!script) {
        console.error("Request received, but no 'script' was found in the body.");
        return res.status(400).send("Error: Request body must contain a 'script' field.");
    }

    // Store the script in our temporary storage object.
    scripts[gameId] = script;

    // Log to the server console to confirm receipt.
    console.log("========================================");
    console.log(`✅ Script Received & Stored for gameID: ${gameId}`);
    console.log(`   Script: ${script}`);
    console.log("========================================");

    // Send a success message back to the batch file.
    res.status(200).send({ message: 'Script stored successfully. Awaiting fetch.' });
});


/**
 * GET /key/:id
 * LISTENS for requests from your WEB PAGE.
 * When the web page asks for a script, this endpoint sends it and
 * then immediately deletes it to prevent re-execution.
 */
app.get('/key/:id', (req, res) => {
    const gameId = req.params.id;

    // Check if a script for the given gameId exists in our storage.
    if (scripts[gameId]) {
        // A script is available. Retrieve it.
        const scriptToExecute = scripts[gameId];

        // *** MODIFIED LOGIC: CLEAR THE SCRIPT ***
        // Immediately delete the script from memory after retrieving it.
        // This makes it a one-time fetch.
        delete scripts[gameId];

        console.log(`\n✅ Script for gameID ${gameId} was fetched and has now been cleared.\n`);

        // Send the retrieved script to the web page.
        res.send(scriptToExecute);
    } else {
        // No script is waiting. Send back a default message.
        res.send('-- No new script to execute. --');
    }
});


// --- 4. START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log("Waiting for requests from your batch tool and web page...");
});
