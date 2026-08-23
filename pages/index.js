import DefaultLayout from "interface/DefaultLayout";

function Home() {
  return (
    <DefaultLayout
      metadata={{
        description: "Bem-vindo ao Proj.",
      }}
    >
      <h1>Teste</h1>
    </DefaultLayout>
  );
}

export default Home;
