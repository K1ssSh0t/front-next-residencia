'use client'
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@/utils/pocketbase"
import { useRouter } from "next/navigation"

export function ActualizarReglas(  {datos}:{datos:string}) {
    const client = createBrowserClient()
    const router = useRouter();

    const cambiarReglas = async () => {
        const nuevasReglas = datos == "Activado" ? { createRule: "@request.auth.id != null && activa = true", updateRule: "escuela = @request.auth.id && activa = true" } : { createRule: "@request.auth.id != null", updateRule: "escuela = @request.auth.id" };

        await client.collections.update('test_preguntas', nuevasReglas);
        router.refresh();
    }

    return (<Button onClick={cambiarReglas}>
        Cambiar Permisos
    </Button>);


}