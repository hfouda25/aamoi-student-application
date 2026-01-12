
# AAMOI Student Application Portal

## Deployment Guide (Netlify)

1.  **Supabase Setup**:
    *   Create a new Supabase project.
    *   Run the provided `schema.sql` in the SQL Editor.
    *   Go to **Storage**, create a new bucket called `applications`. Make sure it's public (for easy link viewing) or configure fine-grained RLS.
    *   Copy your `URL`, `Anon Key`, and `Service Role Key`.

2.  **Email Setup**:
    *   Create a [Resend](https://resend.com) account.
    *   Verify your domain or use their testing address.
    *   Generate an API Key.

3.  **Netlify Deployment**:
    *   Connect your GitHub repository.
    *   Set the build command to `npm run build` and directory to `dist`.
    *   Add Environment Variables in Netlify Settings:
        *   `SUPABASE_URL`
        *   `SUPABASE_ANON_KEY`
        *   `RESEND_API_KEY`
        *   `ADMIN_EMAIL`

4.  **Backend Logic**:
    *   Move the logic from `api/notify.ts` into a Netlify Function (folder: `netlify/functions/notify`).

## Testing Checklist
- [ ] Submit form with all required fields.
- [ ] Verify entry appears in `applications` table in Supabase.
- [ ] Verify files are uploaded to `applications` bucket.
- [ ] Check if student receives confirmation email.
- [ ] Check if admin receives detailed email with document links.
- [ ] Try a 15MB file (should be rejected by client or server validation).
