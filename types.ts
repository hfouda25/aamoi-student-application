
export interface ApplicationFormData {
  // Required Program Fields
  program_type: 'coc' | 'short_course';
  coc_program?: string;
  short_courses?: string[];
  intake_date: string;
  study_mode: string;
  delivery_mode: string;

  // Personal & Contact (Required & Optional)
  first_name: string;
  middle_name?: string;
  last_name: string;
  dob: string;
  nationality: string;
  email: string;
  phone: string;
  whatsapp?: string;
  
  // Optional Details
  passport_number?: string;
  passport_expiry?: string;
  country_of_residence?: string;
  highest_education?: string;
  existing_certificates?: string;

  // Simplified Experience
  has_sea_service: boolean;
  sea_service_description?: string;
  
  files: {
    passport: File | null; // Required
    personal_picture: File | null; // Required
    additional_docs?: File[]; // Optional
  };
}
