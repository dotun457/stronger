import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function ExerciseForm({ onClose }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    category: "strength",
    muscle_group: "chest",
    equipment: "barbell",
    notes: "",
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.Exercise.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Exercise added!');
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl p-6 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">New Exercise</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} className="text-slate-400">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Exercise Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Bench Press"
            required
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Muscle Group</Label>
            <Select value={formData.muscle_group} onValueChange={(value) => setFormData({ ...formData, muscle_group: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chest">Chest</SelectItem>
                <SelectItem value="back">Back</SelectItem>
                <SelectItem value="shoulders">Shoulders</SelectItem>
                <SelectItem value="arms">Arms</SelectItem>
                <SelectItem value="legs">Legs</SelectItem>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="full_body">Full Body</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Equipment</Label>
          <Select value={formData.equipment} onValueChange={(value) => setFormData({ ...formData, equipment: value })}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="barbell">Barbell</SelectItem>
              <SelectItem value="dumbbell">Dumbbell</SelectItem>
              <SelectItem value="machine">Machine</SelectItem>
              <SelectItem value="bodyweight">Bodyweight</SelectItem>
              <SelectItem value="cable">Cable</SelectItem>
              <SelectItem value="bands">Bands</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Notes (optional)</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Exercise instructions or tips..."
            className="bg-slate-800 border-slate-700 text-white"
          />
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
            {saveMutation.isPending ? 'Adding...' : 'Add Exercise'}
          </Button>
        </div>
      </form>
    </Card>
  );
}