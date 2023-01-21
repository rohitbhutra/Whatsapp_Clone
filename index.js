const express = require('express');
const GroupMessage = require('./models/groupmessage');
const port = 3000;


// acquire the mongoose connection from here
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
// connect to the database server
mongoose.connect('mongodb://localhost/whatsapp');
//acquire the connection to the database
const db = mongoose.connection;
//check for errors
db.on('error', console.error.bind(console, 'connection error:'));
//check for success
db.once('open', function(){
    console.log('Connected to MongoDB');
});



const app  = express();
app.use(express.json());


// get request for all the groups in a paginated manner

app.get('/groups/:groupId/messages', async (req, res) => {
    const { groupId } = req.params;
    const { page = 0, limit = 10 } = req.query;
    const client = await MongoClient.connect('mongodb://localhost/whatsapp', {useNewUrlParser: false}).EternalsMilitary;
    const dbs = client.db(GroupMessage);
    const group = await dbs.findOne({ groupId });
    const messages = group.messages.slice(page * limit, page * limit + limit);
    res.send(messages);
    client.close();
});

// post request for sending a message to a group
app.post('/groups/:groupId/messages', async (req, res) => {
    const { groupId } = req.params;
    const { senderId, text } = req.body;
    const client = await MongoClient.connect('mongodb://localhost/whatsapp', {useNewUrlParser: false}).EternalsMilitary;
    const dbs = client.db(GroupMessage);
    const group = await dbs.findOne({ groupId });

    group.messages.push({
        messageId: new ObjectID(),
        senderId,
        text,
        timestamp: new Date(),
    });
    await db.collection('groups').create({ groupId }, group);
    res.send('Success');
    client.close();
});


// function to start the express server which is listening to PORT no - 3000
app.listen(port, function(err) {
    if(err) {
        console.log('error:', err);
    }
    else {
        console.log('listening on port:', port);
    }
});