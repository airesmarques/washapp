const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
//const location = process.env.SQLITE_DB_LOCATION || '/etc/credits/credit.db';
const location = process.env.SQLITE_DB_LOCATION || 'credits/credit.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((acc, rej) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err);

            //if (process.env.NODE_ENV !== 'test')
            console.log(`Aires Using sqlite database at ${location}`);
            db.run(
                'CREATE TABLE IF NOT EXISTS credit_items (id varchar(36), name varchar(255), completed boolean, money integer)',
                (err, result) => {
                    if (err) return rej(err);
                    acc();
                },
            );
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM credit_items', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, 
                        item, 
                        { completed: item.completed === 1,}, 
                        { money: item.money,},
                    ),
                ),
            );
        });
    });
}

async function getItem(id) {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM credit_items WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, 
                        { completed: item.completed === 1,},
                        { money: item.money,},
                    ),
                )[0],
            );
        });
    });
}


async function getItemByName(name) {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM credit_items WHERE id=?', [name], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map(item =>
                    Object.assign({}, item, 
                        { name: item.name,},
                        { completed: item.completed === 1,},
                        { money: item.money,},
                    ),
                )[0],
            );
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        db.run(
            'INSERT INTO credit_items (id, name, completed, money) VALUES (?, ?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0, item.money],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        db.run(
            'UPDATE credit_items SET name=?, completed=?, money=? WHERE id = ?',
            [item.name, item.completed ? 1 : 0, item.money, id],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
} 

async function removeItem(id) {
    return new Promise((acc, rej) => {
        db.run('DELETE FROM credit_items WHERE id = ?', [id], err => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    getItemByName,
    storeItem,
    updateItem,
    removeItem,
};