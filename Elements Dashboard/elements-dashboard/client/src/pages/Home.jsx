import React, { useEffect, useState } from "react";
import ElementCard from "../components/ElementCard";
import { fetchElements } from "../api";

const Home = () => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    fetchElements().then(setElements);
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {elements.map((el) => (
        <ElementCard key={el._id} element={el} />
      ))}
    </div>
  );
};

export default Home;
