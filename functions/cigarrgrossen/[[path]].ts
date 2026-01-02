// Serve Cigarrgrossen files with correct MIME types
// This function intercepts requests to /cigarrgrossen/* and ensures assets are served correctly
export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Check if this is an asset file request
  const isAsset = /\.(js|mjs|css|json|wasm|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp)$/i.test(path);
  
  // Get the response from Cloudflare Pages static file serving
  const response = await next();
  
  // If we got HTML for an asset request, the file wasn't found
  const contentType = response.headers.get('content-type') || '';
  if (isAsset && contentType.includes('text/html')) {
    // Log for debugging
    console.error(`Asset not found: ${path}, got HTML instead`);
    return new Response(`Asset not found: ${path}`, { 
      status: 404,
      headers: { 
        'Content-Type': 'text/plain',
        'X-Debug-Path': path,
      }
    });
  }
  
  // If it's an asset, ensure correct MIME type
  if (isAsset && response.status === 200) {
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
  
  // For HTML pages, ensure we're serving the right file
  if (!isAsset && path.startsWith('/cigarrgrossen')) {
    // If we got a 404 or wrong content, try to serve index.html
    if (response.status === 404 || (contentType.includes('text/html') && !path.endsWith('.html'))) {
      // Let the redirects handle it
      return response;
    }
  }
  
  // For all other requests, return as-is
  return response;
}

