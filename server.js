const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require ('./routes/authRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req,res)=>{
    res.send('API is running.....');
});

app.use('/api/auth', authRoutes);

app.use('/api/opportunities', opportunityRoutes);

const port = process.env.PORT || 5000;

app.listen(port ,()=>{
    console.log(`Server running at http://localhost:${port}`);
});

