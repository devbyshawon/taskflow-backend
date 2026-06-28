const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const projectRouter = require('./routes/projectRoutes');

dotenv.config();

const app = express();

connectDB();

const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
