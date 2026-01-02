// Proxy requests from /cigarrgrossen/* to the Cigarrgrossen Pages deployment
export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(request.url);
  
  // Extract the path after /cigarrgrossen
  let path = url.pathname.replace(/^\/cigarrgrossen/, '') || '/';
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // Cigarrgrossen Pages deployment URL
  const cigarrgrossenUrl = 'https://cigarrgrossen.pages.dev';
  
  // Check if this is an asset request (CSS, JS, images, etc.)
  const isAssetRequest = url.pathname.match(/\.(css|js|mjs|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp)$/i);
  
  // For assets, try both possible locations (root and base path)
  if (isAssetRequest) {
    // Try 1: Root path (assets are in dist root, served from deployment root)
    const rootUrl = `${cigarrgrossenUrl}${path}${url.search}`;
    const rootResponse = await fetch(rootUrl);
    const rootContentType = rootResponse.headers.get('content-type') || '';
    
    if (!rootContentType.includes('text/html') && rootResponse.ok) {
      const headers = new Headers(rootResponse.headers);
      if (url.pathname.endsWith('.css')) {
        headers.set('Content-Type', 'text/css; charset=utf-8');
      } else if (url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
        headers.set('Content-Type', 'application/javascript; charset=utf-8');
      }
      headers.set('Access-Control-Allow-Origin', '*');
      
      return new Response(rootResponse.body, {
        status: rootResponse.status,
        statusText: rootResponse.statusText,
        headers: headers,
      });
    }
    
    // Try 2: Base path (if assets are under /cigarrgrossen/)
    const baseUrl = `${cigarrgrossenUrl}/cigarrgrossen${path}${url.search}`;
    const baseResponse = await fetch(baseUrl);
    const baseContentType = baseResponse.headers.get('content-type') || '';
    
    if (!baseContentType.includes('text/html') && baseResponse.ok) {
      const headers = new Headers(baseResponse.headers);
      if (url.pathname.endsWith('.css')) {
        headers.set('Content-Type', 'text/css; charset=utf-8');
      } else if (url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
        headers.set('Content-Type', 'application/javascript; charset=utf-8');
      }
      headers.set('Access-Control-Allow-Origin', '*');
      
      return new Response(baseResponse.body, {
        status: baseResponse.status,
        statusText: baseResponse.statusText,
        headers: headers,
      });
    }
    
    // Both failed - return 404
    return new Response('Asset not found', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // For non-assets (HTML pages), determine target path
  let targetPath: string;
  if (path === '/') {
    // Root HTML is at /cigarrgrossen/ (because of base path)
    targetPath = '/cigarrgrossen/';
  } else {
    // Other routes are at /cigarrgrossen/route
    targetPath = `/cigarrgrossen${path}`;
  }
  
  const targetUrl = `${cigarrgrossenUrl}${targetPath}${url.search}`;
  
  // Fetch from the Cigarrgrossen deployment
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      'Accept': request.headers.get('Accept') || '*/*',
    },
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().arrayBuffer() : null,
  });
  
  // Get content type
  const contentType = response.headers.get('content-type') || '';
  
  // For non-HTML assets (CSS, JS, images, etc.), return as-is with correct headers
  if (!contentType.includes('text/html') || isAssetRequest) {
    const headers = new Headers(response.headers);
    // Ensure correct MIME types
    if (url.pathname.endsWith('.css')) {
      headers.set('Content-Type', 'text/css; charset=utf-8');
    } else if (url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
      headers.set('Content-Type', 'application/javascript; charset=utf-8');
    }
    headers.set('Access-Control-Allow-Origin', '*');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  }
  
  // For HTML, fix URLs in the content
  const html = await response.text();
  
  // Fix URLs in HTML - replace /cigarrgrossen/cigarrgrossen with /cigarrgrossen
  const fixedHtml = html
    .replace(/\/cigarrgrossen\/cigarrgrossen\//g, '/cigarrgrossen/')
    .replace(/\/cigarrgrossen\/cigarrgrossen"/g, '/cigarrgrossen"')
    .replace(new RegExp(cigarrgrossenUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '/cigarrgrossen');
  
  return new Response(fixedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

