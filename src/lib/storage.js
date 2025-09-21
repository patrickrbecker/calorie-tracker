import { kv } from '@vercel/kv';

const USERS_KEY = 'calorie_contest_users';

export async function getUsers() {
  try {
    const users = await kv.get(USERS_KEY);
    return users || [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

export async function addUser(user) {
  try {
    const users = await getUsers();
    users.push(user);
    await kv.set(USERS_KEY, users);
    return user;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export async function findUser(username) {
  try {
    const users = await getUsers();
    return users.find(user => user.username.toLowerCase() === username.toLowerCase());
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}

export async function updateUser(username, updatedUser) {
  try {
    const users = await getUsers();
    const index = users.findIndex(user => user.username.toLowerCase() === username.toLowerCase());
    if (index !== -1) {
      users[index] = updatedUser;
      await kv.set(USERS_KEY, users);
      return updatedUser;
    }
    return null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function userExists(username) {
  try {
    const users = await getUsers();
    return users.some(user => user.username.toLowerCase() === username.toLowerCase());
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
}

export async function clearAllUsers() {
  try {
    await kv.del(USERS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing users:', error);
    throw error;
  }
}