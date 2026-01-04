export async function onRequestPost({ request, env }: { request: Request; env: { GOOGLE_CALENDAR_API_KEY?: string; GOOGLE_CALENDAR_ID?: string; RESEND_API_KEY?: string } }) {
  try {
    const { 
      firstName, 
      lastName, 
      companyName, 
      websiteUrl, 
      monthlyAdSpend, 
      comments, 
      howFoundUs,
      name, 
      email, 
      timeSlot, 
      packageName 
    } = await request.json();

    if (!firstName || !lastName || !companyName || !email || !timeSlot || !packageName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    // Check if Resend API key is configured
    if (!env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set in environment variables');
      return new Response(
        JSON.stringify({ 
          error: 'Email service not configured',
          details: 'RESEND_API_KEY environment variable is missing.'
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

    // Format the selected time
    const selectedTime = timeSlot.start 
      ? new Date(timeSlot.start).toLocaleString('en-US', {
          timeZone: 'Europe/Stockholm',
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short',
        })
      : 'Not specified';

    // Send booking inquiry email to company
    const inquiryEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Obsidian Peaks <noreply@obsidianpeaks.com>',
        to: ['info@obsidianpeaks.com'],
        reply_to: email,
        subject: `Booking Inquiry: ${packageName} - ${firstName} ${lastName}`,
        html: `
          <h2>New Booking Inquiry</h2>
          <p><strong>Package:</strong> ${packageName}</p>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${companyName}</p>
          ${websiteUrl ? `<p><strong>Website:</strong> ${websiteUrl}</p>` : ''}
          ${monthlyAdSpend ? `<p><strong>Monthly Ad Spend:</strong> ${monthlyAdSpend}</p>` : ''}
          ${howFoundUs ? `<p><strong>How they found us:</strong> ${howFoundUs}</p>` : ''}
          ${comments ? `<p><strong>Additional Info:</strong> ${comments}</p>` : ''}
          <p><strong>Requested Time:</strong> ${selectedTime}</p>
        `,
        text: `
          New Booking Inquiry
          
          Package: ${packageName}
          Name: ${firstName} ${lastName}
          Email: ${email}
          Company: ${companyName}
          ${websiteUrl ? `Website: ${websiteUrl}` : ''}
          ${monthlyAdSpend ? `Monthly Ad Spend: ${monthlyAdSpend}` : ''}
          ${howFoundUs ? `How they found us: ${howFoundUs}` : ''}
          ${comments ? `Additional Info: ${comments}` : ''}
          Requested Time: ${selectedTime}
        `,
      }),
    });

    if (!inquiryEmailResponse.ok) {
      const errorText = await inquiryEmailResponse.text();
      console.error('Resend API error:', {
        status: inquiryEmailResponse.status,
        statusText: inquiryEmailResponse.statusText,
        body: errorText,
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: errorText,
        }),
        { 
          status: 502, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          } 
        }
      );
    }

    // Send confirmation email to user
    const confirmationEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Obsidian Peaks <noreply@obsidianpeaks.com>',
        to: [email],
        subject: `Booking Request: ${packageName}`,
        html: `
          <h2>Booking Request Received</h2>
          <p>Hi ${firstName},</p>
          <p>We've received your booking request for <strong>${packageName}</strong>.</p>
          <p><strong>Requested Time:</strong> ${selectedTime}</p>
          <p>We'll confirm the time and send you a calendar invite shortly.</p>
        `,
      }),
    });

    if (!confirmationEmailResponse.ok) {
      console.error('Failed to send confirmation email to user');
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Booking confirmed' }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    console.error('Error processing booking:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process booking',
        details: errorMessage,
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

