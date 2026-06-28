export default function RegisterPage() {
  console.log("RegisterPage rendered");

  let count = 0;
  console.log("Count:", count);

  function incrementCount() {
    count++;
    console.log("Count incremented:", count);
  }

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={incrementCount}>Increment count</button>
      <h1>Cadastro</h1>
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
