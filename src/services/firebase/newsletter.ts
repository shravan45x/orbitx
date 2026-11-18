import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import type { NewsletterSubscribeResult } from '../../types/newsletter';

const OFFICIAL_FROM_EMAIL = 'OrbitX Astronomy Consortium <newsletter.orbitx@zealeducation.com>';
const OFFICIAL_REPLY_TO = 'contact.orbitx@zealeducation.com';

/**
 * Generate the responsive HTML welcome email template for new subscribers
 */
function generateWelcomeEmailHtml(subscriberEmail: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to OrbitX Research Dispatches</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0c10;
      color: #e4e4e7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .email-wrapper {
      width: 100%;
      background-color: #0b0c10;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #121318;
      border: 1px solid #27272a;
      border-radius: 4px;
      overflow: hidden;
    }
    .email-header {
      padding: 32px 32px 24px;
      background-color: #181920;
      border-bottom: 1px solid #27272a;
      text-align: left;
    }
    .brand-tag {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #10b981;
      display: inline-block;
      margin-bottom: 8px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #ffffff;
      margin: 0 0 6px;
      text-transform: uppercase;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #a1a1aa;
      margin: 0;
      line-height: 1.4;
    }
    .email-body {
      padding: 32px;
      line-height: 1.65;
      font-size: 15px;
      color: #d4d4d8;
    }
    .greeting {
      font-size: 17px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .bullet-box {
      background-color: #181920;
      border: 1px solid #27272a;
      border-radius: 4px;
      padding: 18px 20px;
      margin: 24px 0;
    }
    .bullet-title {
      font-size: 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #a1a1aa;
      margin-bottom: 12px;
      font-weight: 700;
    }
    .bullet-item {
      display: flex;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.5;
    }
    .bullet-dot {
      color: #10b981;
      margin-right: 10px;
      font-weight: bold;
    }
    .cta-row {
      margin: 32px 0 16px;
      text-align: left;
    }
    .cta-btn {
      display: inline-block;
      background-color: #ffffff;
      color: #0b0c10 !important;
      text-decoration: none;
      font-size: 13px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 12px 24px;
      border-radius: 4px;
      border: 1px solid #ffffff;
    }
    .email-footer {
      padding: 24px 32px;
      background-color: #181920;
      border-top: 1px solid #27272a;
      font-size: 12px;
      color: #71717a;
      line-height: 1.5;
    }
    .footer-links {
      margin-top: 10px;
    }
    .footer-link {
      color: #a1a1aa;
      text-decoration: underline;
      margin-right: 14px;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="email-header">
        <span class="brand-tag">PUBLICATIONS &amp; DISPATCHES</span>
        <h1 class="brand-title">ORBITX CONSORTIUM</h1>
        <p class="brand-subtitle">Zeal College of Engineering and Research, Pune • Dept. of Computer Engineering</p>
      </div>

      <div class="email-body">
        <div class="greeting">Welcome to OrbitX Research Dispatches!</div>
        <p>You have successfully subscribed to observational releases, astronomical telemetry, and student engineering logs directly from the OrbitX research desk.</p>

        <div class="bullet-box">
          <div class="bullet-title">What you will receive</div>
          <div class="bullet-item">
            <span class="bullet-dot">&#9658;</span>
            <span><strong>Field Observation Logs:</strong> Real photometric data and seeing metrics from rural Pune observation campaigns.</span>
          </div>
          <div class="bullet-item">
            <span class="bullet-dot">&#9658;</span>
            <span><strong>Optical &amp; Radio Engineering:</strong> Practical blueprints for Dobsonian telescope collimation, CMOS sensors, and CanSat payloads.</span>
          </div>
          <div class="bullet-item">
            <span class="bullet-dot">&#9658;</span>
            <span><strong>Campus Stargazing Nights:</strong> Priority alerts for upcoming dark-sky sessions and rooftop astronomical meets.</span>
          </div>
        </div>

        <p>All articles and observational datasets undergo peer review within our academic society before dissemination.</p>

        <div class="cta-row">
          <a href="https://orbitx-zcoer.web.app/blogs" class="cta-btn" target="_blank">Browse Published Dispatches &rarr;</a>
        </div>
      </div>

      <div class="email-footer">
        <p><strong>Sender:</strong> newsletter.orbitx@zealeducation.com<br>
        <strong>Affiliation:</strong> OrbitX Astronomy Consortium, Zeal College of Engineering and Research, Survey No. 39, Narhe, Pune 411041, Maharashtra, India.<br>
        <strong>Subscribed Address:</strong> ${subscriberEmail}</p>
        <div class="footer-links">
          <a href="https://orbitx-zcoer.web.app/contact" class="footer-link">Contact Desk</a>
          <a href="mailto:newsletter.orbitx@zealeducation.com?subject=Unsubscribe" class="footer-link">Manage Subscription / Unsubscribe</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate plain text fallback for the welcome email
 */
function generateWelcomeEmailText(subscriberEmail: string): string {
    return `ORBITX ASTRONOMY CONSORTIUM
Zeal College of Engineering and Research, Pune

Welcome to OrbitX Research Dispatches!

You have successfully subscribed with ${subscriberEmail}.

What to expect:
- Field Observation Logs: Photometric analysis and dark-sky measurements from Pune outskirts.
- Optical & Aerospace Engineering: Telescopes, CMOS calibration, and CanSat blueprints.
- Stargazing Alerts: Schedule notifications for upcoming rooftop campus astronomy nights.

Read latest dispatches: https://orbitx-zcoer.web.app/blogs
For questions or inquiries: contact.orbitx@zealeducation.com

Official Newsletter Desk:
newsletter.orbitx@zealeducation.com
OrbitX, Zeal College of Engineering and Research, Narhe, Pune 411041.
To unsubscribe, reply to this email with "Unsubscribe" in the subject line.`;
}

/**
 * Subscribe an email address to the OrbitX Newsletter in Firestore
 * and enqueue the welcome email into the `mail` collection for SMTP dispatch.
 */
export async function subscribeToNewsletter(
    rawEmail: string,
    source: string = 'blog_page'
): Promise<NewsletterSubscribeResult> {
    const email = rawEmail.trim().toLowerCase();

    // Strict email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return {
            success: false,
            message: 'Please enter a valid email address.'
        };
    }

    try {
        const subscribersRef = collection(db, 'newsletter_subscribers');

        // Check if this subscriber already exists in Firestore
        const checkQuery = query(subscribersRef, where('email', '==', email));
        const checkSnap = await getDocs(checkQuery);

        if (!checkSnap.empty) {
            const existingDoc = checkSnap.docs[0];
            const data = existingDoc.data();

            if (data.status === 'active') {
                return {
                    success: true,
                    alreadySubscribed: true,
                    message: 'You are already subscribed to OrbitX Research Dispatches.'
                };
            } else {
                // Reactivate previously unsubscribed email
                await updateDoc(doc(db, 'newsletter_subscribers', existingDoc.id), {
                    status: 'active',
                    resubscribedAt: new Date().toISOString()
                });
            }
        } else {
            // Create new subscriber document in Firestore
            await addDoc(subscribersRef, {
                email,
                status: 'active',
                source,
                subscribedAt: new Date().toISOString(),
                createdAt: serverTimestamp()
            });
        }

        // Enqueue welcome email into Firestore 'mail' collection
        // This is automatically processed by the Firebase "Trigger Email from Firestore" extension
        // configured with the SMTP credentials for newsletter.orbitx@zealeducation.com.
        try {
            const mailRef = collection(db, 'mail');
            await addDoc(mailRef, {
                to: [email],
                from: OFFICIAL_FROM_EMAIL,
                replyTo: OFFICIAL_REPLY_TO,
                message: {
                    subject: 'Welcome to OrbitX Research Dispatches 🌌',
                    text: generateWelcomeEmailText(email),
                    html: generateWelcomeEmailHtml(email)
                },
                createdAt: serverTimestamp()
            });
        } catch (mailError) {
            // Even if the mail queue write encounters a permissions warning,
            // the subscriber record was safely saved in Firestore.
            console.warn('Mail queue enqueue notice:', mailError);
        }

        return {
            success: true,
            alreadySubscribed: false,
            message: 'Successfully subscribed! Check your inbox for the welcome dispatch.'
        };
    } catch (error: any) {
        console.error('Error in subscribeToNewsletter:', error);
        return {
            success: false,
            message: error.message || 'Unable to complete subscription. Please try again.'
        };
    }
}
