// Serve Cigarrgrossen files with correct MIME types
// This function intercepts requests to /cigarrgrossen/* and ensures assets are served correctly
export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Log for debugging
  console.log(`[Cigarrgrossen Function] Request: ${path}`);
  
  // Check if this is an asset file request
  const isAsset = /\.(js|mjs|css|json|wasm|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp)$/i.test(path);
  
  // Get the response from Cloudflare Pages static file serving
  const response = await next();
  
  // Get content type
  const contentType = response.headers.get('content-type') || '';
  
  // Log response details
  console.log(`[Cigarrgrossen Function] Response for ${path}: status=${response.status}, contentType=${contentType}, isAsset=${isAsset}`);
  
  // If it's an asset request
  if (isAsset) {
    // If we got HTML, the file wasn't found (404 fallback)
    if (contentType.includes('text/html')) {
      console.error(`[Cigarrgrossen Function] Asset not found: ${path}, got HTML instead`);
      return new Response(`Asset not found: ${path}`, { 
        status: 404,
        headers: { 
          'Content-Type': 'text/plain',
          'X-Debug-Path': path,
          'X-Debug-Function': 'cigarrgrossen',
        }
      });
    }
    
    // If we got the file successfully, ensure correct MIME type
    if (response.status === 200) {
      const headers = new Headers(response.headers);
      
      // Force correct MIME types based on file extension
      if (path.endsWith('.css')) {
        headers.set('Content-Type', 'text/css; charset=utf-8');
      } else if (path.endsWith('.js') || path.endsWith('.mjs')) {
        headers.set('Content-Type', 'application/javascript; charset=utf-8');
      } else if (path.endsWith('.json')) {
        headers.set('Content-Type', 'application/json; charset=utf-8');
      } else if (path.endsWith('.wasm')) {
        headers.set('Content-Type', 'application/wasm');
      }
      
      // Add cache headers
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      headers.set('X-Debug-Function', 'cigarrgrossen');
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: headers,
      });
    }
  }
  
  // For HTML pages, return as-is
  return response;
}

