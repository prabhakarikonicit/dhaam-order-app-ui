import ReactDOM from "react-dom/client";

import "./index.css";
import OrderButton from "./Button";

const App = () => (
  <div className="mt-10 text-3xl mx-auto max-w-6xl">
    <div>Name: dhaam_order_app_ui</div>
    <div>Framework: react-19</div>
    <OrderButton/>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);