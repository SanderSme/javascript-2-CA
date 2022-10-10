const tokenKey = "token";
const userKey = "user";

function saveUser(user) {
  saveToLocalStorage(userKey, user);
}

function saveToken(token) {
  saveToLocalStorage(tokenKey, token);
}

function getToken() {
  const value = localStorage.getItem(tokenKey);
  if (value) {
    return JSON.parse(value);
  } else {
    return null;
  }
}

function getUserName() {
  const user = getFromLocalStorage(userKey);
  if (userKey) {
    return user.name;
  } else {
    return null;
  }
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  } else {
    return [];
  }
}

function clearStorage() {
  localStorage.clear();
}

export { getUserName, getToken, saveToken, saveUser, clearStorage };
