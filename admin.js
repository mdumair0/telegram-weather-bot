require('./db/mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/user');

const app = express();
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    res.json("server is up")
});

app.get('/users', async (req, res) => {
    console.log("getting users")
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { messageFrequency, blocked } = req.body;
        let user = await User.findById(id)
        if (!user) {
            const error = new Error("User Not found");
            error.status = 404; // Set the status property
            throw error;
        }
        if (blocked !== null && messageFrequency == null) {
            await User.findByIdAndUpdate(id, { blocked });
            res.json({ message: "User's blocked status updated successfully" });
        } else if (messageFrequency !== null && blocked == null) {
            await User.findByIdAndUpdate(id, { messageFrequency });
            res.json({ message: "User's messageFrequency updated successfully" });
        } else {
            await User.findByIdAndUpdate(id, { messageFrequency, blocked });
            res.json({ message: "User's blocked status and messageFrequency updated successfully" });
        }
    } catch (e) {
        res.status(e.status || 500).json({error: e.message || 'Internal server error'});
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id)
        if (user) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.json({ message: 'User Not Found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
module.exports = app
