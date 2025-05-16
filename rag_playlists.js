// Example playlists for RAG system
const examplePlaylists = [
    {
        vibe: "Deep Breath",
        requirements: "primary breathwork meditation focus",
        songs: [
            { name: "Weightless Part 1", artist: "Marconi Union" },
            { name: "Nuvole Bianche", artist: "Ludovico Einaudi" },
            { name: "Watermark", artist: "Enya" },
            { name: "Shamanic Dream", artist: "Anugama" },
            { name: "The Call of Dawn", artist: "Porangui, Liquid Bloom" }
        ]
    },
    {
        vibe: "Primary Source",
        requirements: "deep meditative state with ethereal elements",
        songs: [
            { name: "Uno", artist: "Deuter" },
            { name: "Weightless", artist: "Marconi Union" },
            { name: "First Breath After Coma", artist: "Explosions In The Sky" },
            { name: "Spiral", artist: "Dustin O'Halloran" },
            { name: "The Sacred", artist: "Yaima" }
        ]
    },
    {
        vibe: "Joyful Awakening",
        requirements: "uplifting and energetic breathwork",
        songs: [
            { name: "Mother", artist: "Trevor Hall, Xavier Rudd" },
            { name: "I Am Light", artist: "India.Arie" },
            { name: "Blessed We Are", artist: "Peia" },
            { name: "Circle of Women", artist: "Nalini Blossom" },
            { name: "You Are Safe", artist: "Vanessa Forbes" }
        ]
    },
    {
        vibe: "Folksy and Lunar",
        requirements: "folk music with trance elements",
        songs: [
            { name: "By The Jordan", artist: "Starling Arrow, Rising Appalachia" },
            { name: "Name of the Wind", artist: "Starling Arrow" },
            { name: "Prayer Song", artist: "Flowers of the Forest" },
            { name: "The Divine Name", artist: "Jonathan Goldman" },
            { name: "Love Song", artist: "MARDELEVA" }
        ]
    },
    {
        vibe: "Ethereal and Instrumental",
        requirements: "spacious ambient soundscapes",
        songs: [
            { name: "Watermark", artist: "Enya" },
            { name: "Weightless Part 1", artist: "Marconi Union" },
            { name: "Nuvole Bianche", artist: "Ludovico Einaudi" },
            { name: "First Breath After Coma", artist: "Explosions In The Sky" },
            { name: "Uno", artist: "Deuter" }
        ]
    },
    {
        vibe: "Tribal and Spacey",
        requirements: "blend of tribal rhythms and spacious atmospheres",
        songs: [
            { name: "Grandmother Tree & The Feathered Serpent", artist: "Deya Dova" },
            { name: "Xica Xica", artist: "El Búho, Uji, Barrio Lindo" },
            { name: "Iluminar", artist: "Porangui" },
            { name: "Native Prayer", artist: "Gerhard Fankhauser" },
            { name: "Om Ganesha", artist: "Mose, Sam Garrett" }
        ]
    },
    {
        vibe: "Calm Earthy",
        requirements: "grounding nature-connected sounds",
        songs: [
            { name: "Earth Breath", artist: "BLOOM" },
            { name: "The Water Poem", artist: "Ram Dass, AWARE" },
            { name: "Mother", artist: "Trevor Hall" },
            { name: "Loosen", artist: "Aly Halpert" },
            { name: "Ho'oponopono", artist: "The Emmitt Sisters" }
        ]
    },
    {
        vibe: "Shamanic Breathwork",
        requirements: "deep shamanic journey with traditional elements",
        songs: [
            { name: "Shamanic Dream", artist: "Anugama" },
            { name: "Native Prayer", artist: "Gerhard Fankhauser" },
            { name: "The Call of Dawn", artist: "Porangui" },
            { name: "Weaving of the Spirit", artist: "Christian Bollmann" },
            { name: "Om Shanti", artist: "Paul Izak" }
        ]
    },
    {
        vibe: "sacred healing",
        requirements: "peaceful journey with medicine songs and awakening elements",
        songs: [
            { name: "The Water Poem", artist: "Ram Dass, AWARE" },
            { name: "Mother", artist: "Trevor Hall, Xavier Rudd, Tubby Love" },
            { name: "Prayer Song (Mose Remix)", artist: "Flowers of the Forest, Mose" },
            { name: "I Wish You Peace", artist: "Lawrence Laughing" },
            { name: "Name of the Wind", artist: "Starling Arrow, Ayla Nereo, Tina Malia, Marya Stark, Chloe Smith, Leah Song" },
            { name: "The Sacred", artist: "Yaima" },
            { name: "Awaken Your Medicine", artist: "Vianney Lopez" },
            { name: "Xica Xica", artist: "El Búho, Uji, Barrio Lindo" },
            { name: "You Are Safe", artist: "Vanessa Forbes" },
            { name: "Loosen", artist: "Aly Halpert" }
        ]
    },
    {
        vibe: "Weaving of the Spirit",
        requirements: "shamanic journey with indigenous wisdom and sacred transitions",
        songs: [
            { name: "Weaving of the Spirit", artist: "Christian Bollmann, Daniel Namkhay" },
            { name: "Iluminar - J. Pool Remix", artist: "Porangui, Eric Zang, J.Pool" },
            { name: "Into the Wild", artist: "Shylah Ray Sunshine" },
            { name: "Circle of Women", artist: "Nalini Blossom, Craig Pruess" },
            { name: "Native Prayer", artist: "Gerhard Fankhauser, Einat Gilboa" },
            { name: "Bonteka", artist: "Ayla Nereo" },
            { name: "Atman", artist: "Ksenia Luki, Josh Brill" },
            { name: "In Your Bones", artist: "Olivia Fern" },
            { name: "Prayer for Souls Transitioning Into the Spirit Realm", artist: "Daniela Rojas" },
            { name: "At the Ivy Gate", artist: "Brian Crain" },
            { name: "By The Jordan", artist: "Starling Arrow, Tina Malia, Ayla Nereo, Leah Song, Marya Stark, Chloe Smith, Rising Appalachia" }
        ]
    },
    {
        vibe: "sacred feminine",
        requirements: "mother earth connection with piano and indigenous elements",
        songs: [
            { name: "At the Ivy Gate", artist: "Brian Crain" },
            { name: "Atman", artist: "Ksenia Luki, Josh Brill" },
            { name: "Iluminar - J. Pool Remix", artist: "Porangui, Eric Zang, J.Pool" },
            { name: "Xica Xica", artist: "El Búho, Uji, Barrio Lindo" },
            { name: "Grandmother Tree & The Feathered Serpent", artist: "Deya Dova" },
            { name: "Mother", artist: "Trevor Hall, Xavier Rudd, Tubby Love" },
            { name: "Hymn", artist: "Ashana" },
            { name: "By The Jordan", artist: "Starling Arrow, Tina Malia, Ayla Nereo, Leah Song, Marya Stark, Chloe Smith, Rising Appalachia" }
        ]
    },
    {
        vibe: "heart awakening",
        requirements: "shamanic journey with love energy and tribal elements",
        songs: [
            { name: "A Song For Your Heart", artist: "Gwairoch" },
            { name: "Shaman Dance", artist: "Sealskin" },
            { name: "Love Energy", artist: "Darpan" },
            { name: "Danza del Viento (El Búho Remix)", artist: "Porangui, El Búho" },
            { name: "O, I Love You", artist: "Essie Jain" },
            { name: "Atman", artist: "Ksenia Luki, Josh Brill" },
            { name: "By The Jordan", artist: "Starling Arrow, Tina Malia, Ayla Nereo, Leah Song, Marya Stark, Chloe Smith, Rising Appalachia" }
        ]
    },
    {
        vibe: "Be Here Now",
        requirements: "spiritual presence and mindful awareness",
        songs: [
            { name: "I Am Light", artist: "India.Arie" },
            { name: "Blessed We Are", artist: "Peia" },
            { name: "Xica Xica", artist: "El Búho, Uji, Barrio Lindo" },
            { name: "Iluminar - J. Pool Remix", artist: "Porangui, Eric Zang, J.Pool" },
            { name: "Women & Children", artist: "Deya Dova" },
            { name: "Mother", artist: "Trevor Hall, Xavier Rudd, Tubby Love" },
            { name: "Loosen", artist: "Aly Halpert" },
            { name: "You Are Safe", artist: "Vanessa Forbes" },
            { name: "Be Here Now", artist: "Ray LaMontagne" },
            { name: "Ho'oponopono", artist: "The Emmitt Sisters" },
            { name: "The Divine Feminine", artist: "Tallulah Rendall" },
            { name: "One Voice", artist: "The Wailin' Jennys" },
            { name: "Love Surrounds You", artist: "Bird Tribe, Miranda Rondeau" },
            { name: "Oh Love", artist: "Ayla Nereo" },
            { name: "Atman", artist: "Ksenia Luki, Josh Brill" }
        ]
    },
    {
        vibe: "Meditation and mindfulness",
        requirements: "gentle, ambient sounds",
        songs: [
            { name: "Weightless Part 1", artist: "Marconi Union" },
            { name: "Nuvole Bianche", artist: "Ludovico Einaudi" },
            { name: "Teardrop", artist: "Massive Attack" },
            { name: "Anima Mundi", artist: "Ólafur Arnalds" },
            { name: "Watermark", artist: "Enya" },
            { name: "Porcelain", artist: "Moby" },
            { name: "Rivers Within", artist: "Deuter" },
            { name: "Halcyon On and Off", artist: "Orbital" },
            { name: "Into the Void", artist: "Nine Inch Nails" },
            { name: "Oogway Ascends", artist: "Hans Zimmer" }
        ]
    },
    {
        vibe: "breath",
        requirements: "healing and transformative journey with sacred elements",
        songs: [
            { name: "Horizon", artist: "Garth Stevenson" },
            { name: "That Home", artist: "The Cinematic Orchestra" },
            { name: "Hasata (La source)", artist: "Yeahman" },
            { name: "Om Ganesha", artist: "Mose, Sam Garrett, Mollie Mendoza" },
            { name: "Iluminar", artist: "Porangui" },
            { name: "Earth Breath", artist: "BLOOM" },
            { name: "Nectar Drop", artist: "DJ Drez" },
            { name: "Grandmother Tree & The Feathered Serpent", artist: "Deya Dova" },
            { name: "Warmth of the Sun's Rays", artist: "Hang Massive" },
            { name: "Gozo", artist: "Daniel Waples, Alexei Levin" },
            { name: "Om Shanti", artist: "Paul Izak, Seeds of Love" },
            { name: "The Power Is Here Now", artist: "Alexia Chellun" },
            { name: "The Divine Name I Am - Excerpt", artist: "Jonathan Goldman, Tina Malia" },
            { name: "Love Song", artist: "MARDELEVA" },
            { name: "Infinite Universe", artist: "Beautiful Chorus" },
            { name: "The Sacred", artist: "Yaima" },
            { name: "Soulmerge", artist: "Ashana" },
            { name: "Angel Of The Earth", artist: "Ilyana Vilensky, Craig Pruess" },
            { name: "The Water Poem", artist: "Ram Dass, AWARE" }
        ]
    },
    {
        vibe: "Instrumental breathwork",
        requirements: "ambient piano and electronic progression with classical elements",
        songs: [
            { name: "Uno", artist: "Deuter" },
            { name: "Spiral — piano reworks", artist: "Dustin O'Halloran, Ólafur Arnalds" },
            { name: "Shamanic Dream", artist: "Anugama" },
            { name: "Watermark", artist: "Enya" },
            { name: "Weightless Part 1", artist: "Marconi Union" },
            { name: "Nuvole Bianche", artist: "Ludovico Einaudi" },
            { name: "First Breath After Coma - Remastered", artist: "Explosions In The Sky" },
            { name: "The Call of Dawn", artist: "Porangui, Liquid Bloom" }
        ]
    }
];

