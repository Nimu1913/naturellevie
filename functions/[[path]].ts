export async function onRequest({ request, next }: { request: Request; next: () => Promise<Response> }) {
  const response = await next();
  
  // Set correct MIME types for JavaScript modules
  const url = new URL(request.url);
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.mjs')) {
    response.headers.set('Content-Type', 'application/javascript; charset=utf-8');
  } else if (url.pathname.endsWith('.wasm')) {
    response.headers.set('Content-Type', 'application/wasm');
  } else if (url.pathname.endsWith('.json')) {
    response.headers.set('Content-Type', 'application/json; charset=utf-8');
  }
  
  return response;
}


