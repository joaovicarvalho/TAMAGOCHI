import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "tamagochi.db";
const database_version = "1.0";
const database_displayname = "Tamagochi Database";
const database_size = 200000;

let db;

export const initDB = async () => {
  return SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size
  ).then(DB => {
    db = DB;
    console.log("Database OPEN");
    return db;
  }).catch(error => {
    console.log("Error: ", error);
  });
};

export const closeDatabase = async () => {
  if (db) {
    console.log("Closing DB");
    await db.close();
    console.log("Database CLOSED");
  } else {
    console.log("Database was not OPENED");
  }
};

export const createTable = async () => {
  await db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS pets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image TEXT,
        hunger INTEGER,
        sleep INTEGER,
        fun INTEGER,
        status TEXT
      );`
    );
  });
};

export const addPet = async (name, image) => {
  return db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO pets (name, image, hunger, sleep, fun, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, image, 100, 100, 100, 'Muito Bem'],
      (tx, results) => {
        console.log("Pet added: ", results);
      },
      error => {
        console.log("Error: ", error);
      }
    );
  });
};

export const getPets = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM pets',
        [],
        (tx, results) => {
          const rows = results.rows;
          let pets = [];

          for (let i = 0; i < rows.length; i++) {
            pets.push(rows.item(i));
          }

          resolve(pets);
        },
        error => {
          reject(error);
        }
      );
    });
  });
};

export const updatePet = async (id, hunger, sleep, fun, status) => {
  return db.transaction(tx => {
    tx.executeSql(
      'UPDATE pets SET hunger = ?, sleep = ?, fun = ?, status = ? WHERE id = ?',
      [hunger, sleep, fun, status, id],
      (tx, results) => {
        console.log("Pet updated: ", results);
      },
      error => {
        console.log("Error: ", error);
      }
    );
  });
};
