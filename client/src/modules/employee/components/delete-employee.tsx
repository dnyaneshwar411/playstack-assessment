"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/common/confirmation-alert";
import api from "@/network/client";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Employee {
  _id: string;
  name: string;
  email: string;
  mobileNumber: number;
  role: string;
  department: string;
  designation: string;
  salary: number;
  status: string;
  joiningDate: string;
  avatar: {
    private: boolean;
    key: string;
  };
}

interface DeleteEmployeeProps {
  employee: Employee | Record<string, any>;
  onSuccess?: () => void;
  children?: React.ReactNode;
  variant?: "default" | "destructive";
}

export default function DeleteEmployee({
  employee,
  onSuccess,
  children,
  variant = "destructive",
}: DeleteEmployeeProps) {
  const [error, setError] = useState<string>("");

  const handleDelete = async function (
    setLoading: (loading: boolean) => void,
    closeRef: React.RefObject<HTMLButtonElement | null>
  ) {
    try {
      setLoading(true);
      setError("");
      const response = await api.delete(`/api/v1/user/employees/${employee._id}`);

      toast.success(response.message || `Successfully Deleted!`);

      if (onSuccess) {
        onSuccess();
      }

      if (closeRef.current) {
        closeRef.current.click();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete employee");
      toast.error(err instanceof Error ? err.message : "Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmationDialog
      title={`Delete ${employee.name}?`}
      description={`Are you sure you want to delete "${employee.name}"? This action cannot be undone.`}
      onConfirm={handleDelete}
      onClose={() => setError("")}
      variant={variant}
      confirmLabel="Delete Employee"
      error={error}
    >
      <AlertDialogTrigger>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
    </ConfirmationDialog>
  );
}