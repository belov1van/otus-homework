import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ElementPage from "./pages/ElementPage";

function App() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/element/:id" element={<ElementPage />} />
      </Routes>
    </main>
  );
}

export default App;
