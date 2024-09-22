"use client";

import { Button } from "./ui/button";
import { createBrowserClient } from "@/utils/pocketbase";
import { useRouter } from "next/navigation";

export default function CerrarSesion() {
  const { authStore } = createBrowserClient();
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        authStore.clear();
        router.refresh();
      }}
    >
      Cerrar Sesion
    </Button>
  );
}
