import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, TrendingUp, Dumbbell } from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['allSessions'],
    queryFn: () => base44.entities.WorkoutSession.list('-created_date'),
    initialData: [],
  });

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return hrs > 0 ? `${hrs}h ${remainingMins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Workout History</h1>
          <p className="text-slate-400">Track your progress and achievements</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-cyan-600 to-blue-700 border-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium mb-1">Total Workouts</p>
                <p className="text-4xl font-black text-white">{sessions.length}</p>
              </div>
              <Dumbbell className="w-12 h-12 text-white/40" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Total Time</p>
                <p className="text-4xl font-black text-white">
                  {Math.floor(sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 3600)}h
                </p>
              </div>
              <Clock className="w-12 h-12 text-white/40" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-pink-600 border-0 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Total Volume</p>
                <p className="text-4xl font-black text-white">
                  {(sessions.reduce((sum, s) => sum + (s.total_volume || 0), 0) / 1000).toFixed(1)}k
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-white/40" />
            </div>
          </Card>
        </div>

        {/* Workout Sessions */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm p-6 hover:border-slate-700 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Dumbbell className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{session.template_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(session.created_date), 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(session.duration_seconds || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{session.exercises?.length || 0}</p>
                      <p className="text-slate-400 text-sm">exercises</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {session.exercises?.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0) || 0}
                      </p>
                      <p className="text-slate-400 text-sm">sets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">
                        {(session.total_volume || 0).toLocaleString()}
                      </p>
                      <p className="text-slate-400 text-sm">lbs</p>
                    </div>
                  </div>
                </div>

                {/* Exercise Details */}
                {session.exercises && session.exercises.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {session.exercises.map((exercise, idx) => {
                        const completedSets = exercise.sets.filter(s => s.completed);
                        return (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-3">
                            <p className="font-semibold text-white text-sm mb-2">{exercise.exercise_name}</p>
                            <div className="space-y-1">
                              {completedSets.map((set, setIdx) => (
                                <p key={setIdx} className="text-xs text-slate-400">
                                  Set {setIdx + 1}: {set.reps} reps × {set.weight} lbs
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-900/50 border-slate-800 p-16 text-center">
            <Calendar className="w-20 h-20 text-slate-700 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">No Workout History</h3>
            <p className="text-slate-400">Complete your first workout to see it here!</p>
          </Card>
        )}
      </div>
    </div>
  );
}