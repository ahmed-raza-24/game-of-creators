export function getLinkedInAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  
  // Dynamic redirect URI for both local and production
  const redirectUri = typeof window !== 'undefined' 
    ? `${window.location.origin}/auth/linkedin/callback`
    : 'https://game-of-creators-app.vercel.app/auth/linkedin/callback';

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId!,
    redirect_uri: redirectUri,
    scope: "openid profile email",
  });

  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}