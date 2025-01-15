import React from 'react';

const PlayList = () => {
  const playlists = [
    {
      id: 1,
      name: "Mi Lista #1",
      description: "Una colección de mis canciones favoritas",
      embedUrl: "https://open.spotify.com/embed/playlist/6exktS5GGClOOCOupZcIiC?utm_source=generator",
      spotifyUrl: "https://open.spotify.com/playlist/6exktS5GGClOOCOupZcIiC?si=wjCDbpNoTOe6bDe9PF4c9Q&pi=u-t3796ehOQR2X"
    },
    {
      id: 2,
      name: "Mi Lista #2",
      description: "Para esos momentos especiales",
      embedUrl: "https://open.spotify.com/embed/playlist/2lzUsQKrGeTitO1WJXcfUZ?utm_source=generator",
      spotifyUrl: "https://open.spotify.com/playlist/2lzUsQKrGeTitO1WJXcfUZ?si=LeZ6c0LxSQqaQU2B8NiMHA&pi=u-6fs8oX2xT4y2"
    },
    {
      id: 3,
      name: "Mi Lista #3",
      description: "Música para cualquier ocasión",
      embedUrl: "https://open.spotify.com/embed/playlist/0EWTarysKfbICCfe10bH2J?utm_source=generator",
      spotifyUrl: "https://open.spotify.com/playlist/0EWTarysKfbICCfe10bH2J?si=ne_K1RrbQM-xvpNboxFA6w&pi=u-sX5tT3HYQ2y5"
    },
    {
      id: 4,
      name: "Mi Lista #4",
      description: "La mejor selección musical",
      embedUrl: "https://open.spotify.com/embed/playlist/6Mou49cu1OZKuShtmsK9Bt?utm_source=generator",
      spotifyUrl: "https://open.spotify.com/playlist/6Mou49cu1OZKuShtmsK9Bt?si=la_qVe-jROu2AHE2tBHzpg&pi=u-U4sQJmUjR-OD"
    }
  ];

  return (
    <div className="min-h-screen bg-[#202123] pb-12">
      <div className="flex flex-col items-center pt-10">
        <div className="bg-[#2C2C2E] p-8 rounded-lg shadow-2xl w-full max-w-4xl border border-gray-700">
          <h1 className="text-4xl font-bold text-[#FFFFFF] mb-8">
            Mis Playlists
          </h1>

          <div className="grid grid-cols-1 gap-6">
            {playlists.map((playlist) => (
              <div 
                key={playlist.id}
                className="bg-[#202123] rounded-lg border border-gray-700 overflow-hidden hover:border-[#FF3B30] transition-all duration-300"
              >
                <div className="p-4">
                  <h3 className="text-[#F0F0F0] text-xl font-bold mb-2">
                    {playlist.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {playlist.description}
                  </p>
                  
                  {/* Spotify Embed */}
                  <div className="w-full h-[352px] mb-4">
                    <iframe
                      src={playlist.embedUrl}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-lg"
                    />
                  </div>

                  <a
                    href={playlist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-[#FF3B30] hover:bg-opacity-80 text-[#FFFFFF] font-bold py-2 px-4 rounded-lg transition-colors inline-block text-center"
                  >
                    Abrir en Spotify
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayList;