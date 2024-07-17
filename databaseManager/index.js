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

    const {username, size, speed, sizeIncrease, speedIncrease} = playerData.findOne({ username: cUsername }, { projection: { size: 1, speed: 1, sizeIncrease: 1, speedIncrease: 1 } });

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

async function insertUser(cUsername, cEmail) {
    const database = client.db('blockGameProject');
    const Login = database.collection('blockGameProject');

    const newUser = { username: cUsername, email: cEmail, size: 20, speed: 5, sizeIncrease: 1, speedIncrease: 1, points: 0 };
    const insertStatus = await Login.insertOne(newUser);

    return insertStatus;
}

app.get('/dbmanager/getSize/:email', (req, res) => {
    const email = req.params.email;
    getSize(email).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

async function getSize(cEmail) {
    const database = client.db('blockGameProject');
    const playerData = database.collection('blockGameProject');

    const query = { email: cEmail };
    const size = await playerData.findOne(query, { projection: { size: 1 } });

    return size;
}

app.get('/dbmanager/getSpeed/:email', (req, res) => {
    const email = req.params.email;
    getSpeed(email).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

async function getSpeed(cEmail) {
    const database = client.db('blockGameProject');
    const playerData = database.collection('blockGameProject');

    const query = { email: cEmail };
    const speed = await playerData.findOne(query, { projection: { speed: 1 } });

    return speed;
}

const PORT = process.env.PORT || 8085;
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
});