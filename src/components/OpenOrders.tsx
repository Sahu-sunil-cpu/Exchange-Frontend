import { getOpenOrders } from '@/lib/httpClient';
import React, { useEffect, useState } from 'react';

interface Order {
time: string;
pair: string;
type: string;
side: "buy" | "sell";
amount: string;
price: string;
filled: string
}

export const OpenOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    { time: '14:30:12', pair: 'SUI/USDT', type: 'Limit', side: 'buy', amount: '100.00', price: '2.4500', filled: '0%' },
    { time: '14:28:45', pair: 'SUI/USDT', type: 'Limit', side: 'sell', amount: '250.00', price: '2.4800', filled: '25%' },
    { time: '14:25:33', pair: 'SUI/USDT', type: 'Limit', side: 'buy', amount: '500.00', price: '2.4300', filled: '0%' },
  ])

  const openOrders = async () => {
    const data = await getOpenOrders("TATA_INR", 1);
    console.log(data.data)
    const orders: Order[] = data.data.map((e) => {
     return  {
        time: e.time,
        pair: e.market,
        type: e.type,
        side: e.side,
        amount: Number(parseFloat(e.quantity.toString()).toFixed(4)),
        price: Number(parseFloat(e.price.toString()).toFixed(4)),
        filled: Number((e.filled/e.quantity)*100).toFixed(4) + "%"
      }
    })

    setOrders(prevOrders => [...orders])
  }
  useEffect(() => {
    openOrders()
  }, [])
  return (
    <div className="h-full bg-slate-800 p-4 flex flex-col">
      <div className="text-white font-semibold mb-4 text-sm">Open Orders</div>
      
      <div className="grid grid-cols-7 text-xs text-slate-400 mb-2 gap-2">
        <div>Time</div>
        <div>Pair</div>
        <div>Type</div>
        <div>Side</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Price</div>
        <div className="text-right">Filled</div>
      </div>

      <div className="h-full flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {orders.map((order, index) => (
            <div key={index} className="grid grid-cols-7 text-xs py-1 hover:bg-slate-700 cursor-pointer gap-2">
              <div className="text-slate-400">{order.time}</div>
              <div className="text-slate-300">{order.pair}</div>
              <div className="text-slate-300">{order.type}</div>
              <div className={order.side === 'buy' ? 'text-green-400' : 'text-red-400'}>{order.side}</div>
              <div className="text-right text-slate-300">{order.amount}</div>
              <div className="text-right text-slate-300">{order.price}</div>
              <div className="text-right text-slate-400">{order.filled}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
