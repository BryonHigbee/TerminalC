const express = require('express');
const path = require('path');
const app = express();

// Set the port for the server. The batch file and browser will connect to this.
const PORT = 8080;

// This object will store the script sent from your batch file.
let scripts = {};

// --- Middleware ---
// Serve static files (like index.html, style.css, etc.) from a 'public' folder.
app.use(express.static(path.join(__dirname, 'public')));
// Parse incoming JSON data from the batch file's POST request.
app.use(express.json());

// --- API Endpoints ---

/**
 * GET /key/:id
 * This endpoint is called by your index.html page to fetch the script
 * that was sent by the batch file.
 */
app.get('/key/:id', (req, res) => {
    const gameId = req.params.id;
    const script = scripts[gameId] || '-- No script has been executed yet. --';
    res.send(script);
});

/**
 * POST /key/:id
 * This endpoint is called by your batch script (via curl) to post the
 * script content to the server.
 */
app.post('/key/:id', (req, res) => {
    const gameId = req.params.id;
    const { script } = req.body; // Destructure to get the script from the request body

    if (!gameId) {
        return res.status(400).send('Error: No Game ID was specified.');
    }

    if (!script) {
        console.error("Request received, but no 'script' was found in the body.");
        return res.status(400).send("Error: Request body must contain a 'script' field.");
    }

    // Store the script using the gameId as the key
    scripts[gameId] = script;

    console.log("========================================");
    console.log(`✅ Script received for gameID: ${gameId}`);
    console.log(`✅ Script Content: ${script}`);
    console.log("========================================");

    // Send a success response back to the batch file.
    res.status(200).send({ message: 'Successfully Executed' });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
    console.log("Waiting for requests from your batch tool and web page...");
});