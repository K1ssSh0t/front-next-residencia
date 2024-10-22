"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Switch } from "@/components/ui/switch";
import { createBrowserClient } from "@/utils/pocketbase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { SuperiorResponse } from "@/types/pocketbase-types";
import { TipoInstitucionResponse } from "@/types/pocketbase-types";
import { useToast } from "@/hooks/use-toast";


export default function TabsFormularios(
  { preguntas, tiposDeInstitucion }: { preguntas: SuperiorResponse | undefined, tiposDeInstitucion: TipoInstitucionResponse[] }) {
  //console.log(preguntas);
  console.log(tiposDeInstitucion);
  const navigate = useRouter();
  const client = createBrowserClient();
  const existe = preguntas?.id
  const { toast } = useToast();

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

    try {
      if (existe) {
        await client.collection("Superior").update(preguntas!.id, data);
        toast({
          title: "Formulario actualizado",
          description: "Los datos se han actualizado correctamente.",
          variant: "warning",
        });
      } else {
        await client.collection("Superior").create(data);
        toast({
          title: "Formulario enviado",
          description: "Los datos se han guardado correctamente.",
          variant: "success",
        });
      }
      setForm1Completed(true);
      navigate.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar el formulario. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    }
  }
  const [activeTab, setActiveTab] = useState("main");
  const [form1Completed, setForm1Completed] = useState(false);
  const [form2Completed, setForm2Completed] = useState(false);

  const handleForm1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form validation logic here
    setForm1Completed(true);
  };

  const handleForm2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form validation logic here
    setForm2Completed(true);
  };

  const canAccessAdditionalForm = form1Completed //&& form2Completed;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="main">Formularios Principales</TabsTrigger>
          <TabsTrigger value="additional" disabled={!canAccessAdditionalForm}>
            Formulario Adicional
          </TabsTrigger>
        </TabsList>
        <TabsContent value="main">
          <section className="space-y-6 mt-6">
            <h2 className="text-2xl font-bold">Formularios Principales</h2>

            <Card>
              <CardHeader>
                <CardTitle>Formulario 1</CardTitle>
                <CardDescription>
                  Por favor, complete la información personal.
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                {form1Completed && (
                  <Alert className="mt-4">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Formulario 1 Completado</AlertTitle>
                    <AlertDescription>
                      Ha completado exitosamente el Formulario 1.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>



            {!canAccessAdditionalForm && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Acceso al Formulario Adicional</AlertTitle>
                <AlertDescription>
                  Para acceder al Formulario Adicional, por favor complete los
                  Formularios 1 y 2.
                </AlertDescription>
              </Alert>
            )}
          </section>
        </TabsContent>
        <TabsContent value="additional">
          <section className="space-y-6 mt-6">
            <h2 className="text-2xl font-bold">Formulario Adicional</h2>

            <Card>
              <CardHeader>
                <CardTitle>Formulario 3</CardTitle>
                <CardDescription>
                  Por favor, complete la información adicional.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      placeholder="Ingrese el asunto"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Input
                      id="message"
                      placeholder="Escriba su mensaje aquí"
                      required
                    />
                  </div>
                  <Button type="submit">Enviar Formulario 3</Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
