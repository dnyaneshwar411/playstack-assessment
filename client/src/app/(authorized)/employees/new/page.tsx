"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
// --- shadcn/ui Component Imports ---
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/network/client"
import { toast } from "sonner"

const ROLES = ["Employee", "HR", "Super Admin"] as [string, ...string[]]
const USER_STATUSES = ["Active", "In Active"] as [string, ...string[]]
const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Human Resources",
  "Marketing",
  "Sales",
  "Finance",
] as [string, ...string[]]

const employeeFormSchema = z.object({
  email: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "should be a valid email"),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long"),
  name: z.string().trim(),

  // Validates as string in the form, converted to integer on submit
  mobileNumber: z
    .string(),
  // .trim()
  // .optional()
  // .refine(
  //   (val) => !val || /^\d+$/.test(val),
  //   "Must be a valid positive integer"
  // ),

  department: z.enum(DEPARTMENTS, {
    message: "Please select a department",
  }),
  designation: z.string().trim(),
  role: z.enum(ROLES),
  status: z.enum(USER_STATUSES),
  joiningDate: z.string(),

  // Validates as string in the form, converted to float on submit
  salary: z
    .string()
  // .trim()
  // .optional()
  // .refine(
  //   (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
  //   "Must be a positive number"
  // ),
})

type EmployeeFormValues = z.infer<typeof employeeFormSchema>

export default function AddEmployeePage() {
  const router = useRouter()
  const [globalError, setGlobalError] = useState<string | null>(null)

  // Initialize React Hook Form with strict type inference
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      mobileNumber: "",
      department: "Engineering",
      designation: "",
      role: "Employee",
      status: "Active",
      joiningDate: format(new Date(), "yyyy-MM-dd"),
      salary: "",
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (values: EmployeeFormValues) => {
    setGlobalError(null)

    try {
      const payload = {
        ...values,
        mobileNumber: Number(values?.mobileNumber),
        salary: Number(values?.salary),
        joiningDate: new Date(values?.joiningDate).toString(),
      }

      const response = await api.post("/api/v1/user/employees", { body: payload })

      if (response.code !== 200) {
        throw new Error(response.message || "Failed to onboard employee.");
      }

      toast.success(response.message || "Successfull");
      form.reset()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred."
      setGlobalError(message)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-6 md:px-10">
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">Onboard New Employee</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Create a new personnel profile and assign organizational permissions.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-card text-card-foreground border rounded-lg shadow-sm p-6 space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-sm font-semibold tracking-tight border-b pb-2">
                Account Credentials
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Email Address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="employee@company.com"
                          type="email"
                          className="h-9 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Temporary Password <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Min. 6 characters"
                          type="password"
                          className="h-9 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold tracking-tight border-b pb-2">
                Personal Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jane Doe"
                          className="h-9 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Mobile Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="18005551234"
                          type="number"
                          className="h-9 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold tracking-tight border-b pb-2">
                Organizational Role
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Department <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-9 text-sm font-medium">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept} className="text-xs font-medium">
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Designation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Senior Engineer"
                          className="h-9 text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">System Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-9 text-sm font-medium">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ROLES.map((role) => (
                            <SelectItem key={role} value={role} className="text-xs font-medium">
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-9 text-sm font-medium">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {USER_STATUSES.map((status) => (
                            <SelectItem key={status} value={status} className="text-xs font-medium">
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="joiningDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Joining Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="w-full h-8 text-sm" {...field} />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold tracking-tight border-b pb-2">
                Compensation
              </h2>
              <div className="w-full sm:w-1/2">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">
                        Annual Salary (USD)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="120000"
                          type="number"
                          className="h-9 text-sm font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
 {globalError && (
          <div className="p-3 text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
            {globalError}
          </div>
        )}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="text-xs font-medium h-9 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="text-xs font-medium h-9 px-4"
              >
                {isSubmitting ? "Onboarding..." : "Create Employee Profile"}
              </Button>
            </div>
          </form>
        </Form>

      </div>
    </div>
  )
}