export const mfConfig = {
  name: "dhaam_order_app_ui",
  exposes: {
    "./Orders": "./src/localComponents/orders",
    "./tailwindStyles": "./src/index.css"
  },
  shared: ["react", "react-dom"],
};
