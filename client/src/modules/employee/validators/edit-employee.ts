import z from "zod"

export const employeeUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "should be a valid email"),
  mobileNumber: z
    .number({
      error: "Mobile number must be a number",
    })
    .min(1000000000, "Invalid mobile number")
    .max(9999999999, "Invalid mobile number"),
  role: z.string(),
  department: z.enum(["Product", "Sales", "Human Resources", "Finance", "Marketing", "Engineering"], {
    message: "Department is required",
  }),
  designation: z.string().min(1, "Designation is required"),
  salary: z
    .number({
      error: "Salary must be a number",
    })
    .min(0, "Salary must be positive"),
  status: z.enum(["Active", "In Active"], {
    message: "Status is required",
  }),
  joiningDate: z.string().min(1, "Joining date is required"),
  avatar: z.object({
    private: z.boolean(),
    key: z.string(),
  }),
});