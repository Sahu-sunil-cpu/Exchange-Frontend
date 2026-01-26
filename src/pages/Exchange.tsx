import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { TradingViewChart } from '@/components/TradingChart';
import { Depth, OrderBook } from '@/components/OrderBook';
import { TradeHistory } from '@/components/TradeHistory';
import { TradingInterface } from '@/components/TradingInterface';
import { TopNavBar } from '@/components/TopNavBar';
import { TickerStrip } from '@/components/TickerStrip';
import { useParams } from 'react-router-dom';
import { WsManager } from '@/lib/WsManger';
import { OrderHistory } from '@/components/OrderHistory';
import { MarketDepth } from '@/components/MarketDepth';
import { OpenOrders } from '@/components/OpenOrders';
import { AccountBalances } from '@/components/AccountBalances';
import { Button } from '@/components/ui/button';





const Exchange = () => {
  const [selectedPair, setSelectedPair] = useState('SUI/USDT');
  const [currentPrice, setCurrentPrice] = useState('2.4567');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m');

  const timeframes = ['1m', '3m', '5m', '1h'];

  const { ticker } = useParams();

  const generateCandlestickData = () => {
    const data = [];
    let price = parseFloat(currentPrice);

    for (let i = 0; i < 50; i++) {
      const open = price;
      const volatility = price * 0.02;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);

      data.push({ open, high, low, close, volume: Math.random() * 1000000 });
      price = close;
    }
    return data;
  };

  const candlestickData = generateCandlestickData();

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const price = parseFloat(currentPrice);
      const newPrice = price + (Math.random() - 0.5) * 0.1;
      setCurrentPrice(newPrice.toFixed(4));
    }, 2000);


    const message = {
      method: "SUBSCRIBE",
      params: ["TATA_INR"]
    }


    // const message = {
    //   type: "ADD_USER",
    //   payload: {
    //     tickerId: "@TATA_INR"
    //   }
    // }

    WsManager.getInstance().init();
    WsManager.getInstance().sendMessage(message);
    WsManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: ["depth@TATA_INR"]
    })

    WsManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: ["trade@TATA_INR"]
    })

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* <TopNavBar /> */}

      <div className="h-[calc(100vh)]">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Side - Order Book */}
          <ResizablePanel defaultSize={20} minSize={20} maxSize={20}>
            <div className="h-full border-r border-slate-700 bg-slate-900 scroll">
              <Depth market={ticker.replace("/", "_")} />
            </div>
          </ResizablePanel>



          {/* Center - Chart and Trading Pair Info */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full flex flex-col">
              {/* Trading Pair Header */}


              {/* Resizable Chart and Bottom Section */}
              <ResizablePanelGroup direction="vertical" className="flex-1">
                {/* Chart */}
                <ResizablePanel defaultSize={70} minSize={50}>
                  {/* Chart Controls */}
                  <div className="h-12 border-b border-slate-700 flex items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                      {timeframes.map(tf => (
                        <Button
                          key={tf}
                          size="sm"
                          variant={selectedTimeframe === tf ? "default" : "ghost"}
                          className={`text-xs ${selectedTimeframe === tf ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-cyan-400'}`}
                          onClick={() => {
                            setSelectedTimeframe(tf)
                            WsManager.getInstance().sendMessage({
                              method: "TIMEFRAME",
                              params: tf
                            })
                          }}
                        >
                          {tf}
                        </Button>
                      ))}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>O: ${candlestickData[candlestickData.length - 1]?.open.toFixed(4)}</span>
                      <span>H: ${candlestickData[candlestickData.length - 1]?.high.toFixed(4)}</span>
                      <span>L: ${candlestickData[candlestickData.length - 1]?.low.toFixed(4)}</span>
                      <span>C: ${candlestickData[candlestickData.length - 1]?.close.toFixed(4)}</span>
                    </div>
                  </div>


                  <TradingViewChart tf={selectedTimeframe}/>

                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Bottom Tabs */}
                <ResizablePanel defaultSize={30} minSize={30} maxSize={70}>
                  <div className="h-full border-t border-slate-700 bg-slate-800 flex flex-col min-h-0">
                    <Tabs defaultValue="trades" className="h-full flex flex-col overflow-hidden">
                      <TabsList className="grid w-full grid-cols-5 bg-slate-700">
                        <TabsTrigger value="trades">Trades</TabsTrigger>
                        <TabsTrigger value="depth">Depth</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="balances">Balances</TabsTrigger>
                      </TabsList>

                      <TabsContent value="trades" className="mt-0 h-full">
                        <TradeHistory />
                      </TabsContent>

                      <TabsContent value="depth" className="mt-0 h-full p-4">
                        <div className="text-slate-400"><MarketDepth /></div>
                      </TabsContent>

                      <TabsContent value="orders" className="mt-0 h-full p-4">
                        <div className="text-slate-400 "><OpenOrders /></div>
                      </TabsContent>

                      <TabsContent value="history" className="relative flex-1 overflow-hidden p-0">
                        <div className="text-slate-400"> <OrderHistory /></div>
                      </TabsContent>

                      <TabsContent value="balances" className="mt-0 h-full p-4">
                        <div className="text-slate-400"><AccountBalances /></div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </ResizablePanel>

          {/* Right Side - Trading Interface */}
          <ResizablePanel defaultSize={20} minSize={20} maxSize={20}>
            <div className="h-full border-l border-slate-700 bg-slate-900">
              <TradingInterface currentPrice={currentPrice} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Exchange;
