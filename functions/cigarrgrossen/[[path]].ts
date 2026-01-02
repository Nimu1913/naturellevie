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
  
  // When Cigarrgrossen is deployed to Cloudflare Pages:
  // - Assets are served from root: cigarrgrossen.pages.dev/assets/file.css
  // - HTML is served from /cigarrgrossen/: cigarrgrossen.pages.dev/cigarrgrossen/
  // The base: '/cigarrgrossen/' in vite.config only affects HTML references, not actual file locations
  let targetPath: string;
  if (isAssetRequest) {
    // Assets are at root: /assets/file.css
    targetPath = path;
  } else if (path === '/') {
    // Root HTML is at /cigarrgrossen/
    targetPath = '/cigarrgrossen/';
  } else {
    // Other routes (like /login) are at /cigarrgrossen/login
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
  
  // If we got HTML but expected an asset, try fetching from root without /cigarrgrossen
  if (isAssetRequest && contentType.includes('text/html')) {
    // Try fetching from root (assets might be at root, not under /cigarrgrossen/)
    const rootUrl = `${cigarrgrossenUrl}${path}${url.search}`;
    const rootResponse = await fetch(rootUrl);
    const rootContentType = rootResponse.headers.get('content-type') || '';
    
    // If root fetch gives us the asset, use it
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
    
    // If still HTML, return 404
    return new Response('Asset not found', { status: 404 });
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

