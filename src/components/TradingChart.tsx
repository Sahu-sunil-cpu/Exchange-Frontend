
import { Kline } from '@/lib/klines';
import { BASE_URL } from '@/lib/utils';
import { WsManager } from '@/lib/WsManger';
import { AreaSeries, createChart, ColorType, CandlestickSeries, CrosshairMode, LineStyle } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';


//TODO: ohlvc needed to be compatible values to form a candle
export interface klineType {
  time: number;
  open: number;
  high: number;
  low: number
  close: number
  volume: number
}

export function ChartComponent(props: {tf: string}) {

    const chartRef = useRef<Kline | null>(null);
    const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const getData = async () => {
    const url = `${BASE_URL}/history/TATA_INR/${props.tf}`;
    const res = await fetch(url);
    const resp = await res.json();
     console.log(resp.message);
    const cdata = resp.message.map((row) => {
      const {bucket_start, open, high, low, close, volume} = row;

      const time = new Date(bucket_start).getTime();
      return {
        time: time,   // ms -> sec
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
      };
    });



    // open: 200,
    // high: 400,
    // low: 150,
    // close: 50,
    // volume: 30,

//     const url = `http://localhost:5000/proxy?symbol=BTCUSDT&interval=1d`;
//   const res = await fetch(url);
//   const resp = await res.json();
//   //   console.log(resp);
//   const cdata = resp.map((row) => {
//     const [time1, open, high, low, close, volume] = row;
//     return {
//       time: time1 / 1000,   // ms -> sec
//       open: Number(open),
//       high: Number(high),
//       low: Number(low),
//       close: Number(close),
//       volume: Number(volume),
//     };
//   });
// //  return cdata;

//     console.log(cdata)
//     setCandleData(cdata)
    return cdata;
  };

  const candleData = async (tf: string) => {
    if (!chartContainerRef.current) return;

  if (chartRef.current) {
    chartRef.current.destroy(); // you MUST implement this
    chartRef.current = null;
  }

  chartContainerRef.current.innerHTML = "";

  const props = {
    backgroundColor: '#1e293b',
    lineColor: '#2962FF',
    textColor: 'white',
    areaTopColor: '#2962FF',
    areaBottomColor: 'rgba(41, 98, 255, 0.28)',
    width: chartContainerRef.current.clientWidth,
    height: 400,
  };

  const chart = new Kline(chartContainerRef.current, '', props);
  chartRef.current = chart;

  const data = await getData();
  data.forEach(k => chart.upsertKline(k));

  chart.setTargetTimeframe(tf);

  WsManager.getInstance().registerCallback(
    "candle",
    (data: any) => {
      const candle = {
        time: Math.floor(new Date(data.time).getTime()),
        open: +data.open,
        high: +data.high,
        low: +data.low,
        close: +data.close,
        volume: +data.volume,
      };
      chart.upsertKline(candle);
    },
    `CANDLE-${tf}`
  );

  }


  useEffect(() => {
    candleData(props.tf)

  }, [props.tf])

  useEffect(() => {
    return () => {
      WsManager.getInstance().deRegisterCallback("candle", `CANDLE-${props.tf}`);
    }
  }, [])

  return (
    <div
      ref={chartContainerRef}
    />
  );
};

const initialData = [
  { time: '2018-12-22', value: 32.5 },
  { time: '2018-12-23', value: 32.0 },
  { time: '2018-12-24', value: 31.5 },
  { time: '2018-12-25', value: 31.6 },
  { time: '2018-12-26', value: 31.1 },
  { time: '2018-12-27', value: 31.6 },
  { time: '2018-12-28', value: 31.1 },
  { time: '2018-12-29', value: 30.6 },
  { time: '2018-12-30', value: 30.1 },
  { time: '2018-12-31', value: 29.6 }
];

export function TradingViewChart(props: {tf: string}) {
  return (
    <ChartComponent tf={props.tf}></ChartComponent>
  );
}






let randomFactor = 25 + Math.random() * 25;
const samplePoint = i =>
  i *
  (0.5 +
    Math.sin(i / 1) * 0.2 +
    Math.sin(i / 2) * 0.4 +
    Math.sin(i / randomFactor) * 0.8 +
    Math.sin(i / 50) * 0.5) +
  200 +
  i * 2;

function generateData(
  numberOfCandles = 500,
  updatesPerCandle = 5,
  startAt = 100
) {
  const createCandle = (val, time) => ({
    time,
    open: val,
    high: val,
    low: val,
    close: val,
  });

  const updateCandle = (candle, val) => ({
    time: candle.time,
    close: val,
    open: candle.open,
    low: Math.min(candle.low, val),
    high: Math.max(candle.high, val),
  });

  randomFactor = 25 + Math.random() * 25;
  const date = new Date(Date.UTC(2025, 6, 28, 12, 43, 333, 0));
  const numberOfPoints = numberOfCandles * updatesPerCandle;
  const initialData = [];
  const realtimeUpdates = [];
  let lastCandle;
  let previousValue = samplePoint(-1);
  for (let i = 0; i < numberOfPoints; ++i) {
    if (i % updatesPerCandle === 0) {
      //date.setUTCDate(date.getUTCDate() + 1);
      date.setUTCMinutes(date.getUTCMinutes() + 1)
    }
    const time = Math.floor(date.getTime() / 1000);
    let value = samplePoint(i);
    const diff = (value - previousValue) * Math.random();
    value = previousValue + diff;
    previousValue = value;
    if (i % updatesPerCandle === 0) {
      const candle = createCandle(value, time);
      lastCandle = candle;
      if (i >= startAt) {
        realtimeUpdates.push(candle);
      }
    } else {
      const newCandle = updateCandle(lastCandle, value);
      lastCandle = newCandle;
      if (i >= startAt) {
        realtimeUpdates.push(newCandle);
      } else if ((i + 1) % updatesPerCandle === 0) {
        initialData.push(newCandle);
      }
    }
  }

  return {
    initialData,
    realtimeUpdates,
  };
}

