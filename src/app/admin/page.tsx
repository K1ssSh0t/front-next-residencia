"use client";

import React, { useEffect } from "react";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/utils/pocketbase";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

export default function AdminLogin() {
  const client = createBrowserClient();
  const navigate = useRouter();
  const formSchema = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(5),
  });
  useEffect(() => {
    console.log(client.authStore.isValid);
    if (client.authStore.isAdmin) {
      console.log("test1");
      navigate.push("/dashboard/listausuarios");
    }
    if (client.authStore.isValid == true && client.authStore.isAdmin != true) {
      console.log("test 2");
      navigate.push("/");
    }
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      await client.admins.authWithPassword(values.username, values.password);
      navigate.push("/dashboard/listausuarios");
    } catch (error) {
      console.log(error);
    } finally {
    }
  }
  return (
    <div className=" flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} type="password" />
                </FormControl>
                <FormDescription>Tu contraseña</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
