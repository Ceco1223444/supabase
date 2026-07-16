// Example Ask Ansera Q&A cards, shared between the landing page section and
// the in-app Ask Ansera panel. These are marketing examples — the copy makes
// that explicit wherever they render.
export const ASK_EXAMPLES = [
  {
    prompt: 'Why did refund requests spike this week?',
    intelligence:
      '12 of 14 refund tickets this week reference the same product: “Ceramic Plant Pot — Small.” Common theme: packaging damage in transit.',
    nextStep:
      'Flag this SKU for packaging review, and let Ansera Inbox auto-apply a pre-approved partial refund for this specific issue — about 8 minutes to set up.',
    sources: 'Support tickets · Order data · Shipping carrier logs',
  },
  {
    prompt: 'Which products should Scout prioritize this month?',
    intelligence:
      'Scout is tracking 23 products in your categories. Three show rising search interest with low ad saturation: ceramic plant pots, linen aprons, and magnetic cable organizers.',
    nextStep:
      'Review the three flagged products and mark the ones worth a storefront test — Sites can generate a product page for each in minutes.',
    sources: 'Marketplace signals · Ad libraries · Social trends',
  },
  {
    prompt: 'Draft next week’s content calendar',
    intelligence:
      'Based on your catalog and recent engagement, Studio suggests six short-form videos: three product demos, two behind-the-scenes clips, and one customer-question explainer.',
    nextStep:
      'Approve the calendar and Studio will script, generate, and schedule all six across TikTok and Instagram Reels.',
    sources: 'Product catalog · Post performance · Trend data',
  },
  {
    prompt: 'What’s my average first-response time?',
    intelligence:
      'Your average first response this month is 42 seconds. 96% of replies were drafted by Ansera Inbox, and 71% auto-sent above your confidence threshold.',
    nextStep:
      'Nothing needs fixing here. Raising the auto-send threshold to 90% would route roughly 8 more replies a week to review.',
    sources: 'Support tickets · Send logs',
  },
]
