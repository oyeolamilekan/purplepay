// App.jsx
import { useEffect, useState } from "react";

const postMessageToListeners = ({ event, data }: { event: string, data?: any | null }) => {
  window.parent && window.parent.postMessage({ type: event, data }, "*");
};

const App = () => {
  const [config, setConfig] = useState({});

  // listening for messages starts here
  const handleMessage = (event: any) => {
    if (event.data.type === "sdkData") {
      setConfig(event.data.config)
    }
  };


  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // const { publicKey, amount, meta, currency } = config;

  const handleCloseClick = () => postMessageToListeners({ event: "pay.close" });

  const handleSuccessClick = () => {
    const transactionData = {
      type: "transaction",
      transaction: {},
    };
    postMessageToListeners({ event: "pay.success", data: transactionData });
  };

  const handleErrorClick = () =>
    postMessageToListeners({ event: "pay.server_error" });

  return (
    <div style={{ backgroundColor: "purple", padding: "10px", maxWidth: "500px", margin: "auto", height: "400px" }}>
      <p>Powered by Purple pay</p>
      <button onClick={handleCloseClick}>Close SDK</button>
      <button onClick={handleSuccessClick}>Simulate success</button>
      <button onClick={handleErrorClick}>Simulate error</button>
    </div>
  );
};

export default App;