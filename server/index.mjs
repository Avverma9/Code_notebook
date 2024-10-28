import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './routes/route.mjs';

const app = express();
const PORT = process.env.PORT || 5000; // You can specify your port

// Middleware
app.use(cors()); // Purpose: This middleware is responsible for handling CORS. It enables your server to respond to requests from different origins (domains). Without it, browsers might block cross-origin requests for security reasons.
// Functionality: It modifies the response headers to allow specified origins, methods, and headers.
app.use(express.json()); // Purpose: This middleware is for parsing JSON payloads in incoming requests. It converts the JSON string in the request body into a JavaScript object.
// Functionality: After this middleware processes a request, you can access the parsed data through req.body.

// Connect to MongoDB
mongoose
    .connect('mongodb+srv://Avverma:Avverma95766@avverma.2g4orpk.mongodb.net/Javascript')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Routes
app.use('/javascript/v1', router);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
