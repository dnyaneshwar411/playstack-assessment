"use client";
import Visualizer from "@/modules/organization-tree/components";
import { useGlobalStore } from "@/providers/store-provider";

export default function Page() {
  const user = useGlobalStore(state => state);
  return (
    <Visualizer rootNode={user} />
  );
}