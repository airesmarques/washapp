const db = require('../persistence');


module.exports = async (req, res) => {
    await db.updateItemByName(req.params.name, {
        name: req.body.name,
        completed: req.body.completed,
        money: req.body.money
    });
    const item = await db.getItemByName(req.params.name);
    res.send(item);
};
