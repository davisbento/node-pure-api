import { Redis } from 'ioredis';

const host = process.env.REDIS_HOST || 'localhost';
const port = process.env.REDIS_PORT ? Number.parseInt(process.env.REDIS_PORT) : 6379;
const username = process.env.REDIS_USERNAME || 'default';
const password = process.env.REDIS_PASSWORD || 'password';
const db = process.env.REDIS_DB ? Number.parseInt(process.env.REDIS_DB) : 0;

const redis = new Redis({
	port,
	host,
	username,
	password,
	db
});

export const setCache = async (key: string, value: string, ttlSeconds = 60) => {
	await redis.set(key, value, 'EX', ttlSeconds);
};

export const getCache = async (key: string) => {
	return await redis.get(key);
};

export const redisClient = redis;
