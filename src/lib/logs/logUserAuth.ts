import { db } from "@/lib/db";

export async function authLog(userId: number, event: string) {
    try {
        const addressResponse = await fetch("https://api.ipify.org?format=json");
        const { ip } = await addressResponse.json();

        const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
        const data = await locationResponse.json();

        await db.log.create({
            data: {
                userId,
                event,
                ip: ip,
                location: `${data.city}, ${data.region} - ${data.zip}` || 'Unknown Location',
                isp: data.isp || 'Unknown Provider',
                loggedAt: new Date(),
            }
        });
    } catch (error) {
        console.log(error);
    }
}