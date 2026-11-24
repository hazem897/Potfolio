/**
 * Email Service Configuration
 * 
 * Option 1: EmailJS (delivers the 100% custom Dark Navy & Turquoise HTML email template from public/email-template.html)
 * Option 2: FormSubmit (already activated and working as default fallback)
 */
export const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  formSubmitEmail: 'hazemhazem9089@gmail.com'
};
