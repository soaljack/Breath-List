import { Completion } from "./lmstudio.js";
import { enhancePromptWithRAG } from "./rag_playlists.js";

const context_prompt = "Namaste. You are a breathwork practitioner that makes incredible playlists filled with spiritual music. You will help find the perfect playlist for our users. You will be given a specific vibe for the breathwork and a number of songs and you will create a playlist based on it. All that matters to you is that you find the perfect playlist. You will try to match the vibe as closely as you can in the context of breathwork, based on the input you are given and your knowledge of music used for breathwork. All songs must be available on Spotify. Do not use songs with explicit lyrics. Your replies will consist of a list of songs, with each entry containing the name of the track and its artist. You will not return any other content apart from that list. Additionally, the user may specify some extra requirements for the playlist - they may suggest artists, they may limit the time period of the songs. You are also to accomodate for those specific requirements. For example, if you are asked to retrieve a two song playlist based on Be Here Now, your reply would be something like: \"- \"I Am Light\", India.Arie\n\- \"Blessed We Are\", Peia\". No other text is to be added before or after the list.";
let currentPlaylist = [];
let currentVibe = "";

async function spotifySearch(songList) {
    const token = localStorage.getItem('spotify_token');
    if (!token) {
        throw new Error("Spotify authentication required. Please log in.");
    }
    
    const headers = {
        'Authorization': 'Bearer ' + token
    };
    const searchURL = 'https://api.spotify.com/v1/search?q=';
    
    // Create an array of promises for parallel execution
    const searchPromises = songList.map(async ([songName, artistName]) => {
        try {
            // Encode the query parameters properly
            const encodedSong = encodeURIComponent(songName);
            const encodedArtist = encodeURIComponent(artistName);
            const query = `${encodedSong}%20${encodedArtist}&type=track&limit=1`;
            
            const response = await fetch(searchURL + query, { headers });
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Spotify authentication expired. Please log in again.");
                }
                console.warn(`Search failed for "${songName}" by ${artistName}: ${response.statusText}`);
                return null;
            }
            
            const data = await response.json();
            
            // Check if we got valid results
            if (!data.tracks || !data.tracks.items || data.tracks.items.length === 0) {
                console.warn(`No results found for "${songName}" by ${artistName}`);
                return null;
            }
            
            return data.tracks.items[0];
        } catch (error) {
            console.error(`Error searching for "${songName}" by ${artistName}:`, error);
            return null;
        }
    });
    
    // Wait for all promises to resolve
    const results = await Promise.all(searchPromises);
    
    // Filter out null results
    const playlist = results.filter(track => track !== null);
    
    // Log stats about the search
    console.log(`Found ${playlist.length} of ${songList.length} requested tracks on Spotify`);
    
    return playlist;
}

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
  
    return (mins >= 10 ? mins : '0' + mins)  + ':' + (secs >= 10 ? secs : '0' + secs);
}

