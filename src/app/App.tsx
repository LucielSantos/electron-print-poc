import React from "react";

export const App = () => {
  const handlePrint = () => {
    console.log("handlePrint");
    window.electron.ipcRenderer.send("print");
  };

  return (
    <div>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};
