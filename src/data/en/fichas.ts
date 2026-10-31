import type { Faq } from '../../components/FaqList.astro';

// Las 4 fichas de consultoría en inglés (2026-10-25). Clave: slug español.
// Misma estructura que las props de ServiceLayout; el formato (duración,
// dedicación, garantía) sustituye al de data/precios.ts.
export interface FichaEn {
  seoTitle: string;
  description: string;
  subtitle: string;
  imageAlt: string;
  paraQuien: string;
  queResuelve: string;
  recibe: string[];
  pasos: { title: string; text: string }[];
  cierre: string;
  faqs: Faq[];
  formato: { duracion: string; dedicacion: string; garantia?: string; noIncluye: string[] };
}

const PROPUESTA = 'After a 15-minute call, within 5 working days you get a proposal with a fixed price, the timeline and what is included.';

export const FICHAS_EN: Record<string, FichaEn> = {
  pipeline: {
    seoTitle: 'B2B sales pipeline audit',
    description: 'Sales pipeline audit for B2B companies using your CRM data. We find at which stage of the pipeline deals are lost, why, and what to do at each one.',
    subtitle: 'Find out where your B2B pipeline loses valuable deals and which structural changes you need to turn leads into customers consistently.',
    imageAlt: 'Illustration of an executive examining a cracked sales funnel with a magnifying glass as deals slip through',
    paraQuien: 'This service is for CEOs, sales directors and founders of B2B companies with a CRM in use. Your team already generates qualified leads but conversion rates do not improve, and you sense there are invisible leaks in your sales process holding back growth.',
    queResuelve: 'Your problem is not a lack of leads or marketing, but internal inefficiencies draining your sales pipeline. There are blind spots in your sales process where deals stall or are lost without a clear reason. You need an outside, objective view that analyses your real data, finds those leaks and points out exactly which structural change fixes the problem at its root, raising your conversion sustainably.',
    recibe: [
      'A detailed audit of your B2B pipeline using data from your own CRM',
      'Precise identification of leaks and bottlenecks at each stage',
      'Prioritised structural recommendations to fix those leaks',
    ],
    pasos: [
      { title: 'Access and extraction', text: 'We access your CRM to extract the relevant pipeline data, under confidentiality.' },
      { title: 'Analysis and diagnosis', text: 'We analyse the data to diagnose the leaks at each stage of the sales process.' },
      { title: 'Report and priorities', text: 'We deliver a report with the leaks found and prioritised recommendations to fix them.' },
    ],
    cierre: 'If you suspect your pipeline hides inefficiencies that limit your growth, it is time to check. Let’s talk about how an objective audit can give you the answers you need to lift your sales team’s conversion.',
    faqs: [
      { question: 'What kind of company is this B2B pipeline audit for?', answer: 'This B2B pipeline audit is for CEOs, sales directors and founders of B2B companies, including SMEs, who already use a CRM and generate deals but do not improve conversion. This service does not generate leads or run marketing. It diagnoses why you lose the deals you already have.' },
      { question: 'How much does the pipeline audit cost?', answer: `It depends on how many business lines and sales teams need analysing. ${PROPUESTA} 50% is paid at the start and the remaining 50% on delivery.` },
      { question: 'Is there a guarantee?', answer: 'Yes. The final 50% is only paid if the report documents at least 3 leaks with data from your own CRM, each with its prioritised action. We do not promise revenue, because that depends on your team applying the changes we propose.' },
      { question: 'How long does it take and how much of my team’s time do you need?', answer: 'The audit takes 3 weeks. We need about 4 hours of your time in total, for kick-off, questions and the results presentation, plus 45 minutes with each of 2 or 3 of your salespeople.' },
      { question: 'Do I have to give you access to my CRM? Do you sign a confidentiality agreement?', answer: 'Yes, the audit is done with real data from your CRM. Before accessing it, we always sign a confidentiality agreement. Read-only access or a data export is enough; we do not need more.' },
      { question: 'What exactly do I get at the end?', answer: 'You get a report with the real funnel by stage, the leaks found with their data and likely cause, and actions prioritised by impact. We present it to you in a session, in person or remotely. These are fundamental changes to the process, not a list of loose tasks.' },
      { question: 'How is a sales process audit done?', answer: 'We extract the data from your CRM and measure conversion and time at each stage. We cross-check it with short conversations with your salespeople to understand why deals get stuck. We compare it with the process leadership believes exists; the gap between the written process and the real one is usually where the leak is.' },
      { question: 'Do you implement or change the CRM?', answer: 'No. The audit works with whatever CRM you already use, as long as it can export data. If the conclusion is that the CRM is badly set up, the report tells you what to change. The implementation can be done by your team, your supplier or our network.' },
      { question: 'Who applies the recommendations?', answer: 'Your team applies the recommendations. The report is designed so it can be applied without us. If you want help applying it, there is optional monthly support with no lock-in.' },
      { question: 'How is this different from hiring a sales consultant or sales training?', answer: 'Training works on your salespeople’s skills. A sales consultant usually redesigns the whole process. This audit comes first and uses data to find where the sale is lost, so you know whether the problem is process, qualification, message or follow-up before investing in anything.' },
    ],
    formato: {
      duracion: '3 weeks',
      dedicacion: 'About 4 hours of your time and 45 minutes with each of 2 or 3 salespeople',
      garantia: 'The final 50% is only paid if the report documents at least 3 leaks with data from your CRM, each with its prioritised action',
      noIncluye: ['Implementing or changing the CRM', 'Training the sales team', 'Generating leads'],
    },
  },
  'gtm-icp': {
    seoTitle: 'B2B go-to-market strategy and ideal customer',
    description: 'Go-to-market strategy for B2B and SaaS companies: a defined ideal customer, a channel map and messages by segment to enter the market with focus.',
    subtitle: 'Define your ideal customer and a precise go-to-market strategy for profitable growth, putting an end to scattered messages and channels.',
    imageAlt: 'Illustration of an executive pointing at a target hit by accurate arrows, connected to the acquisition channels',
    paraQuien: 'You are the founder or head of product of a B2B SaaS company at an early or growth stage. Your team invests in marketing channels, but effectiveness is low and you need a clear direction to optimise the budget and align everyone on the right message.',
    queResuelve: 'Without a clear ICP and a unified go-to-market strategy, everyone on your team describes the product differently. Channels move without shared criteria, diluting the investment and stalling growth. Working on your company’s marketing strategy from the foundations resolves that scattering, with a roadmap and consistent messages for each stage of the customer journey.',
    recibe: [
      'Your ideal customer profile (ICP), fully defined',
      'A channel map for activation and acquisition',
      'Messages by segment and a twelve-month action calendar',
    ],
    pasos: [
      { title: 'Diagnosis', text: 'We interview your founding and sales team to understand the product, the market and the challenges.' },
      { title: 'Strategy and message', text: 'We define your ICP and build the architecture of key messages for each customer segment.' },
      { title: 'Activation plan', text: 'You receive a decision document with a channel map and a twelve-month action calendar.' },
    ],
    cierre: 'If your B2B SaaS needs clarity to grow steadily, let’s talk about how to focus your go-to-market strategy and end the scattering that is holding back your potential today.',
    faqs: [
      { question: 'What is the difference between this service and hiring a marketing agency?', answer: 'A marketing agency runs channels, while this service first defines who to sell to, with what message and through which channels. That ensures your budget is not spread without criteria. It is for founders and directors of SaaS and B2B companies that already invest in marketing or are about to launch.' },
      { question: 'How much does the go-to-market and ICP strategy cost?', answer: `It depends on how many markets or product lines are included. ${PROPUESTA} 50% is paid at the start and the remaining 50% on delivery.` },
      { question: 'How long does it take and how much of my team’s time do you need?', answer: 'The service takes 6 weeks. We need about 8 hours from your team in total, split between interviews with founders and salespeople and two validation workshops.' },
      { question: 'What do I get at the end?', answer: 'At the end you get a decision document with the defined ICP, the map of prioritised acquisition channels, messages by segment and a twelve-month action calendar. It is not a generic presentation.' },
      { question: 'Which questions do you need to answer to define the ICP?', answer: 'To define the ICP you need to answer which current customers have given you the most margin and the fewest problems, what they had in common, what triggered the purchase, what alternative they used before, who blocks the decision and how long they took to decide. The ICP comes from your best real customers, not an imagined profile.' },
      { question: 'Is it worth it if we have not launched yet?', answer: 'Yes. Before launch is the best time. Deciding the ICP and the channels before launching avoids spending budget on blind tests. If there are no customers yet, the work relies on interviews with potential customers and competitor analysis.' },
      { question: 'Does it work for entering a new market?', answer: 'Yes. The same method applies to a new country, sector or segment. We validate who buys there, what alternative they use today and which channels reach them. If there is more than one market at once, the proposal reflects it in the scope and the price.' },
      { question: 'Who executes the plan? Will you help me build the team?', answer: 'The plan can be executed by your team, your suppliers or our network of specialists. The document states which profiles are needed and in what order to bring them in. If you need to hire, we help you define those profiles and select the people. Follow-up support is optional and has no lock-in.' },
      { question: 'What will have changed after 90 days?', answer: 'At the end of the 6 weeks, your team knows who to target, with what message and which channels to start with. After 90 days you should have the first actions from the calendar under way and data to confirm or correct the ICP. We do not promise a sales figure.' },
      { question: 'My team already runs campaigns for my B2B SaaS but we do not grow consistently. Does this service help?', answer: 'Yes. When each channel says something different and there is no clear ICP, a lot of marketing gets done without steady growth. This service first sorts out the who and the what, and then the channels.' },
    ],
    formato: {
      duracion: '6 weeks',
      dedicacion: 'About 8 hours from the team across interviews and two validation workshops',
      noIncluye: ['Running campaigns, social media or ads, which our network offers as a separate service', 'Implementing the CRM'],
    },
  },
  posicionamiento: {
    seoTitle: 'B2B brand positioning and value proposition',
    description: 'Brand positioning and value proposition for B2B companies, with rewritten examples for your website, pitch and sales that your customer understands at first glance.',
    subtitle: 'Build a B2B product narrative your customer understands at first glance, setting your solution apart and driving the buying decision.',
    imageAlt: 'Illustration of an executive pushing aside messy messages and holding up a single clear message',
    paraQuien: 'This service is for founders and heads of product of technical B2B SaaS companies. If your team struggles to articulate a clear value proposition, centred on the customer’s problem and not just on product features, you need to align the narrative. The product is good, but the message does not convince.',
    queResuelve: 'It solves the difficulty of communicating your product’s unique value. When the narrative focuses on features, the connection with the customer’s real problem is lost and differentiation fades in a noisy market. Being close to the product makes it hard to see from the outside. It takes an outside view, that of a positioning consultant, to identify the real competitive advantage and turn it into a message your audience understands and values over the competition.',
    recibe: [
      'A positioning document with a differentiated value proposition',
      'A message map for each customer segment',
      'Rewritten examples for your landing page, pitch and first sales lines',
    ],
    pasos: [
      { title: 'Audit', text: 'We review how your product is communicated today at every touchpoint, identifying inconsistencies.' },
      { title: 'A single narrative', text: 'We build your differentiated value proposition and the message map by segment.' },
      { title: 'Activation', text: 'We rewrite the key touchpoints with the new narrative, ready to implement.' },
    ],
    cierre: 'If your technical B2B SaaS deserves a message that captures its true value and resonates with your customers, let’s talk about building that narrative from the problem you solve, not from the features.',
    faqs: [
      { question: 'My product is good but the message does not convince. Is this what I need?', answer: 'Yes. This service solves the problem of a message that does not convince, especially when the product is good. Many B2B value propositions focus on features, not on the customer’s real problem. This work is for founders and heads of product of SaaS and technical B2B companies.' },
      { question: 'How much does the positioning project cost?', answer: `It depends mainly on how many customer segments need work. ${PROPUESTA} 50% is paid at the start of the project and the remaining 50% on final delivery.` },
      { question: 'How long does it take and how much of my time do you need?', answer: 'The positioning project takes 4 weeks. We only need about 5 hours of your time in total: an initial interview to understand your business, a key session to validate the message we build and the final review of the deliverable.' },
      { question: 'What deliverable do I get?', answer: 'You get a complete positioning document, with your differentiated value proposition, a message map adapted to each customer segment and the key copy already rewritten. That copy is ready for your website or main landing page, your sales pitch and the first lines of your sales communications.' },
      { question: 'Do you rewrite the copy or just give guidelines?', answer: 'We rewrite the key copy. The job is to hand you messages ready to use, not just guidelines. Building it into your website, graphic design and campaigns are not part of this service: your team, your suppliers or our network can do them as a separate service.' },
      { question: 'We cannot explain what makes us different from the competition. Does this solve it?', answer: 'Yes. We analyse how your competitors present themselves, what alternatives your customers use and the real reasons they choose you. That reveals the difference you can defend, not the one you would like to have.' },
      { question: 'Why can’t my own team write it?', answer: 'Being close to the product makes an outside view difficult. Your team knows every feature but finds it hard to prioritise what the customer values. It takes an outside perspective to turn that real advantage into a clear, concise message that is understood at first glance.' },
      { question: 'What is a brand audit? Is it included?', answer: 'A brand audit reviews how your company communicates today at all its touchpoints, including your website, presentations, proposals and LinkedIn, looking for inconsistencies. Yes, it is included: it is the first phase of the positioning project.' },
      { question: 'How is this different from a branding agency?', answer: 'This service works on the message, not the visual identity. A branding agency usually starts with the logo and design. Here we first decide what you say, who you speak to and why your customers should choose you. If you then need a visual identity, the designers in our network start from this work.' },
      { question: 'What if I am not convinced by the final message?', answer: 'Two rounds of revisions are included in the price. And the message is validated with you in a dedicated session before the copy is rewritten, so you do not reach the end of the project with something you do not recognise or fully identify with.' },
    ],
    formato: {
      duracion: '4 weeks',
      dedicacion: 'About 5 hours of your time across the initial interview, validation and final review',
      garantia: 'Two rounds of revisions included',
      noIncluye: ['Graphic design, logo and website, which our network offers as a separate service', 'Campaign management'],
    },
  },
  'mentoria-comunicacion': {
    seoTitle: 'Media training and communication for executives',
    description: 'Media training and communication mentoring for CEOs, COOs and CFOs, with preparation sessions and written decision notes for every public appearance.',
    subtitle: 'Prepare your leadership team so that every public voice strengthens the brand with the same strategic rigour, whoever is speaking.',
    imageAlt: 'Illustration of an executive at a lectern with a microphone and orderly sound lines, conveying communication judgement',
    paraQuien: 'For CEOs, COOs and CFOs who see public communication as a direct extension of the brand. If your leadership team needs a consistent, strategically aligned voice, beyond public speaking skills, for boards, investors, the press or a crisis, this service is for you.',
    queResuelve: 'Your leadership team has real experience, but the lack of a strategic structure in its external communication dilutes the impact. Without a communication consultant structuring each message, public appearances lose consistency and erode how the brand is perceived. It is not a question of charisma but of underlying strategy, and usually only the CEO gets real preparation, even though the COO and CFO also face the public.',
    recibe: [
      'Individual preparation sessions before each appearance',
      'Written decision notes after each session',
      'A communication approach applied and documented over time',
    ],
    pasos: [
      { title: 'Diagnosis', text: 'We review each executive’s upcoming public appearances and their audiences.' },
      { title: 'Preparation', text: 'An individual preparation session before each specific appearance.' },
      { title: 'Decision note', text: 'A written document after the session with the approach applied to that appearance.' },
    ],
    cierre: 'Your leadership team’s voice is a brand asset. If you want every public appearance, whether by the CEO, COO or CFO, to strengthen it instead of diluting it, let’s talk.',
    faqs: [
      { question: 'Is this communication mentoring only for the CEO?', answer: 'No. It is designed for the leadership team, including the CEO, COO and CFO, because they also face boards, investors and the press. It is also for senior public officials.' },
      { question: 'How much does executive communication mentoring cost?', answer: `It depends on whether it is for one executive or a whole committee, and whether it is the quarterly programme or a one-off appearance, such as media training before a specific interview. The programme includes 6 sessions of 90 minutes, decision notes and support between sessions. ${PROPUESTA} The programme is paid quarterly in advance.` },
      { question: 'Do you work with mayors and public officials?', answer: 'Yes. The method is the same, although the audience changes: it becomes citizens, the media, the council or the opposition. For a Spanish public administration, the fees for this mentoring fall within a minor contract, below €15,000 excluding VAT.' },
      { question: 'What is the difference between media training, executive coaching and communication mentoring?', answer: 'Media training prepares you for interviews with journalists, executive coaching helps you find your own answers through questions, and mentoring brings expert judgement. This service is communication mentoring: it brings the judgement of someone with experience, and preparation is done on your real appearances. It includes media preparation when the appearance requires it.' },
      { question: 'How is it different from public speaking classes?', answer: 'Public speaking works on form, while this mentoring works on substance. We focus on what to say, what not to say and how to answer difficult questions, always on a specific appearance of yours. Each session ends with a written decision note.' },
      { question: 'How often do we meet, and how?', answer: 'We meet in 6 sessions of 90 minutes spread over 3 months, scheduled around your planned appearances. The format is mixed: remote by default, and in person when it helps to rehearse face to face.' },
      { question: 'Will you help me if an urgent appearance comes up?', answer: 'Yes. Within the mentoring programme you have support between sessions for these situations, with a reply within 24 working hours. If you are not in the programme, you can request a one-off session of 2 hours with a decision note.' },
      { question: 'How is confidentiality handled?', answer: 'We always sign an agreement before starting. What we discuss in the sessions is never used as a case or reference without your express written permission.' },
      { question: 'Will you tell me things straight?', answer: 'Yes. The value of this mentoring lies in direct, honest judgement, something your team may not give you. The feedback is always concrete, about specific sentences, answers and decisions, never generic.' },
      { question: 'How do I know I am improving?', answer: 'Each session leaves a written decision note, and we compare the recording of the first rehearsal with the last one of the quarter. You will also have your own perception, and that of the people around you, of your real appearances.' },
    ],
    formato: {
      duracion: '3 months with 6 sessions of 90 minutes',
      dedicacion: 'The sessions and the preparation for each appearance',
      garantia: 'Support between sessions for urgent appearances, with a reply within 24 working hours',
      noIncluye: ['Writing full speeches on your behalf', 'Managing press relations'],
    },
  },
};
