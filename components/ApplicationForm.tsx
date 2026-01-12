
import React, { useState } from 'react';
import { COC_PROGRAMS, SHORT_COURSES, STUDY_MODES, DELIVERY_MODES } from '../config/courses';
import { ApplicationFormData } from '../types';
import { submitApplication } from '../services/api';
import { toast } from 'react-hot-toast';

interface Props {
  onSuccess: (trackingNumber: string) => void;
}

export const ApplicationForm: React.FC<Props> = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    program_type: 'coc',
    coc_program: COC_PROGRAMS[0],
    short_courses: [],
    intake_date: '',
    study_mode: STUDY_MODES[0],
    delivery_mode: DELIVERY_MODES[0],
    first_name: '',
    middle_name: '',
    last_name: '',
    dob: '',
    nationality: '',
    email: '',
    phone: '',
    whatsapp: '',
    passport_number: '',
    passport_expiry: '',
    country_of_residence: '',
    highest_education: '',
    existing_certificates: '',
    has_sea_service: false,
    sea_service_description: '',
    files: {
      passport: null,
      personal_picture: null,
      additional_docs: []
    }
  });

  const steps = ["Program", "Personal & Contact", "Education & Exp", "Documents", "Review"];
  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateFiles = (field: string, file: File | null | File[]) => {
    setFormData(prev => ({
      ...prev,
      files: { ...prev.files, [field]: file }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      nextStep();
      return;
    }

    if (!formData.files.passport || !formData.files.personal_picture) {
      toast.error("Passport and Personal Picture are required.");
      setStep(4);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitApplication(formData);
      // Fixed: Using explicit boolean check to ensure proper TypeScript narrowing of the union type response.
      if (response.success === true) {
        toast.success("Application submitted successfully!");
        onSuccess(trackingNumber, formData);
      } else {
        // Fixed: Explicitly handle the failure case using property check to access 'error' field.
        const errorMsg = 'error' in response ? response.error : "Submission failed.";
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      {/* Stepper Header */}
      <div className="bg-slate-900 p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Student Application</h2>
          <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold">Step {step} of 5</span>
        </div>
        <div className="flex justify-between relative mt-8 px-2">
          {steps.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                step > idx + 1 ? 'bg-green-500' : step === idx + 1 ? 'bg-blue-600 scale-110' : 'bg-slate-700'
              }`}>
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className={`text-[10px] mt-2 uppercase tracking-tighter hidden md:block ${
                step === idx + 1 ? 'text-blue-400 font-bold' : 'text-slate-400'
              }`}>{s}</span>
            </div>
          ))}
          <div className="absolute top-4 left-0 h-0.5 bg-slate-700 w-full -z-0"></div>
          <div 
            className="absolute top-4 left-0 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Course Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Program Category</label>
                <div className="flex space-x-4">
                  {(['coc', 'short_course'] as const).map((type) => (
                    <button 
                      key={type}
                      type="button"
                      onClick={() => updateField('program_type', type)}
                      className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-bold transition-all ${
                        formData.program_type === type ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'
                      }`}
                    >{type === 'coc' ? 'CoC Program' : 'Short Courses'}</button>
                  ))}
                </div>
              </div>

              {formData.program_type === 'coc' ? (
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select CoC Certification</label>
                  <select 
                    value={formData.coc_program}
                    onChange={(e) => updateField('coc_program', e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500"
                  >
                    {COC_PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              ) : (
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Select Short Courses</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-4 border rounded-lg bg-slate-50">
                    {SHORT_COURSES.map(course => (
                      <label key={course} className="flex items-center space-x-3 p-1 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={formData.short_courses?.includes(course)}
                          onChange={(e) => {
                            const current = formData.short_courses || [];
                            updateField('short_courses', e.target.checked ? [...current, course] : current.filter(c => c !== course));
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-slate-700">{course}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Intake Date *</label>
                <input type="date" required value={formData.intake_date} onChange={e => updateField('intake_date', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Study Mode</label>
                  <select value={formData.study_mode} onChange={e => updateField('study_mode', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300">
                    {STUDY_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Delivery Mode</label>
                  <select value={formData.delivery_mode} onChange={e => updateField('delivery_mode', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300">
                    {DELIVERY_MODES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Personal & Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">First Name *</label>
                <input type="text" required value={formData.first_name} onChange={e => updateField('first_name', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name *</label>
                <input type="text" required value={formData.last_name} onChange={e => updateField('last_name', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                <input type="email" required value={formData.email} onChange={e => updateField('email', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile *</label>
                  <input type="tel" required value={formData.phone} onChange={e => updateField('phone', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">WhatsApp (Opt)</label>
                  <input type="tel" value={formData.whatsapp} onChange={e => updateField('whatsapp', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth *</label>
                <input type="date" required value={formData.dob} onChange={e => updateField('dob', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nationality *</label>
                <input type="text" required value={formData.nationality} onChange={e => updateField('nationality', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
              </div>
              <div className="col-span-1 md:col-span-2">
                <hr className="my-2" />
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Optional Passport Info</h4>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Passport Number</label>
                <input type="text" value={formData.passport_number} onChange={e => updateField('passport_number', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Country of Residence</label>
                <input type="text" value={formData.country_of_residence} onChange={e => updateField('country_of_residence', e.target.value)} className="w-full p-3 rounded-lg border border-slate-300" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Education & Experience</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Highest Education Level (Optional)</label>
                <input type="text" value={formData.highest_education} onChange={e => updateField('highest_education', e.target.value)} placeholder="e.g. High School, B.Sc" className="w-full p-3 rounded-lg border border-slate-300" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Existing Certificates (Short List)</label>
                <textarea rows={3} value={formData.existing_certificates} onChange={e => updateField('existing_certificates', e.target.value)} placeholder="Basic Training, MFA, etc." className="w-full p-3 rounded-lg border border-slate-300" />
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-700">Do you have prior Sea Service?</label>
                  <button 
                    type="button"
                    onClick={() => updateField('has_sea_service', !formData.has_sea_service)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.has_sea_service ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.has_sea_service ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                {formData.has_sea_service && (
                  <textarea 
                    rows={4} 
                    value={formData.sea_service_description} 
                    onChange={e => updateField('sea_service_description', e.target.value)} 
                    placeholder="Briefly describe your vessel names, ranks, and total experience..." 
                    className="w-full p-3 rounded-lg border border-slate-300 mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Document Uploads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Passport Bio Page *', key: 'passport', icon: '📄', accept: '.pdf,.jpg,.png' },
                { label: 'Personal Photo *', key: 'personal_picture', icon: '👤', accept: '.jpg,.png' }
              ].map((doc) => (
                <div key={doc.key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">{doc.label}</label>
                  <div className={`border-2 border-dashed p-6 rounded-xl text-center cursor-pointer transition-all ${(formData.files as any)[doc.key] ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-blue-400'}`}>
                    {(formData.files as any)[doc.key] ? (
                      <div>
                        <div className="text-green-600 font-bold text-xs">UPLOADED</div>
                        <div className="text-sm truncate px-4">{(formData.files as any)[doc.key].name}</div>
                        <button type="button" onClick={() => updateFiles(doc.key, null)} className="text-red-500 text-xs font-bold mt-2">Remove</button>
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl mb-2">{doc.icon}</div>
                        <input type="file" className="hidden" id={`up-${doc.key}`} accept={doc.accept} onChange={e => updateFiles(doc.key, e.target.files?.[0] || null)} />
                        <label htmlFor={`up-${doc.key}`} className="cursor-pointer text-blue-600 text-sm font-bold">Click to Upload</label>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Documents (Optional)</label>
                <input 
                  type="file" 
                  multiple 
                  onChange={e => updateFiles('additional_docs', Array.from(e.target.files || []))} 
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-bold text-amber-900">Final Review</h3>
              <p className="text-xs text-amber-700">Verify your contact details and course selection before submitting.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Program</span>
                <span className="font-bold">{formData.program_type === 'coc' ? formData.coc_program : formData.short_courses?.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Student</span>
                <span className="font-bold">{formData.first_name} {formData.last_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Email</span>
                <span className="font-bold">{formData.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Phone</span>
                <span className="font-bold">{formData.phone}</span>
              </div>
            </div>
            <div className="border-t pt-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input type="checkbox" required className="mt-1" />
                <span className="text-[11px] text-slate-500 leading-tight">I certify that all information provided is accurate and complete.</span>
              </label>
            </div>
          </div>
        )}

        <div className="mt-10 pt-8 border-t flex justify-between">
          <button type="button" onClick={prevStep} disabled={step === 1 || isSubmitting} className={`px-6 py-3 font-bold ${step === 1 ? 'opacity-0' : 'text-slate-600'}`}>Back</button>
          <button type="submit" disabled={isSubmitting} className="px-10 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg disabled:bg-slate-400 transition-all">
            {isSubmitting ? 'Submitting...' : step === 5 ? 'Submit Application' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};
