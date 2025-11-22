import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Dumbbell, Play, Clock, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import WorkoutTemplateForm from "../components/workouts/WorkoutTemplateForm";

export default function Workouts() {
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.WorkoutTemplate.list('-created_date'),
    initialData: [],
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id) => base44.entities.WorkoutTemplate.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this workout template?')) {
      deleteTemplateMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">My Workouts</h1>
            <p className="text-slate-400">Create and manage your workout templates</p>
          </div>
          <Button 
            onClick={() => {
              setEditingTemplate(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 shadow-lg shadow-cyan-500/30"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Workout
          </Button>
        </div>

        {showForm && (
          <WorkoutTemplateForm
            template={editingTemplate}
            onClose={() => {
              setShowForm(false);
              setEditingTemplate(null);
            }}
          />
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 p-6 group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                      <Dumbbell className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="icon"
                        variant="ghost"
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon"
                        variant="ghost"
                        className="text-slate-400 hover:text-red-400 hover:bg-slate-800"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {template.name}
                    </h3>
                    {template.description && (
                      <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                        {template.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{template.exercises?.length || 0} exercises</span>
                      {template.estimated_duration_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {template.estimated_duration_minutes} min
                        </span>
                      )}
                    </div>
                  </div>

                  <Link to={`${createPageUrl("ActiveWorkout")}?template_id=${template.id}`} className="block">
                    <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 shadow-lg shadow-cyan-500/20">
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-900/50 border-slate-800 p-16 text-center">
            <Dumbbell className="w-20 h-20 text-slate-700 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3">No Workouts Yet</h3>
            <p className="text-slate-400 mb-6">Create your first workout template to get started</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Workout
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}