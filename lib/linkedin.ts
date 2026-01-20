export function getLinkedInAuthUrl() {
  const base = "https://www.linkedin.com/oauth/v2/authorization";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI!,
    scope: "openid profile email",
  });

  return `${base}?${params.toString()}`;
}
