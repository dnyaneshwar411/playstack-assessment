"use client"
import { useState, useEffect } from "react"
import { ErrorState } from "@/components/ui/error"
import { ComponentLoader } from "@/components/ui/loader"
import useFetch from "@/hooks/useFetch"
import { useDebounce } from "@/hooks/useDebounce"
import EditEmployee from "@/modules/employee/components/edit-employee"
import DeleteEmployee from "@/modules/employee/components/delete-employee"

interface Employee {
  _id: string
  name: string
  email: string
  mobileNumber: number
  employeeId: string
  reportingManager: string | null
  role: string
  department: string
  designation: string
  salary: number
  status: "Active" | "In Active"
  joiningDate: string
  avatar?: {
    private: boolean
    key: string
  }
  createdAt: string
}

interface PaginatedEmployeeResponse {
  code: number
  message: string
  data: {
    employees: Employee[]
    total: number
    page: number
    limit: number
    totalPages: number
  } | Employee[]
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 700)

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    query: ""
  })

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      query: debouncedSearchQuery,
      page: 1
    }))
  }, [debouncedSearchQuery])

  const { isLoading, isValidating, error, data, mutate } = useFetch("/api/v1/user/employees", filters)

  if (isLoading && !data) return <ComponentLoader />

  if (error || data?.code !== 200) {
    return (
      <ErrorState
        title={data?.message || "Synchronizing operational telemetry..."}
        description="The database cluster returned an invalid schema or network failure."
        reset={() => mutate()}
      />
    )
  }

  const employees = data.data
  const totalCount = data.pagination.total
  const totalPages = Math.ceil(totalCount / filters.limit)
  return (
    <div className="min-h-screen bg-background text-foreground pb-6">
      <header className="bg-card text-card-foreground border-b py-6 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Employee Directory</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage personnel profiles, roles, and departmental assignments.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 px-3 py-1 text-sm bg-background border shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      <main className="space-y-6 mx-auto">
        {isValidating && (
          <div className="text-xs font-medium text-muted-foreground bg-muted/40 p-2 border rounded-md text-center animate-pulse">
            Synchronizing operational telemetry...
          </div>
        )}
        <div className="w-full max-w-full overflow-x-auto bg-card">
          <table className="w-full min-w-max text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Sr</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Name & Email</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground font-medium italic">
                    No personnel records match your current search parameters.
                  </td>
                </tr>
              ) : (
                employees.map((emp: Record<string, any>, index: string) => (
                  <tr key={emp._id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-medium text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-muted-foreground">
                      {emp.employeeId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{emp.name}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{emp.email}</div>
                    </td>
                    <td className="py-3 px-4">{emp.department}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      <span className="font-medium text-foreground block">{emp.designation}</span>
                      <span className="text-[10px]">{emp.role}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(emp.salary)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 font-bold text-[10px] uppercase border rounded-full ${emp.status === "Active"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="text-right px-4 py-3 flex justify-end gap-2">
                      <EditEmployee employee={emp} onSuccess={mutate} />
                      <DeleteEmployee employee={emp} onSuccess={mutate} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <select
              value={filters.limit}
              onChange={(e) => setFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
              className="h-8 px-2 bg-background border rounded-md font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="pl-2 border-l">
              Showing <strong className="text-foreground">{employees.length}</strong> of <strong className="text-foreground">{totalCount}</strong> records
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <span>
              Page <strong className="text-foreground">{filters.page}</strong> of <strong className="text-foreground">{totalPages}</strong>
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={filters.page <= 1 || isValidating}
                className="px-3 py-1.5 border rounded-md bg-background text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                disabled={filters.page >= totalPages || isValidating}
                className="px-3 py-1.5 border rounded-md bg-background text-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}