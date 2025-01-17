const { MongoClient } = require("mongodb");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient("mongodb://localhost:32768");

app.post('/dbmanager/update-stats', (req, res) => {
    const {email, key} = req.body;
    updateStats(email, key).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

async function updateStats(cEmail, uStat) {
    const database = client.db('blockGameProject');
    const playerData = database.collection('blockGameProject');
    const {email, size, speed, sizeIncrease, speedIncrease} = await playerData.findOne({ email: cEmail }, { projection: { email: 1, size: 1, speed: 1, sizeIncrease: 1, speedIncrease: 1 } });
    
    if (uStat == 'sizeIncrease') {
        const query = { email: cEmail };
        const newValues = { $inc: { 'sizeIncrease' : 1}};
        const updateStatus = await playerData.updateOne(query, newValues);
        return updateStatus;
    } 
    else if (uStat == 'speedIncrease') {
        const query = { email: cEmail };
        const newValues = { $inc: { 'speedIncrease' : 1}};
        const updateStatus = await playerData.updateOne(query, newValues);
        return updateStatus;
    }
    else if (uStat == 'size') {
        const query = { email: cEmail };
        const newValues = { $inc: {'size': sizeIncrease} };
        const updateStatus = await playerData.updateOne(query, newValues);
        return updateStatus;
    }
    else if (uStat == 'speed') {
        const query = { email: cEmail };
        const newValues = { $inc: {'speed': speedIncrease} };
        const updateStatus = await playerData.updateOne(query, newValues);
        return updateStatus;
    }
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

    const newUser = { username: cUsername, email: cEmail, size: 10, speed: 1, sizeIncrease: 1, speedIncrease: 1, points: 0 };
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

app.post("/dbmanager/incrementPoints", (req, res) => {
    const {email, pointsGained} = req.body;
    incrementPoints(email, pointsGained).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

async function incrementPoints(cEmail, pointsGained) {
    const database = client.db('blockGameProject');
    const playerData = database.collection('blockGameProject');
    console.log('incrementing points');
    console.log(pointsGained);
    const query = { email: cEmail };
    const newValues = { $inc: { 'points' : pointsGained}};
    const updateStatus = await playerData.updateOne(query, newValues);

    return updateStatus;
}

app.get('/dbmanager/getPoints/:email', (req, res) => {
    const email = req.params.email;
    getPoints(email).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

async function getPoints(cEmail) {
    const database = client.db('blockGameProject');
    const playerData = database.collection('blockGameProject');

    const query = { email: cEmail };
    const points = await playerData.findOne(query, { projection: { points: 1 } });

    return points;
}

app.get('/dbmanager/getStats/:email', (req, res) => {
    const email = req.params.email;
    getStats(email).then((result) => {
        res.json(result);
        console.log(result);
    }).catch((error) => {
        console.log(error);
        res.status(500).json({message : 'Internal server error'});
    });
});

async function getStats(cEmail) {
    const database = client.db('blockGameProject');
    const playerData = database.collection('blockGameProject');

    const query = { email: cEmail };
    const stats = await playerData.findOne(query, { projection: { size: 1, speed: 1, sizeIncrease: 1, speedIncrease: 1 } });

    return stats;
}

const PORT = process.env.PORT || 8085;
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);
});