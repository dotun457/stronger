/**
 * Local Client
 * This file used to connect to Base44 SDK, now uses local storage
 */
import { localClient, initializeSampleData } from './localDataService';

// Initialize sample data on first load
initializeSampleData();

// Export the local client as 'base44' to maintain compatibility with existing code
export const base44 = localClient;
