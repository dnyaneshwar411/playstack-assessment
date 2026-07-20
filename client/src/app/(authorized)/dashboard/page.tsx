"use client"
import { ErrorState } from "@/components/ui/error"
import { ComponentLoader } from "@/components/ui/loader"
import useFetch from "@/hooks/useFetch"

interface DashboardPayload {
  code: number
  message: string
  data: {
    summary: {
      totalEmployees: number
      activeEmployees: number
      inactiveEmployees: number
      departmentCount: number
    }
    departments: Array<{ _id: string; count: number }>
    recentHires: Array<{
      _id: string
      name: string
      email: string
      department: string
      designation: string
      status: string
    }>
  }
}

export default function Page() {
  const { isLoading, isValidating, error, data, mutate } = useFetch("/api/v1/user/dashboard")

  if (isLoading || isValidating) return <ComponentLoader />

  if (error || data?.code !== 200) {
    return (
      <ErrorState
        title={data?.message || "Dashboard Sync Error"}
        description="The database cluster returned an invalid schema or network failure."
        reset={() => mutate()}
      />
    )
  }

  const { summary, departments, recentHires } = data.data

  return (
    <div className="pb-8">
      <DashboardHeader
        title="Main Operations Dashboard"
        subtitle="Real-time telemetry and resource tracking metrics."
      />

      <main className="px-6 md:px-6 space-y-8">
        <DashboardStatGrid summary={summary} />

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="bg-card text-card-foreground p-6 border shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-tight mb-1">
                Operational Health
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Ratio of active to inactive staff documents.</p>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-[240px]">
              <StatusDonutChart
                active={summary.activeEmployees}
                inactive={summary.inactiveEmployees}
              />
            </div>
          </div>

          <div className="bg-card text-card-foreground p-6 border shadow-sm lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-tight mb-1">
                Resource Allocation
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Headcount distribution indexed across internal departments.</p>
            </div>
            <div className="flex-1 min-h-[240px] flex items-end">
              <DepartmentBarChart departments={departments} />
            </div>
          </div>

        </div>

        <div className="bg-card text-card-foreground p-6 border shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold tracking-tight mb-1">
              Recent Resource Onboardings
            </h3>
            <p className="text-xs text-muted-foreground">The latest personnel profiles appended to the organization tree.</p>
          </div>
          <RecentHiresTable hires={recentHires} />
        </div>
      </main>
    </div>
  )
}

function DashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="bg-card text-card-foreground border-b py-5 px-6 md:px-10 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
    </header>
  )
}

function DashboardStatGrid({ summary }: { summary: DashboardPayload["data"]["summary"] }) {
  const cards = [
    { title: "Total Employees", value: summary.totalEmployees },
    { title: "Active Employees", value: summary.activeEmployees },
    { title: "Inactive Employees", value: summary.inactiveEmployees },
    { title: "Department Count", value: summary.departmentCount },
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-card text-card-foreground p-5 border shadow-sm flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">
            {card.title}
          </span>
          <span className="text-3xl font-bold tracking-tight mt-3">
            {card.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function StatusDonutChart({ active, inactive }: { active: number; inactive: number }) {
  const total = active + inactive || 1
  const activePercentage = Math.round((active / total) * 100)

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6">
      <div
        className="w-36 h-36 rounded-full relative flex items-center justify-center shadow-inner"
        style={{
          background: `conic-gradient(var(--primary) 0% ${activePercentage}%, #ef4444 ${activePercentage}% 100%)`
        }}
      >
        <div className="w-28 h-28 bg-card rounded-full flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-bold text-foreground">{activePercentage}%</span>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Active</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-2 pt-4 border-t text-xs">
        <div className="flex items-center space-x-2 justify-center">
          <span className="w-2.5 h-2.5 block rounded-sm bg-emerald-500" />
          <span className="text-muted-foreground font-medium">Active ({active})</span>
        </div>
        <div className="flex items-center space-x-2 justify-center">
          <span className="w-2.5 h-2.5 block rounded-sm bg-rose-500" />
          <span className="text-muted-foreground font-medium">Inactive ({inactive})</span>
        </div>
      </div>
    </div>
  )
}

function DepartmentBarChart({ departments }: { departments: DashboardPayload["data"]["departments"] }) {
  const maxCount = Math.max(...departments.map(d => d.count), 1)

  return (
    <div className="w-full flex items-end justify-between gap-3 h-full pt-6 min-h-[200px]">
      {departments.map((dept, idx) => {
        const heightPercent = Math.min(100, Math.max(10, (dept.count / maxCount) * 100))

        return (
          <div key={idx} className="flex-1 flex flex-col items-center group space-y-2 h-full justify-end">
            <span className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {dept.count}
            </span>
            <div
              className="w-full bg-primary/80 group-hover:bg-primary transition-colors duration-200 cursor-pointer"
              style={{ height: `${heightPercent}%` }}
            />
            <span className="text-[10px] font-medium text-muted-foreground truncate max-w-full text-center block pt-1 border-t w-full">
              {dept._id || "Unknown"}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function RecentHiresTable({ hires }: { hires: DashboardPayload["data"]["recentHires"] }) {
  return (
    <div className="w-full max-w-full overflow-x-auto border rounded-md">
      <table className="w-full min-w-max text-left border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Department</th>
            <th className="py-3 px-4">Designation</th>
            <th className="py-3 px-4 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y text-xs">
          {hires.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-muted-foreground font-medium italic">
                No telemetry profiles captured inside this partition scope yet.
              </td>
            </tr>
          ) : (
            hires.map((user) => (
              <tr key={user._id} className="hover:bg-muted/40 transition-colors">
                <td className="py-3 px-4 font-semibold">{user.name}</td>
                <td className="py-3 px-4 font-mono text-muted-foreground">{user.email}</td>
                <td className="py-3 px-4">{user.department}</td>
                <td className="py-3 px-4 text-muted-foreground">{user.designation}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-block px-2 py-0.5 font-bold text-[10px] uppercase border ${user.status === "Active"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}>
                    {user.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}