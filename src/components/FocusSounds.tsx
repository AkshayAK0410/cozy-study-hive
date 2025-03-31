import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Music } from "lucide-react";
import { motion } from "framer-motion";

// Spotify playlist types
const playlistOptions = [
  {
    id: "study",
    name: "Study Focus",
    icon: "📚",
    embedUrl: "https://open.spotify.com/embed/playlist/0oPyDVNdgcPFAWmOYSK7O1",
  },
  {
    id: "lofi",
    name: "Lo-Fi Beats",
    icon: "🎵",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn",
  },
  {
    id: "classical",
    name: "Classical Focus",
    icon: "🎻",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWWEJlAGA9gs0",
  },
  {
    id: "ambient",
    name: "Deep Focus",
    icon: "🧠",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdKQ",
  },
  {
    id: "jazz",
    name: "Jazz Focus",
    icon: "🎷",
    embedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3SiCzCxMDOH",
  },
];

const FocusSounds = () => {
  const [activePlaylist, setActivePlaylist] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {playlistOptions.map((playlist) => (
          <motion.div
            key={playlist.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className={`cursor-pointer transition-colors ${
                activePlaylist === playlist.id
                  ? "border-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setActivePlaylist(playlist.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{playlist.icon}</div>
                  <div>
                    <h3 className="font-medium">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Spotify Playlist
                    </p>
                  </div>
                </div>
                {activePlaylist === playlist.id && (
                  <div className="mt-4 aspect-video w-full">
                    <iframe
                      src={playlist.embedUrl}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-md"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FocusSounds;
