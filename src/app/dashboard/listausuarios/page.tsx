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
import { Badge } from "@/components/ui/badge"

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

    // Obtener todas las preguntas de una sola vez
    const todasLasPreguntas = await client.collection("test_preguntas").getFullList();

    // Agrupar las preguntas por la escuela
    const preguntasPorEscuela: { [key: string]: any[] } = todasLasPreguntas.reduce(
      (acc: any, pregunta: any) => {
        const escuelaId = pregunta.escuela;
        if (!acc[escuelaId]) {
          acc[escuelaId] = [];
        }
        acc[escuelaId].push(pregunta);
        return acc;
      },
      {}
    );
  
    // Para cada escuela, calcular el estado del cuestionario
    const escuelasConEstado = escuelas.map((escuela: any) => {
      const preguntas = preguntasPorEscuela[escuela.id] || [];
  
      // Determinar el estado del cuestionario
      let estado = 'Sin empezar';
      if (preguntas.length > 0) {
        const completadas = preguntas.filter((pregunta: any) => pregunta.test2 === true);
        if (completadas.length === preguntas.length) {
          estado = 'Terminado';
        } else {
          estado = 'En progreso';
        }
      }
  
      return {
        ...escuela,
        estadoCuestionario: estado,
      };
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
                  <TableHead>Estado del Cuestionario</TableHead>
                  <TableHead>Acciones</TableHead>
             
                </TableRow>
              </TableHeader>
              <TableBody>
                {escuelasConEstado?.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.username}
                    </TableCell>
                    <TableCell>Escuela Primaria Acme</TableCell>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      
                      <Badge className=" gap-2 " variant="outline">
                      <EstadoIcon estado={item.estadoCuestionario} />
                      {item.estadoCuestionario}</Badge>
                    </TableCell>
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

// Íconos SVG para los diferentes estados
function EstadoIcon({ estado }: { estado: string }) {
  if (estado === 'Sin empezar') {
    return (
      <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7" stroke="#e74c3c" strokeWidth="2" />
      </svg>
    );
  } else if (estado === 'En progreso') {
    return (
      <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7" stroke="#f39c12" strokeWidth="2" />
        <path d="M8 4v4h4" stroke="#f39c12" strokeWidth="2" />
      </svg>
    );
  } else if (estado === 'Terminado') {
    return (
      <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7" stroke="#2ecc71" strokeWidth="2" fill="#2ecc71" />
        <path d="M6 8l2 2 4-4" stroke="white" strokeWidth="2" />
      </svg>
    );
  }
  return null;
}
