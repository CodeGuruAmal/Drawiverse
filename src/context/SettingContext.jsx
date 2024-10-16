import React, { createContext, useContext, useState } from "react";

const SettingContext = createContext();

export const SettingProvider = ({ children }) => {
  const [strokeColor, setStrokeColor] = useState("#e4e4e7");
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [fillColor, setFillColor] = useState("#e4e4e700");

  const handleStrokeColor = (color) => {
    setStrokeColor(color)
  }

  const handleFillColor = (color) => {
    setFillColor(color);
  }

  const handleStrokeWidth = (width) => {
    setStrokeWidth(width);
  }


  return (
    <SettingContext.Provider
      value={{
        handleStrokeColor,
        handleFillColor,
        handleStrokeWidth,
        strokeColor,
        fillColor,
        strokeWidth,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};


export const useSetting = () => useContext(SettingContext);

export default SettingContext;
