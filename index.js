const express = require('express');
const app = express();
const PORT = 8080;

// This variable will hold the latest script to be executed.
let scriptToExecute = "";

app.use(express.json());

// Endpoint for the batch file to POST scripts to.
app.post('/execute', (req, res) => {
    const { script } = req.body;

    if (!script) {
        console.log("Received request without a script.");
        return res.status(400).send({ message: 'No script provided.' });
    }

    // Store the script and log it to the console.
    scriptToExecute = script;
    console.log(`✅ Script received and is waiting for the game to fetch it.`);
    console.log(`   Script: ${scriptToExecute}`);
    
    res.status(200).send({ message: 'Script stored successfully.' });
});

// Endpoint for the Roblox game to GET the script from.
app.get('/get-script', (req, res) => {
    if (scriptToExecute) {
        // Send the script to the game.
        res.send(scriptToExecute);
        
        // Clear the script so it doesn't run again.
        console.log(`📜 Script was fetched by the game and has been cleared.`);
        scriptToExecute = ""; 
    } else {
        // If no script is waiting, send an empty response.
        res.send("");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log("Waiting for scripts from the batch file and requests from the game...");
});
