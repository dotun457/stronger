import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, X, Check, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const templateId = urlParams.get('template_id');

  const [startTime] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [workoutData, setWorkoutData] = useState(null);

  const { data: template } = useQuery({
    queryKey: ['template', templateId],
    queryFn: async () => {
      const templates = await base44.entities.WorkoutTemplate.list();
      return templates.find(t => t.id === templateId);
    },
    enabled: !!templateId,
  });

  useEffect(() => {
    if (template && !workoutData) {
      setWorkoutData({
        template_id: template.id,
        template_name: template.name,
        start_time: startTime.toISOString(),
        exercises: template.exercises?.map(ex => ({
          exercise_id: ex.exercise_id,
          exercise_name: ex.exercise_name,
          sets: Array(ex.sets || 3).fill(null).map(() => ({
            reps: 0,
            weight: 0,
            completed: false
          }))
        })) || []
      });
    }
  }, [template, workoutData, startTime]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const saveWorkoutMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkoutSession.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSessions'] });
      toast.success('Workout saved!');
      navigate(createPageUrl("Home"));
    },
  });

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === exerciseIndex ? {
          ...ex,
          sets: ex.sets.map((set, j) => 
            j === setIndex ? { ...set, [field]: value } : set
          )
        } : ex
      )
    }));
  };

  const toggleSetComplete = (exerciseIndex, setIndex) => {
    setWorkoutData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === exerciseIndex ? {
          ...ex,
          sets: ex.sets.map((set, j) => 
            j === setIndex ? { ...set, completed: !set.completed } : set
          )
        } : ex
      )
    }));
  };

  const finishWorkout = () => {
    const endTime = new Date();
    const totalVolume = workoutData.exercises.reduce((total, ex) => {
      return total + ex.sets.reduce((exTotal, set) => {
        return exTotal + (set.completed ? set.reps * set.weight : 0);
      }, 0);
    }, 0);

    saveWorkoutMutation.mutate({
      ...workoutData,
      end_time: endTime.toISOString(),
      duration_seconds: elapsedSeconds,
      total_volume: totalVolume
    });
  };

  const cancelWorkout = () => {
    if (window.confirm('Cancel this workout? All progress will be lost.')) {
      navigate(createPageUrl("Home"));
    }
  };

  if (!template || !workoutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24">
      {/* Fixed Header with Timer */}
      <div className="sticky top-0 z-10 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-white">{template.name}</h1>
              <p className="text-slate-400">{workoutData.exercises.length} exercises</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelWorkout}
              className="text-slate-400 hover:text-red-400"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Timer */}
          <Card className="bg-gradient-to-r from-cyan-600 to-blue-700 border-0 p-6 shadow-xl shadow-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsRunning(!isRunning)}
                  className="bg-white/20 hover:bg-white/30 text-white"
                >
                  {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <div>
                  <p className="text-cyan-100 text-sm font-medium">Workout Duration</p>
                  <p className="text-4xl font-black text-white tabular-nums">
                    {formatTime(elapsedSeconds)}
                  </p>
                </div>
              </div>
              <Clock className="w-12 h-12 text-white/40" />
            </div>
          </Card>
        </div>
      </div>

      {/* Exercise List */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {workoutData.exercises.map((exercise, exerciseIndex) => {
          const completedSets = exercise.sets.filter(s => s.completed).length;
          const totalSets = exercise.sets.length;
          
          return (
            <Card key={exerciseIndex} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exercise.exercise_name}</h3>
                    <p className="text-slate-400 text-sm">{completedSets} of {totalSets} sets complete</p>
                  </div>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold ${
                    completedSets === totalSets ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {completedSets}/{totalSets}
                  </div>
                </div>

                {/* Sets */}
                <div className="space-y-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      set.completed 
                        ? 'bg-green-500/20 border-2 border-green-500/50' 
                        : 'bg-slate-800 border-2 border-slate-700'
                    }`}>
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white font-bold">
                        {setIndex + 1}
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-slate-400 text-xs mb-1">Reps</p>
                          <Input
                            type="number"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border-slate-700 text-white text-center font-bold text-lg h-12"
                            disabled={set.completed}
                          />
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs mb-1">Weight (lbs)</p>
                          <Input
                            type="number"
                            value={set.weight || ''}
                            onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseInt(e.target.value) || 0)}
                            className="bg-slate-900 border-slate-700 text-white text-center font-bold text-lg h-12"
                            disabled={set.completed}
                          />
                        </div>
                      </div>

                      <Button
                        size="icon"
                        onClick={() => toggleSetComplete(exerciseIndex, setIndex)}
                        className={`w-12 h-12 rounded-xl ${
                          set.completed 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-slate-700 hover:bg-cyan-600'
                        }`}
                      >
                        <Check className="w-6 h-6 text-white" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={finishWorkout}
            disabled={saveWorkoutMutation.isPending}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-xl shadow-green-500/30"
          >
            {saveWorkoutMutation.isPending ? 'Saving...' : 'Finish Workout'}
            <ChevronRight className="w-6 h-6 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}