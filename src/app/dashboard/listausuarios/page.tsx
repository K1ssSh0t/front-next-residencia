import { createServerClient } from "@/utils/pocketbase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { AgregarEscuelas } from "./agregar-escuela";
import { AcualizarEscuela } from "./acualizar-escuela";
import { redirect } from 'next/navigation';
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'


async function Usuarios() {
  const cookieStore = cookies();

  const client = createServerClient(cookieStore);

 
  const a = client.authStore.isAdmin;


  if (!a) {
    redirect("/");
  }

  const escuelas = await client.collection("escuelas").getFullList({
    sort: "-created",
  });

  return (
    <div className="container mx-auto my-8">
      <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Escuelas</CardTitle>
              <CardDescription>
                Gestiona los datos de las escuelas registradas.
              </CardDescription>
            </div>
            <AgregarEscuelas />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Código de Centro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escuelas?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.username}
                    </TableCell>
                    <TableCell>Escuela Primaria Acme</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AcualizarEscuela Escuela={item} />
                        <Button variant="outline" size="sm" color="red">
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
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

export default Usuarios;

function MountainIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}