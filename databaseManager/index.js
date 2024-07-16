const { MongoClient } = require("mongodb");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient("mongodb://localhost:32768");


app.get('/dbmanager/fetch-user-data/:username', (req, res) => {
    const {username} = req.params;
    readUserAccount(username).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

async function readUserAccount(cUsername) {
    const database = client.db('blockGameProject');
    const Login = database.collection('blockGameProject');

    const query = { username: cUsername };
    const userInfo = await Login.findOne(query);

    return userInfo;
}

app.post('/dbmanager/update-stats', (req, res) => {
    const {username, updatedStat} = req.body;
    updateStats(username, updatedStat).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

async function updateStats(cUsername, uStat) {
    const database = client.db('blockGameProject');
    const playerData = database.collection('blockGameProject');

    const {username, size, speed, sizeIncrease, speedIncrease} = readUserAccount(cUsername);

    if (uStat == 'sizeIncrease' || uStat == 'speedIncrease') {
        const query = { username: cUsername };
        const newValues = { $inc: {uStat: 1}};
    }
    else if (uStat == 'size') {
        const query = { username: cUsername };
        const newValues = { $inc: {uStats: sizeIncrease} };
    }
    else if (uStat == 'speed') {
        const query = { username: cUsername };
        const newValues = { $inc: {uStats: speedIncrease} };
    }
    const updateStatus = await playerData.updateOne(query, newValues);

    return updateStatus;
}

app.get('/dbmanager/getUserByEmail/:email' , (req, res) => {
    const email = req.params.email;
    getUserByEmail(email).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

async function getUserByEmail(cEmail) {
    const database = client.db('blockGameProject');
    const Login = database.collection('blockGameProject');
    console.log("called2 " + cEmail);

    const query = { email: `${cEmail}` };
    const userInfo = await Login.findOne(query)
    return userInfo;
}

app.post('/dbmanager/insertUser', (req, res) => {
    const {username, email} = req.body;
    insertUser(username, email).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

const PORT = process.env.PORT || 8085;
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
});