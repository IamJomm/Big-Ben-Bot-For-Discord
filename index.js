import "dotenv/config";
import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
} from "@discordjs/voice";
import { client } from "./src/client.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord.js";
import * as process from "process";
import * as path from "path";
import * as fs from "fs";
import pingCommand from "./src/commands/ping.js";
import "./src/events/voiceStateUpdate.js";

const rest = new REST({ version: "10" }).setToken(process.env.token);

(async () => {
	try {
		await rest.put(Routes.applicationCommands(process.env.applicationId), {
			body: [pingCommand],
		});
		console.log("Successfully registered application commands.");
	} catch (error) {
		console.log(error);
	}
})();

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName == "ping") {
		await interaction.reply("Pong!");
		/*for (let i = 0; i < interaction.options.getInteger("amount") - 1; i++)
			await interaction.followUp("Pong again!");*/
	}
});

client.login(process.env.token).then(() => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("with your mom");
	console.log();
	(async () => {
		var data,
			dataPath = path.join(process.cwd(), "data"),
			i,
			max;
		function joinvc() {
			fs.readdir(dataPath, (err, files) => {
				files.forEach((file) => {
					data = JSON.parse(
						fs
							.readFileSync(`${dataPath}/${file}`, "utf-8")
							.toString()
					);
					if (
						client.guilds.cache.get(data["guildId"]) !== undefined
					) {
						i = 0;
						max = ["", "", 0];
						for (i, max; i < data["channels"].length; i++) {
							if (
								max[2] <
								client.channels.cache.get(
									data["channels"][i]["channelId"]
								).members.size
							) {
								max[0] = data["guildId"];
								max[1] = data["channels"][i]["channelId"];
								max[2] = client.channels.cache.get(
									data["channels"][i]["channelId"]
								).members.size;
							}
						}
						if (max[2] != 0) {
							const player = createAudioPlayer();
							const resource = createAudioResource(
								"./assets/Big Ben Audio.mp3"
							);
							player.play(resource);
							const connection = joinVoiceChannel({
								channelId: max[1],
								guildId: max[0],
								adapterCreator: client.guilds.cache.get(max[0])
									.voiceAdapterCreator,
							});
							console.log(
								"Bot has just joined the voice channel"
							);
							connection.subscribe(player);
							setTimeout(() => {
								try {
									connection.destroy();
									console.log(
										"Bot has just disconnected the voice channel"
									);
								} catch (err) {
									if (
										err.message.includes(
											"Cannot destroy VoiceConnection - it has already been destroyed"
										)
									)
										console.log(
											"Cannot destroy VoiceConnection - it has already been destroyed"
										);
									else console.log(err);
								}
							}, 80000);
						}
					} else {
						fs.unlinkSync(`${dataPath}/${file}`);
						console.log("File deleted");
					}
				});
			});
		}
		var date = new Date();
		setTimeout(() => {
			joinvc();
			setInterval(() => {
				joinvc();
			}, 60 * 60 * 1000);
		}, 60 * 60 * 1000 - date.getMinutes() * 60000 - date.getSeconds() * 1000 - date.getMilliseconds());
	})();
});
