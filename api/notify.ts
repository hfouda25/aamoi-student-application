
// This file illustrates how the backend serverless function (e.g., Netlify/Vercel) would look.
// In a real environment, you'd use `npm install resend` and import it.

/*
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'hfouda721@gmail.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { trackingNumber, email, studentName, details, passportUrl, pictureUrl } = req.body;

  try {
    // 1. Send Student Confirmation
    await resend.emails.send({
      from: 'AAMOI Admissions <admissions@aamoi.edu>',
      to: [email],
      subject: `Application Received - ${trackingNumber}`,
      html: `
        <h1>Welcome to AAMOI, ${studentName}!</h1>
        <p>Your application for <strong>${details.coc_program || 'Short Courses'}</strong> has been received.</p>
        <p>Your unique tracking number is: <strong>${trackingNumber}</strong></p>
        <p>Our admissions team will review your documents and contact you within 3-5 business days.</p>
        <br/>
        <p>Regards,<br/>AAMOI Team</p>
      `
    });

    // 2. Send Admin Notification
    await resend.emails.send({
      from: 'System <no-reply@aamoi.edu>',
      to: [adminEmail],
      subject: `NEW Application: ${trackingNumber} - ${studentName}`,
      html: `
        <h2>New Student Application Details</h2>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p><strong>Student:</strong> ${studentName}</p>
        <p><strong>Program:</strong> ${details.coc_program || details.short_courses?.join(', ')}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${details.phone}</p>
        <hr/>
        <h3>Documents:</h3>
        <ul>
          <li>Passport: <a href="${passportUrl}">View Document</a></li>
          <li>Personal Photo: <a href="${pictureUrl}">View Photo</a></li>
        </ul>
        <br/>
        <p>Full details are available in the Supabase Dashboard.</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
*/
