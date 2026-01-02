export async function onRequestPost({ request }: { request: Request }) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // MailChannels requires the from domain to match the request domain
    // For custom domains, you need DNS TXT record: _mailchannels with value: v=mc1;
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Use the domain from the request, but fallback to pages.dev if needed
    let fromEmail = `noreply@${hostname}`;
    
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
          email: fromEmail,
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
      console.error('MailChannels API error:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        body: errorText,
        fromEmail: fromEmail,
        hostname: hostname,
      });
      
      // Return more detailed error for debugging
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: errorText,
          hint: 'Add DNS TXT record: _mailchannels with value: v=mc1; in Cloudflare DNS'
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
