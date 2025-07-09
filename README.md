# Breath List
`Breath List` is an LLM-based breathwork playlist generator. It takes specific vibe or mood as input, along with other requirements and a given number of songs, and returns a playlist for breathwork.

This project is based on the open source project `LLMusic` an LLM-based playlist generator. It takes specific vibe or mood as input, along with other requirements and a given number of songs, and returns a playlist of songs that match the input.

It is integrated with the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) so users can save playlists to their Spotify account.

## How it works

Breath List takes the user input and inserts into an handcrafted prompt. The prompt is then fed into a Large Language Model (LLM) to generate a breath work specific playlist. The larger LLMs are trained on the whole internet, they are informed about music as a whole. We then fine-tune the model input using a RAG system to guide it in generating breath work specific playlists.

## The LLM

The project can use LM Studio for locally hosted LLMs, which is how it is curretnly configred. You can also change the code to use OpenAI or you.com

## How to use

You don't need much to get this project up and running. Set up a Spotify developer account and create an app. Then, in the `auth.js` file, replace the `client_id` and `redirect_uri` with your own. You can then run the app locally, for example, with VSCode's Live Server extension.

You will also need to setup a local LLM or adjust the confiuration to use a third party LLM

## DISCLAIMER

This project is for educational purposes only. I do not condone the use of this project for any malicious purposes. I am not responsible for any misuse of this project. Any use of this project is at your own risk.
