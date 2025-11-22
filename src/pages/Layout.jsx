
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Dumbbell, Home, Calendar, Play, Library } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Workouts",
    url: createPageUrl("Workouts"),
    icon: Dumbbell,
  },
  {
    title: "History",
    url: createPageUrl("History"),
    icon: Calendar,
  },
  {
    title: "Exercises",
    url: createPageUrl("Exercises"),
    icon: Library,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --primary: 200 100% 30%;
          --primary-foreground: 0 0% 100%;
          --accent: 15 85% 60%;
          --accent-foreground: 0 0% 100%;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Sidebar className="border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl">
          <SidebarHeader className="border-b border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-white">STRONG</h2>
                <p className="text-xs text-slate-400">Workout Tracker</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-slate-800/60 transition-all duration-200 rounded-xl mb-2 ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-300'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-semibold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">Athlete</p>
                <p className="text-xs text-slate-400 truncate">Keep pushing!</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-slate-950/30 backdrop-blur-xl border-b border-slate-800 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-800 p-2 rounded-lg transition-colors duration-200 text-white" />
              <h1 className="text-xl font-bold text-white">STRONG</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
