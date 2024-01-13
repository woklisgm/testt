"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bybit_api_1 = require("bybit-api");
/**
 * If you don't plan on making any private api calls,
 * you can instance the REST client without any parameters
 */
const client = new bybit_api_1.RestClientV5();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const klineResult = await client.getKline({
        //   category: 'linear',
        //   interval: '15',
        //   symbol: 'BTCUSDT',
        // });
        // console.log('klineResult: ', klineResult);
        // const markPriceKlineResult = await client.getMarkPriceKline({
        //   category: 'linear',
        //   interval: '15',
        //   symbol: 'BTCUSDT',
        // });
        // console.log('markPriceKlineResult: ', markPriceKlineResult);
        // const indexPriceKline = await client.getIndexPriceKline({
        //   category: 'linear',
        //   interval: '15',
        //   symbol: 'BTCUSDT',
        // });
        // console.log('indexPriceKline: ', indexPriceKline);
        // const openInterest = await client.getOpenInterest({
        //   category: 'linear',
        //   symbol: 'BTCUSDT',
        //   intervalTime: '5min',
        // });
        const tickers = yield client.getTickers({ category: 'linear' });
        // console.log(
        //   JSON.stringify(
        //     tickers.result.list.map((ticker) => ticker.symbol),
        //     null,
        //     2,
        //   ),
        // );
        console.log('response', tickers);
        if (tickers.result.list) {
            tickers.result.list.forEach(element => {
                console.log(element);
            });
        }
        // openInterest.result.list.forEach((row) => {
        //   console.log('int: ', {
        //     timestamp: row.timestamp,
        //     value: row.openInterest,
        //   });
        // });
        // console.log('openInterest: ', openInterest.result.list);
    }
    catch (e) {
        console.error('request failed: ', e);
    }
}))();
