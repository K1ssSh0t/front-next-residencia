"use client";

import { useEffect, useState } from "react";

import FormPreguntas from "./Formulario";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { createBrowserClient } from "@/utils/pocketbase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function Preguntas() {
  const navigate = useRouter();
  const client = createBrowserClient();
  const [preguntas, setPreguntas] = useState<any>({});
  //let preguntas: any = {};

  useEffect(() => {
    console.log(client.authStore.isValid);
    if (client.authStore.isValid == false) {
      navigate.push("/login");
      // console.log("No logeado");
    }
    const userId = client.authStore.model?.id;

    const fetchPregunta = async () => {
      const pregunta = await client
        .collection("test_preguntas")
        .getFirstListItem(`escuela="${userId}"`);
      //.getFirstListItem(`escuela="ldzdf8envrfyizz"`);
      // console.log("tesgsd");
      // console.log(pregunta);
      // setPreguntas(pregunta);
      //preguntas = pregunta;
      //console.log(preguntas);
      return pregunta;
      // navigate("/mipregunta", { state: { pregunta } });
    };

    fetchPregunta()
      .then((value) => {
        // preguntas = value;
        // console.log(preguntas);

        setPreguntas({
          ...preguntas,
          tes1: value.tes1,
          test2: value.test2,
          id: value.id,
        });
        //console.log(preguntas);
      })
      .catch((error) => {
        console.log("errrror");
        console.log(error);
        //setPreguntas({});
      });
  }, []);

  //
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 z-50 w-full bg-background shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <img
                src="/placeholder.svg"
                width="32"
                height="32"
                className="rounded-full"
                alt="Avatar"
                style={{ aspectRatio: "32/32", objectFit: "cover" }}
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
            <Button variant="outline" onClick={() => console.log("test")}>
              Button
            </Button>
            {client.authStore.isValid ? (
              <>
                <Button
                  onClick={() => {
                    client.authStore.clear();
                    navigate.refresh();
                  }}
                >
                  Cerrar Sesion
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Inicio</Link>
                </Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link href="login">Iniciar Sesion</Link>
              </Button>
            )}
            <ModeToggle></ModeToggle>
          </div>
        </div>
      </header>
      <main className="flex-1 pt-16 px-4 md:px-6">
        <div className=" flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <FormPreguntas
            tes1={preguntas?.tes1}
            test2={preguntas?.test2}
            id={preguntas?.id}
          />
        </div>
      </main>
    </div>
  );
}

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
