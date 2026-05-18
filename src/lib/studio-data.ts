export const TEMPLATES = [
  {
    id: 'x-hacp-hook',
    platform: 'x',
    name: 'HACP Origin Hook',
    description: 'The 2015 patent story — stops scroll every time',
    content:
      'Filed a patent in 2015 for human-AI connection protocols.\n\nGPT-1 dropped in 2018.\n\nFor 3 years I thought I was early.\n\nTurns out I was just right.',
  },
  {
    id: 'linkedin-founder',
    platform: 'linkedin',
    name: 'Founder Thought Leadership',
    description: 'Wall Street → AI pivot story for LinkedIn authority',
    content:
      "22 years on Wall Street taught me one thing about technology adoption:\n\nInstitutions don't move fast. They move carefully.\n\nWhen everyone was racing to deploy AI, I asked a different question:\n\nWhat about the 33% of organizations that legally, ethically, or morally cannot use mainstream AI?\n\nHealthcare. Finance. Faith communities. Government.\n\nThat's not a niche. That's a $340B market hiding in plain sight.\n\nWe built Responsible Intelligence for them.\n\n[link in first comment]\n\nWhat industries do you think are being left behind in the AI race?",
  },
  {
    id: 'reddit-authentic',
    platform: 'reddit',
    name: 'r/artificial Authentic Drop',
    description: 'Genuine community engagement — no marketing speak',
    content:
      "I filed a patent for a human-AI connection protocol in September 2015.\n\nAt the time, I was just a Wall Street guy who thought banks would need a way to configure AI behavior based on client risk profiles and values.\n\nGPT-1 didn't exist yet. Neither did the term \"AI safety.\"\n\nI spent $2.1M of my own money over 12 years building toward this.\n\nNow everyone is suddenly talking about \"responsible AI\" and \"configurable guardrails.\"\n\nI'm not saying I predicted anything. I'm saying the problem I was trying to solve in 2015 is the same problem enterprises are panicking about in 2026.\n\nHappy to answer questions about what we actually built if anyone's curious.",
  },
  {
    id: 'ig-reel-caption',
    platform: 'instagram',
    name: 'Reel Caption — Origin Story',
    description: 'Faith + founder story for maximum shareability',
    content:
      '12 years. $2.1M. 238 live API routes.\n\nAnd a patent I filed 3 years before ChatGPT existed.\n\nSome people call it a head start. I call it faith.\n\nBuilding @saintsallabs with everything I have.\n\n#ResponsibleAI #FounderLife #HACP #AIStartup #BuildInPublic',
  },
  {
    id: 'ph-tagline',
    platform: 'producthunt',
    name: 'Product Hunt Tagline',
    description: 'Launch day tagline + description',
    content:
      "SaintSal Growth Command — The operating system for founders who refuse to sacrifice values for velocity.\n\nTagline: \"Responsible Intelligence, built in public.\"\n\nDescription: We're the AI platform for the 33% of organizations that mainstream AI can't serve. HACP™ (US Patent #10,290,222) makes AI safeguards configurable — not blockers, but enablers. Built by a 22-year Wall Street veteran who filed this patent 3 years before GPT-1.",
  },
  {
    id: 'investor-dm',
    platform: 'linkedin',
    name: 'Investor Outreach DM',
    description: 'Warm intro request / cold VC DM',
    content:
      'Hi [Name],\n\nI noticed your portfolio includes [Company] — you clearly see the compliance gap in enterprise AI.\n\nWe\'re raising our Series A ($15-25M @ $50-75M pre) for Saint Vision Technologies — we hold US Patent #10,290,222 for HACP, a configurable AI safety protocol we filed in 2015.\n\nOur "Responsible Intelligence" platform serves the 33% of the market that cannot use OpenAI/Anthropic directly — healthcare, finance, faith communities, government.\n\n238 live routes, $53.8K/mo burn, 12+ years self-funded.\n\nWorth 20 minutes? Happy to share the deck.\n\n— Cap',
  },
]

export type Warmth = 'high-fit' | 'warm' | 'cold' | 'sensitive'

