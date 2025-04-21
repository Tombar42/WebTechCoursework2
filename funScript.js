const playlistUrls = [
    "https://open.spotify.com/embed/playlist/0JhmTXAGOZMGeSwGDBLFWC?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/37i9dQZEVXbLnolsZ8PSNw?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DWY4lFlS4Pnso?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/37i9dQZF1DWVCKO3xAlT1Q?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/4qXuwJrwX368VuvOw2C0gK?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/38wzjPLtaQfMtUWiYONlar?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/45kWzztmpIRXz5i934V09O?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/5jTkE0z8RM5ijInIHTOixF?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/0PYnfouUK9DWYOWGjBzFDl?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/2oFgKE2WuUqFadiAAmrFFI?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/3FLOxDEUK0mfNrAEDwWfgp?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/1PmwMQY86pJuAm7veFt3u2?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/0q1di38xTtJS21GjOtaeNb?utm_source=oembed",
    "https://open.spotify.com/embed/playlist/7mxYiC8pPzPATfZ0yar77U?utm_source=oembed"
];

function dale() {
    const randomUrl = playlistUrls[Math.floor(Math.random() * playlistUrls.length)];
    document.getElementById("enjoy").innerText = "Enjoy the music!😉";
    document.getElementById("sorpresa").src = randomUrl;
}
