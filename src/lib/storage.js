import { kv } from '@vercel/kv';

// Storage key for KV
const STORAGE_KEY = 'october-2025-contest-data';

// Default contest data structure
const defaultContestData = {
  currentWeek: 1,
  contestName: "October 2025 Burning Contest",
  contestStart: "2025-10-01",
  contestEnd: "2025-10-31", 
  participants: [],
  weeks: {}
};

// Check if we're in a Vercel environment with KV configured
const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

// Fallback local storage for development
let localCache = null;

// Load data from KV or local cache
async function loadData() {
  if (hasKV) {
    try {
      const data = await kv.get(STORAGE_KEY);
      return data || { ...defaultContestData };
    } catch (error) {
      console.error('Error loading from KV:', error.message);
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

// Save data to KV or local cache
async function saveData(data) {
  if (hasKV) {
    try {
      await kv.set(STORAGE_KEY, data);
      return true;
    } catch (error) {
      console.error('Error saving to KV:', error.message);
      return false;
    }
  }
  
  // Development fallback - save to file
  try {
    const fs = require('fs');
    const path = require('path');
    const DATA_FILE = path.join(process.cwd(), 'contest-data.json');
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    localCache = data;
    return true;
  } catch (error) {
    console.error('Error saving data:', error.message);
    return false;
  }
}

export async function getContestData() {
  return await loadData();
}

export async function addParticipant(name) {
  const contestData = await loadData();
  if (contestData.participants.includes(name)) {
    throw new Error('Participant already exists');
  }
  contestData.participants.push(name);
  await saveData(contestData);
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
  
  // Add/update calories for participant on date
  contestData.weeks[week][date][participant] = calories;
  
  await saveData(contestData);
  return contestData;
}

export async function setCurrentWeek(weekNumber) {
  const contestData = await loadData();
  // Only allow weeks 1-5 for October 2025
  if (weekNumber >= 1 && weekNumber <= 5) {
    contestData.currentWeek = weekNumber;
    await saveData(contestData);
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