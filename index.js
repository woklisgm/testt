import { RestClientV5 } from 'bybit-api';
import Binance from 'binance-api-node';
import  TelegramBot from 'node-telegram-bot-api';
import controller from './controller/user.controller.js';
import chalk from 'chalk';

const currentExchange = 'binance'; // bybit
const token = '6338137831:AAFIOFogzqh8uSnpGM3UdYYaFj65GNSJnjY';
const bot = new TelegramBot(token, {polling: true});
const chatId = 5311566607;

const client = new RestClientV5();
const client2 = Binance.default();
const symbols = [];
let sentCoins = [];
let requestCounter = 0;

bot.on('message', async (msg) => {
  // const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, chatId);
  }
});

// Заполнение таблицы symbol
const fillSymbolTable = (symbols) => {
  console.log(symbols);

  symbols.forEach(element => {
    controller.createSymbol(element);
  })
}

const insertPriceToTable = async (element) => {
  await controller.addPriceBybit(element.symbol, element.lastPrice, element.indexPrice, element.markPrice);
}

const getAllTickets = async () => {
  if (currentExchange === 'bybit') {
    await getAllTicketsBybit();
  }

  if (currentExchange === 'binance') {
    await getAllTicketsBinance();
  }

  console.log(symbols);
}

const getAllTicketsBinance = async () => {
  try {
    const tickers = await client2.futuresPrices();
    
    if (Object.keys(tickers).length > 0) {
      for (let symbol in tickers) {
        symbols.push(symbol);
      }
    }
  } catch (e) {
    console.error('Binance request failed');
  }
}

const getAllTicketsBybit = async () => {
  try {
    const tickers = await client.getTickers({ category: 'linear' });
  
    if (tickers.result.list) {
      tickers.result.list.forEach(async (element) => {
        symbols.push(element.symbol);
      });
    }
  } catch (e) {
    console.error('Bybit request failed');
  }
}

const sendTickersRequestBybit = async () => {
  // console.log('[GET TICKETS]');
  try {
    const tickers = await client.getTickers({ category: 'linear' });

    if (tickers.result.list) {
      tickers.result.list.forEach(async (element, i) => {
        await insertPriceToTable(element);
      });
    }
  } catch (e) {
    console.error('failed sendTickersRequestBybit');
  }
  await sendTickersRequestBybit();
}

const sendTickersRequestBinance = async () => {
  const date = new Date();
  console.log(`[GET BINANCE DATA ${requestCounter++}] - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);

  try {
    const tickers = await client2.futuresPrices();

    if (Object.keys(tickers).length > 0) {
      for (let symbol in tickers) {
        await controller.addPriceBinance(symbol, tickers[symbol]);
      }
    }
  } catch (e) {
    console.error('failed sendTickersRequestBinance');
  }

  await sendTickersRequestBinance();
}

const getPercent = async () => {
  symbols.length && symbols.forEach(async (s) => {
    const arr = await controller.getPrice(s);

    if (arr.length) {
      const firstPrice = parseFloat(arr[0].indexprice);
      const lastPrice = parseFloat(arr[arr.length - 1].indexprice);

      if (firstPrice < lastPrice) {
        const tmp = 100 - (firstPrice / lastPrice) * 100;
        
        if (tmp > 1 && !sentCoins.includes(s)) {

          sentCoins.push(s);
          setTimeout(() => {
            sentCoins.shift();
          }, 1100 * 60);
          
          console.log('');
          console.log(chalk.green(`${s} +${tmp.toFixed(2)}%`));
          await bot.sendMessage(chatId, `${s} +${tmp.toFixed(2)}%`);
        }
        return;
      }

      const tmp = (firstPrice / lastPrice) * 100 - 100;
      if (tmp > 1.5 && !sentCoins.includes(s)) {

        sentCoins.push(s);
        setTimeout(() => {
          sentCoins.shift();
        }, 1100 * 60);

        console.log('');
        console.log(chalk.red(`${s} -${tmp.toFixed(2)}%`));
        await bot.sendMessage(chatId, `${s} -${tmp.toFixed(2)}%`);
      }
    }
  })
}

const getPercent2 = async (s, first, last, level, text, minmax) => {
  const firstPrice = first;
  const lastPrice = last;

  if (firstPrice < lastPrice) {
    const tmp = 100 - (firstPrice / lastPrice) * 100;
    if (tmp >= level && !sentCoins.includes(s)) {

      sentCoins.push(s);
      setTimeout(() => {
        const index = sentCoins.indexOf(`${s}`);
        if (index !== -1) {
          sentCoins.splice(index, 1);
        }
      }, 1000 * 60);

      console.log(chalk.green(`${s} +${tmp.toFixed(2)}% ${text}`));
      await bot.sendMessage(chatId, `🟢  ${s}.P +${tmp.toFixed(2)}% ${text}`);
    }
    return;
  }

  const tmp = (firstPrice / minmax.min) * 100 - 100;
  if (tmp >= level && !sentCoins.includes(s)) {

    sentCoins.push(s);
    setTimeout(() => {
      const index = sentCoins.indexOf(`${s}`);
      if (index !== -1) {
        sentCoins.splice(index, 1);
      }
    }, 1000 * 60);

    console.log(chalk.red(` ${s} -${tmp.toFixed(2)}% ${text}`));
    await bot.sendMessage(chatId, `🔴  ${s}.P -${tmp.toFixed(2)}% ${text}`);
  }
}

await controller.clearDB();
await getAllTickets();
// sendTickersRequestBybit();
sendTickersRequestBinance();

// setInterval(() => {
//   getPercent();
// }, 500);

setInterval(async () => {
  let objOneMinute = {};
  let objTwoMinute = {};

  symbols.forEach(element => {
    objOneMinute[element] = {
      min: 1000000000,
      max: 0,
      data: []
    };
    objTwoMinute[element] = {
      min: 1000000000,
      max: 0,
      data: []
    };
  });  

  const response = await controller.getLastMinutePrice();
  response.forEach((e, i) => {
    objOneMinute[e.name].data.push(e.indexprice);
    
    if (e.indexprice < objOneMinute[e.name].min) objOneMinute[e.name].min = e.indexprice;
    if (e.indexprice > objOneMinute[e.name].max) objOneMinute[e.name].max = e.indexprice;
  });

  const response2 = await controller.getLastTwoMinutePrice();
  response2.forEach((e, i) => {
    objTwoMinute[e.name].data.push(e.indexprice);

    if (e.indexprice < objTwoMinute[e.name].min) objTwoMinute[e.name].min = e.indexprice;
    if (e.indexprice > objTwoMinute[e.name].max) objTwoMinute[e.name].max = e.indexprice;
  });

  symbols.forEach(element => {
    if (!objOneMinute[element].data.length) {
      return;
    }

    const lastElement = objOneMinute[element].data.length - 1;
    getPercent2(
      element,
      objOneMinute[element].data[0],
      objOneMinute[element].data[lastElement],
      1,
      'за 1 минуту',
      {min: objOneMinute[element]['min'], max: objOneMinute[element]['max']}
    );

    const lastElement2 = objTwoMinute[element].data.length - 1;
    getPercent2(
      element,
      objTwoMinute[element].data[0],
      objTwoMinute[element].data[lastElement2],
      1.5,
      'за 2 минуты',
      {min: objTwoMinute[element]['min'], max: objTwoMinute[element]['max']}
    );
  });
}, 500);
