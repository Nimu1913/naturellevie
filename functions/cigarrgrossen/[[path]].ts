// Serve Cigarrgrossen files from dist/cigarrgrossen/
export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Remove leading /cigarrgrossen to get the relative path
  const relativePath = path.replace(/^\/cigarrgrossen/, '') || '/';
  
  // If it's an asset request (CSS, JS, images), serve it with correct MIME type
  const isAsset = path.match(/\.(css|js|mjs|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp)$/i);
  
  // Try to get the response from Cloudflare Pages static file serving
  const response = await next();
  
  // If it's an asset and we got HTML (404 fallback), the file doesn't exist
  if (isAsset && response.headers.get('content-type')?.includes('text/html')) {
    // Return 404 with proper error
    return new Response('Asset not found', { status: 404 });
  }
  
  // If it's an asset, ensure correct MIME type
  if (isAsset) {
    const headers = new Headers(response.headers);
    
    // Set correct MIME types based on file extension
    if (path.endsWith('.css')) {
      headers.set('Content-Type', 'text/css; charset=utf-8');
    } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
      headers.set('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.json')) {
      headers.set('Content-Type', 'application/json; charset=utf-8');
    } else if (path.endsWith('.wasm')) {
      headers.set('Content-Type', 'application/wasm');
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  }
  
  // For HTML pages, serve as-is
  return response;
}

