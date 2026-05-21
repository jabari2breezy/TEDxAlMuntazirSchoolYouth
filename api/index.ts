import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/speakers', (req, res) => {
  const speakers = [
    { 
      id: '1', 
      name: 'Ridhwan Mohammed', 
      topic: 'Topic TBA', 
      segmentId: 'past',
      bio: "Ridhwan Mohammed explores the historical narratives that have shaped our current reality. His talk promises to bridge the gap between yesterday's decisions and today's consequences."
    },
    { 
      id: '2', 
      name: 'Anaya Rashid', 
      topic: 'The Culture of Time', 
      segmentId: 'past',
      bio: "Anaya Rashid explores the subjective nature of time and how cultural perspectives shape our perception of reality. Her talk delves into the tension between our desire for productivity and the intrinsic value of being present."
    },
    { 
      id: '3', 
      name: 'Zahra Datoo', 
      topic: 'The Architecture of Nostalgia', 
      segmentId: 'past', 
      bio: "Zahra challenges the cliché that 'time is money,' proposing instead that time's true value lies in its ability to create nostalgia. She explores how small, seemingly unproductive moments—a rainy afternoon or unexpected friendships—become priceless memories. By reminding us that being busy isn't the same as being alive, she urges the audience to prioritize presence and embrace the uncertainty of tomorrow."
    },
    { 
      id: '4', 
      name: 'Zahra Moledina', 
      topic: "Capitalism's Clock", 
      segmentId: 'present',
      bio: "Zahra Moledina examines how modern economic systems have commodified our hours. She challenges the relentless demand for efficiency and questions whether the clock serves us, or if we serve the clock."
    },
    { 
      id: '5', 
      name: 'Faizaan', 
      topic: 'Topic TBA', 
      segmentId: 'present',
      bio: "Faizaan delves into the complexities of navigating the modern world. His insights shed light on how we can ground ourselves amidst the rapid pace of contemporary life."
    },
    { 
      id: '6', 
      name: 'Hassan Abbas Mohammed', 
      topic: 'The Procrastination Paradox', 
      segmentId: 'present',
      bio: "Hassan Abbas Mohammed unpacks the psychology behind delay. He reveals how procrastination is often less about laziness and more about our complex emotional relationship with time and self-worth."
    },
    { 
      id: '7', 
      name: 'Yunus Osman', 
      topic: 'The Art of Scheduling', 
      segmentId: 'future',
      bio: "Yunus Osman decodes the structural mastery of time management, exploring how intentional scheduling transforms chaos into predictable success. His talk provides a blueprint for reclaiming control over our future."
    },
    { 
      id: '8', 
      name: 'Sada Mbaruk Said', 
      topic: 'Three Clocks: Climate, Animals, AI', 
      segmentId: 'future',
      bio: "Sada explores 'slow destruction,' challenging the notion of a sudden global catastrophe in favor of a more insidious reality. By examining the interconnected chain of environmental decay and societal shift, she reveals how everyday choices feed into a larger systemic crisis."
    },
    { 
      id: '9', 
      name: 'Liyaan Karbelkar', 
      topic: 'The Legacy We Leave', 
      segmentId: 'future',
      bio: "Liyaan Karbelkar challenges us to think beyond our immediate lifespans. She asks us to consider how the actions we take today will ripple out to define the world for generations to come."
    }
  ];
  res.json(speakers);
});

app.get('/api/event-status', (req, res) => {
  const eventDate = new Date('2026-06-15T09:00:00Z');
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  
  res.json({
    status: diff > 0 ? 'upcoming' : 'live',
    eventDate: eventDate.toISOString(),
    daysRemaining: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
    secondsRemaining: Math.max(0, Math.floor(diff / 1000))
  });
});

app.get('/api/updates', (req, res) => {
  const updates = [
    { 
      id: '1', 
      title: 'Speaker List Finalized', 
      date: '2026-05-05', 
      content: 'The final assembly for "Borrowed Time" has been confirmed.' 
    },
    { 
      id: '2', 
      title: 'Partnering with Al Muntazir Schools', 
      date: '2026-04-28', 
      content: 'We are proud to host this year at the main assembly hall.' 
    }
  ];
  res.json(updates);
});

