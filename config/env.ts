const getEnvVar = (name: string): string => {
  const value = process.env[`EXPO_PUBLIC_${name}`];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

export const ENV = {
  SUPABASE_URL: getEnvVar('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY'),
  GOOGLE_CLOUD_API_KEY: getEnvVar('GOOGLE_CLOUD_API_KEY'),
} as const;

// Type for our environment
export type ENV_TYPE = typeof ENV; 