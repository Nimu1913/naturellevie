// Serve Cigarrgrossen files from dist/cigarrgrossen/
// This function ensures correct MIME types for assets
export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Get the response from Cloudflare Pages static file serving
  const response = await next();
  
  // If it's an asset file, ensure correct MIME type
  const isAsset = path.match(/\.(css|js|mjs|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp|json|wasm)$/i);
  
  if (isAsset && response.status === 200) {
    const headers = new Headers(response.headers);
    
    // Override Content-Type to ensure correct MIME type
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
  
  // For all other requests (HTML, etc.), return as-is
  return response;
}

