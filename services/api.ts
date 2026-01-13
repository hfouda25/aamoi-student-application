import { ApplicationFormData } from '../types';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const submitApplication = async (
  data: ApplicationFormData
): Promise<{ success: true; trackingNumber: string } | { success: false; error: string }> => {
  const trackingNumber =
    `AAMOI-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const uploadFile = async (file: File, folder: string) => {
      const filePath = `${trackingNumber}/${folder}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('applications').upload(filePath, file);
      if (error) throw error;

      return supabase.storage.from('applications').getPublicUrl(filePath).data.publicUrl;
    };

    const passportUrl = data.files.passport
      ? await uploadFile(data.files.passport, 'passport')
      : null;

    const pictureUrl = data.files.personal_picture
      ? await uploadFile(data.files.personal_picture, 'profile')
      : null;

    const { error } = await supabase.from('applications').insert({
      tracking_number: trackingNumber,
      program_type: data.program_type,
      coc_program: data.coc_program,
      short_courses: data.short_courses,
      intake_date: data.intake_date,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      dob: data.dob,
      nationality: data.nationality,
      passport_number: data.passport_number,
      country_of_residence: data.country_of_residence,
      highest_education: data.highest_education,
      existing_certificates: data.existing_certificates,
      has_sea_service: data.has_sea_service,
      sea_service_description: data.sea_service_description,
      passport_url: passportUrl,
      personal_picture_url: pictureUrl
    });

    if (error) throw error;

    // 🔔 EMAIL (Netlify Function) - send links (admin can download)
    fetch('/.netlify/functions/sendApplicationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackingNumber,
        name: `${data.first_name} ${data.last_name}`,
        studentEmail: data.email,
        program: data.coc_program || data.program_type,
        passportUrl,
        pictureUrl
      })
    }).catch(() => {});

    return { success: true, trackingNumber };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
