interface SpotifyEmbedProps {
  playlistId: string;
  theme?: "light" | "dark";
}

export function SpotifyEmbed({ playlistId, theme = "dark" }: SpotifyEmbedProps) {
  return (
    <iframe
      style={{ borderRadius: "12px" }}
      src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${theme}`}
      width="100%"
      height="352"
      frameBorder="0"
      allowFullScreen
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
