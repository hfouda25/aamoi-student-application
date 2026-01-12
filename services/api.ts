
import { ApplicationFormData } from '../types';
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  const viteKey = `VITE_${key}`;
  try {
    // @ts-ignore
    const env = typeof process !== 'undefined' ? process.env : (import.meta as any).env || {};
    return env[key] || env[viteKey] || '';
  } catch {
    return '';
  }
};

const supabase = (getEnv('SUPABASE_URL') && getEnv('SUPABASE_ANON_KEY')) 
  ? createClient(getEnv('SUPABASE_URL'), getEnv('SUPABASE_ANON_KEY'))
  : null;

const simulateSubmission = async (data: ApplicationFormData, trackingNumber: string): Promise<{ success: true; trackingNumber: string }> => {
  console.info("⚠️ Preview Mode: Simulating submission for", trackingNumber);
  await new Promise(r => setTimeout(r, 1200));
  return { success: true, trackingNumber };
};

export const submitApplication = async (data: ApplicationFormData): Promise<{ success: true; trackingNumber: string } | { success: false; error: string }> => {
  const trackingNumber = `AAMOI-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  if (!supabase) return simulateSubmission(data, trackingNumber);

  try {
    const upload = async (file: File, path: string) => {
      const name = `${trackingNumber}/${path}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('applications').upload(name, file);
      if (error) throw error;
      return supabase.storage.from('applications').getPublicUrl(name).data.publicUrl;
    };

    const passportUrl = data.files.passport ? await upload(data.files.passport, 'passport') : '';
    const pictureUrl = data.files.personal_picture ? await upload(data.files.personal_picture, 'profile') : '';

    const { error } = await supabase.from('applications').insert([{
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
    }]);

    if (error) throw error;

    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingNumber, email: data.email, name: `${data.first_name} ${data.last_name}` })
    }).catch(() => {});

    return { success: true, trackingNumber };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
