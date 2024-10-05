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

async function ListaPreguntas() {
  const cookieStore = cookies();

  const client = createServerClient(cookieStore);

  let estadoCuestionario = "";

  //TODO: HACER QUE SE MUESTREN TODAS LOS CAMPOS DE UNA ESCUELA EN UNA SOLA FILA
  const preguntas = await client.collection("estadisticaSuperior").getFullList({
    sort: "-created",
    expand: "idInstitucion,categoriaPersona,genero",
  });

  const collection = await client.collections.getOne('test_preguntas');
  if (collection.updateRule == "escuela = @request.auth.id && activa = true" && collection.createRule == "@request.auth.id != null && activa = true") {
    estadoCuestionario = "Desactivado"

  } else {
    estadoCuestionario = "Activado"
  }

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
            <div>{collection.createRule}</div>
            <div>{collection.updateRule}</div>
            <div>Estado del Cuestionario: {estadoCuestionario}</div>
            <div className=" flex items-center justify-between">
              <ActualizarReglas datos={estadoCuestionario} />
              <ExportCSV data={preguntas} />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Genero</TableHead>
                  <TableHead>Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='capitalize'>
                {preguntas?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.expand?.idInstitucion?.username}</TableCell>
                    <TableCell>{item.expand?.categoriaPersona?.descripcion}</TableCell>
                    <TableCell>{item.expand?.genero?.descripcion}</TableCell>
                    <TableCell>{item.cantidad}</TableCell>
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