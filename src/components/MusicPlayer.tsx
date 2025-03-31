import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListMusic } from "lucide-react";
import { playlists } from "@/data/playlists";
import { SpotifyEmbed } from "./SpotifyEmbed";

export function MusicPlayer() {
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const currentPlaylist = playlists[currentPlaylistIndex];

  return (
    <Card className="p-4 bg-background/95 backdrop-blur border-none shadow-lg rounded-3xl">
      <div className="space-y-4">
        {/* Spotify Embed */}
        <SpotifyEmbed playlistId={currentPlaylist.spotifyId} />

        {/* Playlist Selector */}
        <div className="flex justify-end px-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <ListMusic />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <ScrollArea className="h-96">
                <div className="grid gap-4 p-4">
                  {playlists.map((playlist, index) => (
                    <button
                      key={playlist.id}
                      className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${
                        currentPlaylistIndex === index
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setCurrentPlaylistIndex(index)}
                    >
                      <img
                        src={playlist.cover}
                        alt={playlist.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="text-left">
                        <h4 className="font-medium leading-none">{playlist.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {playlist.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  );
}
