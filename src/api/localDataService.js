/**
 * Local Data Service
 * Replaces Base44 SDK with localStorage-based data persistence
 */

// Initialize storage keys
const STORAGE_KEYS = {
  exercises: 'app_exercises',
  workoutTemplates: 'app_workout_templates',
  workoutSessions: 'app_workout_sessions',
};

// Helper to get data from localStorage
const getFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
};

// Helper to save data to localStorage
const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage:`, error);
  }
};

// Generate unique ID
const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Exercise Entity
export const Exercise = {
  list: async (sortBy = '-created_date', limit = null) => {
    const exercises = getFromStorage(STORAGE_KEYS.exercises);
    let sorted = [...exercises];
    
    if (sortBy === '-created_date') {
      sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    
    return limit ? sorted.slice(0, limit) : sorted;
  },

  create: async (data) => {
    const exercises = getFromStorage(STORAGE_KEYS.exercises);
    const newExercise = {
      ...data,
      id: generateId(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    exercises.push(newExercise);
    saveToStorage(STORAGE_KEYS.exercises, exercises);
    return newExercise;
  },

  update: async (id, data) => {
    const exercises = getFromStorage(STORAGE_KEYS.exercises);
    const index = exercises.findIndex(ex => ex.id === id);
    if (index !== -1) {
      exercises[index] = {
        ...exercises[index],
        ...data,
        updated_date: new Date().toISOString(),
      };
      saveToStorage(STORAGE_KEYS.exercises, exercises);
      return exercises[index];
    }
    throw new Error('Exercise not found');
  },

  delete: async (id) => {
    const exercises = getFromStorage(STORAGE_KEYS.exercises);
    const filtered = exercises.filter(ex => ex.id !== id);
    saveToStorage(STORAGE_KEYS.exercises, filtered);
    return { success: true };
  },

  get: async (id) => {
    const exercises = getFromStorage(STORAGE_KEYS.exercises);
    const exercise = exercises.find(ex => ex.id === id);
    if (!exercise) throw new Error('Exercise not found');
    return exercise;
  },
};

// WorkoutTemplate Entity
export const WorkoutTemplate = {
  list: async (sortBy = '-created_date', limit = null) => {
    const templates = getFromStorage(STORAGE_KEYS.workoutTemplates);
    let sorted = [...templates];
    
    if (sortBy === '-created_date') {
      sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    
    return limit ? sorted.slice(0, limit) : sorted;
  },

  create: async (data) => {
    const templates = getFromStorage(STORAGE_KEYS.workoutTemplates);
    const newTemplate = {
      ...data,
      id: generateId(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    templates.push(newTemplate);
    saveToStorage(STORAGE_KEYS.workoutTemplates, templates);
    return newTemplate;
  },

  update: async (id, data) => {
    const templates = getFromStorage(STORAGE_KEYS.workoutTemplates);
    const index = templates.findIndex(t => t.id === id);
    if (index !== -1) {
      templates[index] = {
        ...templates[index],
        ...data,
        updated_date: new Date().toISOString(),
      };
      saveToStorage(STORAGE_KEYS.workoutTemplates, templates);
      return templates[index];
    }
    throw new Error('Workout template not found');
  },

  delete: async (id) => {
    const templates = getFromStorage(STORAGE_KEYS.workoutTemplates);
    const filtered = templates.filter(t => t.id !== id);
    saveToStorage(STORAGE_KEYS.workoutTemplates, filtered);
    return { success: true };
  },

  get: async (id) => {
    const templates = getFromStorage(STORAGE_KEYS.workoutTemplates);
    const template = templates.find(t => t.id === id);
    if (!template) throw new Error('Workout template not found');
    return template;
  },
};

// WorkoutSession Entity
export const WorkoutSession = {
  list: async (sortBy = '-created_date', limit = null) => {
    const sessions = getFromStorage(STORAGE_KEYS.workoutSessions);
    let sorted = [...sessions];
    
    if (sortBy === '-created_date') {
      sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
    
    return limit ? sorted.slice(0, limit) : sorted;
  },

  create: async (data) => {
    const sessions = getFromStorage(STORAGE_KEYS.workoutSessions);
    const newSession = {
      ...data,
      id: generateId(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    };
    sessions.push(newSession);
    saveToStorage(STORAGE_KEYS.workoutSessions, sessions);
    return newSession;
  },

  update: async (id, data) => {
    const sessions = getFromStorage(STORAGE_KEYS.workoutSessions);
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      sessions[index] = {
        ...sessions[index],
        ...data,
        updated_date: new Date().toISOString(),
      };
      saveToStorage(STORAGE_KEYS.workoutSessions, sessions);
      return sessions[index];
    }
    throw new Error('Workout session not found');
  },

  delete: async (id) => {
    const sessions = getFromStorage(STORAGE_KEYS.workoutSessions);
    const filtered = sessions.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.workoutSessions, filtered);
    return { success: true };
  },

  get: async (id) => {
    const sessions = getFromStorage(STORAGE_KEYS.workoutSessions);
    const session = sessions.find(s => s.id === id);
    if (!session) throw new Error('Workout session not found');
    return session;
  },
};

// Initialize with sample data if needed
export const initializeSampleData = () => {
  localStorage.removeItem(STORAGE_KEYS.exercises);
  const exercises = getFromStorage(STORAGE_KEYS.exercises);
  
  if (exercises.length === 0) {
    // Add some sample exercises
    
    const sampleExercises = [
      {
        id: generateId(),
        name: 'Bench Press',
        muscle_group: 'chest',
        equipment: 'compound',
        category: 'strength',
        description: 'Classic chest exercise',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Squat',
        muscle_group: 'legs',
        equipment: 'compound',
        category: 'strength',
        description: 'Compound leg exercise',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Deadlift',
        muscle_group: 'back',
        equipment: 'compound',
        category: 'strength',
        description: 'Full body compound movement',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Dumbbell Press',
        muscle_group: 'chest',
        equipment: 'dumbbell',
        category: 'strength',
        description: 'Dumbbell chest press',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Overhead Press',
        muscle_group: 'shoulders',
        equipment: 'compound',
        category: 'strength',
        description: 'Standing or seated overhead press',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Pull Ups',
        muscle_group: 'back',
        equipment: 'weighted_bodyweight',
        category: 'strength',
        description: 'Bodyweight pull ups',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Pull Ups (Assisted)',
        muscle_group: 'back',
        equipment: 'assisted_bodyweight',
        category: 'strength',
        description: 'Machine-assisted pull ups',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Leg Extensions',
        muscle_group: 'legs',
        equipment: 'machine',
        category: 'strength',
        description: 'Isolation exercise for quads',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Leg Curls',
        muscle_group: 'legs',
        equipment: 'machine',
        category: 'strength',
        description: 'Isolation exercise for hamstrings',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      // Arms
      {
        id: generateId(),
        name: 'Bicep Curls',
        muscle_group: 'arms',
        equipment: 'dumbbell',
        category: 'strength',
        description: 'Dumbbell bicep curls',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Tricep Dips',
        muscle_group: 'arms',
        equipment: 'weighted_bodyweight',
        category: 'strength',
        description: 'Bodyweight tricep dips',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Hammer Curls',
        muscle_group: 'arms',
        equipment: 'dumbbell',
        category: 'strength',
        description: 'Neutral grip dumbbell curls',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Skull Crushers',
        muscle_group: 'arms',
        equipment: 'compound',
        category: 'strength',
        description: 'Lying tricep extensions',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      // Core
      {
        id: generateId(),
        name: 'Plank',
        muscle_group: 'core',
        equipment: 'duration',
        category: 'strength',
        description: 'Static core hold',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Russian Twists',
        muscle_group: 'core',
        equipment: 'duration',
        category: 'strength',
        description: 'Rotational core exercise',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Hanging Leg Raises',
        muscle_group: 'core',
        equipment: 'weighted_bodyweight',
        category: 'strength',
        description: 'Hanging ab exercise',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Ab Wheel Rollout',
        muscle_group: 'core',
        equipment: 'machine',
        category: 'strength',
        description: 'Ab wheel exercise',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      // Full Body
      {
        id: generateId(),
        name: 'Burpees',
        muscle_group: 'full_body',
        equipment: 'weighted_bodyweight',
        category: 'strength',
        description: 'Full body conditioning exercise',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Thrusters',
        muscle_group: 'full_body',
        equipment: 'compound',
        category: 'strength',
        description: 'Front squat to overhead press',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Clean and Press',
        muscle_group: 'full_body',
        equipment: 'compound',
        category: 'strength',
        description: 'Olympic-style lift',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Man Makers',
        muscle_group: 'full_body',
        equipment: 'compound',
        category: 'strength',
        description: 'Burpee with dumbbells and rows',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      // Cardio
      {
        id: generateId(),
        name: 'Running',
        muscle_group: 'cardio',
        equipment: 'cardio',
        category: 'cardio',
        description: 'Outdoor or treadmill running',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Rowing Machine',
        muscle_group: 'cardio',
        equipment: 'cardio',
        category: 'cardio',
        description: 'Indoor rowing',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Jump Rope',
        muscle_group: 'cardio',
        equipment: 'cardio',
        category: 'cardio',
        description: 'Skipping rope cardio',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
      {
        id: generateId(),
        name: 'Cycling',
        muscle_group: 'cardio',
        equipment: 'cardio',
        category: 'cardio',
        description: 'Stationary or outdoor bike',
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      },
    ];
    saveToStorage(STORAGE_KEYS.exercises, sampleExercises);
  }
};

// Export a client-like interface similar to base44
export const localClient = {
  entities: {
    Exercise,
    WorkoutTemplate,
    WorkoutSession,
  },
};
