// Simple redirect from /cigarrgrossen to cigarrgrossen.pages.dev
export async function onRequest({ request }: { request: Request }) {
  const url = new URL(request.url);
  
  // Extract the path after /cigarrgrossen
  let path = url.pathname.replace(/^\/cigarrgrossen/, '') || '/';
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // Redirect to Cigarrgrossen Pages deployment
  const cigarrgrossenUrl = 'https://cigarrgrossen.pages.dev';
  const redirectUrl = `${cigarrgrossenUrl}${path}${url.search}`;
  
  return Response.redirect(redirectUrl, 302);
}
