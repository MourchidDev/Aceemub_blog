const requiredCache = new Map();

export function requiredEnv(name) {
  if (requiredCache.has(name)) return requiredCache.get(name);

  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  requiredCache.set(name, value);
  return value;
}

export function optionalEnv(name, fallback) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
}
