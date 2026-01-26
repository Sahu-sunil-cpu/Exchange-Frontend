import { getHistory } from '@/lib/httpClient';
import React, { useEffect, useState } from 'react';

interface History {
  time: string;
  pair: string;
  type: string;
  side: string;
  amount: string;
  price: string;
  status: string;
}

export const OrderHistory: React.FC = () => {
  
  const [history, setHistory] = useState<History[]>([])

  const getOrders = async () => {
    const data = await getHistory(1);
    console.log(data)
    const orders: History[] = data.message.map((e) => {
     return  {
        time: "",
        pair: e.market,
        type: e.order_type,
        side: e.side,
        amount: parseFloat(e.qty),
        price: parseFloat(e.price),
        status: e.status
      }
    })

    setHistory(prevOrders => [...orders])
  }
  useEffect(() => {
    getOrders()
  }, [])

  return (
    <div className="h-full bg-slate-800 p-4 flex flex-col">
      
      <div className="text-white font-semibold mb-4 text-sm">
        Order History
      </div>

      {/* Header */}
      <div className="grid grid-cols-7 text-xs text-slate-400 mb-2 gap-2">
        <div>Time</div>
        <div>Pair</div>
        <div>Type</div>
        <div>Side</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Price</div>
        <div className="text-right">Status</div>
      </div>

      {/* Scroll container */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto space-y-1">
          {history.map((order, index) => (
            <div
              key={index}
              className="grid grid-cols-7 text-xs py-1 gap-2 hover:bg-slate-700 cursor-pointer"
            >
              <div className="text-slate-400">{order.time}</div>
              <div className="text-slate-300">{order.pair}</div>
              <div className="text-slate-300">{order.type}</div>
              <div className={order.side === 'Buy' ? 'text-green-400' : 'text-red-400'}>
                {order.side}
              </div>
              <div className="text-right text-slate-300">{order.amount}</div>
              <div className="text-right text-slate-300">{order.price}</div>
              <div
                className={`text-right ${
                  order.status === 'filled'
                    ? 'text-green-400'
                    : order.status === 'cancelled'
                    ? 'text-red-400'
                    : 'text-yellow-400'
                }`}
              >
                {order.status}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
