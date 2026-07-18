export const protocol: "http" | "https" = process.env.NODE_ENV === 'production' ? 'https' : 'http';
export const rootDomain: string = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';