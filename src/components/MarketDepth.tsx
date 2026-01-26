import React from 'react';

export const MarketDepth: React.FC = () => {
  const depthData = [
    { price: '2.4823', cumulative: '12.5K', percentage: '15%' },
    { price: '2.4801', cumulative: '24.8K', percentage: '30%' },
    { price: '2.4789', cumulative: '38.2K', percentage: '45%' },
    { price: '2.4756', cumulative: '52.1K', percentage: '60%' },
    { price: '2.4723', cumulative: '67.8K', percentage: '75%' },
    { price: '2.4698', cumulative: '83.2K', percentage: '90%' },
    { price: '2.4672', cumulative: '98.7K', percentage: '100%' },
    { price: '2.4651', cumulative: '112.4K', percentage: '100%' },
    { price: '2.4629', cumulative: '127.8K', percentage: '100%' },
    { price: '2.4607', cumulative: '143.2K', percentage: '100%' },
  ];

  return (
    <div className="h-full bg-slate-800 p-4 flex flex-col">
      <div className="text-white font-semibold mb-4 text-sm">Market Depth</div>
      
      <div className="grid grid-cols-3 text-xs text-slate-400 mb-2">
        <div>Price</div>
        <div className="text-right">Cumulative</div>
        <div className="text-right">%</div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-1">
          {depthData.map((item, index) => (
            <div key={index} className="grid grid-cols-3 text-xs py-1 hover:bg-slate-700 cursor-pointer">
              <div className="text-slate-300">{item.price}</div>
              <div className="text-right text-slate-300">{item.cumulative}</div>
              <div className="text-right text-slate-400">{item.percentage}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
