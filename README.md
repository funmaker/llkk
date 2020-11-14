# llkk
Simple Markov-chain based text generator/discord bot.

## Usage

Extract messages from [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter) csv format:

```sh
    $ ./parsecsv.js <logs.csv >text.txt
```

Train model based on text file:

```sh
    $ ./generateModel.js <text.txt >model.json
```

Generate sentences using model:

```sh
    $ ./generateText.js model.json
```

Generate sentences and send them to Discord's Webhook:

```sh
    $ ./generateText.js model.json webhookUrl
```
