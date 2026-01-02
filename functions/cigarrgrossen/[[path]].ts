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
  
  // When Cigarrgrossen is built with base: '/cigarrgrossen/' and deployed:
  // - The dist folder contains assets at: dist/assets/file.css
  // - Cloudflare Pages serves from dist root, so files are at: cigarrgrossen.pages.dev/assets/file.css
  // - But the HTML references them as: /cigarrgrossen/assets/file.css
  // So we need to fetch from root, not from /cigarrgrossen/
  let targetPath: string;
  if (isAssetRequest) {
    // Assets are at root of the deployment: /assets/file.css
    targetPath = path;
  } else if (path === '/') {
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
  
  // If we got HTML but expected an asset, try the alternative path
  // (Initial fetch tried root, so fallback tries base path, or vice versa)
  if (isAssetRequest && contentType.includes('text/html')) {
    // The initial fetch already tried root (targetPath = path)
    // So try with /cigarrgrossen/ prefix
    const altUrl = `${cigarrgrossenUrl}/cigarrgrossen${path}${url.search}`;
    const altResponse = await fetch(altUrl);
    const altContentType = altResponse.headers.get('content-type') || '';
    
    if (!altContentType.includes('text/html') && altResponse.ok) {
      const headers = new Headers(altResponse.headers);
      if (url.pathname.endsWith('.css')) {
        headers.set('Content-Type', 'text/css; charset=utf-8');
      } else if (url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
        headers.set('Content-Type', 'application/javascript; charset=utf-8');
      }
      headers.set('Access-Control-Allow-Origin', '*');
      
      return new Response(altResponse.body, {
        status: altResponse.status,
        statusText: altResponse.statusText,
        headers: headers,
      });
    }
    
    // If still HTML, return 404 with helpful error
    console.error(`Asset not found at either path. Requested: ${url.pathname}, tried: ${targetUrl} and ${altUrl}`);
    return new Response('Asset not found', { 
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
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

