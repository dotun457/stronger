import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Play, TrendingUp, Calendar, Dumbbell, Clock, Flame } from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const { data: sessions = [] } = useQuery({
    queryKey: ['recentSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-created_date', 5),
    initialData: [],
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.WorkoutTemplate.list('-created_date', 3),
    initialData: [],
  });

  const thisWeekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.created_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });

  const totalVolume = sessions.reduce((sum, s) => sum + (s.total_volume || 0), 0);
  const avgDuration = sessions.length > 0 
    ? sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length / 60
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Ready to Train?
          </h1>
          <p className="text-slate-400 text-lg">Let's crush your workout today 💪</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-cyan-600 to-blue-700 border-0 p-6 shadow-xl shadow-cyan-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium mb-1">This Week</p>
                <p className="text-4xl font-black text-white">{thisWeekSessions.length}</p>
                <p className="text-cyan-200 text-sm mt-1">Workouts</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-pink-600 border-0 p-6 shadow-xl shadow-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Total Volume</p>
                <p className="text-4xl font-black text-white">{(totalVolume / 1000).toFixed(1)}k</p>
                <p className="text-orange-200 text-sm mt-1">lbs lifted</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Flame className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-0 p-6 shadow-xl shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Avg Duration</p>
                <p className="text-4xl font-black text-white">{avgDuration.toFixed(0)}</p>
                <p className="text-purple-200 text-sm mt-1">minutes</p>
              </div>
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Start Workouts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Quick Start</h2>
            <Link to={createPageUrl("Workouts")}>
              <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800">
                View All
              </Button>
            </Link>
          </div>

          {templates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card key={template.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 p-5 group cursor-pointer">
                  <Link to={`${createPageUrl("ActiveWorkout")}?template_id=${template.id}`}>
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                          <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/30">
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white mb-1 group-hover:text-cyan-400 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2">
                          {template.description || `${template.exercises?.length || 0} exercises`}
                        </p>
                      </div>
                      {template.estimated_duration_minutes && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>~{template.estimated_duration_minutes} min</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
              <Dumbbell className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No workouts yet</p>
              <Link to={createPageUrl("Workouts")}>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  Create Your First Workout
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
          
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <Card key={session.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm p-5 hover:border-slate-700 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{session.template_name}</h3>
                        <p className="text-slate-400 text-sm">
                          {format(new Date(session.created_date), 'MMM d, yyyy')} • {Math.floor((session.duration_seconds || 0) / 60)} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{session.exercises?.length || 0}</p>
                      <p className="text-slate-400 text-sm">exercises</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
              <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No workout history yet</p>
              <p className="text-slate-500 text-sm">Start your first workout to see it here!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}