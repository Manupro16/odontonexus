// app/dashboard/layout.tsx
'use client'

import React, { useState } from "react";
import { SideBar } from "@/app/components/layouts/SideBar";
import TopBar from "@/app/components/layouts/TopBar";
import { Grid } from "@radix-ui/themes";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Grid
      as="div"
      columns={isSidebarOpen ? "260px 1fr" : "72px 1fr"}
      rows="72px 1fr"
      className="min-h-screen overflow-hidden"
    >
      <SideBar
        isOpen={isSidebarOpen}
        onToggleAction={() => setIsSidebarOpen((prev) => !prev)}
      />
      <TopBar />
      <main className="row-start-2 col-start-2 p-6 overflow-y-auto">
        {children} {/* This renders /dashboard, /dashboard/units, etc. */}
      </main>
    </Grid>
  );
}