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

export default function FormPreguntas({ preguntas }: {
  preguntas: {
    nombre: string,
    region: string,
    municipio: string,
    id: string,
    nivelEducativo: string,
    tipoInstitucion: string,
    tipoBachiller: string
  } | null
}) {
  console.log(preguntas);
  const navigate = useRouter();
  const client = createBrowserClient();
  const existe = preguntas?.id ? true : false;

  const formSchema = z.object({
    nombre: z.string().min(2).max(50),
    region: z.string().optional(),
    municipio: z.string().optional(),
    nivelEducativo: z.string().min(2).max(50).optional(),
    tipoInstitucion: z.string().min(2).max(50).optional(),
    tipoBachiller: z.string().min(2).max(50).optional(),

  });

  // This can come from your database or API.
  const values: z.infer<typeof formSchema> = {
    nombre: preguntas?.nombre as string,
    region: preguntas?.region,
    municipio: preguntas?.municipio,
    nivelEducativo: preguntas?.nivelEducativo,
    tipoInstitucion: preguntas?.tipoInstitucion,
    tipoBachiller: preguntas?.tipoBachiller,

  };

  const defaultValues: Partial<z.infer<typeof formSchema>> = {
    nombre: preguntas?.nombre,
    region: preguntas?.region,
    municipio: preguntas?.municipio,
    nivelEducativo: preguntas?.nivelEducativo,
    tipoInstitucion: preguntas?.tipoInstitucion,
    tipoBachiller: preguntas?.tipoBachiller,
  };
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // example create data
    const data = {
      nombre: values.nombre,
      region: values.region,
      municipio: values.municipio,
      nivelEducativo: values.nivelEducativo,
      tipoInstitucion: values.tipoInstitucion,
      tipoBachiller: values.tipoBachiller,
      usuario: client.authStore.model?.id,
    };
    console.log(values);

    if (existe) {
      try {
        console.log("IDDDD");
        console.log(preguntas!.id);
        await client.collection("institucion").update(preguntas!.id, data);

        navigate.refresh();
      } catch (error) {
        console.log(error);
      } finally {
        return;
      }
    }
    try {
      await client.collection("institucion").create(data);

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
