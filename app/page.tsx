'use client'



import { useState} from "react";
import {SideBar} from "@/app/components/layouts/SideBar";
import TopBar from "@/app/components/layouts/TopBar";
import {Grid} from "@radix-ui/themes";






export default function Home() {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <Grid
            as="div"
            columns={isSidebarOpen ? "260px 1fr" : "72px 1fr"}
            rows="72px 1fr"
            className="min-h-screen overflow-hidden"
        >
            <SideBar isOpen={isSidebarOpen} onToggleAction={() => setIsSidebarOpen((prev) => !prev)} />
            <TopBar  />

        </Grid>
    );
}

