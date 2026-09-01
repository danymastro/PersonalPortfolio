interface Env {
  RESEND_API_KEY?: string;
  CONTACT_RECEIVER_EMAIL?: string;
  FROM_EMAIL?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  message: string;
  topics?: string[];
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const data = (await request.json()) as ContactPayload;
    const { name, email, message, topics = [] } = data;

    // Validate inputs
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields (name, email, message)' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const resendApiKey = env.RESEND_API_KEY;
    const receiverEmail = env.CONTACT_RECEIVER_EMAIL || 'danilo.mastropaolo05@gmail.com';
    const fromEmail = env.FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

    // If no API key configured yet (e.g. initial setup test), return mock success with warning
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY is not set in Cloudflare environment variables.');
      return new Response(
        JSON.stringify({
          success: true,
          mock: true,
          message: 'Message processed (configure RESEND_API_KEY in Cloudflare Pages dashboard for live delivery).',
        }),
        { status: 200, headers: corsHeaders }
      );
    }

    // Call Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [receiverEmail],
        reply_to: email,
        subject: `🚀 Nuovo messaggio Portfolio da ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #FFFDF5; padding: 24px; border: 2px solid #000; border-radius: 12px; max-width: 600px; margin: 0 auto;">
            <h2 style="margin-top: 0; color: #000; font-size: 24px; border-bottom: 2px solid #000; padding-bottom: 12px;">Nuovo contatto dal Portfolio</h2>
            
            <p style="font-size: 16px; margin: 8px 0;"><strong>Nome:</strong> ${name}</p>
            <p style="font-size: 16px; margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563EB;">${email}</a></p>
            
            ${
              topics.length > 0
                ? `<p style="font-size: 16px; margin: 8px 0;"><strong>Argomenti:</strong> ${topics
                    .map(
                      (t) =>
                        `<span style="background: #FDE047; border: 1px solid #000; padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 4px;">${t}</span>`
                    )
                    .join(' ')}</p>`
                : ''
            }
            
            <div style="margin-top: 20px; padding: 16px; background-color: #fff; border: 1px solid #000; border-radius: 8px;">
              <p style="margin-top: 0; font-weight: bold; color: #555;">Messaggio:</p>
              <p style="white-space: pre-wrap; font-size: 15px; line-height: 1.6; margin-bottom: 0;">${message}</p>
            </div>
            
            <p style="margin-top: 24px; font-size: 12px; color: #888;">Inviato dal form di contatto di danilomastropaolo.dev</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json();
      console.error('Resend API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email via Resend', details: errorData }),
        { status: 500, headers: corsHeaders }
      );
    }

    const resendData = (await resendResponse.json()) as { id?: string };
    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error('Contact function error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Internal Server Error' }),
      { status: 500, headers: corsHeaders }
    );
  }
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
