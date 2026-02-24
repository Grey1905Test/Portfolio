export type ContactSection = 
  | { id: string; title: string; content: string; type: 'text' }
  | { id: string; title: string; content: Array<{ label: string; value: string; link?: string; }>; type: 'grid' };
  
export const contactData: ContactSection[] = [
  {
    id: 'get_in_touch',
    title: 'GET_IN_TOUCH.EXE',
    content: 'Ready to collaborate, discuss opportunities, or just chat about code? I\'m always open to connecting with fellow developers, potential employers, or anyone who shares a passion for building solutions that matter. Drop me a line through any of the channels below.',
    type: 'text'
  },
  {
    id: 'contact_info',
    title: 'CONTACT_CHANNELS.DAT',
    content: [
      {
        label: 'EMAIL',
        value: 'suryasundar2002@gmail.com',
        link: 'mailto:suryasundar2002@gmail.com'
      },
      {
        label: 'PHONE',
        value: '+1 (602) 723-2052',
        link: 'tel:+16027232052'
      },
      {
        label: 'LINKEDIN',
        value: 'linkedin.com/in/suryasundar19',
        link: 'https://www.linkedin.com/in/suryasundar19/'
      },
      {
        label: 'LOCATION',
        value: 'Phoenix, Arizona, USA'
      },
      {
        label: 'TIMEZONE',
        value: 'MST (UTC-7)'
      },
      {
        label: 'STATUS',
        value: 'Open to opportunities'
      }
    ],
    type: 'grid'
  },
  {
    id: 'lets_build',
    title: 'LETS_BUILD_SOMETHING.LOG',
    content: 'Whether you\'re looking for a software engineer who can turn ideas into reality, a collaborator for your next hackathon project, or someone to automate those daily annoyances that slow you down—I\'m your person. Let\'s build something that matters together.',
    type: 'text'
  }
];

export function getContactSection(id: string): ContactSection | undefined {
  return contactData.find(section => section.id === id);
}

export function getAllContactSections(): ContactSection[] {
  return contactData;
}