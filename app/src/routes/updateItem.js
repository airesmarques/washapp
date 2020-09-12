const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateItem(req.params.id, {
        name: req.body.name,
        completed: req.body.completed,
        money: req.body.money
    });
    const item = await db.getItem(req.params.id);
    res.send(item);
};
