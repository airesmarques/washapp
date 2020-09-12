const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const getItemByName = require('./routes/getItemByName');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const updateItemByName = require('./routes/updateItemByName');
const deleteItem = require('./routes/deleteItem');


app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

app.get('/items', getItems);
app.get('/items:name', getItemByName);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.put('/items/:name', updateItemByName);
app.delete('/items/:id', deleteItem);

db.init().then(() => {
    app.listen(3000, () => console.log('Washapp is listening on port 3000'));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
