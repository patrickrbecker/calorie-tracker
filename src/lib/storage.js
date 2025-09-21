// October 2025 Burning Contest data structure
let contestData = {
  currentWeek: 1,
  contestName: "October 2025 Burning Contest",
  contestStart: "2025-10-01",
  contestEnd: "2025-10-31", 
  participants: [],
  weeks: {
    // week1: {
    //   '2025-10-01': { 'John': 500, 'Jane': 600 },
    //   '2025-10-02': { 'John': 400, 'Jane': 550 }
    // }
  }
};

export async function getContestData() {
  return contestData;
}

export async function addParticipant(name) {
  if (contestData.participants.includes(name)) {
    throw new Error('Participant already exists');
  }
  contestData.participants.push(name);
  return contestData;
}

export async function addCaloriesForDate(date, participant, calories, week) {
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
  
  return contestData;
}

export async function setCurrentWeek(weekNumber) {
  // Only allow weeks 1-5 for October 2025
  if (weekNumber >= 1 && weekNumber <= 5) {
    contestData.currentWeek = weekNumber;
  }
  return contestData;
}

export async function getWeekData(weekNumber) {
  return contestData.weeks[weekNumber] || {};
}

export async function participantExists(name) {
  return contestData.participants.includes(name);
}

export async function clearAllData() {
  contestData = {
    currentWeek: 1,
    contestName: "October 2025 Burning Contest",
    contestStart: "2025-10-01",
    contestEnd: "2025-10-31",
    participants: [],
    weeks: {}
  };
  return true;
}

// Legacy functions for backward compatibility
export async function getUsers() {
  return contestData.participants.map(name => ({ username: name, totalCalories: 0 }));
}

export async function addUser(user) {
  return addParticipant(user.username);
}

export async function findUser(username) {
  return contestData.participants.includes(username) ? { username } : null;
}

export async function userExists(username) {
  return participantExists(username);
}

export async function clearAllUsers() {
  return clearAllData();
}