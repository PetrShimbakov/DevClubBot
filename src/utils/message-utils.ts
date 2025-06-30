export const getDiscordDate = (date: Date) => `<t:${Math.floor(new Date(date).getTime() / 1000)}:D>`;
