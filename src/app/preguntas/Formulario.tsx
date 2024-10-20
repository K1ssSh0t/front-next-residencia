"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { createBrowserClient } from "@/utils/pocketbase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { SuperiorResponse } from "@/types/pocketbase-types";
import { TipoInstitucionResponse } from "@/types/pocketbase-types";

export default function FormPreguntas({ preguntas, tiposDeInstitucion }: { preguntas: SuperiorResponse | undefined, tiposDeInstitucion: TipoInstitucionResponse[] }) {
  //console.log(preguntas);
  console.log(tiposDeInstitucion);
  const navigate = useRouter();
  const client = createBrowserClient();
  const existe = preguntas?.id

  const formSchema = z.object({
    nombre: z.string().min(2).max(50),
    region: z.string().optional(),
    municipio: z.string().optional(),
    //tipoInstitucion: z.string().min(2).max(50).optional(),


  });

  // This can come from your database or API.
  const values: z.infer<typeof formSchema> = {
    nombre: preguntas?.nombre as string,
    region: preguntas?.region,
    municipio: preguntas?.municipio,
    //tipoInstitucion: preguntas?.idTipoInstitucion,


  };

  const defaultValues: Partial<z.infer<typeof formSchema>> = {
    nombre: preguntas?.nombre,
    region: preguntas?.region,
    municipio: preguntas?.municipio,
    //tipoInstitucion: preguntas?.idTipoInstitucion

  };
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {

    console.log("boton apretado")
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // example create data
    const data = {
      nombre: values.nombre,
      region: values.region,
      municipio: values.municipio,
      // idTipoInstitucion: values.tipoInstitucion,
      idUsuario: client.authStore.model?.id,
    };
    //console.log(values);

    if (existe) {
      try {
        console.log("IDDDD");
        console.log("Actualizando")
        console.log(preguntas?.id);
        await client.collection("Superior").update(preguntas!.id, data);

        navigate.refresh();
      } catch (error) {
        console.log(error);
      } finally {
        return;
      }
    }
    try {
      console.log("Creando")
      await client.collection("Superior").create(data);

      navigate.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      return;
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={preguntas?.nombre} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={preguntas?.region} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="municipio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municpio</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={preguntas?.municipio} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">{existe ? "Actualizar" : "Enviar"}</Button>
        </form>
      </Form>
    </div>
  );
}
