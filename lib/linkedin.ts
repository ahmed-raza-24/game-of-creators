// lib/linkedin.ts - UPDATED FOR VERCEL
export function getLinkedInAuthUrl() {
  // Get client ID from environment or use placeholder
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "demo_client_id";
  
  // Check if client ID is available
  if (!clientId || clientId === "undefined") {
    console.error("LinkedIn Client ID is missing!");
    return "/auth/linkedin"; // Fallback to demo page
  }
  
  // Dynamic redirect URI for Vercel
  const redirectUri = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/linkedin/callback`
    : process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/linkedin/callback`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}/auth/linkedin/callback`
        : 'http://localhost:3000/auth/linkedin/callback';

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email",
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}