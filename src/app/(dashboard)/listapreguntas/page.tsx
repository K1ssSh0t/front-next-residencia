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

  //console.log(datosInstitucion)
  // grour preguntasCuestionario that have the same idCuestionario 
  // Agrupar las preguntas por idCuestionario
  const preguntasAgrupadas = preguntasCuestionario.reduce((acc: any, pregunta: any) => {
    const idCuestionario = pregunta.idCuestionario;
    const idUsuarioCuestionario = pregunta.expand?.idCuestionario?.expand.idUsuario?.id;

    // Si el cuestionario aún no ha sido agregado al objeto agrupado
    if (!acc[idCuestionario]) {
      acc[idCuestionario] = {
        preguntas: [],
        datosInstitucion: {}
      };

      // Buscar la institución correspondiente al idUsuario del cuestionario
      const institucion = datosInstitucion.find(
        (inst: any) => inst.idUsuario === idUsuarioCuestionario
      );
      // console.log(institucion)
      // Asignar la institución al cuestionario (si existe)
      if (institucion) {

        acc[idCuestionario].datosInstitucion = institucion;
      }
    }

    // Agregar la pregunta a la lista de preguntas del cuestionario
    acc[idCuestionario].preguntas.push(pregunta);

    return acc;
  }, {});


  // console.log(JSON.stringify(preguntasAgrupadas))
  const categorias = new Set<string>();

  // Iterar sobre cada conjunto de preguntas agrupadas por cuestionario
  Object.values(preguntasAgrupadas).forEach((data: any) => {
    // Iterar sobre las preguntas de cada cuestionario
    data.preguntas.forEach((pregunta: any) => {
      // Agregar la categoría de cada pregunta al Set
      if (pregunta.expand?.idCategoria?.descripcion) {
        categorias.add(pregunta.expand?.idCategoria?.descripcion);
      }
    });
  });

  const categoriasUnicas = Array.from(categorias);

  //console.log(JSON.stringify(categoriasUnicas))
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Municipio</TableHead>
                  {categoriasUnicas.map((categoria) => (
                    <TableHead key={categoria} colSpan={2} className=' text-center'>
                      {categoria}
                    </TableHead>
                  ))}


                </TableRow>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
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
                {Object.entries(preguntasAgrupadas).map(([idCuestionario, data]: any) => {
                  console.log(data.preguntas)

                  return (
                    <TableRow key={idCuestionario}>

                      <TableCell>{idCuestionario}</TableCell>
                      <TableCell>{data.datosInstitucion?.nombre}</TableCell>
                      <TableCell>{data.datosInstitucion?.region}</TableCell>
                      <TableCell>{data.datosInstitucion?.municipio}</TableCell>
                      {categoriasUnicas.map((categoria) => {

                        const pregunta = data.preguntas.find(
                          (pregunta: any) => pregunta?.expand?.idCategoria?.descripcion === categoria
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
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ListaPreguntas;
