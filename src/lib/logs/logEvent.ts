import { db } from "../db";

export async function eventLog(userId: number, event: string) {
    try {
        await db.log.create({
            data: {
                userId,
                event,
                ip: '',
                isp: '',
                location: '',
                loggedAt: new Date(),
            }
        });
    } catch (error) {
        console.log(error);
    }
}