function createEmbedding(track) {
    let link = document.createElement('a');
    link.href = track['external_urls']['spotify'];
    link.target = "_blank";

    let row = document.createElement('div');
    row.classList.add('flex', 'flex-row', 'space-x-2', 'p-2', 'bg-gray-700', 'rounded');
    
    let cover = document.createElement('img');
    cover.classList.add('w-24', 'h-24');
    cover.src = track['album']['images'][0]['url'];
    cover.alt = "Cover";
    
    let info = document.createElement('div');
    info.classList.add('flex', 'flex-col', 'text-white', 'w-full');

    let infoContainer = document.createElement('div');
    infoContainer.classList.add('flex', 'flex-col', 'flex-grow');

    let titleContainer = document.createElement('div');
    titleContainer.classList.add('flex', 'flex-row', 'items-center', 'justify-between', 'w-full');

    let title = document.createElement('h1');
    title.classList.add('text-xl');
    title.innerText = track['name'];

    let spotifyIcon = document.getElementById('spotify-icon').cloneNode(true);

    titleContainer.appendChild(title);
    titleContainer.appendChild(spotifyIcon);

    let artistContainer = document.createElement('div');
    artistContainer.classList.add('flex', 'flex-row', 'space-x-2', 'items-center');

    if (track['explicit']) {
        let explicit = document.createElement('div');
        explicit.classList.add('bg-gray-400', 'rounded');
        explicit.style.padding = "3px 5px";

        let explicitText = document.createElement('p');
        explicitText.classList.add('text-xs');
        explicitText.innerText = "E";

        explicit.appendChild(explicitText);
        artistContainer.appendChild(explicit);
    }

    let artist = document.createElement('h2');
    artist.classList.add('text-lg');
    artist.innerText = track['artists'][0]['name'];

    artistContainer.appendChild(artist);

    infoContainer.appendChild(titleContainer);
    infoContainer.appendChild(artistContainer);

    let timeContainer = document.createElement('div');
    timeContainer.classList.add('flex', 'flex-row', 'items-center');

    let time = document.createElement('h3');
    time.classList.add('text-sm');
    time.innerText = msToTime(track['duration_ms']);

    timeContainer.appendChild(time);

    info.appendChild(infoContainer);
    info.appendChild(timeContainer);

    row.appendChild(cover);
    row.appendChild(info);

    link.appendChild(row);

    return link;
}

function setPlaylist(playlist) {
    let playlistWrapper = document.getElementById('playlist-wrapper');
    while (playlistWrapper.firstChild) {
        playlistWrapper.removeChild(playlistWrapper.firstChild);
    }
    for (let i = 0; i < playlist.length; i++) {
        if (playlist[i] != null) {
            playlistWrapper.appendChild(createEmbedding(playlist[i]));
        }
    }
}

function getGeneratePlaylistButton() {
    let button = document.createElement('button');
    button.classList.add('flex', 'items-center', 'space-x-1', 'justify-center', 'w-full', 'bg-green-400', 'rounded', 'p-2');
    button.id = 'generate-playlist';
    let spotifyIcon = document.getElementById('spotify-icon').cloneNode(true);
    button.appendChild(spotifyIcon);
    let text = document.createElement('span');
    text.innerText = 'Create Playlist';
    button.appendChild(text);
    return button;
}

function replaceSpotifyWrapper() {
    let spotifyWrapper = document.getElementById('spotify-wrapper');
    if (!localStorage.getItem('playlist_id')) {
      spotifyWrapper.replaceChild(getGeneratePlaylistButton(), document.getElementById('login'));
      document.getElementById("generate-playlist").addEventListener("click", prompt);
    }
}

async function prompt() {
    try {
        // Show loading state
        const generateButton = document.getElementById('generate-playlist');
        const originalText = generateButton.innerHTML;
        generateButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...';
        generateButton.disabled = true;
        
        const vibe = document.getElementById('vibe').value;
        const requirements = document.getElementById('requirements').value;
        const numSongs = document.getElementById('numSongs').value || 5; // Default to 5 if not specified
        
        if (!vibe) {
            throw new Error("Please enter a vibe for your breathwork experience");
        }
        
        // Use RAG to enhance the prompt with similar playlists
        const enhancedPrompt = enhancePromptWithRAG(vibe, requirements, numSongs);
        
        // Create a more structured prompt that emphasizes matching the example style
        const messages = [
            {
                role: "system",
                content: "You are a breathwork playlist curator. Analyze the example playlists carefully and create new playlists that closely match their style, artists, and energy. Focus on spiritual and meditative music suitable for breathwork. Include artists from the examples when they match the requested vibe."
            },
            {
                role: "user",
                content: enhancedPrompt
            }
        ];
        
        // Call the static create method directly on the Completion class
        const songList = await Completion.create(enhancedPrompt);
        
        if (songList.length === 0) {
            throw new Error("No songs were generated. Please try again with a different vibe.");
        }
        
        // Convert the song list to Spotify search format
        const playlist = await spotifySearch(songList);
        
        if (playlist.length === 0) {
            throw new Error("No songs could be found on Spotify. Please try again with a different vibe.");
        }
        
        setPlaylist(playlist);
        
        currentPlaylist = playlist;
        currentVibe = vibe;
        
        // Show success message
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `<div class="text-green-600 mt-2">Successfully created a "${vibe}" playlist with ${playlist.length} songs!</div>`;
        resultElement.classList.remove('text-red-600');
        resultElement.classList.add('text-green-600');
    } catch (error) {
        console.error("Error generating playlist:", error);
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `<div class="text-red-600 mt-2">Error: ${error.message}</div>`;
        resultElement.classList.remove('text-green-600');
        resultElement.classList.add('text-red-600');
    } finally {
        // Reset button state
        const generateButton = document.getElementById('generate-playlist');
        generateButton.innerHTML = '<svg id="spotify-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-spotify" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z"/></svg> <span>Create Playlist</span>';
        generateButton.disabled = false;
    }
    
    return null;
}

