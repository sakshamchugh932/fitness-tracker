
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

mongoose.connect('mongodb://localhost:27017/workoutDB');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const workoutSchema = new mongoose.Schema({
    name: String,
    date: Date,
    duration: Number, // in minutes
    notes: String
});

const Workout = mongoose.model('Workout', workoutSchema);


app.get('/', async (req, res) => {
    const workouts = await Workout.find({});
    res.render('index', { workouts });
});

app.get('/workouts/new', (req, res) => {
    res.render('new');
});

app.post('/workouts', async (req, res) => {
    const { name, date, duration, notes } = req.body;
    await Workout.create({ name, date, duration, notes });
    res.redirect('/');
});

app.get('/workouts/:id/edit', async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    res.render('edit', { workout });
});

app.put('/workouts/:id', async (req, res) => {
    const { name, date, duration, notes } = req.body;
    await Workout.findByIdAndUpdate(req.params.id, { name, date, duration, notes });
    res.redirect('/');
});

app.delete('/workouts/:id', async (req, res) => {
    await Workout.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
