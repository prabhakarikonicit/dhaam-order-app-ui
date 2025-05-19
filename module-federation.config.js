export const mfConfig = {
  name: "dhaam_order_app_ui",
  filename: "remoteEntry.js",
  exposes: {
    "./Orders": "./src/localComponents/orders",
    "./tailwindStyles": "./src/index.css"
  },
  shared: ["react", "react-dom"],
   types: {
    skipEmit: process.env.NODE_ENV === 'development',
  },
};
