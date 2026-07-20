"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { loginSchema, LoginSchemaInput } from "@/validation-schemas/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { buildToastMessage } from "@/lib/catchAsync"

export default function LoginPage() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const form = useForm<LoginSchemaInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    mode: "onChange",
  })
  const router = useRouter();

  const loginUser = async function (data: LoginSchemaInput) {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      if (responseData.code !== 200) throw new Error(responseData.message);
      setLoginSuccess(true)
      router.replace("/dashboard")
      toast.success("Successfully Logged In!");
    } catch (error) {
      toast.error(buildToastMessage(error));
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="max-w-sm md:max-w-4xl">
        <div className={"flex flex-col gap-6"} >
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0">
              <div className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(loginUser)}>
                    <FieldGroup>
                      <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-2xl font-bold capitalize">Welcome back</h1>
                        <p className="text-balance text-muted-foreground">
                          Login to your account
                        </p>
                      </div>
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email ID</FormLabel>
                          <FormControl><Input placeholder="Email ID" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center">
                            <FormLabel>Password</FormLabel>
                          </div>
                          <FormControl><Input placeholder="********" type="password" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Field>
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || loginSuccess}>Login</Button>
                      </Field>
                      {/* <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                        Or continue with
                      </FieldSeparator> */}
                    </FieldGroup>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center select-none text-transparent">
            By clicking continue, you agree to our Terms of Service{" "}
            and Privacy Policy
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}