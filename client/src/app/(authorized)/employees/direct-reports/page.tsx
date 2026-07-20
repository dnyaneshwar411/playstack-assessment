"use client";

import { useState } from "react";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building2,
  Copy,
  Check,
  UserCircle,
  MoreVertical,
  Search,
  LayoutGrid,
  LayoutList,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/ui/error";
import { ComponentLoader } from "@/components/ui/loader";
import useFetch from "@/hooks/useFetch";
import { useGlobalStore } from "@/providers/store-provider";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Employee = {
  _id: string;
  name: string;
  email: string;
  mobileNumber: number;
  employeeId: string;
  role: string;
  department: string;
  designation: string;
  salary: number;
  status: "Active" | "In Active";
  joiningDate: string;
  avatar: {
    private: boolean;
    key: string;
  };
  reportingManager: string;
  createdAt: string;
  updatedAt: string;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string
}) => (
  <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={cn("rounded-full p-3", color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const EmployeeCard = ({ employee }: { employee: Employee }) => {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-emerald-500" : "bg-rose-500";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-border/40">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-background">
              <AvatarImage src={employee.avatar.key} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{employee.name}</h3>
                <div className={cn("h-2 w-2 rounded-full", getStatusColor(employee.status))} />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {employee.designation}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {employee.department}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {employee.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {employee.employeeId}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => router.push(`/employees/${employee._id}`)}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy(employee.email)}>
                  {copied ? (
                    <Check className="mr-2 h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy Email"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{employee.mobileNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Joined {new Date(employee.joiningDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="border-border/40">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <Card className="border-dashed border-2 border-border/60">
    <CardContent className="flex flex-col items-center justify-center py-16">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Direct Reports</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-4">
        You don't have any team members reporting to you yet. Team members will appear here once assigned.
      </p>
      <Button variant="outline" onClick={onReset}>
        Refresh
      </Button>
    </CardContent>
  </Card>
);

const Filters = ({
  search,
  setSearch,
  viewMode,
  setViewMode
}: {
  search: string;
  setSearch: (value: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}) => (
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by name, email, or department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9 bg-background/50 backdrop-blur-sm border-border/40"
      />
    </div>

    <div className="flex items-center gap-2">
      <div className="flex items-center border border-border/40 rounded-md">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="icon"
          className="h-9 w-9 rounded-none rounded-l-md"
          onClick={() => setViewMode("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="icon"
          className="h-9 w-9 rounded-none rounded-r-md"
          onClick={() => setViewMode("list")}
        >
          <LayoutList className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

export default function Page() {
  const userId = useGlobalStore((state) => state._id);
  const { isLoading, error, data, mutate } = useFetch(
    `/api/v1/user/${userId}/subordinates`
  );

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (isLoading && !data) return <ComponentLoader />;

  if (error || data?.code !== 200) {
    return (
      <ErrorState
        title={data?.message || "Unable to load direct reports"}
        description="We're having trouble fetching your team members. Please try again."
        reset={() => mutate()}
      />
    );
  }

  const employees: Employee[] = data?.data || [];

  const stats = {
    total: employees.length,
    active: employees.filter((emp) => emp.status === "Active").length,
    departments: new Set(employees.map((emp) => emp.department)).size,
    roles: new Set(employees.map((emp) => emp.role)).size,
  };

  const filteredEmployees = employees.filter((emp) => {
    const searchLower = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.department.toLowerCase().includes(searchLower) ||
      emp.designation.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Direct Reports</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view your team members
            </p>
          </div>
          <Button
            onClick={() => mutate()}
            variant="outline"
            className="gap-2 border-border/40"
          >
            <Users className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {employees.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Users}
              label="Total Members"
              value={stats.total}
              color="bg-blue-500"
            />
            <StatCard
              icon={UserCircle}
              label="Active"
              value={stats.active}
              color="bg-emerald-500"
            />
            <StatCard
              icon={Building2}
              label="Departments"
              value={stats.departments}
              color="bg-purple-500"
            />
            <StatCard
              icon={Briefcase}
              label="Roles"
              value={stats.roles}
              color="bg-amber-500"
            />
          </div>
        )}

        {employees.length > 0 && (
          <div className="mb-6">
            <Filters
              search={search}
              setSearch={setSearch}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
          </div>
        )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 bg-background/50 backdrop-blur-sm border border-border/40">
            <TabsTrigger value="all" className="gap-2">
              <Users className="h-4 w-4" />
              All ({filteredEmployees.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Active
            </TabsTrigger>
            <TabsTrigger value="inactive" className="gap-2">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              Inactive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <EmployeeList
              employees={filteredEmployees}
              viewMode={viewMode}
              emptyState={<EmptyState onReset={() => mutate()} />}
            />
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <EmployeeList
              employees={filteredEmployees.filter(emp => emp.status === "Active")}
              viewMode={viewMode}
              emptyState={<EmptyState onReset={() => mutate()} />}
            />
          </TabsContent>

          <TabsContent value="inactive" className="mt-0">
            <EmployeeList
              employees={filteredEmployees.filter(emp => emp.status === "In Active")}
              viewMode={viewMode}
              emptyState={<EmptyState onReset={() => mutate()} />}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmployeeList({
  employees,
  viewMode,
  emptyState
}: {
  employees: Employee[];
  viewMode: "grid" | "list";
  emptyState: React.ReactNode;
}) {
  if (employees.length === 0) {
    return emptyState;
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {employees.map((employee) => (
          <EmployeeCard key={employee._id} employee={employee} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {employees.map((employee) => (
        <EmployeeListItem key={employee._id} employee={employee} />
      ))}
    </div>
  );
}

function EmployeeListItem({ employee }: { employee: Employee }) {
  const router = useRouter();
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-emerald-500" : "bg-rose-500";
  };

  return (
    <Card
      className="hover:shadow-md transition-all duration-200 border-border/40 cursor-pointer"
      onClick={() => router.push(`/employees/${employee._id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 ring-2 ring-background">
            <AvatarImage src={employee.avatar.key} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{employee.name}</span>
              <div className={cn("h-2 w-2 rounded-full", getStatusColor(employee.status))} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{employee.designation}</span>
              <span>•</span>
              <span>{employee.department}</span>
              <span>•</span>
              <span className="font-mono text-xs">{employee.employeeId}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:inline-flex">
              {employee.role}
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}