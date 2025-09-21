// Simple in-memory storage that will work immediately
// TODO: Set up Vercel KV for persistence later
let users = [];

export async function getUsers() {
  return users;
}

export async function addUser(user) {
  users.push(user);
  return user;
}

export async function findUser(username) {
  return users.find(user => user.username.toLowerCase() === username.toLowerCase());
}

export async function updateUser(username, updatedUser) {
  const index = users.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
  if (index !== -1) {
    users[index] = updatedUser;
    return updatedUser;
  }
  return null;
}

export async function userExists(username) {
  return users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

export async function clearAllUsers() {
  users = [];
  return true;
}