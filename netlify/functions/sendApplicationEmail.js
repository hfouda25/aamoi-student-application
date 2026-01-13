import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    const trackingNumber = body.trackingNumber || "N/A";
    const name = body.name || "Student";
    const studentEmail = body.studentEmail || "";
    const program = body.program || "N/A";

    const passportUrl = body.passportUrl || "";
    const pictureUrl = body.pictureUrl || "";

    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || "AA Maritime <onboarding@resend.dev>";

    // attachments from frontend (Base64) - optional
    const attachments =
      Array.isArray(body.attachments)
        ? body.attachments
            .filter(a => a?.filename && a?.contentBase64)
            .map(a => ({ filename: a.filename, content: a.contentBase64 }))
        : undefined;

    const linksHtml = `
      <h4>Documents (Download Links)</h4>
      <ul>
        <li>Passport: ${passportUrl ? `<a href="${passportUrl}">${passportUrl}</a>` : "N/A"}</li>
        <li>Personal Photo: ${pictureUrl ? `<a href="${pictureUrl}">${pictureUrl}</a>` : "N/A"}</li>
      </ul>
      <p style="color:#666;font-size:12px;">
        Note: Links require the storage bucket to be public. If you later prefer private access, use signed URLs.
      </p>
    `;

    // Admin email
    await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: `New Student Application – ${trackingNumber}`,
      html: `
        <h3>New Student Application</h3>
        <p><b>Tracking #:</b> ${trackingNumber}</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${studentEmail || "N/A"}</p>
        <p><b>Program:</b> ${program}</p>
        ${linksHtml}
      `,
      attachments,
    });

    // Student confirmation
    if (studentEmail && studentEmail.includes("@")) {
      await resend.emails.send({
        from: fromEmail,
        to: [studentEmail],
        subject: `AA Maritime Application Received – ${trackingNumber}`,
        html: `
          <p>Dear ${name},</p>
          <p>Your application was received successfully.</p>
          <p><b>Tracking #:</b> ${trackingNumber}</p>
          <p><b>Program:</b> ${program}</p>
          <p>Please keep this tracking number for future reference.</p>
        `,
      });
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: e.message }),
    };
  }
}
