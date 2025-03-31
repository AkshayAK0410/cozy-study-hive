export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  spotifyUri: string;
  duration: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  spotifyId: string;
  cover: string;
}

export const playlists: Playlist[] = [
  {
    id: "lofi-beats",
    name: "Lofi Beats",
    description: "Chill beats to help you study and focus",
    spotifyId: "37i9dQZF1DWWQRwui0ExPn",
    cover: "https://i.scdn.co/image/ab67706c0000da84bfcd52d1c60c41a9fb06368d"
  },
  {
    id: "focus-ambient",
    name: "Focus Flow",
    description: "Uptempo instrumental hip hop beats",
    spotifyId: "37i9dQZF1DX8NTLI2TtZa6",
    cover: "https://i.scdn.co/image/ab67706f000000034d26d431869cabfc53c67d8e"
  },
  {
    id: "piano-focus",
    name: "Peaceful Piano",
    description: "Peaceful piano to help you slow down and relax",
    spotifyId: "37i9dQZF1DX4sWSpwq3LiO",
    cover: "https://i.scdn.co/image/ab67706f000000035d87659dcadef82dd0e73f56"
  }
];
