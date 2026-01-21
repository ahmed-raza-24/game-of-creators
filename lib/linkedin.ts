export function getLinkedInAuthUrl() {
  // Get client ID from environment or use placeholder
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "86z1uroaw6nnes";
  
  // Check if client ID is available
  if (!clientId || clientId === "undefined") {
    console.error("LinkedIn Client ID is missing!");
    alert("LinkedIn configuration error. Please contact support.");
    return "/auth/linkedin"; // Fallback to demo page
  }
  
  // Dynamic redirect URI
  const redirectUri = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/linkedin/callback`
    : 'https://game-of-creators-app.vercel.app/auth/linkedin/callback';

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "openid profile email",
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}