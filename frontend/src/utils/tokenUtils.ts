export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");

  let expirationDate;

  if (typeof storedExpirationDate === "string") {
    expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
  }
  return 0;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  if (!tokenDuration) {
    return null;
  } else if (tokenDuration <= 0) {
    return "EXPIRED";
  }
  return token;
}

export function tokenLoader() {
  const token = getAuthToken();
  return token;
}
