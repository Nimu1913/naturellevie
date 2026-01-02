// Proxy requests from /cigarrgrossen/* to the Cigarrgrossen Pages deployment
export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const url = new URL(request.url);
  
  // Extract the path after /cigarrgrossen
  const path = url.pathname.replace('/cigarrgrossen', '') || '/';
  
  // Cigarrgrossen Pages deployment URL
  const cigarrgrossenUrl = 'https://cigarrgrossen.pages.dev';
  
  // Build the target URL
  const targetUrl = `${cigarrgrossenUrl}${path}${url.search}`;
  
  // Fetch from the Cigarrgrossen deployment
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.clone().arrayBuffer() : null,
  });
  
  // Create a new response with the fetched content
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
  
  // Fix any absolute URLs in the response
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/html')) {
    const html = await newResponse.text();
    // Replace absolute URLs to point back to /cigarrgrossen
    const fixedHtml = html
      .replace(new RegExp(cigarrgrossenUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '/cigarrgrossen')
      .replace(/href="\//g, 'href="/cigarrgrossen/')
      .replace(/src="\//g, 'src="/cigarrgrossen/');
    
    return new Response(fixedHtml, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        'Content-Type': 'text/html',
      },
    });
  }
  
  return newResponse;
}