export const CHANNELS = [
  // X channels
  {
    id: 'x-ai-twitter',
    platform: 'x',
    name: '@AIStartups',
    handle: '@AIStartups',
    description: 'AI founder community — 280k followers',
    warmth: 'high-fit' as Warmth,
    tags: ['ai', 'startup'],
  },
  {
    id: 'x-buildinpublic',
    platform: 'x',
    name: '#BuildInPublic',
    handle: '#BuildInPublic',
    description: 'Founder transparency movement — massive reach',
    warmth: 'high-fit' as Warmth,
    tags: ['founder', 'transparency'],
  },
  {
    id: 'x-yc',
    platform: 'x',
    name: '@ycombinator',
    handle: '@ycombinator',
    description: 'YC community — engage on AI safety threads',
    warmth: 'warm' as Warmth,
    tags: ['vc', 'ai'],
  },
  {
    id: 'x-responsible-ai',
    platform: 'x',
    name: '#ResponsibleAI',
    handle: '#ResponsibleAI',
    description: 'Core hashtag — own this conversation',
    warmth: 'high-fit' as Warmth,
    tags: ['responsible-ai'],
  },
  // LinkedIn
  {
    id: 'li-ai-enterprise',
    platform: 'linkedin',
    name: 'AI in Enterprise',
    handle: 'LinkedIn Group',
    description: '45k members — CTOs, VPs, decision makers',
    warmth: 'high-fit' as Warmth,
    tags: ['enterprise', 'ai'],
  },
  {
    id: 'li-fintech',
    platform: 'linkedin',
    name: 'Fintech Professionals',
    handle: 'LinkedIn Group',
    description: 'Wall Street credibility plays well here',
    warmth: 'warm' as Warmth,
    tags: ['fintech', 'wall-street'],
  },
  {
    id: 'li-healthit',
    platform: 'linkedin',
    name: 'Health IT Leaders',
    handle: 'LinkedIn Group',
    description: 'HIPAA compliance angle — perfect HACP fit',
    warmth: 'high-fit' as Warmth,
    tags: ['healthcare', 'compliance'],
  },
  // Reddit
  {
    id: 'r-artificial',
    platform: 'reddit',
    name: 'r/artificial',
    handle: 'r/artificial',
    description: '2.3M members — skeptical but influential',
    warmth: 'warm' as Warmth,
    tags: ['ai', 'technical'],
  },
  {
    id: 'r-MachineLearning',
    platform: 'reddit',
    name: 'r/MachineLearning',
    handle: 'r/MachineLearning',
    description: 'Research-focused — HACP technical angle',
    warmth: 'warm' as Warmth,
    tags: ['ml', 'research'],
  },
  {
    id: 'r-entrepreneur',
    platform: 'reddit',
    name: 'r/entrepreneur',
    handle: 'r/entrepreneur',
    description: 'Founder story — 12 years, self-funded',
    warmth: 'high-fit' as Warmth,
    tags: ['founder', 'startup'],
  },
  {
    id: 'r-AIethics',
    platform: 'reddit',
    name: 'r/AIethics',
    handle: 'r/AIethics',
    description: 'Responsible AI community — core audience',
    warmth: 'high-fit' as Warmth,
    tags: ['ai-ethics', 'responsible-ai'],
  },
  {
    id: 'r-wallstreetbets',
    platform: 'reddit',
    name: 'r/wallstreetbets',
    handle: 'r/wallstreetbets',
    description: 'Wall Street cred — tread carefully',
    warmth: 'sensitive' as Warmth,
    tags: ['finance'],
  },
  // LinkedIn more
  {
    id: 'li-investors',
    platform: 'linkedin',
    name: 'Angel Investors Network',
    handle: 'LinkedIn Group',
    description: 'Series A visibility — direct VC engagement',
    warmth: 'high-fit' as Warmth,
    tags: ['investors', 'series-a'],
  },
  // TikTok
  {
    id: 'tt-founder',
    platform: 'tiktok',
    name: '#FounderTok',
    handle: '#FounderTok',
    description: 'Founder content vertical — storytelling wins',
    warmth: 'warm' as Warmth,
    tags: ['founder', 'tiktok'],
  },
  {
    id: 'tt-ai',
    platform: 'tiktok',
    name: '#AITok',
    handle: '#AITok',
    description: 'AI explainer content — HACP origin story',
    warmth: 'warm' as Warmth,
    tags: ['ai', 'education'],
  },
]
