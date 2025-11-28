import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pilotos from "./pages/Pilotos";
import Construtores from "./pages/Construtores";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pilotos" element={<Pilotos />} />
        <Route path="/construtores" element={<Construtores />} />
      </Routes>
    </>
  );
}

export default App;
