const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state",
  "streaming",
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative"
].join(" ");

export const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

export async function getAccessToken(): Promise<string | null> {
  const hash = window.location.hash;
  if (hash) {
    const token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1];
    if (token) {
      localStorage.setItem("spotify_token", token);
      return token;
    }
  }
  return localStorage.getItem("spotify_token");
}

export async function getCurrentTrack(token: string) {
  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export async function getPlaylists(token: string) {
  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function playTrack(token: string, uri: string) {
  await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: [uri],
    }),
  });
}

export async function pauseTrack(token: string) {
  await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function nextTrack(token: string) {
  await fetch("https://api.spotify.com/v1/me/player/next", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function previousTrack(token: string) {
  await fetch("https://api.spotify.com/v1/me/player/previous", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function seekToPosition(token: string, position_ms: number) {
  await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