app.get('/api/quote', (req, res) => {
  const quotes = [
    { text: "Yesterday is but today's memory, and tomorrow is today's dream.", author: "Kahlil Gibran" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The two most powerful warriors are patience and time.", author: "Leo Tolstoy" },
    { text: "Time is a created thing. To say 'I don't have time,' is like saying, 'I don't want to.'", author: "Lao Tzu" },
    { text: "Lost time is never found again.", author: "Benjamin Franklin" }
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json(randomQuote);
});

app.get('/api/schedule', (req, res) => {
  const schedule = [
    { time: '09:00', event: 'Doors Open & Registration', type: 'logistics' },
    { time: '10:00', event: 'Opening: The Clock Starts', type: 'session' },
    { time: '10:30', event: 'Segment I: The Ghost of the Past', type: 'session' },
    { time: '12:00', event: 'Break: Stillness', type: 'logistics' },
    { time: '13:00', event: 'Segment II: The Weight of Now', type: 'session' },
    { time: '14:30', event: 'Segment III: The Horizon of Future', type: 'session' },
    { time: '16:00', event: 'Closing: Borrowed Time is Ours', type: 'session' }
  ];
  res.json(schedule);
});

app.post('/api/register', async (req, res) => {
  const { email, name, message } = req.body;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: existingUser } = await supabase
        .from('registrations')
        .select('email')
        .eq('email', email)
        .single();
        
      if (existingUser) {
        return res.status(400).json({ success: false, error: "You've already registered before. If you have additional concerns, email us at info@tedxalmuntazir.com" });
      }

      await supabase.from('registrations').insert([{ name, email, message }]);
    } catch (err: any) {
      console.error('Supabase error:', err.message || err);
    }
  }
  
  if (gmailUser && gmailPass) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
      
      // Send notification to Admin
      console.log('Attempting to send admin email via Nodemailer...');
      try {
        await transporter.sendMail({
          from: `"TEDx Youth" <${gmailUser}>`,
          to: 'jabari2breezy@gmail.com',
          subject: `New Get Involved Request: ${name}`,
          html: `
            <div style="font-family: sans-serif; line-height: 1.5; color: #002B5B;">
              <h1 style="border-bottom: 2px solid #00A859; padding-bottom: 10px;">New Interest for TEDxAlMuntazirSchoolsYouth 2026</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong> ${message || 'No message provided'}</p>
            </div>
          `
        });
        console.log('Admin notification sent successfully.');

        // Send Welcome to User
        await transporter.sendMail({
          from: `"TEDx Youth" <${gmailUser}>`,
          to: email,
          subject: `Welcome to the TEDx Youth Community`,
          html: `
            <div style="font-family: sans-serif; line-height: 1.5; color: #000839; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e2e2e2;">
              <h1 style="border-bottom: 2px solid #006d38; padding-bottom: 10px; font-weight: 800; font-size: 32px;">Welcome, ${name.split(' ')[0]}.</h1>
              <p>Thank you for expressing interest in <strong>TEDxAlMuntazirSchoolsYouth</strong>.</p>
              <p>We are building a community of visionaries, and we are excited to have you with us. Our team will review your message and reach out to you shortly regarding next steps.</p>
              <p style="margin-top: 32px; font-style: italic;">The clock's ticking. The stage is yours.</p>
              <p>- TEDxAlMuntazirSchoolsYouth Organizing Team</p>
            </div>
          `
        });
        console.log('User welcome email sent successfully');
        
      } catch (err: any) {
        console.error('Admin/User email failed:', err.message || err);
      }
    } catch (err: any) {
      console.error('Nodemailer Setup Error:', err.message || err);
    }
  } else {
    console.warn('GMAIL_USER or GMAIL_APP_PASSWORD is missing. Skipping emails.');
  }

  // --- Mailchimp Integration ---
  const mailchimpKey = process.env.MAILCHIMP_API_KEY;
  const mailchimpAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const mailchimpServer = process.env.MAILCHIMP_SERVER_PREFIX;

  if (mailchimpKey && mailchimpAudienceId && mailchimpServer) {
    try {
      const mailchimp = (await import('@mailchimp/mailchimp_marketing')).default;
      mailchimp.setConfig({
        apiKey: mailchimpKey,
        server: mailchimpServer,
      });

      console.log(`Subscribing ${email} to Mailchimp...`);
      try {
        await mailchimp.lists.addListMember(mailchimpAudienceId, {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: name.split(' ')[0] || '',
            LNAME: name.split(' ').slice(1).join(' ') || '',
          },
        });
        console.log('User successfully subscribed to Mailchimp');
      } catch (mcError: any) {
        const body = mcError.response?.body;
        if (body?.title === 'Member Exists') {
          console.log('User is already in the Mailchimp list.');
        } else {
          console.warn('Mailchimp API Warning:', body?.detail || mcError.message);
        }
      }
    } catch (err: any) {
      console.error('Mailchimp Setup Error:', err.message || err);
    }
  } else {
    console.warn('Mailchimp credentials missing. Skipping subscription.');
  }
  
  res.json({ 
    success: true, 
    message: 'Invitation request received. We will be in touch.' 
  });
});

