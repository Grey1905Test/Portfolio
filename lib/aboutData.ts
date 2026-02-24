export type AboutSection = 
  | { id: string; title: string; content: string; type: 'text' }
  | { id: string; title: string; content: string[]; type: 'list' }
  | { id: string; title: string; content: Array<{ label: string; value: string; }>; type: 'grid' };
  
export const aboutData: AboutSection[] = [
  {
    id: 'who_i_am',
    title: 'WHO_I_AM.EXE',
    content: 'I\'m Surya Sundar, a Software Engineer from Chicago → India → Phoenix, currently pursuing my MS in Software Engineering at ASU. Started in biology, fell in love with code when I realized a few lines could solve any problem. The transition wasn\'t easy, but every challenge made me hungrier. I believe in writing code that solves problems so people can focus on what truly matters.',
    type: 'text'
  },
  {
    id: 'what_drives_me',
    title: 'WHAT_DRIVES_ME.LOG',
    content: [
      'MISSION: Become a world-class software engineer who automates the mundane',
      'PHILOSOPHY: Build fast, break things, learn faster',
      'APPROACH: Turn everyday frustrations into automation opportunities',
      'GOAL: Let code handle the noise so humans can focus on what they love',
      'INSPIRATION: Brilliant minds who showed me what\'s possible when you stop playing it safe'
    ],
    type: 'list'
  },
  {
    id: 'beyond_code',
    title: 'LIFE_BEYOND_TERMINAL',
    content: [
      {
        label: 'SPORTS',
        value: 'Soccer player (school & state level), marathon runner, gym enthusiast'
      },
      {
        label: 'MUSIC',
        value: 'Guitar learner, indie rock devotee, The Strokes on repeat'
      },
      {
        label: 'ORIGIN',
        value: 'Chicago-born, India-raised, Arizona-based, world-curious'
      },
      {
        label: 'FUN_FACT',
        value: 'Built a Raspberry Pi scraper for Postmates promo codes at 3 AM'
      },
      {
        label: 'HACKATHONS',
        value: 'Too many to count - building solutions to daily annoyances'
      },
      {
        label: 'COFFEE_STATUS',
        value: 'Critical dependency levels'
      }
    ],
    type: 'grid'
  }
];

export function getAboutSection(id: string): AboutSection | undefined {
  return aboutData.find(section => section.id === id);
}

export function getAllAboutSections(): AboutSection[] {
  return aboutData;
}