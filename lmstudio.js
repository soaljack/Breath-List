class Completion {
    static async getAvailableModels() {
        try {
            const response = await fetch('http://localhost:8000/models');
            if (!response.ok) {
                throw new Error('Failed to fetch models');
            }
            const data = await response.json();
            return data.data.map(model => model.id);
        } catch (error) {
            console.error('Error fetching models:', error);
            return [];
        }
    }

    static async create(prompt, page=1, count=10, safe_search='Moderate', on_shopping_page=false, mkt='', response_filter='WebPages,Translations,TimeZone,Computation,RelatedSearches', domain='youchat', query_trace_id=null, chat=null, include_links=false, detailed=false, debug=false) {
        try {
            console.log('Sending request to proxy server...');
            
            // Get available models
            const models = await this.getAvailableModels();
            if (models.length === 0) {
                throw new Error('No models available. Please make sure LM Studio is running.');
            }

            // Use the first available model
            const selectedModel = models[0];
            console.log('Using model:', selectedModel);
            
            const response = await fetch('http://localhost:8000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
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
                    max_tokens: 500,
                    stream: false,
                    model: selectedModel
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error('Proxy server error:', data);
                throw new Error(data.error || data.details || response.statusText);
            }

            console.log('Received response from proxy server:', data);
            const result = data.choices[0].message.content;
            document.getElementById("result").innerHTML = result;
            
            // Extract songs using the same format as you.js
            const songs = this.extractSongs(result);
            console.log('Extracted songs:', songs);
            return songs;
        } catch (error) {
            console.error('Error in proxy server API call:', error);
            if (error.message === 'Failed to fetch') {
                document.getElementById("result").innerHTML = 'Error: Could not connect to the proxy server. Please make sure the proxy server is running on port 8000.';
            } else {
                document.getElementById("result").innerHTML = `Error: ${error.message}`;
            }
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
        return 'Unable to contact the proxy server. Please make sure the proxy server is running.';
    }
}

export { Completion }; 