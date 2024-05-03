import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  useColorMode,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { ChartComponent } from "./ChartComponent";

import { ChevronDownIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
export default function App(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [timeframe, Settimeframe] = useState("5min");
  const [ChartType, SetChartType] = useState("CandleStick");
  const timeframes = ["5min", "15min", "30min", "1hr", "1D"];
  const ChartTypes = [
    "CandleStick",
    "Moving Average",
    "Area Chart",
    "Histogram",
    "Baseline",
    "Bars",
  ];
  return (
    <Box>
      <Flex justifyContent="space-between" mx={2} my={4}>
        <HStack>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {timeframe}
            </MenuButton>
            <MenuList zIndex={10}>
              <MenuOptionGroup defaultValue="5min" type="radio">
                {timeframes.map((item, index) => {
                  return (
                    <MenuItemOption
                      onClick={() => {
                        Settimeframe(item);
                      }}
                      value={item}
                      key={item}
                    >
                      {item}
                    </MenuItemOption>
                  );
                })}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              {ChartType}
            </MenuButton>
            <MenuList zIndex={10}>
              <MenuOptionGroup defaultValue="CandleStick" type="radio">
                {ChartTypes.map((item, index) => {
                  return (
                    <MenuItemOption
                      onClick={() => {
                        SetChartType(item);
                      }}
                      value={item}
                      key={item}
                    >
                      {item}
                    </MenuItemOption>
                  );
                })}
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </HStack>
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon></MoonIcon> : <SunIcon></SunIcon>}
        </Button>
      </Flex>
      <ChartComponent
        {...props}
        timeframeSelected={timeframe}
        chartType={ChartType}
      ></ChartComponent>
    </Box>
  );
}
