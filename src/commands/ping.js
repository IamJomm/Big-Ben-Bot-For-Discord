import { SlashCommandBuilder } from "@discordjs/builders";

const pingCommand = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Replies with Pong!");
/*.addIntegerOption((option) =>
		option
			.setName("amount")
			.setDescription("Amount of replies")
			.setRequired(false)
	);*/
export default pingCommand.toJSON();
