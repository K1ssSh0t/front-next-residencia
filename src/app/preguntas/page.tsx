import FormPreguntas from "./Formulario";
import { createServerClient } from "@/utils/pocketbase";
import React from "react";
import { ClientResponseError } from "pocketbase";
import { cookies } from "next/headers";

async function getInstitucion() {
  const cookiesStore = cookies();
  const client = createServerClient(cookiesStore);

  const tiposDeInstitucion = await client.collection("TipoInstitucion").getFullList();
  return tiposDeInstitucion;
}



async function getPreguntas() {
  const cookieStore = cookies();
  const client = createServerClient(cookieStore);

  const userId = client.authStore.model?.id;
  const tipoEscuela: boolean = client.authStore.model?.nivelEducativo;


  try {
    //const pregunta = await client
    //  .collection("test_preguntas")
    //  .getFirstListItem(`escuela="${userId}"`);

    if (tipoEscuela) {
      const nivelSuperior = await client.collection("Superior").getFirstListItem(`idUsuario="${userId}"`, {
        expand: "idTipoInstitucion"
      });
      return nivelSuperior;
    }
    /*
        const parteUno = await client.collection("institucion").getFirstListItem(`usuario="${userId}"`, { expand: "nivelEducativo,tipoInstitucion,tipoBachiller,usuario" });
    
        return {
          nombre: parteUno.nombre,
          region: parteUno.region,
          municipio: parteUno.municipio,
          id: parteUno.id,
          nivelEducativo: parteUno.expand?.nivelEducativo?.descripcion,
          tipoInstitucion: parteUno.expand?.tipoInstitucion?.descripcion,
          tipoBachiller: parteUno.expand?.tipoBachiller?.descripcion,
    
    
        };*/
  } catch (error) {
    //console.error("Error fetching preguntas:", (error as ClientResponseError).data);
    if ((error as ClientResponseError).status === 404) {
      console.log("No tienes una informacion en Institucion")
    }
    return null;
  }
}

export default async function Preguntas() {

  const preguntas = await getPreguntas();

  const tiposDeInstitucion = await getInstitucion();



  /* if (preguntas === null) {
 
     return (
 
       <div className=" flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
         {//TODO: HACER UN FORMULARIO PARA Actualizar Y OTRO PARA NUEVOS PREGUNTAS
         }
         <h1>No hay preguntas disponibles</h1>
         <pre>
           {JSON.stringify(preguntas, null, 2)}
         </pre>
       </div>
     );
   }
 */
  return (


    <div className=" flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <FormPreguntas
        preguntas={preguntas!}
        tiposDeInstitucion={tiposDeInstitucion}
      />


    </div>


  );
}