async function savePlaylist() {
    try {
        // Show loading state
        const saveButton = document.getElementById('save-playlist');
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '<svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...';
        saveButton.disabled = true;
        
        const resultElement = document.getElementById('result');
        
        // Check if we have a token
        const token = localStorage.getItem('spotify_token');
        if (!token) {
            throw new Error("You need to log in to Spotify first");
        }
        
        const headers = {
            'Authorization': 'Bearer ' + token
        };
        
        // Check if we have a playlist to save
        if (currentPlaylist.length === 0) {
            throw new Error("You either have not generated a playlist or have already saved it");
        }

        // Get user ID
        const userResponse = await fetch('https://api.spotify.com/v1/me', { headers });
        if (!userResponse.ok) {
            if (userResponse.status === 401) {
                throw new Error("Your Spotify session has expired. Please log in again");
            }
            throw new Error(`Failed to get user info: ${userResponse.statusText}`);
        }
        
        const userData = await userResponse.json();
        const userId = userData.id;
        if (!userId) {
            throw new Error("Could not retrieve your Spotify user ID");
        }
        
        // Create playlist
        const body = {
            "name": currentVibe || "Breath List Playlist",
            "description": `A breathwork playlist generated to match the vibe "${currentVibe}".`,
            "public": false
        };

        const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!playlistResponse.ok) {
            throw new Error(`Failed to create playlist: ${playlistResponse.statusText}`);
        }
        
        const playlistData = await playlistResponse.json();
        const playlistId = playlistData.id;
        if (!playlistId) {
            throw new Error("Failed to get playlist ID");
        }
        
        // Add tracks to playlist
        let uris = [];
        for (let i = 0; i < currentPlaylist.length; i++) {
            if (currentPlaylist[i] != null) {
                uris.push(currentPlaylist[i]['uri']);
            }
        }
        
        if (uris.length === 0) {
            throw new Error("No valid tracks to add to playlist");
        }

        const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "uris": uris })
        });
        
        if (!tracksResponse.ok) {
            throw new Error(`Failed to add tracks to playlist: ${tracksResponse.statusText}`);
        }
        
        // Success!
        resultElement.innerHTML = `<div class="text-green-600 mt-2">Successfully saved "${currentVibe}" playlist to your Spotify account! <a href="${playlistData.external_urls.spotify}" target="_blank" class="underline">Open in Spotify</a></div>`;
        resultElement.classList.remove('text-red-600');
        resultElement.classList.add('text-green-600');
        
        // Clear current playlist to prevent duplicate saves
        currentPlaylist = [];
        
    } catch (error) {
        console.error("Error saving playlist:", error);
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `<div class="text-red-600 mt-2">Error: ${error.message}</div>`;
        resultElement.classList.remove('text-green-600');
        resultElement.classList.add('text-red-600');
    } finally {
        // Reset button state
        const saveButton = document.getElementById('save-playlist');
        saveButton.innerHTML = '<svg id="spotify-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-spotify" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.669 11.538a.498.498 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686zm.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858zm.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288z"/></svg> <span>Save Current Playlist</span>';
        saveButton.disabled = false;
    }
}

document.getElementById("save-playlist").addEventListener("click", savePlaylist);

export { replaceSpotifyWrapper };
