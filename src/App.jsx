import React from "react";
import Canvas from "./components/Draw/Canvas";
import Option from "./components/Option";
import { SettingProvider } from "./context/SettingContext";

const App = () => {
  return (
    <SettingProvider>
      <Option />
      <Canvas />
    </SettingProvider>
  );
};

export default App;
