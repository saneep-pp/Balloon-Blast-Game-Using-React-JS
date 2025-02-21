import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InstallPWA from "./components/InstallPWA";
import Instruction from "./components/Instruction";
import HomePage from "./components/HomePage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center h-screen bg-sky-300">
        <Routes>
          <Route path="/" element={<Instruction />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
        <InstallPWA />
      </div>
    </Router>
  );
};

export default App;
