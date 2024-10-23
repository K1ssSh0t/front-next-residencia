import { createServerClient } from "@/utils/pocketbase";
import { cookies } from "next/headers";
import { ClientResponseError } from "pocketbase";
import React from "react";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ArrowUpToLine } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";




async function getPreguntas() {
    const cookieStore = cookies();
    const client = createServerClient(cookieStore);

    const userId = client.authStore.model?.id;
    const tipoEscuela: boolean = client.authStore.model?.nivelEducativo;

    try {
        if (tipoEscuela) {
            const nivelSuperior: any = await client.collection("Superior").getFirstListItem(`idUsuario="${userId}"`, {
                expand: "idTipoInstitucion"
            });
            return nivelSuperior
        }
    } catch (error) {
        if ((error as ClientResponseError).status === 404) {
            console.log("No tienes una informacion en Institucion")
        }
        return null;
    }
}

async function getCuestionario() {
    const cookieStore = cookies();
    const client = createServerClient(cookieStore);

    const userId = client.authStore.model?.id;

    try {
        const cuestionario = await client.collection("Cuestionario").getFirstListItem(`idUsuario="${userId}"`);
        return cuestionario
    } catch (error) {
        return null
    }
}

async function getPreguntasCuestionario(cuestionarioId: string) {
    const cookieStore = cookies();
    const client = createServerClient(cookieStore);

    try {
        const preguntasCuestionario = await client.collection("Preguntas").getFullList({
            filter: `idCuestionario = "${cuestionarioId}"`,
            expand: "idCategoria"
        });
        return preguntasCuestionario
    } catch (error) {
        return null
    }
}

export default async function Preguntas() {

    const preguntas = await getPreguntas();
    const cuestionario = await getCuestionario();
    console.log(cuestionario?.id)

    const preguntasCuestionario = await getPreguntasCuestionario(cuestionario?.id as string);
    console.log(preguntasCuestionario)

    return (
        <div className="container mx-auto my-8 ">
            <div className="flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
                <Card >
                    <CardHeader className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-5xl">Datos de la Institucion</CardTitle>
                            <CardDescription>
                                Tus Datos
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 capitalize ">
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm font-medium">Nombre de la Institucion:</p>
                                <p className="text-sm">{preguntas?.nombre}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm font-medium">Municipio:</p>
                                <p className="text-sm">{preguntas?.municipio}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm font-medium">Region:</p>
                                <p className="text-sm">{preguntas?.region}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm font-medium">Tipo de Institucion:</p>
                                <p className="text-sm">{preguntas?.expand?.idTipoInstitucion?.descripcion}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm font-medium">Carera:</p>
                                <p className="text-sm">{cuestionario?.carrera}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-2 text-center">
                                <p className="text-sm font-medium">Datos </p>
                            </div>
                            <div className=" rounded-lg border bg-card text-card-foreground shadow-sm">
                                {preguntasCuestionario?.map((datos: any) => (
                                    <div className="grid grid-cols-3 gap-2 text-center " key={datos.id}>
                                        <p className="text-sm font-medium">{datos.expand?.idCategoria.descripcion}</p>
                                        <div className="text-sm">
                                            {datos.cantidadHombres}

                                        </div><div className="text-sm">
                                            {datos.cantidadMujeres}

                                        </div>
                                    </div>
                                )
                                )
                                }</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
