export function convertToHigherFrequency(data, targetFrequency) {
  if (data.length > 0) {
    if (data[0]) {
      const result = [];
      let currentPeriod = {
        open: data[0].open,
        high: data[0].high,
        low: data[0].low,
        close: data[0].close,
        time: new Date(data[0].time),
      };

      const addPeriod = () => {
        result.push({
          time: currentPeriod.time.getTime() / 1000,
          open: currentPeriod.open,
          high: currentPeriod.high,
          low: currentPeriod.low,
          close: currentPeriod.close,
        });
      };

      const addToCurrentPeriod = (candle) => {
        currentPeriod.high = Math.max(currentPeriod.high, candle.high);
        currentPeriod.low = Math.min(currentPeriod.low, candle.low);
        currentPeriod.close = candle.close;
      };

      for (let i = 1; i < data.length; i++) {
        const currentDate = new Date(data[i].time);

        if (
          targetFrequency === "15min" &&
          currentDate.getMinutes() % 15 === 0
        ) {
          addPeriod();
          currentPeriod = {
            open: data[i].open,
            high: data[i].high,
            low: data[i].low,
            close: data[i].close,
            time: currentDate,
          };
        } else if (
          targetFrequency === "30min" &&
          currentDate.getMinutes() % 30 === 0
        ) {
          addPeriod();
          currentPeriod = {
            open: data[i].open,
            high: data[i].high,
            low: data[i].low,
            close: data[i].close,
            time: currentDate,
          };
        } else if (
          targetFrequency === "hourly" &&
          currentDate.getHours() !== currentPeriod.time.getHours()
        ) {
          addPeriod();
          currentPeriod = {
            open: data[i].open,
            high: data[i].high,
            low: data[i].low,
            close: data[i].close,
            time: currentDate,
          };
        } else if (
          targetFrequency === "daily" &&
          currentDate.getDate() !== currentPeriod.time.getDate()
        ) {
          addPeriod();
          currentPeriod = {
            open: data[i].open,
            high: data[i].high,
            low: data[i].low,
            close: data[i].close,
            time: currentDate,
          };
        } else if (targetFrequency === "5m") {
          addPeriod();
          currentPeriod = {
            open: data[i].open,
            high: data[i].high,
            low: data[i].low,
            close: data[i].close,
            time: currentDate,
          };
        } else {
          addToCurrentPeriod(data[i]);
        }
      }

      addPeriod(); // Add the last period

      return result;
    }
  }
  return [{ time: new Date("2024-04-30 00:00").getTime() }];
}
