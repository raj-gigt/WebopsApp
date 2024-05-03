import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Box, useColorMode, Button } from "@chakra-ui/react";
import { formatStockData } from "./dataloader";
import { calculateMovingAverageSeriesData } from "./indicators";
import { convertToHigherFrequency } from "./timeframeConverter";
export const ChartComponent = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [stockData, setStockData] = useState({});

  const {
    data,
    colors: {
      backgroundColor = colorMode === "light" ? "white" : "#1A202C",
      lineColor = colorMode === "light" ? "#2962FF" : "#CBD5E0",
      textColor = colorMode === "light" ? "black" : "white",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
    timeframeSelected,
    chartType,
  } = props;

  const chartContainerRef = useRef();
  useEffect(() => {
    const fetchStockData = async () => {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&month=2009-01&outputsize=full&apikey=demo`
        // "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&outputsize=full&apikey=demo"
      );
      const data = await response.json();

      return data;
    };
    fetchStockData().then((data) => setStockData(data));
  }, []);

  const seriesData = useMemo(() => formatStockData(stockData), [stockData]);

  let fiveminData, fifteenminData, thirtyminData, hourlyData, DailyData;
  fiveminData = convertToHigherFrequency(seriesData, "5m");
  fifteenminData = convertToHigherFrequency(seriesData, "15min");
  thirtyminData = convertToHigherFrequency(seriesData, "30min");
  hourlyData = convertToHigherFrequency(seriesData, "hourly");
  DailyData = convertToHigherFrequency(seriesData, "daily");
  const timeframeData = new Map([
    ["5min", fiveminData],
    ["15min", fifteenminData],
    ["30min", thirtyminData],
    ["1hr", hourlyData],
    ["1D", DailyData],
  ]);
  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      grid: {
        vertLines: {
          color: colorMode === "light" ? "RGBA(0, 0, 0, 0.08)" : "#444",
        },
        horzLines: {
          color: colorMode === "light" ? "RGBA(0, 0, 0, 0.08)" : "#444",
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 700,
      timeScale: {
        visible: true,
        secondsVisible: true,
      },
    });
    // chart.timeScale().fitContent();

    // newSeries.setData(data);

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: true,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });
    candlestickSeries.setData(
      chartType == "CandleStick"
        ? timeframeData.get(timeframeSelected)
        : [{ time: "2024-04-30" }]
    );
    const maData = calculateMovingAverageSeriesData(
      timeframeData.get(timeframeSelected),
      1
    );
    const areaSeries = chart.addAreaSeries({
      lineColor: "#2962FF",
      topColor: "#2962FF",
      bottomColor: "rgba(41, 98, 255, 0.28)",
    });
    const barSeries = chart.addBarSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
    });
    const baselineSeries = chart.addBaselineSeries({
      baseValue: { type: "price", price: 50 },
      topLineColor: "rgba( 38, 166, 154, 1)",
      topFillColor1: "rgba( 38, 166, 154, 0.28)",
      topFillColor2: "rgba( 38, 166, 154, 0.05)",
      bottomLineColor: "rgba( 239, 83, 80, 1)",
      bottomFillColor1: "rgba( 239, 83, 80, 0.05)",
      bottomFillColor2: "rgba( 239, 83, 80, 0.28)",
    });
    const histogramSeries = chart.addHistogramSeries({ color: "#26a69a" });
    const lineSeries = chart.addLineSeries({ color: "#2962FF" });
    areaSeries.setData(
      chartType == "Area Chart" ? maData : [{ time: "2024-04-30" }]
    );
    barSeries.setData(
      chartType == "Bars"
        ? timeframeData.get(timeframeSelected)
        : [{ time: "2024-04-30" }]
    );
    baselineSeries.setData(
      chartType == "Baseline" ? maData : [{ time: "2024-04-30" }]
    );
    histogramSeries.setData(
      chartType == "Histogram" ? maData : [{ time: "2024-04-30" }]
    );
    lineSeries.setData(
      chartType == "Moving Average" ? maData : [{ time: "2024-04-30" }]
    );
    // window.addEventListener("resize", handleResize);

    // const maData = calculateMovingAverageSeriesData(fiveminData, 50);
    // const maData2 = calculateMovingAverageSeriesData(fiveminData, 100);
    // const maSeries = chart.addLineSeries({ color: "#2962FF", lineWidth: 3 });
    // const maSeries2 = chart.addLineSeries({ color: "#2962FF", lineWidth: 3 });
    // maSeries.setData(maData);
    // maSeries2.setData(maData2);
    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
    seriesData,
    timeframeSelected,
    chartType,
  ]);

  return <Box my={5} px={3} py={3} mr={5} ref={chartContainerRef} />;
};
