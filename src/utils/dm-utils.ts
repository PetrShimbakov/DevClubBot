import { MessageCreateOptions, User } from "discord.js";

export async function safeSendDM(user: User, message: MessageCreateOptions, retries: number = 0): Promise<void> {
	for (let _ = 0; _ <= retries; _++) {
		try {
			await user.send(message);
			break;
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && (error as any).code === 10062) return; // ignore error Unknown interaction

			console.error("[reply-utils] Error while sending a reply:", error);
		}

		await new Promise(resolve => setTimeout(resolve, 1000));
	}
}