app.post('/api/buy-ticket', async (req, res) => {
  const { name, email, phone } = req.body;
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // Countdown from 100
  const counterFile = path.join(process.cwd(), 'data', 'ticket_counter.json');
  let currentCount = 100;
  try {
    if (existsSync(counterFile)) {
      const data = await fs.readFile(counterFile, 'utf8');
      const parsed = JSON.parse(data);
      // Decrement counter, clamp at 1
      currentCount = Math.max(1, (parsed.count ?? 100) - 1);
    } else {
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    }
    await fs.writeFile(counterFile, JSON.stringify({ count: currentCount }));
  } catch (e) {
    console.error("Counter error", e);
  }

  const ticketNumber = currentCount.toString().padStart(4, '0');

  let ticketBuffer;
  try {
    const jimp = (await import('jimp')).default;
    const templatePath = path.join(process.cwd(), 'public', 'ticket-template.png');
    
    let image;
    if (existsSync(templatePath)) {
      image = await jimp.read(templatePath);
      const fontPath = path.join(__dirname, 'fonts', 'open-sans-64-white.fnt');
      const font = await jimp.loadFont(fontPath);
      const imageWidth = image.bitmap.width;
      const imageHeight = image.bitmap.height;
      // Stamping bottom right (assuming standard HD layout). 
      // Offset heavily to try and cover or place near the old ticket number.
      image.print(font, imageWidth - 450, imageHeight - 120, `NO. ${ticketNumber}`);
    } else {
      // Fallback: create a blank black ticket safely
      const JimpConstructor = (jimp as any).Jimp || jimp;
      image = new JimpConstructor(1200, 400, 0x0c1012FF);
      const fontPath = path.join(__dirname, 'fonts', 'open-sans-64-white.fnt');
      const font = await jimp.loadFont(fontPath);
      image.print(font, 50, 50, "TEDxAlMuntazirSchoolsYouth");
      image.print(font, 50, 200, `TICKET NO. ${ticketNumber}`);
      image.print(font, 50, 300, `ADMIT: ${name}`);
    }

    ticketBuffer = await image.getBufferAsync(jimp.MIME_JPEG);
  } catch (err: any) {
    console.error('Jimp Error (Ticket Generation Failed):', err);
    // DO NOT fail the request. Let the user see their ticket number anyway.
  };

  if (gmailUser && gmailPass && ticketBuffer) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
      
      await transporter.sendMail({
        from: `"TEDx Youth" <${gmailUser}>`,
        to: email,
        subject: `Your Ticket to TEDxAlMuntazirSchoolsYouth 2026`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.5; color: #000839; max-width: 600px; margin: 0 auto;">
            <h1 style="border-bottom: 2px solid #006d38; padding-bottom: 10px;">Thank you, ${name}!</h1>
            <p>Your purchase was successful. Attached is your official digital ticket for "Borrowed Time".</p>
            <p><strong>Ticket Number:</strong> ${ticketNumber}</p>
            <p>Please present the attached image along with your valid Student ID at the entrance.</p>
            <br/>
            <p>See you on June 14th, 2026.</p>
          </div>
        `,
        attachments: [
          {
            filename: `ticket-${ticketNumber}.jpg`,
            content: ticketBuffer
          }
        ]
      });
      
      console.log('Ticket email sent successfully');
    } catch (err: any) {
      console.error('Ticket email failed:', err.message || err);
    }
  }

  return res.json({ 
    success: true, 
    ticketNumber,
    ticketImageBase64: ticketBuffer ? `data:image/jpeg;base64,${ticketBuffer.toString('base64')}` : null
  });
});

const setupApp = async (app: any) => {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production or on Vercel, we serve static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // SPA Fallback for non-API routes
    app.get(/^(?!\/api).+/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
};

// Start logic
if (!process.env.VERCEL) {
  // On Cloud Run or local dev, we need to listen
  setupApp(app).then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
    });
  });
} else {
  // On Vercel, the handler is exported
  setupApp(app);
}

export default app;
