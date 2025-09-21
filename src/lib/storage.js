import { put, list } from '@vercel/blob';

// Storage filename for Blob
const STORAGE_FILENAME = 'october-2025-contest-data.json';

// Default contest data structure
const defaultContestData = {
  currentWeek: 1,
  contestName: "October 2025 Burning Contest",
  contestStart: "2025-10-01",
  contestEnd: "2025-10-31", 
  participants: [],
  weeks: {}
};

// Check if we're in a Vercel environment with Blob configured
const hasBlob = process.env.BLOB_READ_WRITE_TOKEN;
console.log('BLOB_READ_WRITE_TOKEN exists:', !!hasBlob);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Fallback local storage for development
let localCache = null;

// Load data from Blob or local cache
async function loadData() {
  console.log('loadData: hasBlob =', hasBlob);
  if (hasBlob) {
    try {
      console.log('loadData: Attempting to fetch from Blob');
      // Use the @vercel/blob list function to check if file exists
      const { blobs } = await list({ prefix: STORAGE_FILENAME.split('.')[0] });
      
      if (blobs.length > 0) {
        // File exists, fetch it
        const response = await fetch(blobs[0].url);
        if (response.ok) {
          const data = await response.json();
          console.log('loadData: Successfully loaded from Blob:', data);
          return data;
        }
      }
      
      // File doesn't exist yet, return defaults
      console.log('loadData: Blob file not found, using defaults');
      return { ...defaultContestData };
    } catch (error) {
      console.error('Error loading from Blob:', error.message);
      return { ...defaultContestData };
    }
  }
  
  // Development fallback - use file system
  if (!localCache) {
    try {
      const fs = require('fs');
      const path = require('path');
      const DATA_FILE = path.join(process.cwd(), 'contest-data.json');
      
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        localCache = JSON.parse(data);
      } else {
        localCache = { ...defaultContestData };
      }
    } catch (error) {
      console.log('Error loading local data file, using defaults:', error.message);
      localCache = { ...defaultContestData };
    }
  }
  
  return localCache;
}

// Save data to Blob or local cache
async function saveData(data) {
  console.log('saveData called with participants:', data.participants);
  
  if (hasBlob) {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      
      const result = await put(STORAGE_FILENAME, jsonString, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });
      console.log('Saved to Blob successfully:', result.url);
      localCache = { ...data }; // Also update local cache
      return true;
    } catch (error) {
      console.error('Error saving to Blob:', error.message);
      console.error('Full error:', error);
      // This is critical - if Blob fails, we should throw an error
      throw error;
    }
  }
  
  // In-memory cache as fallback (will persist during function lifetime)
  console.log('Using in-memory cache fallback');
  localCache = { ...data };
  return true;
}

export async function getContestData() {
  return await loadData();
}

export async function addParticipant(name) {
  console.log('Storage: Adding participant:', name);
  const contestData = await loadData();
  console.log('Storage: Current participants:', contestData.participants);
  
  if (contestData.participants.includes(name)) {
    console.log('Storage: Participant already exists');
    throw new Error('Participant already exists');
  }
  
  contestData.participants.push(name);
  console.log('Storage: Updated participants:', contestData.participants);
  
  const saveSuccess = await saveData(contestData);
  console.log('Storage: Save success:', saveSuccess);
  
  if (!saveSuccess) {
    throw new Error('Failed to save participant data');
  }
  return contestData;
}

export async function addCaloriesForDate(date, participant, calories, week) {
  const contestData = await loadData();
  
  // Ensure week exists
  if (!contestData.weeks[week]) {
    contestData.weeks[week] = {};
  }
  
  // Ensure date exists in week
  if (!contestData.weeks[week][date]) {
    contestData.weeks[week][date] = {};
  }
  
  // Add calories to existing amount for participant on date
  const existingCalories = contestData.weeks[week][date][participant] || 0;
  contestData.weeks[week][date][participant] = existingCalories + calories;
  
  const saveSuccess = await saveData(contestData);
  if (!saveSuccess) {
    throw new Error('Failed to save calorie data');
  }
  return contestData;
}

export async function setCurrentWeek(weekNumber) {
  const contestData = await loadData();
  // Only allow weeks 1-5 for October 2025
  if (weekNumber >= 1 && weekNumber <= 5) {
    contestData.currentWeek = weekNumber;
    const saveSuccess = await saveData(contestData);
    if (!saveSuccess) {
      throw new Error('Failed to save week data');
    }
  }
  return contestData;
}

export async function getWeekData(weekNumber) {
  const contestData = await loadData();
  return contestData.weeks[weekNumber] || {};
}

export async function participantExists(name) {
  const contestData = await loadData();
  return contestData.participants.includes(name);
}

export async function clearAllData() {
  const newData = {
    currentWeek: 1,
    contestName: "October 2025 Burning Contest",
    contestStart: "2025-10-01",
    contestEnd: "2025-10-31",
    participants: [],
    weeks: {}
  };
  await saveData(newData);
  return true;
}

// Legacy functions for backward compatibility
export async function getUsers() {
  const contestData = await loadData();
  return contestData.participants.map(name => ({ username: name, totalCalories: 0 }));
}

export async function addUser(user) {
  return await addParticipant(user.username);
}

export async function findUser(username) {
  const contestData = await loadData();
  return contestData.participants.includes(username) ? { username } : null;
}

export async function userExists(username) {
  return await participantExists(username);
}

export async function clearAllUsers() {
  return await clearAllData();
}