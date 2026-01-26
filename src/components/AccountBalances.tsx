import React from 'react';

export const AccountBalances: React.FC = () => {
  const balances = [
    { coin: 'SUI', available: '1,234.56', locked: '123.45', total: '1,358.01', usdValue: '$3,345.67' },
    { coin: 'USDT', available: '5,678.90', locked: '567.89', total: '6,246.79', usdValue: '$6,246.79' },
    { coin: 'BTC', available: '0.12345', locked: '0.01234', total: '0.13579', usdValue: '$12,456.78' },
    { coin: 'ETH', available: '2.3456', locked: '0.2345', total: '2.5801', usdValue: '$8,934.56' },
    { coin: 'SOL', available: '45.67', locked: '4.56', total: '50.23', usdValue: '$4,567.89' },
    { coin: 'BNB', available: '12.34', locked: '1.23', total: '13.57', usdValue: '$3,456.78' },
  ];

  return (
    <div className="h-full bg-slate-800 p-4 flex flex-col">
      <div className="text-white font-semibold mb-4 text-sm">Account Balances</div>
      
      <div className="grid grid-cols-5 text-xs text-slate-400 mb-2 gap-2">
        <div>Coin</div>
        <div className="text-right">Available</div>
        <div className="text-right">Locked</div>
        <div className="text-right">Total</div>
        <div className="text-right">USD Value</div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {balances.map((balance, index) => (
            <div key={index} className="grid grid-cols-5 text-xs py-1 hover:bg-slate-700 cursor-pointer gap-2">
              <div className="text-white font-medium">{balance.coin}</div>
              <div className="text-right text-slate-300">{balance.available}</div>
              <div className="text-right text-slate-400">{balance.locked}</div>
              <div className="text-right text-white">{balance.total}</div>
              <div className="text-right text-green-400">{balance.usdValue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
