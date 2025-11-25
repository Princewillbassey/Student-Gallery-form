require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Student = require('./models/Student');

// Initialize Express app
const app = express();

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.set('view engine', 'ejs');

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
    const students = await Student.find().sort({ createdAt: -1 });
    res.render('index', { students });
})

app.get('/new', async (req, res) => {
    res.render('new');
});

app.post('/new', async (req, res) => {
    const { name, age, course, photo } = req.body;
    await Student.create({ name, age, course, photo });
    res.redirect('/');
});


// Shows edit form-------------------
app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;

    // Find student by ID
    const student = await Student.findById(id);

    res.render('edit', { student });
});

// Update: Saves edited student---------------------
app.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, course, photo } = req.body;

    await Student.findByIdAndUpdate(id, { name, age, course, photo });

    res.redirect('/');
});

// ------------------ DELETE: Remove a student ------------------

app.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    await Student.findByIdAndDelete(id);

    res.redirect('/');
});


// server running
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});