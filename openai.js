class Completion {
    static async create(prompt, page=1, count=10, safe_search='Moderate', on_shopping_page=false, mkt='', response_filter='WebPages,Translations,TimeZone,Computation,RelatedSearches', domain='youchat', query_trace_id=null, chat=null, include_links=false, detailed=false, debug=false) {
        const apiKey = localStorage.getItem('openai_api_key');
        if (!apiKey) {
            console.error('No OpenAI API key found in localStorage');
            alert('Please enter your OpenAI API key in the settings');
            return [];
        }

        try {
            console.log('Sending request to OpenAI API...');
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a music playlist generator. You will only respond with a list of songs in the format: "- "Song Name", Artist Name"'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('OpenAI API error:', errorData);
                throw new Error(`OpenAI API request failed: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('Received response from OpenAI:', data);
            const result = data.choices[0].message.content;
            document.getElementById("result").innerHTML = result;
            
            // Extract songs using the same format as you.js
            const songs = this.extractSongs(result);
            console.log('Extracted songs:', songs);
            return songs;
        } catch (error) {
            console.error('Error in OpenAI API call:', error);
            document.getElementById("result").innerHTML = `Error: ${error.message}`;
            return [];
        }
    }

    static extractSongs(text) {
        console.log('Extracting songs from text:', text);
        const lines = text.split('\n');
        const result = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('-')) {
                const songInfo = line.substring(1).trim();
                const [song, artist] = songInfo.split('",').map(s => s.trim().replace(/"/g, ''));
                if (song && artist) {
                    result.push([song, artist]);
                }
            }
        }

        return result;
    }

    static __get_failure_message() {
        return 'Unable to contact OpenAI API. Please check your API key and try again.';
    }
}

export { Completion }; 