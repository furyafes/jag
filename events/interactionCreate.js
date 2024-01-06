const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} int 
     */
    execute: async(int) => {
        let command = global.client._commands.get(int.commandName);
        if (!command) {
            return;
        }else {
            let client = global.client;
            command.execute(client, int);
        }
    }
}