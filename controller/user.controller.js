import db from '../db.js';

class Controller {
  async createSymbol(name) {
    const newSymbol = await db.query(
      'INSERT INTO symbol (name) values ($1) RETURNING *',
      [name]
    );
    console.log('new symbol: ', newSymbol.rows[0]);
  }

  async getSymbolIdByName(name) {
    const symbols = await db.query(
      'SELECT * FROM symbol where name = $1',
      [name]
    );

    if (symbols?.rows[0]) {
      return symbols.rows[0]; 
    }

    return null;
  }

  async addPriceBybit(name, lastPrice, indexPrice, markPrice) {
    const price = await db.query(
      'INSERT INTO price (name, lastPrice, indexPrice, markPrice) values ($1, $2, $3, $4) RETURNING *',
      [name, lastPrice, indexPrice, markPrice]
    );

    // console.log('price: ', price.rows[0]);
  }

  async addPriceBinance(name, price) {
    const row = await db.query(
      'INSERT INTO price (name, lastPrice, indexPrice, markPrice) values ($1, $2, $3, $4) RETURNING *',
      [name, '', price, '']
    );

    // console.log('price: ', row.rows[0]);
  }

  async getAllSymbols() {
    const symbols = await db.query(
      `SELECT DISTINCT name FROM price`
    );

    if (symbols?.rows) {
      console.log(symbols.rows);
      return symbols.rows;
    }

    return null;
  }

  async getPrice(name) {
    const price = await db.query(
      `SELECT * FROM price WHERE name = '${name}' and recorddate >= now() - INTERVAL '1 minute' ORDER BY recorddate ASC`,
    );
    
    if (price?.rows) {
      return price.rows;
    }

    return null;
  }

  async clearDB() {
    await db.query(
      `DELETE FROM price;`,
    );
  }

  async getAllData() {
    const price = await db.query(`SELECT * FROM price`);

    if (price?.rows) {
      return price.rows;
    }

    return null;
  }

  async getLastMinutePrice() {
    const price = await db.query(
      `SELECT * FROM price WHERE recorddate >= now() - INTERVAL '1 minute' ORDER BY recorddate ASC`,
    );
    
    if (price?.rows) {
      return price.rows;
    }

    return null;
  }

  async getLastTwoMinutePrice() {
    const price = await db.query(
      `SELECT * FROM price WHERE recorddate >= now() - INTERVAL '2 minute' ORDER BY recorddate ASC`,
    );
    
    if (price?.rows) {
      return price.rows;
    }

    return null;
  }
}

const userController = new Controller();
export default userController;
