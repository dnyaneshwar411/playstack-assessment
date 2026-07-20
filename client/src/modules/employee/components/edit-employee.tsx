import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import api from "@/network/client";
import { employeeUpdateSchema } from "../validators/edit-employee";


type EmployeeUpdateForm = z.infer<typeof employeeUpdateSchema>;

type Employee = {
  _id: string;
  name: string;
  email: string;
  mobileNumber: number;
  role: string;
  department: "Product" | "Human Resources" | "Finance" | "Marketing" | "Engineering";
  designation: string;
  salary: number;
  status: "Active" | "Inactive";
  joiningDate: string;
  avatar: {
    private: boolean;
    key: string;
  };
}

type UpdateEmployeeDialogProps = {
  employee: Employee | Record<string, any> | null;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export default function EditEmployee({
  employee,
  onSuccess
}: UpdateEmployeeDialogProps) {
  const [open, onOpenChange] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<EmployeeUpdateForm>({
    resolver: zodResolver(employeeUpdateSchema),
    defaultValues: {
      name: "",
      email: "",
      mobileNumber: 0,
      role: "",
      department: "Product",
      designation: "",
      salary: 0,
      status: "Active",
      joiningDate: "",
      avatar: {
        private: false,
        key: "",
      },
    },
  });

  useEffect(() => {
    if (employee && open) {
      form.reset({
        name: employee.name || "",
        email: employee.email || "",
        mobileNumber: employee.mobileNumber || 0,
        role: employee.role || "",
        department: employee.department || "Product",
        designation: employee.designation || "",
        salary: employee.salary || 0,
        status: employee.status || "Active",
        joiningDate: employee.joiningDate || "",
        avatar: employee.avatar || { private: false, key: "" },
      });

      if (employee.avatar?.key) {
        setAvatarPreview(employee.avatar.key);
      } else {
        setAvatarPreview("");
      }
    }
  }, [employee, open, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EmployeeUpdateForm) => {
    if (!employee) {
      toast.error("No employee selected");
      return;
    }

    try {
      setLoading(true);

      let avatarKey = data.avatar.key;

      // tbd
      if (avatarFile) {
        avatarKey = await api.post("avatarFile", {
          body: new FormData(),
        });
      }

      const payload = {
        ...data,
        avatar: {
          private: false,
          key: avatarKey,
        },
      };

      const response = await api.post(
        `/api/v1/user/employees/${employee._id}`,
        { body: payload }
      );

      if (response.code !== 200) {
        throw new Error(response.message || "Failed to update employee");
      }

      toast.success(response.message || "Employee updated successfully");

      if (typeof onSuccess === "function") onSuccess();

      onOpenChange(false);
      form.reset();
      setAvatarFile(null);
      setAvatarPreview("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="bg-emerald-900/20 text-emerald-200 hover:bg-emerald-800/10 hover:text-green-400 px-4 py-1">
         Edit Employee
      </DialogTrigger>
      <DialogContent className="!max-w-2xl max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Employee</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview} />
                <AvatarFallback>
                  {employee?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-48"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload new avatar (optional)
                </p>
              </div>
            </div>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number */}
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter mobile number"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role - Non-editable */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="Product">Product</SelectItem>
                      <SelectItem className="cursor-pointer" value="Human Resources">
                        Human Resources
                      </SelectItem>
                      <SelectItem className="cursor-pointer" value="Sales">Sales</SelectItem>
                      <SelectItem className="cursor-pointer" value="Finance">Finance</SelectItem>
                      <SelectItem className="cursor-pointer" value="Marketing">Marketing</SelectItem>
                      <SelectItem className="cursor-pointer" value="Engineering">Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Designation */}
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter designation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Salary */}
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter salary"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem className="cursor-pointer" value="Active">Active</SelectItem>
                      <SelectItem className="cursor-pointer" value="In Active">In Active</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Joining Date */}
            <FormField
              control={form.control}
              name="joiningDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Joining Date</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? field.value.slice(0, 16) : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? new Date(value).toISOString() : "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                  setAvatarFile(null);
                  setAvatarPreview("");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Employee"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}