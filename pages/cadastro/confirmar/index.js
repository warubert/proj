import { Banner } from "@primer/react";
import DefaultLayout from "interface/DefaultLayout";

export default function ConfirmRegisterPage() {
  return (
    <DefaultLayout
      contentWidth="small"
      metadata={{
        title: "Confirme seu e-mail",
      }}
    >
      <Banner
        variant="warning"
        title="Falta só uma etapa!"
        description="Confirme seu e-mail para completar o cadastro."
      />
    </DefaultLayout>
  );
}
