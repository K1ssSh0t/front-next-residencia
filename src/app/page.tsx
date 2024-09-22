import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { createServerClient } from "@/utils/pocketbase";
import Link from "next/link";
import CerrarSesion from "@/components/Login-Button";

const Page = () => {
  const cookieStore = cookies();

  const { authStore } = createServerClient(cookieStore);

  return (
    <div>
      <div>
        <header className="fixed top-0 left-0 z-50 w-full bg-background shadow-sm antialiased">
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
              <Button
                variant="outline"
                // onClick={() => console.log("fdsfdsf")}
              >
                Button
              </Button>
              {authStore.isValid ? (
                <>
                  <CerrarSesion />
                  <Button variant="outline" asChild>
                    <Link href="preguntas">Formulario</Link>
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
      </div>
    </div>
  );
};

export default Page;

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
