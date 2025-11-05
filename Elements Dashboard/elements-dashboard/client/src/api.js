export const fetchElements = async () => {
  const res = await fetch("http://localhost:4000/api/elements");
  return res.json();
};
