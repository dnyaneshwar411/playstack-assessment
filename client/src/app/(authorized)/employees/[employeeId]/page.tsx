"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building2,
  Copy,
  Check,
  Edit,
  Shield,
  Key,
  Users,
  FileText,
  Award,
  Clock,
  Activity,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Save,
  RotateCcw,
  Trash2,
  Loader2
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ErrorState } from "@/components/ui/error";
import { ComponentLoader } from "@/components/ui/loader";
import useFetch from "@/hooks/useFetch";
import { copyText } from "@/lib/helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import EditEmployee from "@/modules/employee/components/edit-employee";
import api from "@/network/client";

type EmployeeData = {
  _id: string;
  name: string;
  email: string;
  mobileNumber: number;
  employeeId: string;
  reportingManager: string | null;
  role: string;
  department: string;
  designation: string;
  salary: number;
  status: "Active" | "In Active";
  joiningDate: string;
  createdAt: string;
  updatedAt: string;
  avatar: {
    private: boolean;
    key: string;
  };
}

interface ScopeMap {
  [key: string]: boolean;
}

interface EmployeeDetailsData {
  profile: EmployeeData;
  scopeMap: {
    _id: string;
    user: EmployeeData;
    scopeMap: ScopeMap;
    __v: number;
  };
}

export const SCOPES = [
  "user:read:own",
  "user:read:all",
  "user:create:all",
  "user:update:own",
  "user:update:all",
  "user:delete:all",
  "manager:assign:all"
] as const;

