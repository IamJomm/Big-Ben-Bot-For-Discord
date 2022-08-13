import { client } from "../client.js";
import * as process from "process";
import * as path from "path";
import * as fs from "fs";

var dataPath = path.join(process.cwd(), "data");
var data = {};

if (!fs.existsSync(dataPath)) {
	fs.mkdirSync(dataPath);
}

function setData(id) {
	var i = 0;

	if (data.hasOwnProperty("channels")) {
		for (i; i < data["channels"].length; i++) {
			if (data["channels"][i]["channelId"] == id) break;
		}
	}
	if (data["channels"] !== undefined) {
		if (i < data["channels"].length) {
			data["channels"][i]["channelId"] = id;
		} else {
			data["channels"].push({
				channelId: id,
			});
		}
	} else
		data["channels"] = [
			{
				channelId: id,
			},
		];
}

client.on("voiceStateUpdate", (oldState, newState) => {
	data = {};
	if (fs.existsSync(`${dataPath}/${newState.guild.id}.json`)) {
		data = JSON.parse(
			fs
				.readFileSync(`${dataPath}/${newState.guild.id}.json`, "utf-8")
				.toString()
		);
	} else {
		console.log("No such file");
	}
	data["guildId"] = newState.guild.id;
	if (newState.channel !== null) {
		setData(newState.channel.id);
		if (
			oldState.channel !== null &&
			newState.channel.id !== oldState.channel.id
		)
			setData(oldState.channel.id);
		//Why does "Prettier" make this conditional statement so ugly
	} else setData(oldState.channel.id);
	fs.writeFileSync(
		`${dataPath}/${newState.guild.id}.json`,
		JSON.stringify(data),
		"utf-8"
	);
	console.log("The file has been rewritten or written");
});
