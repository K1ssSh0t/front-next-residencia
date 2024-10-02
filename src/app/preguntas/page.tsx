import FormPreguntas from "./Formulario";
import { createServerClient } from "@/utils/pocketbase";
import React from "react";
import { cookies } from "next/headers";

async function getPreguntas() {
  const cookieStore = cookies();
  const client = createServerClient(cookieStore);

  const userId = client.authStore.model?.id;

  try {
    const pregunta = await client
      .collection("test_preguntas")
      .getFirstListItem(`escuela="${userId}"`);

    return {
      tes1: pregunta.tes1,
      test2: pregunta.test2,
      id: pregunta.id,
    };
  } catch (error) {
    console.error("Error fetching preguntas:", error);
    return null;
  }
}

export default async function Preguntas() {

  const preguntas = await getPreguntas();

  return (


    <div className=" flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <FormPreguntas
        tes1={preguntas?.tes1}
        test2={preguntas?.test2}
        id={preguntas?.id!}
      />
    </div>


  );
}
