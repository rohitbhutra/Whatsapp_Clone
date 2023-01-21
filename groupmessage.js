
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    groupId: String, // unique identifier for the group
    messages: [
        {
            messageId: String, // unique identifier for the message
            senderId: String, // unique identifier for the sender
            text: String, // message text
            timestamp: Date, // timestamp of when the message was sent
        }
    ]
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;