import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader before the app renders
defineCustomElements(window);

const startApp = async () => {
  // Wait for the deviceready event when running in a native app
  if ((window as any).Capacitor) {
    document.addEventListener('deviceready', () => {
      console.log('Device is ready');
    }, false);
  }
  
  // Render the app
  createRoot(document.getElementById("root")!).render(<App />);
};

startApp();
