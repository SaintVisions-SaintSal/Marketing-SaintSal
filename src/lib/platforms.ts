export interface Signal {
  name: string
  weight: number // positive or negative
  note?: string
}

export interface Platform {
  id: string
  name: string
  icon: string
  updated: string
  playbook: string[]
  signals: Signal[]
}

export const PLATFORMS: Platform[] = [
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: '🐦',
    updated: 'May 2026 · Phoenix Algorithm',
    playbook: [
      'Reply velocity > posting volume — 1 quote-post triggering 10 replies beats 5 standalone posts',
      'Drive curiosity → profile click (12x signal). Bio and pinned post must convert.',
      'Bookmark = purchase intent (10x). Write threads where bookmarking IS the value.',
      'Retweet = distribution (20x). Make it shareable, not just likeable.',
      'Block penalty is real (-3.0). Don\'t be divisive without purpose.',
      'Post at 9-11am EST or 7-9pm EST weekdays for peak engagement windows.',
    ],
    signals: [
      { name: 'Retweet', weight: 20 },
      { name: 'Reply', weight: 13.5 },
      { name: 'Profile Click', weight: 12 },
      { name: 'Bookmark', weight: 10 },
      { name: 'Like', weight: 1 },
      { name: 'Block', weight: -3.0, note: 'Avoid divisiveness' },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    updated: 'May 2026 · Meta Algorithm',
    playbook: [
      'DM sends-per-reach is the #1 signal in 2026. Design every caption to trigger "send this to someone."',
      'Reels posted same day as trend = +50% reach boost. Speed matters.',
      'Saves indicate long-term value — educational and inspirational content wins.',
      'Stories drive DM opens — use polls and questions to create conversation.',
      'Hashtags: 3-5 specific ones beat 30 generic ones.',
      'Post Mon/Wed/Fri 11am-1pm EST for peak IG reach.',
    ],
    signals: [
      { name: 'DM Sends per Reach', weight: 10, note: '#1 signal 2026' },
      { name: 'Saves', weight: 8 },
      { name: 'Comments', weight: 6 },
      { name: 'Shares', weight: 7 },
      { name: 'Likes', weight: 2 },
      { name: 'Same-day Reels', weight: 5, note: '+50% reach' },
    ],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    updated: 'May 2026 · LinkedIn Algorithm',
    playbook: [
      'Dwell time is the primary ranking signal — write long-form posts people actually read.',
      'Comment depth matters more than comment count. Respond to every comment to extend dwell.',
      'Drop links in the FIRST COMMENT, not in the post body — 3-5x reach restoration.',
      'Optimal length: 800-1300 characters. Use line breaks every 2-3 sentences.',
      'Post Tue-Thu 8-10am EST. Tuesday is the single best day.',
      'Personal stories outperform company announcements 10:1.',
    ],
    signals: [
      { name: 'Dwell Time', weight: 10, note: 'Primary signal' },
      { name: 'Comment Depth', weight: 9 },
      { name: 'Shares', weight: 8 },
      { name: 'Comments', weight: 7 },
      { name: 'Reactions', weight: 3 },
      { name: 'External Links in Post', weight: -5, note: 'Put in first comment' },
    ],
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: '🔴',
    updated: 'May 2026 · Reddit Ranking',
    playbook: [
      'Zero marketing language — be a person, not a brand.',
      'Falsifiable claims outperform vague assertions. Specifics beat generalities.',
      'Story format >> pitch format. "I did X for 12 years and learned Y" wins.',
      'Engage skepticism directly — don\'t deflect, address it head-on.',
      'Never link to your own site in the post. Earn trust first.',
      'Subreddit-specific peak times vary — check each community\'s activity patterns.',
    ],
    signals: [
      { name: 'Upvote Ratio', weight: 10 },
      { name: 'Comment Engagement', weight: 8 },
      { name: 'Time to First Upvote', weight: 7, note: 'Critical in first hour' },
      { name: 'Report Rate', weight: -8, note: 'Avoid promotional content' },
      { name: 'Account Karma', weight: 5 },
      { name: 'Awards', weight: 6 },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '▶️',
    updated: 'May 2026 · YouTube Algorithm',
    playbook: [
      'CTR × AVD (Average View Duration) = the entire ranking formula.',
      'Thumbnail + title determine CTR. Test multiple thumbnails.',
      'Hook in first 30 seconds determines AVD. Don\'t waste it on intros.',
      'Chapters improve AVD by letting viewers navigate — add them to every video.',
      'End screen clicks signal satisfaction — design for them.',
      'Consistency beats virality. 1 video/week > 4 videos/month binge.',
    ],
    signals: [
      { name: 'Click-Through Rate (CTR)', weight: 10, note: 'Thumbnail + title' },
      { name: 'Average View Duration', weight: 10, note: 'AVD' },
      { name: 'Likes', weight: 4 },
      { name: 'Comments', weight: 5 },
      { name: 'Shares', weight: 7 },
      { name: 'Saves to Playlist', weight: 6 },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    updated: 'May 2026 · TikTok Algorithm',
    playbook: [
      'Hook in 0-3 seconds or you\'re dead. Test 5 different first lines.',
      'Videos 60+ seconds qualify for Creator Rewards Program revenue share.',
      'Loop-ability is the hidden signal — design end to connect back to beginning.',
      'Sounds/trends in first 24 hours of trending = massive FYP boost.',
      'Comment back within first hour to boost algorithmic push.',
      'Post 6-10pm EST for highest FYP probability.',
    ],
    signals: [
      { name: 'Completion Rate', weight: 10, note: 'Most important' },
      { name: 'Shares', weight: 9 },
      { name: 'Comments', weight: 7 },
      { name: 'Likes', weight: 5 },
      { name: 'Profile Visits', weight: 6 },
      { name: 'Loop Rate', weight: 8, note: 'Hidden signal' },
    ],
  },
  {
    id: 'producthunt',
    name: 'Product Hunt',
    icon: '🚀',
    updated: 'May 2026 · PH Launch Strategy',
    playbook: [
      'Launch TUESDAY at exactly 12:01 AM PST — highest traffic day, full 24-hour window.',
      'Top 5 products in first 2 hours = front page for the day. Pre-warm your hunter network.',
      'Maker comment on every upvote in first hour — shows engagement, drives more.',
      'Ship a first-comment that\'s genuine and specific — not just "happy to answer questions."',
      'Your tagline is everything. Under 60 chars. Benefit + differentiator.',
      'PH voters share to Twitter — have your Twitter ready to engage the traffic.',
    ],
    signals: [
      { name: 'First 2-Hour Votes', weight: 10, note: 'Front page determinant' },
      { name: 'Upvote Velocity', weight: 9 },
      { name: 'Maker Engagement', weight: 8 },
      { name: 'Comment Quality', weight: 7 },
      { name: 'External Traffic', weight: 5 },
      { name: 'Gallery/Media Quality', weight: 4 },
    ],
  },
  {
    id: 'llm',
    name: 'LLM Brand Visibility',
    icon: '🤖',
    updated: 'May 2026 · Brandi AI Research',
    playbook: [
      'ChatGPT, Gemini, Perplexity pull from Reddit, LinkedIn, authoritative blogs — not just SEO.',
      'Getting cited in LLM answers requires high-quality, specific content on niche topics.',
      'HACP + Responsible Intelligence framing is ideal for LLM citation — specific, unique, verifiable.',
      'Wikipedia-style factual claims in content get cited more often than opinion pieces.',
      'Perplexity specifically surfaces recent news — press mentions matter for LLM visibility.',
      'Target Brandi AI to monitor your citation rate across major LLMs weekly.',
    ],
    signals: [
      { name: 'Reddit Thread Citations', weight: 9, note: 'Heavily weighted by LLMs' },
      { name: 'LinkedIn Article Citations', weight: 8 },
      { name: 'Press Mentions', weight: 9 },
      { name: 'Wikipedia/Authoritative Refs', weight: 10 },
      { name: 'Recent News Coverage', weight: 8, note: 'Perplexity especially' },
      { name: 'Unique Terminology Usage', weight: 7, note: 'HACP, Responsible Intelligence' },
    ],
  },
]
