// Serve Cigarrgrossen files from dist/cigarrgrossen/
export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // If it's an asset request (CSS, JS, images), serve it directly
  const isAsset = path.match(/\.(css|js|mjs|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp)$/i);
  
  if (isAsset) {
    // Let Cloudflare Pages serve the static file
    const response = await next();
    
    // Set correct MIME types
    const headers = new Headers(response.headers);
    if (path.endsWith('.css')) {
      headers.set('Content-Type', 'text/css; charset=utf-8');
    } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
      headers.set('Content-Type', 'application/javascript; charset=utf-8');
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  }
  
  // For HTML pages, serve the index.html
  return next();
}

