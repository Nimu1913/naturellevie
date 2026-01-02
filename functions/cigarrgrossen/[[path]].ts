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
  
  // When Cigarrgrossen is deployed, files are at the root, not under /cigarrgrossen/
  // The base: '/cigarrgrossen/' only affects how HTML references assets, not where they're served
  // So /cigarrgrossen/assets/file.css should fetch from cigarrgrossen.pages.dev/assets/file.css
  // But /cigarrgrossen/ (root) should fetch from cigarrgrossen.pages.dev/cigarrgrossen/ (for the HTML)
  const isRoot = path === '/';
  const targetPath = isRoot ? '/cigarrgrossen/' : path;
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
  
  // Check if response is actually HTML (404 page) when we expected an asset
  const isAssetRequest = url.pathname.match(/\.(css|js|mjs|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|webp)$/i);
  
  // If we got HTML but expected an asset, the file doesn't exist - return 404
  if (isAssetRequest && contentType.includes('text/html') && response.status === 200) {
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

