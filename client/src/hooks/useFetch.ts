import { buildUrlWithQueryParams } from "@/lib/helpers"
import api from "@/network/client"
import { useMemo } from "react"
import useSWR from "swr"

export default function useFetch(
  endpoint: string,
  options: Record<string, string | number> = {}
) {
  const endpointWithQuery = useMemo(
    () => buildUrlWithQueryParams(endpoint, options),
    [endpoint, options]
  )
  const args = useSWR(endpointWithQuery, api.get)
  return args
}