// Function to find similar playlists based on vibe and requirements
function findSimilarPlaylists(vibe, requirements) {
    // Enhanced similarity scoring with artist and theme weighting
    return examplePlaylists.map(playlist => {
        let score = 0;
        
        // Check vibe similarity with more weight on exact matches
        const vibeWords = vibe.toLowerCase().split(' ');
        const playlistVibeWords = playlist.vibe.toLowerCase().split(' ');
        vibeWords.forEach(word => {
            if (playlistVibeWords.includes(word)) score += 3;  // Increased weight for vibe matches
            // Check for related themes
            if (word === 'sacred' && playlistVibeWords.some(w => ['spiritual', 'divine', 'holy'].includes(w))) score += 2;
            if (word === 'healing' && playlistVibeWords.some(w => ['medicine', 'awakening', 'transformation'].includes(w))) score += 2;
        });
        
        // Check requirements similarity with context
        const reqWords = requirements.toLowerCase().split(' ');
        const playlistReqWords = playlist.requirements.toLowerCase().split(' ');
        reqWords.forEach(word => {
            if (playlistReqWords.includes(word)) score += 2;
            // Check for related concepts
            if (word === 'journey' && playlistReqWords.some(w => ['path', 'transition', 'progression'].includes(w))) score += 1;
            if (word === 'energy' && playlistReqWords.some(w => ['power', 'force', 'strength'].includes(w))) score += 1;
        });
        
        // Create sets of artists for comparison
        const playlistArtists = new Set(playlist.songs.flatMap(song => 
            song.artist.split(', ').map(a => a.toLowerCase())
        ));
        
        // Common spiritual artists get extra weight
        const commonArtists = ['trevor hall', 'xavier rudd', 'rising appalachia', 'ayla nereo', 'porangui'];
        commonArtists.forEach(artist => {
            if (playlistArtists.has(artist)) score += 1;
        });
        
        return { playlist, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Get top 3 most similar playlists
}

// Function to enhance the prompt with similar playlist examples
function enhancePromptWithRAG(vibe, requirements, numSongs) {
    const similarPlaylists = findSimilarPlaylists(vibe, requirements);
    
    let enhancedPrompt = `Namaste. You are a breathwork practitioner that makes incredible playlists filled with spiritual music. You will help find the perfect playlist for our users. You will be given a specific vibe for the breathwork and a number of songs and you will create a playlist based on it. All that matters to you is that you find the perfect playlist. You will try to match the vibe as closely as you can in the context of breathwork, based on the input you are given and your knowledge of music used for breathwork. All songs must be available on Spotify. Do not use songs with explicit lyrics. Your replies will consist of a list of songs, with each entry containing the name of the track and its artist. You will not return any other content apart from that list.\n\n`;
    
    // Add similar playlist examples with more emphasis on their structure and progression
    enhancedPrompt += `Here are some carefully curated playlists that demonstrate the exact style, artists, and energy progression we're looking for. Your playlist should follow a similar structure and use these artists when they match the requested vibe:\n\n`;
    
    similarPlaylists.forEach(({ playlist }, index) => {
        enhancedPrompt += `Example Playlist ${index + 1} (${playlist.vibe}):\n`;
        enhancedPrompt += `Requirements: ${playlist.requirements}\n`;
        enhancedPrompt += `Songs (notice the energy progression):\n`;
        playlist.songs.forEach((song, idx) => {
            enhancedPrompt += `${idx + 1}. "${song.name}", ${song.artist}\n`;
        });
        enhancedPrompt += '\n';
    });
    
    // Add the current request with clear instructions for matching style
    enhancedPrompt += `Now, create a playlist that precisely matches the style, energy progression, and artist selection of these examples:\n`;
    enhancedPrompt += `Vibe: ${vibe}\n`;
    if (requirements) {
        enhancedPrompt += `Requirements: ${requirements}\n`;
    }
    enhancedPrompt += `Number of songs: ${numSongs}\n\n`;
    enhancedPrompt += `Important: Use artists from the example playlists when they fit the vibe, and maintain a similar energy progression throughout the playlist.`;
    
    return enhancedPrompt;
}

// Export the functions
export { enhancePromptWithRAG }; 