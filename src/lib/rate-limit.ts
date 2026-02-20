type RateLimitConfig = {
    interval: number; // in milliseconds
    limit: number;
};

const rateLimits = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(ip: string, config: RateLimitConfig = { interval: 60000, limit: 10 }) {
    const now = Date.now();
    const record = rateLimits.get(ip);

    if (!record || now > record.expiresAt) {
        rateLimits.set(ip, {
            count: 1,
            expiresAt: now + config.interval,
        });
        return { success: true };
    }

    if (record.count >= config.limit) {
        return { success: false };
    }

    record.count += 1;
    return { success: true };
}
