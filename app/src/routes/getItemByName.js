const db = require('../persistence');

module.exports = async (req, res) => {
    const items = await db.getItemByName(req.params.name);
    res.send(items);
};
