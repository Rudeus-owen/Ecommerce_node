const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan'); // Import Morgan for logging
const path = require('path');
const fs = require('fs'); // Require the File System module for creating directories
const jwt = require('jsonwebtoken');
const authJwt = require('./middleware/authJwt'); // Import your custom middleware

const app = express();
const port = process.env.PORT || 8000;

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it does not exist
}

const allowedOrigins = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://10.0.2.2:8000',
];

// Middleware to log HTTP requests
app.use(morgan('dev'));

// Configure JSON and URL-encoded form parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make uploaded files accessible
app.use('/uploads', express.static('uploads'));

// Configure CORS with dynamic origin for flexibility and security
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "*",
    credentials: true
}));

// Configure cookies for secure transmission in production
app.use(cookieParser({
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true // Adds httpOnly to prevent access to cookie via client-side script
}));

// Import and use API routes
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// Route for handling login and redirecting based on role
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await user.findOne({ username });
        if (!user) {
            return res.status(404).send({ message: 'User not found!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: 'Invalid Password!' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, config.secret, { expiresIn: 86400 });
        res.status(200).send({
            id: user.id,
            username: user.username,
            role: user.role,
            accessToken: token,
        });
    } catch (err) {
        console.error("Error in login route:", err);
        res.status(500).send({ message: "Internal server error" });
    }
});

// Middleware for role-based redirection after login
app.get('/redirect-after-login', authJwt.verifyToken, authJwt.roleRedirect);

// Routes for different dashboards and home pages
app.get('/admin-dashboard', authJwt.verifyToken, authJwt.isAdmin, (req, res) => {
    res.send('Welcome to Admin Dashboard');
});

app.get('/root-admin-dashboard', authJwt.verifyToken, authJwt.isRootAdmin, (req, res) => {
    res.send('Welcome to Root Admin Dashboard');
});

app.get('/ecommerce-home', authJwt.verifyToken, (req, res) => {
    if (req.userType === 'user') {
        res.send('Welcome to E-commerce Home');
    } else {
        res.status(403).send('Access Denied');
    }
});

app.get('/guest-home', (req, res) => {
    res.send('Welcome to Guest Home');
});

// Serve static files from the frontend build directory
const frontendBuildPath = path.join(__dirname, 'frontend-build');
app.use(express.static(frontendBuildPath));

// Serve the index.html file for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server and log which port it's running on
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
