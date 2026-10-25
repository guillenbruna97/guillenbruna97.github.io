import type { Area } from '../areas';
import { AREAS } from '../areas';

// Versión inglesa de las 6 áreas (2026-10-25). Mismo `slug` que en español
// (es el identificador); la URL inglesa sale de RUTAS_EN en i18n/index.ts.
// Términos con búsqueda en inglés: brand strategy, fractional CMO, web design,
// SEO & GEO, Google Ads, Meta Ads, social media management, corporate events.

const PROPOSAL = 'After a 15-minute call, within 5 working days you get a proposal with the scope, the team, the timeline and a fixed price.';

const EN: Record<string, Omit<Area, 'slug'>> = {
  'estrategia-y-marca': {
    name: 'Strategy and brand',
    seoTitle: 'Marketing consultancy in Zaragoza, Spain',
    description: 'Marketing and brand consultancy in Zaragoza, Spain: fractional CMO, brand strategy, go-to-market, sales pipeline audit and visual identity.',
    tagline: 'Who you speak to, what makes you different and how you say it, before investing in channels.',
    intro: 'Before investing in channels you need to know who you are speaking to, what makes you different and how you say it. We define the strategy with you and, if you want, our network of specialists executes it.',
    paraQuien: 'Mid-sized and B2B companies with a leader who wants to put marketing in order. Because they are about to launch something, because they only compete on price, or because they invest in marketing without knowing what works.',
    servicios: [
      { name: 'Fractional CMO', text: 'Part-time, month-to-month marketing leadership. Guillén Bruna sets the direction, coordinates the network and reports to the leadership team.' },
      { name: 'Brand strategy consulting', text: 'Positioning, value proposition and messaging so your company is understood at first glance.', href: '/servicios/posicionamiento/' },
      { name: 'Marketing plan and go-to-market', text: 'Ideal customer, channels, messages and calendar to launch or grow with clear criteria.', href: '/servicios/gtm-icp/' },
      { name: 'Sales pipeline audit', text: 'Where your sales process loses deals, using data from your own CRM.', href: '/servicios/pipeline/' },
      { name: 'Media training for executives', text: 'Preparing CEOs, COOs and CFOs to speak to the media, boards, investors or in a crisis.', href: '/servicios/mentoria-comunicacion/' },
      { name: 'Visual identity and rebranding', text: 'Logo, colours, typography, brand guidelines and applications, or refreshing a brand that has fallen behind.' },
    ],
    faqs: [
      { question: 'What is a fractional CMO?', answer: 'A senior professional who leads your marketing part-time, without joining your payroll. They set the strategy, prioritise, coordinate whoever executes and report to the leadership team. It fits when you need direction but not a full-time marketing director.' },
      { question: 'How much does marketing consulting cost?', answer: `It depends on the scope: a three-week audit does not cost the same as leading your marketing every month. ${PROPOSAL}` },
      { question: 'Do you also design the logo and visual identity?', answer: 'Yes. The designers in our network handle the visual identity, always based on the brand strategy, so the design expresses something already decided and not the other way round.' },
      { question: 'What if I want my own team to execute it?', answer: 'No problem. The deliverables are designed for your team or your suppliers to apply. If you prefer, our network executes them.' },
    ],
  },
  'diseno-web': {
    name: 'Web design and development',
    seoTitle: 'Web design in Zaragoza for companies',
    description: 'Web design and development in Zaragoza, Spain: corporate websites with UX/UI design, landing pages, online shops and maintenance. Fixed price.',
    tagline: 'Websites that explain what you do, turn visits into leads and are ready to rank.',
    intro: 'Your website is the first thing a client checks before calling you. We design it around what it has to achieve, build it fast and measurable, and leave it ready to rank.',
    paraQuien: 'Companies whose website no longer explains what they do, does not bring in leads or cannot be changed without calling someone.',
    servicios: [
      { name: 'Corporate website', text: 'Architecture, UX/UI design and development of a website that explains what you do and turns visits into leads.' },
      { name: 'Landing pages', text: 'Campaign pages built for a single action, with tracking and A/B tests.' },
      { name: 'Online shop', text: 'Catalogue, payments and shipping connected so you can sell online without hassle.' },
      { name: 'Technical maintenance', text: 'Updates, security and changes on request. The website, domain and hosting are always yours.' },
    ],
    faqs: [
      { question: 'How much does a company website cost?', answer: `It depends on the number of pages, the features and who prepares the content. ${PROPOSAL}` },
      { question: 'Will the website be mine?', answer: 'Yes. The domain, hosting and access are in your name from day one. We recommend where and how to sign up for them.' },
      { question: 'Does the website include SEO?', answer: 'Every website comes with the technical SEO basics: speed, structure, titles and structured data. Ongoing positioning is a separate service, SEO and GEO.' },
      { question: 'Do you handle maintenance?', answer: 'Only if you ask. Many companies prefer to manage the website themselves once it is delivered. If you want us to take care of updates and changes, it is a monthly service.' },
    ],
  },
  'seo-geo': {
    name: 'SEO and GEO',
    seoTitle: 'SEO and GEO services in Zaragoza, Spain',
    description: 'SEO and GEO in Zaragoza, Spain: show up on Google and in ChatGPT and Gemini answers. Audit, monthly SEO, local SEO and Google Business Profile.',
    tagline: 'Get found on Google and cited by ChatGPT and Gemini when people ask about what you do.',
    intro: 'Your clients search for you on Google and, more and more, ask ChatGPT or Gemini. We work so you show up in both, with content that answers what they are really looking for.',
    paraQuien: 'Companies that depend on being found. Those that do not appear when someone searches for their service in their city, or those that used to appear and have lost traffic.',
    servicios: [
      { name: 'SEO and GEO audit', text: 'Technical health, content, competitors and visibility in AI search engines, with a prioritised plan.' },
      { name: 'Monthly SEO', text: 'Data-driven keywords, content, technical improvements and links, with a monthly report.' },
      { name: 'Visibility in ChatGPT and AI search', text: 'Getting AI assistants to cite your company when someone asks about what you do.' },
      { name: 'Local SEO and Google Business Profile', text: 'Business profile, reviews and Maps presence for searches in your area.' },
    ],
    faqs: [
      { question: 'What is GEO?', answer: 'GEO (generative engine optimization) is the work of getting AI search engines such as ChatGPT, Gemini or Perplexity to cite your company in their answers. It builds on the same foundation as SEO, but needs more direct content, verifiable data and presence in the sources those systems consult.' },
      { question: 'How long does SEO take to work?', answer: 'Technical fixes show up within weeks. New content usually takes several months to rank. Be wary of anyone promising the top position on Google within a set time.' },
      { question: 'How much does SEO cost?', answer: `It depends on your starting point, the competition in your sector and the content needed. Monthly SEO has no lock-in. ${PROPOSAL}` },
      { question: 'Do you use this method on your own website?', answer: 'Yes. This website is worked the same way: keywords backed by Search Console data, a weekly content routine and measurement of visibility in AI search engines.' },
    ],
  },
  'publicidad-online': {
    name: 'Online advertising',
    seoTitle: 'Google Ads and Meta Ads agency in Zaragoza',
    description: 'Google Ads, Meta Ads and LinkedIn Ads campaign management in Zaragoza, Spain, measured by cost per customer. Ad account audits and monthly management.',
    tagline: 'Campaigns on Google, Meta and LinkedIn, measured by what each customer costs, not by clicks.',
    intro: 'Advertising works when you know who you are talking to and what happens after the click. We plan, launch and optimise your campaigns on Google, Meta and LinkedIn, and measure what each customer costs you.',
    paraQuien: 'Companies that already invest in ads without knowing what return they get, and those that want to start without spending the budget on blind tests.',
    servicios: [
      { name: 'Google Ads', text: 'Search, Performance Max and YouTube to reach people already looking for what you sell.' },
      { name: 'Meta Ads', text: 'Instagram and Facebook campaigns to generate demand and sell.' },
      { name: 'LinkedIn Ads', text: 'To reach B2B decision-makers by job title, sector and company size.' },
      { name: 'Ad account audit', text: 'We review your current campaigns and tell you where the budget goes and what to change.' },
    ],
    faqs: [
      { question: 'How much should I invest in advertising?', answer: `It depends on the sector, the area and the goal. In the proposal we always separate media spend from management, so you know what goes where. ${PROPOSAL}` },
      { question: 'Are the ad accounts mine?', answer: 'Yes. The accounts and their data are in your name. We work with management access, so if we ever stop working together, everything stays with you.' },
      { question: 'How do you measure results?', answer: 'With conversions set up from the start, such as calls, forms or sales, and a monthly report with the cost per lead or per sale. Not just clicks and impressions.' },
      { question: 'Is there a minimum contract?', answer: 'No. Campaign management is month to month. If it does not work, you will see it in the reports before anyone else.' },
    ],
  },
  'redes-sociales': {
    name: 'Social media and content',
    seoTitle: 'Social media management in Zaragoza, Spain',
    description: 'Social media management for companies in Zaragoza, Spain: strategy, content, video and LinkedIn for executives, in your brand voice with a monthly calendar.',
    tagline: 'What to say, to whom and in what tone, produced and managed by specialists.',
    intro: 'Posting for the sake of posting does not build a brand. We define what to say and to whom, and the network produces and manages the content in your company’s voice.',
    paraQuien: 'Companies with neglected social media or posting without direction, and executives who want their sector to know them.',
    servicios: [
      { name: 'Social media strategy and management', text: 'Editorial lines, calendar, publishing and community management.' },
      { name: 'Video and content production', text: 'Short-form video, photography and pieces for social media, web and campaigns.' },
      { name: 'LinkedIn for executives and companies', text: 'Profile and content for the executive and the company page, to build authority in your sector.' },
    ],
    faqs: [
      { question: 'How much does social media management cost?', answer: `It depends on how many networks, how many pieces a month and whether video or photo production is needed. ${PROPOSAL}` },
      { question: 'Do I have to approve every post?', answer: 'At first, yes. We work with a monthly calendar you approve before publishing. Over time you can delegate approval of routine content.' },
      { question: 'Which networks do you manage?', answer: 'Instagram, LinkedIn, TikTok, Facebook and YouTube. We recommend only the ones that make sense for your customer, not all of them.' },
      { question: 'Do you also run social media ads?', answer: 'Yes, through the online advertising area. If we handle both, content and ads are planned together.' },
    ],
  },
  eventos: {
    name: 'Events',
    seoTitle: 'Corporate events in Zaragoza, Spain',
    description: 'Corporate events, launches and brand activations in Zaragoza, Spain and wherever you need them, from concept to production.',
    tagline: 'Launches, activations and corporate events, from concept to production.',
    intro: 'A well-run event concentrates in one day what a brand takes months to build. We design the concept with you and the network handles production, from start to finish.',
    paraQuien: 'Companies launching something, celebrating a milestone or wanting to bring their sector together around their brand.',
    servicios: [
      { name: 'Launches and presentations', text: 'Presenting a product, a brand or a company to clients, press or partners.' },
      { name: 'Brand activations', text: 'Experiences at the point of sale, trade fairs or public spaces so people live your brand.' },
      { name: 'Corporate events', text: 'Conferences, workshops, anniversaries and company gatherings.' },
    ],
    faqs: [
      { question: 'What does organising an event include?', answer: 'Concept, venue, production, suppliers, communication before and after, and coordination on the day. Anything you do not need is left out.' },
      { question: 'How much does it cost to organise an event?', answer: `It depends on the capacity, the venue and the production. ${PROPOSAL}` },
      { question: 'Do you only work in Zaragoza?', answer: 'We are based in Zaragoza, but we produce events wherever you need them.' },
    ],
  },
};

export const AREAS_EN: Area[] = AREAS.map((a) => ({ slug: a.slug, ...EN[a.slug] }));
