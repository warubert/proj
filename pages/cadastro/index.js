import { useState } from "react";

export default function RegisterPage() {
  console.log("RegisterPage rendered");

  const [newCount, setNewCount] = useState(0);

  let count = 0;
  console.log("Count:", count);
  console.log("newCount:", newCount);

  function incrementCount() {
    count++;
    console.log("Count incremented:", count);
  }

  function incrementNewCount() {
    setNewCount(newCount + 1);
    console.log("newCount incremented:", newCount + 1);
  }

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
