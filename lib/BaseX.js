const { Client, Collection, Partials, GatewayIntentBits, REST, Routes, ActivityType } = require("discord.js");
const { readdirSync } = require("fs");
const { config } = require("../Global.Config");

class BaseClient extends Client {
    constructor() {
        let intents = [];
        let partials = [];
        Object.values(GatewayIntentBits).forEach(v => {
            intents.push(v)
        })
        Object.values(Partials).forEach(v => {
            partials.push(v)
        })
        super({
            intents: intents,
            partials: partials
        });
        this.config = config;
        this._commands = global._commands = new Collection()
        this._slash = global._slash = new Array();
        this._rest = global._rest = new REST({ version: "10" }).setToken(this.config.token);
    }
    requestCommands() {
        readdirSync(`./module/commands`).forEach(directory => {
            if (directory.endsWith(".js") === true) {
                let prop = require(`../../module/commands/${directory}`);
                this._commands.set(prop.data.name, prop);
                this._slash.push(prop.data.toJSON());
                console.log(`[Commands] ${prop.data.name} loaded!`)
            }else {
                for (let file of directory) {
                    let prop = require(`../../module/commands/${directory}/${file}`);
                    this._commands.set(prop.data.name, prop);
                    this._slash.push(prop.data.toJSON());
                    console.log(`[Commands] ${prop.data.name} loaded!`)
                }
            }
        })
    }
    requestEvents() {
        readdirSync(`./module/events`).forEach(directory => {
            if (directory.endsWith(".js") === true) {
                let prop = require(`../../module/events/${directory}`);
                this.on(prop.name, prop.execute)
                console.log(`[Events] ${prop.name} loaded!`)
            }else {
                for (let file of directory) {
                    let prop = require(`../../module/events/${directory}/${file}`);
                    this.on(prop.name, prop.execute)
                    console.log(`[Events] ${prop.name} loaded!`)
                }
            }
        })
    }
    handleApplication() {
        this.on("ready", async () => {
            this.requestCommands()
            this.requestEvents()
            try {
                this._rest.put(Routes.applicationCommands(this.config.clientId), {
                    body: this._slash
                })
            } catch (error) {
                console.log(error)
            }
            await this.user.setPresence({
                activities: [{
                    name: `j!help || /help`,
                    type: ActivityType.Watching
                }],
                status: "dnd"
            });
        })
        this
        .login(this.config.token)
        .catch((err) => console.error(err))
    }
}
module.exports = {
    BaseClient
}