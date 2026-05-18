export interface StackTool {
  id: string
  name: string
  repo: string
  description: string
  license: string
  priority: 'core' | 'evaluate' | 'reference'
  category: string
}

export const OS_STACK: StackTool[] = [
  // Workflow Orchestration
  { id: 'n8n', name: 'n8n', repo: 'n8n-io/n8n', description: 'Self-hosted workflow automation — 400+ integrations, visual builder', license: 'Sustainable Use', priority: 'core', category: 'Workflow Orchestration' },
  { id: 'activepieces', name: 'Activepieces', repo: 'activepieces/activepieces', description: 'Open source Zapier alternative — cleaner self-hosting story', license: 'MIT', priority: 'evaluate', category: 'Workflow Orchestration' },
  // Marketing Automation
  { id: 'mautic', name: 'Mautic', repo: 'mautic/mautic', description: 'Open source marketing automation — email, SMS, lead scoring', license: 'GPL-3.0', priority: 'core', category: 'Marketing Automation' },
  // Listening & Reply
  { id: 'social-listening', name: 'HasData Social Listener', repo: 'HasData/social-listening-tool', description: 'Multi-platform keyword monitoring — webhook to FastAPI on mention', license: 'MIT', priority: 'core', category: 'Listening & Reply' },
  { id: 'mentionkit', name: 'Mentionkit', repo: 'mentionkit/mentionkit', description: 'Relevance scoring layer on top of raw social signals', license: 'Commercial', priority: 'evaluate', category: 'Listening & Reply' },
  { id: 'openclaw', name: 'OpenClaw', repo: 'openclaw-io/openclaw', description: 'Browser automation runtime — posts via your live Chrome session, no bot accounts', license: 'Commercial', priority: 'core', category: 'Listening & Reply' },
  // Channel Discovery
  { id: 'praw', name: 'PRAW', repo: 'praw-dev/praw', description: 'Python Reddit API Wrapper — subreddit discovery, velocity tracking', license: 'BSD-2', priority: 'core', category: 'Channel Discovery' },
  // LLM Brand Visibility
  { id: 'brandi', name: 'Brandi AI', repo: 'brandi-ai/brandi', description: 'Monitor how your brand appears in ChatGPT, Gemini, Perplexity answers', license: 'Commercial', priority: 'evaluate', category: 'LLM Brand Visibility' },
  // Core Infrastructure
  { id: 'supabase', name: 'Supabase', repo: 'supabase/supabase', description: 'Postgres + Auth + Realtime + Storage — our entire data layer', license: 'Apache-2.0', priority: 'core', category: 'Core Infrastructure' },
  { id: 'fastapi', name: 'FastAPI', repo: 'fastapi/fastapi', description: '238+ live routes on Render — our Python backend', license: 'MIT', priority: 'core', category: 'Core Infrastructure' },
  { id: 'nextjs', name: 'Next.js', repo: 'vercel/next.js', description: 'This app — App Router, server components, edge-ready', license: 'MIT', priority: 'core', category: 'Core Infrastructure' },
  // Analytics
  { id: 'posthog', name: 'PostHog', repo: 'PostHog/posthog', description: 'Product analytics — usage tracking, session recording, feature flags', license: 'MIT', priority: 'evaluate', category: 'Analytics' },
  { id: 'sentry', name: 'Sentry', repo: 'getsentry/sentry', description: 'Error tracking and performance monitoring', license: 'FSL-1.0', priority: 'evaluate', category: 'Analytics' },
  // AI Infrastructure
  { id: 'anthropic-sdk', name: 'Anthropic SDK', repo: 'anthropics/anthropic-sdk-python', description: 'Claude API — powers all 11 SAL agents', license: 'MIT', priority: 'core', category: 'AI Infrastructure' },
  { id: 'replicate', name: 'Replicate', repo: 'replicate/replicate-python', description: 'Flux image generation for Studio v2', license: 'Apache-2.0', priority: 'evaluate', category: 'AI Infrastructure' },
  { id: 'elevenlabs', name: 'ElevenLabs SDK', repo: 'elevenlabs/elevenlabs-python', description: 'Voice for SAL Voice agent — inbound/outbound calls', license: 'MIT', priority: 'evaluate', category: 'AI Infrastructure' },
]
