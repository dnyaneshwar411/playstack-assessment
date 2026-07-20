"use client";

import { useState } from "react";
import {
  User,
  Calendar,
  Briefcase,
  Building2,
  Copy,
  Check,
  Shield,
  Users,
  FileText,
  Award,
  Clock,
  Activity,
  LogOut,
  CheckCircle,
  XCircle,
  HelpCircle,
  Layout
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/ui/error";
import { ComponentLoader } from "@/components/ui/loader";
import useFetch from "@/hooks/useFetch";
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
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import EditEmployee from "@/modules/employee/components/edit-employee";
import { toast } from "sonner";
import { buildToastMessage } from "@/lib/catchAsync";

type ProfileData = {
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
  scopeMap: {
    [key: string]: boolean;
  };
  avatar: {
    private?: boolean
    key?: string
  }
}

const ProfileHeader = ({
  profile,
  mutate
}: {
  profile: ProfileData;
  mutate: () => void
}) => {
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
                <AvatarImage src={profile.avatar?.key} />
                <AvatarFallback className="text-3xl md:text-4xl font-bold bg-primary/10 text-primary">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute bottom-1 right-1 h-4 w-4 rounded-full ring-2 ring-background",
                  getStatusColor(profile.status)
                )}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                <Badge className="gap-1.5 bg-primary/10 text-primary border-primary/20">
                  {profile.role}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {profile.designation}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {profile.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <Badge variant="outline" className="font-mono">
                    {profile.employeeId}
                  </Badge>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Joined {new Date(profile.joiningDate).toLocaleDateString("en-US", {
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
              onClick={() => handleCopy(profile.email)}
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy Email"}
            </Button>
            <EditEmployee employee={profile} onSuccess={mutate} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{profile.email}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm font-medium">{profile.mobileNumber}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Status</p>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", getStatusColor(profile.status))} />
              <p className="text-sm font-medium">{profile.status}</p>
            </div>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Salary</p>
            <p className="text-sm font-medium">
              ${profile.salary.toLocaleString()}
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

const PermissionCard = ({
  permission,
  value
}: {
  permission: string;
  value: boolean;
}) => {
  const getPermissionLabel = (key: string) => {
    return key
      .split(":")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getPermissionDescription = (key: string) => {
    const descriptions: { [key: string]: string } = {
      "user:read:own": "View own profile information",
      "user:read:all": "View all user profiles",
      "user:create:all": "Create new users",
      "user:update:own": "Update own profile",
      "user:update:all": "Update any user's profile",
      "user:delete:all": "Delete users",
      "role:assign:basic": "Assign basic roles",
      "role:assign:admin": "Assign admin roles",
      "manager:assign:all": "Assign reporting managers",
    };
    return descriptions[key] || "";
  };

  return (
    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{getPermissionLabel(permission)}</p>
          <Badge variant={value ? "default" : "secondary"} className="text-xs">
            {value ? "Granted" : "Restricted"}
          </Badge>
        </div>
        {getPermissionDescription(permission) && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {getPermissionDescription(permission)}
          </p>
        )}
      </div>
      <div className="ml-4">
        {value ? (
          <CheckCircle className="h-5 w-5 text-emerald-500" />
        ) : (
          <XCircle className="h-5 w-5 text-rose-500" />
        )}
      </div>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Card className="border-border/40">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
  </div>
);

const PermissionEmptyState = () => (
  <div className="text-center py-8">
    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
    <h4 className="font-semibold">No Permissions Assigned</h4>
    <p className="text-sm text-muted-foreground">
      You don't have any specific permissions configured.
    </p>
  </div>
);

const ActivityItem = ({
  icon: Icon,
  label,
  value
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
    <div className="rounded-full p-2 bg-background">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  </div>
);

export default function Page() {
  const router = useRouter();
  const { isLoading, data, error, mutate } = useFetch("/api/v1/user/me");
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = async function () {
    try {
      const response = await fetch("/api/logout", { method: "DELETE" })
      const data = await response.json()
      if (data.code !== 200) throw new Error(data.message);
      if (typeof history) history.replaceState({}, "", "/login")
      window.location.href = "/login"
    } catch (error) {
      toast.error(buildToastMessage(error))
    }
  }

  if (isLoading && !data) return <ComponentLoader />;

  if (error || data?.code !== 200) {
    return (
      <ErrorState
        title={data?.message || "Unable to load profile"}
        description="We're having trouble fetching your profile information. Please try again."
        reset={() => mutate()}
      />
    );
  }

  const profile: ProfileData = data?.data;
  if (!profile) return <ProfileSkeleton />;

  const totalPermissions = Object.keys(profile.scopeMap || {}).length;
  const grantedPermissions = Object.values(profile.scopeMap || {}).filter(v => v === true).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground text-sm">
              View and manage your personal information
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <ProfileHeader
          profile={profile}
          mutate={mutate}
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
                {grantedPermissions}/{totalPermissions}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your personal and professional details
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
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common actions you can perform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => router.push("/employees")}
                  >
                    <Users className="h-4 w-4" />
                    View All Employees
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => router.push("/employees/new")}
                  >
                    <User className="h-4 w-4" />
                    Add New Employee
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={() => router.push("/dashboard")}
                  >
                    <Layout className="h-4 w-4" />
                    Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <Card className="border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Permissions & Scopes</CardTitle>
                    <CardDescription>
                      Your access permissions across the platform
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <Shield className="h-3 w-3" />
                    {grantedPermissions} of {totalPermissions} granted
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {totalPermissions === 0 ? (
                  <PermissionEmptyState />
                ) : (
                  <div className="space-y-1">
                    {Object.entries(profile.scopeMap).map(([key, value]) => (
                      <PermissionCard
                        key={key}
                        permission={key}
                        value={value}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>
                  Recent activity and account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ActivityItem
                    icon={Calendar}
                    label="Member Since"
                    value={new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  />
                  <ActivityItem
                    icon={Clock}
                    label="Joined Organization"
                    value={new Date(profile.joiningDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  />
                  <ActivityItem
                    icon={Users}
                    label="Role"
                    value={`${profile.role} (${profile.department})`}
                  />
                  <ActivityItem
                    icon={Shield}
                    label="Permissions"
                    value={`${grantedPermissions} permissions granted`}
                  />
                </div>

                <Separator />

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-primary/10">
                      <HelpCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Need help?</p>
                      <p className="text-sm text-muted-foreground">
                        Contact your system administrator for assistance with permissions or account issues.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}