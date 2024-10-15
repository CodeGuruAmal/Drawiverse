import React, { createContext, useContext, useState } from "react";

const SettingContext = createContext();

export const SettingProvider = ({ children }) => {
  const [strokeColor, setStrokeColor] = useState("#e4e4e7");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeStyle, setStrokeStyle] = useState("solid");
  const [fillColor, setFillColor] = useState("#e4e4e700");

  const handleStrokeColor = (color) => {
    setStrokeColor(color)
  }

  const handleFillColor = (color) => {
    setFillColor(color);
  }

  const handleStrokeStyle = (style) => {
    setStrokeStyle(style);
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
        handleStrokeStyle,
        strokeColor,
        strokeStyle,
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
