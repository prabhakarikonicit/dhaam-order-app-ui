import ReactDOM from "react-dom/client";

import "./index.css";
import OrderDiv from "./OrderDiv";

const App = () => (
  <div className="mt-10 text-3xl mx-auto max-w-6xl">
    <div>Name: dhaam_order_app_ui</div>
    <div>Framework: react-19</div>
    <OrderDiv/>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);