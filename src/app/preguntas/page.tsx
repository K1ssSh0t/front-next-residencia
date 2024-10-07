import FormPreguntas from "./Formulario";
import { createServerClient } from "@/utils/pocketbase";
import React from "react";
import { cookies } from "next/headers";

async function getPreguntas() {
  const cookieStore = cookies();
  const client = createServerClient(cookieStore);

  const userId = client.authStore.model?.id;

  try {
    //const pregunta = await client
    //  .collection("test_preguntas")
    //  .getFirstListItem(`escuela="${userId}"`);

    const parteUno = await client.collection("institucion").getFirstListItem(`usuario="${userId}"`, { expand: "nivelEducativo,tipoInstitucion,tipoBachiller,usuario" });

    return {
      nombre: parteUno.nombre,
      region: parteUno.region,
      municipio: parteUno.municipio,
      id: parteUno.id,
      nivelEducativo: parteUno.expand?.nivelEducativo?.descripcion,
      tipoInstitucion: parteUno.expand?.tipoInstitucion?.descripcion,
      tipoBachiller: parteUno.expand?.tipoBachiller?.descripcion,


    };
  } catch (error) {
    console.error("Error fetching preguntas:", error);
    return null;
  }
}

export default async function Preguntas() {

  const preguntas = await getPreguntas();


  if (preguntas === null) {

    return (

      <div className=" flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        {//TODO: HACER UN FORMULARIO PARA Actualizar Y OTRO PARA NUEVOS PREGUNTAS
        }
        <h1>No hay preguntas disponibles</h1>
      </div>
    );
  }

  return (


    <div className=" flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <FormPreguntas
        preguntas={preguntas}
      />
    </div>


  );
}
