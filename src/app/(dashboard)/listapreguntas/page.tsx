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

  const preguntas = await client.collection("test_preguntas").getFullList({
    sort: "-created",
    expand: "escuela",
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
                  <TableHead>Username</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Código de Centro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preguntas?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.tes1}</TableCell>
                    <TableCell>{JSON.stringify(item.test2)}</TableCell>
                    <TableCell>{item.expand?.escuela?.username}</TableCell>
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