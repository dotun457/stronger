import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, GripVertical } from "lucide-react";
import { toast } from "sonner";

export default function WorkoutTemplateForm({ template, onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: template?.name || "",
    description: template?.description || "",
    exercises: template?.exercises || [],
    estimated_duration_minutes: template?.estimated_duration_minutes || 60,
  });

  const { data: exercises = [] } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => base44.entities.Exercise.list(),
    initialData: [],
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (template) {
        return base44.entities.WorkoutTemplate.update(template.id, data);
      }
      return base44.entities.WorkoutTemplate.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success(template ? 'Workout updated!' : 'Workout created!');
      onClose();
    },
  });

  const addExercise = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise) {
      setFormData(prev => ({
        ...prev,
        exercises: [...prev.exercises, {
          exercise_id: exercise.id,
          exercise_name: exercise.name,
          sets: 3,
          reps: 10,
          rest_seconds: 60,
          notes: ""
        }]
      }));
    }
  };

  const updateExercise = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      )
    }));
  };

  const removeExercise = (index) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl p-6 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            {template ? 'Edit Workout' : 'New Workout'}
          </h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="text-slate-400">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Workout Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Push Day, Leg Day"
              required
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Estimated Duration (minutes)</Label>
            <Input
              type="number"
              value={formData.estimated_duration_minutes}
              onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: parseInt(e.target.value) })}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Workout description..."
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white text-lg">Exercises</Label>
            <Select onValueChange={addExercise}>
              <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Add exercise" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.exercises.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No exercises added yet. Add exercises from the dropdown above.
            </div>
          ) : (
            <div className="space-y-3">
              {formData.exercises.map((exercise, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700 p-4">
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-5 h-5 text-slate-500 mt-2" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">{exercise.exercise_name}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExercise(index)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label className="text-slate-400 text-xs">Sets</Label>
                          <Input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-400 text-xs">Reps</Label>
                          <Input
                            type="number"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-slate-400 text-xs">Rest (sec)</Label>
                          <Input
                            type="number"
                            value={exercise.rest_seconds}
                            onChange={(e) => updateExercise(index, 'rest_seconds', parseInt(e.target.value))}
                            className="bg-slate-900 border-slate-700 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-slate-700 text-white hover:bg-slate-800">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saveMutation.isPending}
            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800"
          >
            {saveMutation.isPending ? 'Saving...' : template ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Card>
  );
}