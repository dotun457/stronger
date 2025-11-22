
import { localClient, initializeSampleData } from './localDataService';
// import { createClient } from '@base44/sdk';

initializeSampleData();

// Using local mock data for now
// Base44 integration can be added later when building proper auth flow
export const base44 = localClient;