const EmployeeHeader = ({
  employee,
  onEdit
}: {
  employee: EmployeeData;
  onEdit: () => void;
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-emerald-500" : "bg-rose-500";
  };

  return (
    <Card className="border-border/40 bg-gradient-to-br from-background via-card/80 to-card shadow-lg overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-background shadow-xl">
                <AvatarImage src={employee.avatar?.key} />
                <AvatarFallback className="text-3xl md:text-4xl font-bold bg-primary/10 text-primary">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute bottom-1 right-1 h-4 w-4 rounded-full ring-2 ring-background",
                  getStatusColor(employee.status)
                )}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{employee.name}</h1>
                <Badge className="gap-1.5 bg-primary/10 text-primary border-primary/20">
                  {employee.role}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {employee.designation}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {employee.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <Badge variant="outline" className="font-mono">
                    {employee.employeeId}
                  </Badge>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Joined {new Date(employee.joiningDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleCopy(employee.email)}
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy Email"}
            </Button>
            <Button size="sm" className="gap-2" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{employee.email}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">{employee.mobileNumber}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", getStatusColor(employee.status))} />
              <p className="text-sm font-medium">{employee.status}</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Salary</p>
            <p className="text-sm font-medium">
              ${employee.salary.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoCard = ({
  icon: Icon,
  label,
  value,
  color = "text-primary"
}: {
  icon: any;
  label: string;
  value: string | number;
  color?: string;
}) => (
  <Card className="border-border/40 bg-background/50">
    <CardContent className="p-4 flex items-center gap-3">
      <div className={cn("rounded-full p-2 bg-primary/10", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium truncate">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const ScopeToggle = ({
  scopeKey,
  value,
  onChange,
  disabled
}: {
  scopeKey: string;
  value: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  const getScopeLabel = (key: string) => {
    return key
      .split(":")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getScopeDescription = (key: string) => {
    const descriptions: { [key: string]: string } = {
      "user:read:own": "View own profile information",
      "user:read:all": "View all user profiles",
      "user:create:all": "Create new users",
      "user:update:own": "Update own profile",
      "user:update:all": "Update any user's profile",
      "user:delete:all": "Delete users",
      "manager:assign:all": "Assign reporting managers",
    };
    return descriptions[key] || "";
  };

  return (
    <div className="flex items-start justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/40">
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{getScopeLabel(scopeKey)}</p>
          <Badge variant={value ? "default" : "secondary"} className="text-xs">
            {value ? "Granted" : "Restricted"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {getScopeDescription(scopeKey)}
        </p>
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

export default function Page() {
  const { employeeId } = useParams();
  const router = useRouter();
  const { isLoading, data, error, mutate } = useFetch(`/api/v1/user/employees/${employeeId}`);
  const [scopes, setScopes] = useState<ScopeMap>({});
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (data?.data?.scopeMap?.scopeMap) {
      setScopes(data.data.scopeMap.scopeMap);
    }
  }, [data]);

  if (isLoading && !data) return <ComponentLoader />;

  if (error || data?.code !== 200) {
    return (
      <ErrorState
        title={data?.message || "Unable to load employee details"}
        description="We're having trouble fetching the employee information. Please try again."
        reset={() => mutate()}
      />
    );
  }

  const employeeData: EmployeeDetailsData = data?.data;
  if (!employeeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  const { profile, scopeMap } = employeeData;
  const totalScopes = SCOPES.length;
  const grantedScopes = Object.values(scopes).filter(v => v === true).length;

  const handleScopeToggle = (key: string, value: boolean) => {
    setScopes(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveScopes = async () => {
    try {
      setSaving(true);

      const response = await api.put(`/api/v1/user/${employeeId}/roles`, {
        body: { scopeMap: scopes },
      });

      if (response.code !== 200) {
        throw new Error(response.message || "Failed to update permissions");
      }

      toast.success(response.message || "Permissions updated successfully!");
      setHasChanges(false);
      mutate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update permissions");
    } finally {
      setSaving(false);
    }
  };

  const handleResetScopes = () => {
    if (scopeMap?.scopeMap) {
      setScopes(scopeMap.scopeMap);
      setHasChanges(false);
      toast.info("Permissions reset to original values");
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        mobileNumber: profile.mobileNumber,
        role: profile.role,
        department: profile.department,
        designation: profile.designation,
        salary: profile.salary,
        status: profile.status,
        joiningDate: profile.joiningDate,
        avatar: profile.avatar,
      };

      const response = await fetch(`/api/v1/user/employees/${profile._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      toast.success(`${profile.name} has been deleted successfully`);
      router.push("/employees");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete employee");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-2"
          onClick={() => router.back()}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Employee Details</h1>
            <p className="text-muted-foreground text-sm">
              View and manage employee information
            </p>
          </div>
        </div>

        <EmployeeHeader
          employee={profile}
          onEdit={() => router.push(`/employees/${employeeId}/edit`)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <InfoCard
            icon={User}
            label="Employee ID"
            value={profile.employeeId}
          />
          <InfoCard
            icon={Users}
            label="Role"
            value={profile.role}
            color="text-purple-500"
          />
          <InfoCard
            icon={Briefcase}
            label="Department"
            value={profile.department}
            color="text-blue-500"
          />
          <InfoCard
            icon={Award}
            label="Designation"
            value={profile.designation}
            color="text-amber-500"
          />
        </div>

        <Tabs
          defaultValue="overview"
          className="mt-6"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="bg-background/50 backdrop-blur-sm border border-border/40">
            <TabsTrigger value="overview" className="gap-2">
              <FileText className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2">
              <Shield className="h-4 w-4" />
              Permissions
              <Badge variant="secondary" className="ml-1">
                {grantedScopes}/{totalScopes}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Complete employee details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{profile.mobileNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Employee ID</p>
                    <p className="font-medium font-mono">{profile.employeeId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Joining Date</p>
                    <p className="font-medium">
                      {new Date(profile.joiningDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Account Created</p>
                    <p className="font-medium">
                      {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Department</p>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{profile.department}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Designation</p>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{profile.designation}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Role</p>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="default">{profile.role}</Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      {profile.status === "Active" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-500" />
                      )}
                      <p className="font-medium">{profile.status}</p>
                    </div>
                  </div>
                </div>

                {profile.reportingManager && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Reporting Manager</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">{profile.reportingManager}</p>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex gap-3 pt-2">
                  <EditEmployee employee={data.data.profile} onSuccess={mutate} />

                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Employee
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{profile.name}"? This action cannot be undone.
                          All associated data will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteEmployee}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle>Permissions & Scopes</CardTitle>
                    <CardDescription>
                      Manage access permissions for this employee
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1.5">
                      <Shield className="h-3 w-3" />
                      {grantedScopes} of {totalScopes} granted
                    </Badge>
                    {hasChanges && (
                      <Badge variant="secondary" className="gap-1.5 animate-pulse">
                        Unsaved changes
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {SCOPES.map((scopeKey) => (
                    <ScopeToggle
                      key={scopeKey}
                      scopeKey={scopeKey}
                      value={scopes[scopeKey] || false}
                      onChange={(checked) => handleScopeToggle(scopeKey, checked)}
                      disabled={saving}
                    />
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleSaveScopes}
                    disabled={!hasChanges || saving}
                    className="gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetScopes}
                    disabled={!hasChanges || saving}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                  {hasChanges && (
                    <p className="text-sm text-muted-foreground">
                      You have unsaved changes to permissions
                    </p>
                  )}
                </div>

                {!hasChanges && !saving && (
                  <div className="mt-4 flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="rounded-full p-2 bg-primary/10">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">All permissions are up to date</p>
                      <p className="text-sm text-muted-foreground">
                        No changes pending. The current permissions are saved.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}