export const formatStockData = (stockData) => {
  let formattedData = [];

  if (stockData["Time Series (5min)"]) {
    Object.entries(stockData["Time Series (5min)"]).map((item, index) => {
      formattedData.push({
        time: new Date(item[0]),

        open: parseFloat(item[1]["1. open"]),
        high: parseFloat(item[1]["2. high"]),
        low: parseFloat(item[1]["3. low"]),
        close: parseFloat(item[1]["4. close"]),
      });
    });
    formattedData = formattedData.reverse();
  }
  return formattedData;
};
