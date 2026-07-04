import { useState, useEffect } from "react";

export default function RegisterPage() {
  console.log("RegisterPage rendered");

  const [newCount, setNewCount] = useState(0);

  let count = 0;

  function incrementCount() {
    count++;
  }

  function incrementNewCount() {
    setNewCount(newCount + 1);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("[SetInterval] Count:", count, "| New Count:", newCount);
      console.log("");
    }, 2000);

    return () => {
      console.log("[CleanUp] Isso vai ser impresso antes do proximo setup");
      console.log("[CleanUp] Count:", count, "| New Count:", newCount);
      clearInterval(intervalId);
    };
  }, [newCount]);

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={incrementCount}>Increment count</button>
      <h1>New Count: {newCount}</h1>
      <button onClick={incrementNewCount}>Increment new count</button>
      <h1>Cadastro</h1>
      <hr />
      <ComponenteA />
      <ComponenteB />
    </>
  );
}

function ComponenteA() {
  console.log("ComponenteA rendered");

  return (
    <>
      <h2>Componente A</h2>
    </>
  );
}

function ComponenteB() {
  console.log("ComponenteB rendered");

  return (
    <>
      <h2>Componente B</h2>
    </>
  );
}
