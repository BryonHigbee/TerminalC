const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 8080;

app.use(express.json());

// Serve the HTML page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Script Executor</title>
            <style>
                body { font-family: sans-serif; background-color: #121212; color: #e0e0e0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                #container { text-align: center; background-color: #1e1e1e; padding: 40px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
                h1 { color: #bb86fc; }
                #status { margin-top: 20px; font-size: 1.2em; }
                .dot-flashing { position: relative; width: 10px; height: 10px; border-radius: 5px; background-color: #bb86fc; color: #bb86fc; animation: dotFlashing 1s infinite linear alternate; animation-delay: .5s; }
                .dot-flashing::before, .dot-flashing::after { content: ''; display: inline-block; position: absolute; top: 0; }
                .dot-flashing::before { left: -15px; width: 10px; height: 10px; border-radius: 5px; background-color: #bb86fc; color: #bb86fc; animation: dotFlashing 1s infinite alternate; animation-delay: 0s; }
                .dot-flashing::after { left: 15px; width: 10px; height: 10px; border-radius: 5px; background-color: #bb86fc; color: #bb86fc; animation: dotFlashing 1s infinite alternate; animation-delay: 1s; }
                @keyframes dotFlashing { 0% { background-color: #bb86fc; } 50%, 100% { background-color: #3700b3; } }
            </style>
        </head>
        <body>
            <div id="container">
                <h1>Script Executor</h1>
                <div id="status">Waiting for a script...</div>
                <div class="dot-flashing"></div>
            </div>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io();
                const statusDiv = document.getElementById('status');

                socket.on('script_received', (script) => {
                    statusDiv.textContent = 'Executing script...';
                    console.log('Executing script:', script);
                });

                socket.on('execution_complete', (message) => {
                    statusDiv.textContent = message;
                     setTimeout(() => {
                        statusDiv.textContent = 'Waiting for a script...';
                    }, 5000);
                });
            </script>
        </body>
        </html>
    `);
});

app.post('/execute', (req, res) => {
    const { script } = req.body;

    if (!script) {
        return res.status(400).send({ message: 'No script provided.' });
    }

    console.log(`Received script: ${script}`);
    io.emit('script_received', script);

    exec(script, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error.message}`);
            io.emit('execution_complete', 'Script execution failed.');
            // Don't send a 500 to the batch file, as it might not handle it well
        } else {
            console.log(`Execution successful: ${stdout}`);
            io.emit('execution_complete', 'Script executed successfully!');
        }
    });

    res.status(200).send({ message: 'Script received and is being executed.' });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});