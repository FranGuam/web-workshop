import { createRoot } from "react-dom/client";
import "./index.css";

const App = () => {
  return <div>Hello World!</div>;
};

const domNode = document.getElementById("root");
const root = createRoot(domNode!);
root.render(<App />);
