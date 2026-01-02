// Serve Cigarrgrossen files with correct MIME types
// This function intercepts requests to /cigarrgrossen/* and ensures assets are served correctly
export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Get the response from Cloudflare Pages static file serving
  const response = await next();
  
  // Check if this is an asset file request
  const isAsset = /\.(js|mjs|css|json|wasm|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp)$/i.test(path);
  
  // If it's an asset and we got a 200 response, ensure correct MIME type
  if (isAsset && response.status === 200) {
    const headers = new Headers(response.headers);
    const contentType = headers.get('content-type');
    
    // Only override if we got HTML (which means the file wasn't found and we got the fallback)
    if (contentType && contentType.includes('text/html')) {
      // File not found - return 404
      return new Response('Asset not found', { 
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
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
  
  // For all other requests (HTML, etc.), return as-is
  return response;
}

