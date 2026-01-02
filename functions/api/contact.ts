export async function onRequestPost({ request }: { request: Request }) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the hostname from the request to use as the from domain
    const url = new URL(request.url);
    const hostname = url.hostname;
    const fromDomain = hostname.includes('pages.dev') 
      ? 'noreply@pages.dev' // Use pages.dev for testing
      : `noreply@${hostname}`; // Use your custom domain when deployed

    // Send email using MailChannels (free, built into Cloudflare)
    const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: 'info@obsidianpeaks.com', name: 'Obsidian Peaks' }],
            reply_to: { email: email, name: name },
          },
        ],
        from: {
          email: fromDomain,
          name: 'Obsidian Peaks Contact Form',
        },
        subject: `Contact Form: ${name}`,
        content: [
          {
            type: 'text/html',
            value: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            `,
          },
          {
            type: 'text/plain',
            value: `
              New Contact Form Submission
              
              Name: ${name}
              Email: ${email}
              
              Message:
              ${message}
            `,
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('MailChannels API error:', errorText);
      
      // Return more detailed error for debugging
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: errorText,
          hint: 'Make sure the _mailchannels DNS TXT record is set up'
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        } 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
