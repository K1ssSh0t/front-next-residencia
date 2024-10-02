import CerrarSesion from "@/components/Login-Button";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { createServerClient } from "@/utils/pocketbase";
import { createServer } from "http";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

export default function PreguntasLayout({
    children, // will be a page or nested layout
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const client = createServerClient(cookieStore);
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

                        {client.authStore.isValid ? (
                            <>
                                <CerrarSesion />
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
            <main className="flex-1 pt-16 px-4 md:px-6">{children}</main>

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
