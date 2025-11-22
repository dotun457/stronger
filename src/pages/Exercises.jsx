import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, BicepsFlexed, Dumbbell, Cog, User, HandHelping, Heart, Clock } from "lucide-react";
import ExerciseForm from "../components/exercises/ExerciseForm";

const muscleColors = {
  chest: "from-red-500 to-pink-600",
  back: "from-blue-500 to-cyan-600",
  shoulders: "from-purple-500 to-indigo-600",
  arms: "from-orange-500 to-yellow-600",
  legs: "from-green-500 to-emerald-600",
  core: "from-pink-500 to-rose-600",
  full_body: "from-indigo-500 to-purple-600",
  cardio: "from-cyan-500 to-blue-600",
};

// Icon mapping for equipment types
const equipmentIcons = {
  compound: BicepsFlexed,
  machine: Cog,
  weighted_bodyweight: User,
  assisted_bodyweight: HandHelping,
  cardio: Heart,
  duration: Clock,
  dumbbell: Dumbbell,
};

export default function Exercises() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMuscle, setFilterMuscle] = useState("all");
  const queryClient = useQueryClient();

  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => base44.entities.Exercise.list(),
    initialData: [],
  });

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = filterMuscle === "all" || ex.muscle_group === filterMuscle;
    return matchesSearch && matchesMuscle;
  });

  const muscleGroups = ["all", "chest", "back", "shoulders", "arms", "legs", "core", "full_body", "cardio"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Exercise Library</h1>
            <p className="text-slate-400">Manage your exercise database</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 shadow-lg shadow-cyan-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Exercise
          </Button>
        </div>

        {showForm && (
          <ExerciseForm onClose={() => setShowForm(false)} />
        )}

        {/* Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercises..."
              className="pl-12 bg-slate-900/50 border-slate-800 text-white h-12"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {muscleGroups.map((muscle) => (
              <Button
                key={muscle}
                variant={filterMuscle === muscle ? "default" : "outline"}
                onClick={() => setFilterMuscle(muscle)}
                className={filterMuscle === muscle 
                  ? "bg-cyan-600 hover:bg-cyan-700" 
                  : "border-slate-700 text-slate-300 hover:bg-slate-800"
                }
              >
                {muscle.replaceAll('_', ' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExercises.map((exercise) => {
              const EquipmentIcon = equipmentIcons[exercise.equipment] || User;
              return (
              <Card key={exercise.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 p-5">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 bg-gradient-to-br ${muscleColors[exercise.muscle_group] || 'from-slate-600 to-slate-700'} rounded-xl flex items-center justify-center shadow-lg`}>
                      <EquipmentIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                      {exercise.equipment?.replaceAll('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-white mb-1">{exercise.name}</h3>
                    <p className="text-cyan-400 text-sm font-medium capitalize">
                      {exercise.muscle_group.replaceAll('_', ' ')} • {exercise.category}
                    </p>
                    {exercise.notes && (
                      <p className="text-slate-400 text-sm mt-2 line-clamp-2">{exercise.notes}</p>
                    )}
                  </div>
                </div>
              </Card>
            );
            })}
          </div>
        ) : (
          <Card className="bg-slate-900/50 border-slate-800 p-16 text-center">
            <Dumbbell className="w-20 h-20 text-slate-700 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">No Exercises Found</h3>
            <p className="text-slate-400 mb-6">
              {searchTerm || filterMuscle !== "all" 
                ? "Try adjusting your filters" 
                : "Add your first exercise to get started"}
            </p>
            {!searchTerm && filterMuscle === "all" && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Exercise
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}