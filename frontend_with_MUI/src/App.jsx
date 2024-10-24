import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScriptGenerator from "./pages/ScriptGenerator";

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/translator" element={<ScriptGenerator />} /> 
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;