import ReactDOM from "react-dom/client";
import "./index.css";
import Orders from "./localComponents/orders";

const App = () => {
  return (
    <div>
      <Orders />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("app") as HTMLElement);

root.render(<App />);
