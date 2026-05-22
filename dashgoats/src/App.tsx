import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Drivers from "./pages/Drivers";
import Teams from "./pages/Teams";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pilotos" element={<Drivers />} />
        <Route path="/construtores" element={<Teams />} />
      </Routes>
    </>
  );
}

export default App;
