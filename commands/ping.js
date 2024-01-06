const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const { BaseClient } = require("../lib/BaseX");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("🏓 Pong!"),
    /**
     * 
     * @param {BaseClient} client 
     * @param {CommandInteraction} int 
     * @returns 
     */
    execute: async (client, int) => {
        let status = {}; 
        return await int.reply({
            content: `🏓 **Pong!**\n> API delay: **${client.ws.ping}**\n> Interaction delay: **${Date.now() - int.createdAt}**`,
            ephemeral: true
        })
    }
}