import { createServerClient } from '@/utils/pocketbase';
import { redirect } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ExportCSV } from "./descargar-csv";
import { cookies } from 'next/headers';

import { ActualizarReglas } from './actualizar-reglas';
import { BaseSystemFields, PreguntasRecord } from '@/types/pocketbase-types';
import { Fragment } from 'react';

interface InstitucionData {
  nombre: string;
  datos: Record<string, number>;
  codigo: string;
}

async function ListaPreguntas() {
  const cookieStore = cookies();

  const client = createServerClient(cookieStore);

  let estadoCuestionario = "";


  const preguntasCuestionario = await client.collection("Preguntas").getFullList({
    sort: "idCuestionario",
    expand: "idCuestionario.idUsuario,idCategoria",
  });

  const datosInstitucion = await client.collection("Superior").getFullList({

  })

  // grour preguntasCuestionario that have the same idCuestionario 
  // Agrupar las preguntas por idCuestionario
  const preguntasAgrupadas = preguntasCuestionario.reduce((acc: any, pregunta: any) => {
    const idCuestionario = pregunta.idCuestionario;
    const idUsuarioPregunta = pregunta.expand?.idCuestionario?.expand?.idUsuario?.id;

    // Buscar la institución correspondiente al idUsuario
    const institucion = datosInstitucion.find(
      (inst: any) => inst.idUsuario === idUsuarioPregunta
    );

    // Añadir los datos de la institución (si existe)
    if (institucion) {
      //pregunta.datosInstitucion = institucion;
    }

    // Agrupar por idCuestionario
    if (!acc[idCuestionario]) {
      acc[idCuestionario] = [];
    }
    acc[idCuestionario].push(pregunta);
    acc[idCuestionario].institucion = institucion

    return acc;
  }, {});


  console.log(preguntasAgrupadas)

  const categoriasGeneros = Array.from(new Set(preguntasCuestionario.map((item: any) =>
    `${item.expand?.idCategoria?.descripcion}`
  )));

  const categoriasUnicas = [
    ...new Set(Object.values(preguntasAgrupadas).flat().map((pregunta: any) => pregunta.expand.idCategoria.descripcion)),
  ];
  //console.log(categoriasUnicas)
  //console.log(preguntasAgrupadas);

  // Para cada cuestionario, calcular el estado del cuestionario
  /*const cuestionariosConEstado = Object.entries(preguntasAgrupadas).map(([cuestionarioId, preguntas]) => {
    // Determinar el estado del cuestionario
    let estado = "Sin empezar";
    if (preguntas.length > 0) {
      const completadas = preguntas.filter(
        (pregunta: any) => pregunta.test2 === true
      );
      if (completadas.length === preguntas.length) {
        estado = "Terminado";
      } else {
        estado = "En progreso";
      }
    }

    return {
      id: cuestionarioId,
      estadoCuestionario: estado,
    };
  });*/

  //console.log(cuestionariosConEstado);




  //TODO: HACER QUE SE MUESTREN TODAS LOS CAMPOS DE UNA ESCUELA EN UNA SOLA FILA
  /*
  const preguntas = await client.collection("estadisticaSuperior").getFullList({
    sort: "-created",
    expand: "idInstitucion.usuario,categoriaPersona,genero",
  });

  const collection = await client.collections.getOne('test_preguntas');
  if (collection.updateRule == "escuela = @request.auth.id && activa = true" && collection.createRule == "@request.auth.id != null && activa = true") {
    estadoCuestionario = "Desactivado"

  } else {
    estadoCuestionario = "Activado"
  }


  // Agrupar los datos por institución
  const datosAgrupados = preguntas.reduce<Record<string, InstitucionData>>((acc, item) => {
    const idInstitucion = item.expand?.idInstitucion?.id;
    if (idInstitucion) {
      if (!acc[idInstitucion]) {
        acc[idInstitucion] = {
          codigo: item.expand?.idInstitucion.expand.usuario.username,
          nombre: item.expand?.idInstitucion.nombre,
          datos: {}
        };
      }
      const key = `${item.expand?.categoriaPersona?.descripcion}-${item.expand?.genero?.descripcion}`;
      acc[idInstitucion].datos[key] = (acc[idInstitucion].datos[key] || 0) + item.cantidad;
    }
    return acc;
  }, {});

  // Obtener todas las categorías y géneros únicos
  const categoriasGeneros = Array.from(new Set(preguntas.map(item =>
    `${item.expand?.categoriaPersona?.descripcion}-${item.expand?.genero?.descripcion}`
  )));
*/
  return (
    <div className="container mx-auto my-8">
      <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Preguntas</CardTitle>
              <CardDescription>
                Gestiona los datos de las escuelas registradas.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {
              /*
            
            <div>{collection.createRule}</div>
            <div>{collection.updateRule}</div>*/}
            <div>Estado del Cuestionario: {estadoCuestionario}</div>
            <div className=" flex items-center justify-between">
              <ActualizarReglas datos={estadoCuestionario} />
              {// <ExportCSV data={preguntas} />
              }
            </div>

            <Table>
              <TableHeader>
                <TableRow className="capitalize">

                  <TableHead>Codigo</TableHead>
                  {categoriasUnicas.map((categoria) => (
                    <TableHead key={categoria} colSpan={2} className=' text-center'>
                      {categoria}
                    </TableHead>
                  ))}


                </TableRow>
                <TableRow>
                  <TableHead></TableHead>
                  {categoriasUnicas.map((categoria) => (
                    <Fragment key={categoria}>
                      <TableHead>Hombres</TableHead>
                      <TableHead>Mujeres</TableHead>
                    </Fragment>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className='capitalize'>
                {/*Object.values(datosAgrupados).map((institucion) => (
                  <TableRow key={institucion.nombre}>
                    <TableCell className="font-medium">{institucion.nombre}</TableCell>
                    <TableCell className="font-medium">{institucion.codigo}</TableCell>
                    {categoriasGeneros.map(cg => (
                      <TableCell key={cg}>{institucion.datos[cg] || 0}</TableCell>
                    ))}
                  </TableRow>
                ))*/}
                {Object.keys(preguntasAgrupadas).map((idCuestionario) => (
                  <TableRow key={idCuestionario}>
                    <TableCell>{idCuestionario}</TableCell>
                    {categoriasUnicas.map((categoria) => {
                      const pregunta = preguntasAgrupadas[idCuestionario].find(
                        (pregunta: any) => pregunta.expand.idCategoria.descripcion === categoria
                      );
                      const cantidadHombres = pregunta?.cantidadHombres || "N/A";
                      const cantidadMujeres = pregunta?.cantidadMujeres || "N/A";
                      return (
                        <Fragment key={categoria}>
                          <TableCell>{cantidadHombres}</TableCell>
                          <TableCell>{cantidadMujeres}</TableCell>
                        </Fragment>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ListaPreguntas;
