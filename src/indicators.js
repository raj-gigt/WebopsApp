export function calculateMovingAverageSeriesData(candleData, maLength) {
  const maData = [];
  let sum = 0;
  if (candleData.length > 0) {
    for (let j = 0; j < maLength; j++) {
      sum += candleData[j].close;
      maData.push({ time: candleData[j].time });
    }
    for (let i = maLength; i < candleData.length; i++) {
      sum = sum + candleData[i].close - candleData[i - maLength].close;

      const maValue = sum / maLength;
      maData.push({ time: candleData[i].time, value: maValue });
    }
  }
  return maData;
}
