import { NextRequest, NextResponse } from "next/server";

// In-memory store for BrighterWorks running inside Next.js API routes.
// Mirrors backend/app/infrastructure/seed.py and backend/app/domain/matching.py.

export interface DbOrg {
  id: string;
  name: string;
  type: string;
  sector: string;
  loc: string;
  seal: string;
  about: string;
  billing_email: string | null;
  tax_id: string | null;
  billing_address: Record<string, unknown>;
  created_at: string;
  is_active: boolean;
}

export interface DbPlacement {
  id: string;
  title: string;
  org_id: string;
  courses: string[];
  grade: string;
  loc: string;
  mode: string;
  duration: string;
  stipend: string;
  deadline: string;
  slots: number;
  status: string;
  applicants: number;
  docs: string[];
  testimonial: boolean;
  about: string;
  duties: string[];
  review_status: string;
  published_at: string;
  closes_at: string;
  starts_at: string;
  requirements: string[];
  review_reason: string;
  opportunity_type: string;
  duration_hours: number | null;
  budget_range: string | null;
  milestones: string[] | null;
  remote_ok: boolean | null;
  salary_range: string | null;
  probation_period: string | null;
  training_included: boolean | null;
  career_path: string | null;
  skills_required: string[] | null;
}

export interface DbJob {
  id: string;
  title: string;
  org_id: string;
  loc: string;
  mode: string;
  employment_type: string;
  salary: string;
  closes_at: string;
  summary: string;
  requirements: string[];
  status: string;
  review_status: string;
  published_at: string;
  review_reason: string;
  applicants: number;
}

export interface DbUser {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
  org_id: string | null;
  created_at: string;
  is_active: boolean;
}

export interface DbStudentProfile {
  user_id: string;
  course: string;
  year: string;
  cgpa: number;
  university: string;
  skills: string[];
  talent_search_opt_in: boolean;
  skills_confidence: Record<string, number>;
  skills_source: Record<string, string>;
}

export interface DbDocument {
  id: string;
  user_id: string;
  document_type: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  status: string;
  rejection_reason: string;
  uploaded_at: string;
  is_public: boolean;
}

export interface DbApplication {
  id: string;
  user_id: string;
  placement_id: string;
  status: string;
  statement: string;
  cover_letter: string;
  cv_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  academic_papers: string[];
  reference_1_name: string;
  reference_1_email: string;
  reference_1_phone: string;
  reference_1_relationship: string;
  reference_2_name: string;
  reference_2_email: string;
  reference_2_phone: string;
  reference_2_relationship: string;
  document_ids: string[];
  shortlisted: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbJobApplication {
  id: string;
  user_id: string;
  job_id: string;
  status: string;
  statement: string;
  cover_letter: string;
  cv_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  academic_papers: string[];
  reference_1_name: string;
  reference_1_email: string;
  reference_1_phone: string;
  reference_1_relationship: string;
  reference_2_name: string;
  reference_2_email: string;
  reference_2_phone: string;
  reference_2_relationship: string;
  document_ids: string[];
  shortlisted: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface DbSubscription {
  org_id: string;
  plan: string;
  billing_cycle: string;
  payment_gateway: string;
  seats: number;
  since: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  is_premium: boolean;
}

interface SkillDef {
  name: string;
  category: string;
  keywords: string[];
}

const SKILLS: SkillDef[] = [
  { name: "Figma", category: "Design", keywords: ["figma"] },
  { name: "UI Design", category: "Design", keywords: ["ui design", "ui/ux", "interface design", "mockup"] },
  { name: "UX Research", category: "Design", keywords: ["ux research", "usability test", "user interview", "user research"] },
  { name: "Prototyping", category: "Design", keywords: ["prototype", "prototyping", "wireframe"] },
  { name: "Design Systems", category: "Design", keywords: ["design system", "component library", "style guide"] },
  { name: "Brand Identity", category: "Design", keywords: ["brand", "branding", "logo", "visual identity"] },
  { name: "Typography", category: "Design", keywords: ["typography", "type setting", "font"] },
  { name: "Illustrator", category: "Design", keywords: ["illustrator", "photoshop", "adobe", "affinity"] },
  { name: "JavaScript", category: "Engineering", keywords: ["javascript", "js", "es6"] },
  { name: "TypeScript", category: "Engineering", keywords: ["typescript", "ts"] },
  { name: "React", category: "Engineering", keywords: ["react", "reactjs", "next.js", "nextjs"] },
  { name: "Node.js", category: "Engineering", keywords: ["node", "nodejs", "express"] },
  { name: "Python", category: "Engineering", keywords: ["python", "django", "flask", "fastapi"] },
  { name: "Git", category: "Engineering", keywords: ["git", "github", "version control"] },
  { name: "APIs", category: "Engineering", keywords: ["api", "rest", "graphql", "endpoint"] },
  { name: "Testing", category: "Engineering", keywords: ["test", "testing", "jest", "unit test", "qa"] },
  { name: "SQL", category: "Data", keywords: ["sql", "postgres", "mysql", "query", "database"] },
  { name: "Excel", category: "Data", keywords: ["excel", "spreadsheet", "google sheets"] },
  { name: "Data Cleaning", category: "Data", keywords: ["data cleaning", "data wrangling", "etl", "preprocess"] },
  { name: "Dashboards", category: "Data", keywords: ["dashboard", "tableau", "power bi", "looker", "data studio"] },
  { name: "Statistics", category: "Data", keywords: ["statistic", "regression", "hypothesis", "r ", "spss", "sampling"] },
  { name: "Data Analysis", category: "Data", keywords: ["data analysis", "analytics", "pandas", "numpy", "insight"] },
  { name: "Policy Analysis", category: "Research", keywords: ["policy", "legislation", "regulation", "bill"] },
  { name: "Research", category: "Research", keywords: ["research", "literature review", "survey", "study"] },
  { name: "Report Writing", category: "Research", keywords: ["report writing", "brief", "memo", "documentation", "write-up"] },
  { name: "Stakeholder Engagement", category: "Research", keywords: ["stakeholder", "community", "consultation", "coordination"] },
  { name: "Monitoring & Evaluation", category: "Research", keywords: ["monitoring", "evaluation", "m&e", "indicator", "logframe", "theory of change"] },
  { name: "Health Informatics", category: "Health", keywords: ["health informatics", "electronic health", "ehr", "patient data"] },
  { name: "Patient Records", category: "Health", keywords: ["patient record", "clinical record", "medical record", "triage"] },
  { name: "Copywriting", category: "Communication", keywords: ["copywriting", "content writing", "copy", "blog"] },
  { name: "Communication", category: "Communication", keywords: ["communication", "presentation", "public speaking", "storytelling"] },
  { name: "Problem Solving", category: "Professional", keywords: ["problem solving", "problem-solving", "analytical thinking"] },
  { name: "Teamwork", category: "Professional", keywords: ["teamwork", "collaboration", "team lead", "agile", "scrum"] },
];

const REQUIRED_SKILLS: Record<string, string[]> = {
  p1: ["Figma", "UI Design", "Prototyping", "Design Systems"],
  p2: ["SQL", "Excel", "Data Cleaning", "Dashboards", "Statistics"],
  p3: ["Python", "JavaScript", "Git", "SQL", "APIs"],
  p4: ["Health Informatics", "Patient Records", "Data Cleaning"],
  p5: ["JavaScript", "React", "TypeScript", "Git"],
  p6: ["Policy Analysis", "Research", "Report Writing"],
  p7: ["SQL", "Dashboards", "Data Analysis", "Python"],
  p8: ["Data Analysis", "Report Writing", "Research", "Excel"],
  p9: ["Stakeholder Engagement", "Report Writing", "Monitoring & Evaluation"],
  p10: ["UX Research", "Research", "Prototyping", "Statistics"],
  p11: ["Brand Identity", "Typography", "Illustrator", "Copywriting"],
  p12: ["Monitoring & Evaluation", "Data Analysis", "Report Writing", "Statistics"],
};

const GRADE_RANK: Record<string, number> = {
  "CGPA 3.6+": 3.6,
  "CGPA 3.4+": 3.4,
  "CGPA 3.0+": 3.0,
  "Second Class Upper": 3.3,
  "Second Class Lower": 2.7,
};

const SKILL_LOOKUP = new Map(SKILLS.map((s) => [s.name.toLowerCase(), s.name]));

function requiredSkillsFor(p: DbPlacement): string[] {
  const raw = p.skills_required && p.skills_required.length > 0 ? p.skills_required : REQUIRED_SKILLS[p.id] || [];
  return raw.map((s) => SKILL_LOOKUP.get(s.toLowerCase()) || s);
}

function matchPlacement(
  p: DbPlacement,
  studentSkills: string[],
  studentCourse: string,
  studentCgpa: number,
  confidence: Record<string, number> = {}
) {
  const required = requiredSkillsFor(p);
  const have = new Set(studentSkills.map((s) => SKILL_LOOKUP.get(s.toLowerCase()) || s));
  const matched = required.filter((s) => have.has(s));
  const missing = required.filter((s) => !have.has(s));

  const weight = (s: string) => {
    const lvl = confidence[s];
    if (lvl === 1) return 0.5;
    if (lvl === 2) return 0.75;
    return 1.0;
  };
  const weighted = matched.reduce((acc, s) => acc + weight(s), 0);
  const coverage = required.length > 0 ? Math.min(1, weighted / required.length) : 0;

  const courseFit = p.courses.includes(studentCourse);
  const threshold = GRADE_RANK[p.grade] ?? 0;
  const gradeFit = studentCgpa >= threshold;
  const opp = p.opportunity_type || "internship";

  let raw = 0;
  if (opp === "gig") {
    raw = coverage * 0.8 + (p.remote_ok ? 0.2 : 0);
  } else if (opp === "entry_level") {
    raw = coverage * 0.5 + (courseFit ? 0.3 : 0) + (gradeFit ? 0.2 : 0);
  } else {
    raw = coverage * 0.6 + (courseFit ? 0.25 : 0) + (gradeFit ? 0.15 : 0);
  }

  return {
    score: Math.round(raw * 100),
    matched,
    missing,
    course_fit: courseFit,
    grade_fit: gradeFit,
  };
}

function extractSkills(text: string): string[] {
  const hay = ` ${text.toLowerCase()} `;
  const found: string[] = [];
  for (const skill of SKILLS) {
    const hit = skill.keywords.some((kw) => {
      const needle = kw.toLowerCase();
      const idx = hay.indexOf(needle);
      if (idx === -1) return false;
      const before = hay[idx - 1];
      const after = hay[idx + needle.length];
      const leftOk = before === undefined || /[^a-z0-9]/.test(before);
      const rightOk = after === undefined || /[^a-z0-9]/.test(after) || needle.endsWith(" ");
      return leftOk && rightOk;
    });
    if (hit) found.push(skill.name);
  }
  return found;
}

interface Store {
  orgs: DbOrg[];
  placements: DbPlacement[];
  jobs: DbJob[];
  users: DbUser[];
  tokens: Map<string, string>; // token -> user_id
  profiles: Map<string, DbStudentProfile>;
  packs: Map<string, { user_id: string; statement: string; targets: string[] }>;
  resumes: Map<string, { filename: string; content_type: string; size_bytes: number; uploaded_at: string }>;
  documents: DbDocument[];
  savedPlacements: Map<string, string[]>;
  savedJobs: Map<string, string[]>;
  applications: DbApplication[];
  jobApplications: DbJobApplication[];
  learningResources: Array<{
    id: string;
    title: string;
    url: string;
    provider: string;
    description: string;
    skill: string;
    placement_id: string;
    level: string;
    resource_type: string;
    duration: string;
    created_at: string;
  }>;
  completedModules: Map<string, Set<string>>;
  subscriptions: Map<string, DbSubscription>;
  paymentMethods: Map<string, Array<{
    id: string;
    org_id: string;
    type: string;
    details: Record<string, unknown>;
    is_default: boolean;
    gateway_payment_method_id: string | null;
    created_at: string;
  }>>;
  invoices: Array<Record<string, unknown>>;
  transactions: Array<Record<string, unknown>>;
  studentPlans: Map<string, {
    plan: string;
    status: string;
    billing_cycle: string | null;
    application_limit: number;
    price_cents: number;
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
  }>;
  studentInvoices: Map<string, Array<Record<string, unknown>>>;
  orgMembers: Map<string, Array<Record<string, unknown>>>;
  actionLogs: Array<{
    id: string;
    admin_id: string;
    admin_email: string;
    target_user_id: string | null;
    target_user_email: string | null;
    action: string;
    reason: string;
    details: string | null;
    created_at: string;
  }>;
  chatGroups: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
    member_ids: string[];
    messages: Array<{
      id: string;
      group_id: string | null;
      sender_id: string;
      recipient_id: string | null;
      type: string;
      content: string;
      original_language: string;
      duration_seconds: number | null;
      file_name: string | null;
      file_size: number | null;
      mime_type: string | null;
      created_at: string;
      updated_at: string | null;
      deleted_at: string | null;
      is_edited: boolean;
      reply_to_id: string | null;
      translations: Record<string, string>;
      translated_content: string | null;
      sender_name: string;
    }>;
  }>;
  directMessages: Array<{
    id: string;
    group_id: string | null;
    sender_id: string;
    recipient_id: string | null;
    type: string;
    content: string;
    original_language: string;
    duration_seconds: number | null;
    file_name: string | null;
    file_size: number | null;
    mime_type: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    is_edited: boolean;
    reply_to_id: string | null;
    translations: Record<string, string>;
    translated_content: string | null;
    sender_name: string;
  }>;
  testimonials: Array<{
    id: string;
    uploaded_at: string;
    author_role: string;
    testimonial_text: string;
  }>;
}

function createInitialStore(): Store {
  const today = new Date().toISOString().slice(0, 10);
  const nowIso = new Date().toISOString();

  const orgs: DbOrg[] = [
    { id: "o1", name: "Ministry of ICT and National Guidance", type: "Government", sector: "Public sector", loc: "Kampala", seal: "MIC", about: "National ministry responsible for digital government services, ICT policy and public-sector innovation.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-10", is_active: true },
    { id: "o2", name: "National Information Technology Authority", type: "Government", sector: "Public sector", loc: "Kampala", seal: "NITA", about: "Statutory body delivering national ICT infrastructure, e-government systems and digital skills programmes.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-12", is_active: true },
    { id: "o3", name: "Kampala Capital City Authority", type: "Government", sector: "Public services", loc: "Kampala", seal: "KCCA", about: "City authority responsible for urban planning, transport, sanitation and municipal digital services.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-14", is_active: true },
    { id: "o4", name: "Lumen Labs", type: "Company", sector: "Design & software", loc: "Remote, Europe", seal: "LL", about: "Product studio building design tooling used by 40,000 teams. Small, senior team, ships weekly.", billing_email: "billing@lumenlabs.example", tax_id: "TIN-44021", billing_address: {}, created_at: "2026-01-15", is_active: true },
    { id: "o5", name: "Northwind", type: "Company", sector: "Financial technology", loc: "Berlin, hybrid", seal: "NW", about: "Payments infrastructure for small merchants across East Africa and Europe.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-18", is_active: true },
    { id: "o6", name: "Atlas Health", type: "Company", sector: "Health", loc: "Nairobi", seal: "AH", about: "Primary-care network digitising patient records across 120 clinics.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-20", is_active: true },
    { id: "o7", name: "Kite Mobility", type: "Company", sector: "Transport", loc: "Kampala", seal: "KM", about: "Route planning and fare payments for minibus operators.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-22", is_active: true },
    { id: "o8", name: "Twaweza Foundation", type: "NGO", sector: "Civic research", loc: "Dar es Salaam", seal: "TW", about: "Research and advocacy on public service delivery in East Africa.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-25", is_active: true },
    { id: "o9", name: "Brac Uganda", type: "NGO", sector: "Development", loc: "Kampala", seal: "BU", about: "Development organisation working on livelihoods, education and financial inclusion.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-26", is_active: true },
    { id: "o10", name: "Makerere University — School of Computing", type: "University", sector: "Research", loc: "Kampala", seal: "MU", about: "Research group on human-computer interaction and public-interest technology.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-28", is_active: true },
  ];

  const basePlacements = [
    { id: "p1", title: "Product Design Intern", org_id: "o4", courses: ["Design", "Computer Science"], grade: "CGPA 3.0+", loc: "Remote", mode: "Remote", duration: "12 weeks", stipend: "$2,400 / month", deadline: "2027-03-12", slots: 4, status: "Open", applicants: 41, docs: ["Transcript", "Student ID", "Portfolio"], testimonial: true, about: "You will own one workstream from brief to handover, review weekly with a named mentor and present at the end-of-term critique.", duties: ["Own one end-to-end product workstream", "Join weekly critiques and ship to production", "Present at the end-of-term review"] },
    { id: "p2", title: "Data Analyst Intern", org_id: "o2", courses: ["Statistics", "Computer Science", "Economics"], grade: "Second Class Upper", loc: "Kampala", mode: "On-site", duration: "6 months", stipend: "UGX 1,200,000 / month", deadline: "2027-02-28", slots: 6, status: "Open", applicants: 87, docs: ["Transcript", "National ID", "Recommendation letter"], testimonial: true, about: "Placement within the national data office, supporting dashboards used by ministries and district offices.", duties: ["Maintain national indicator dashboards", "Clean and reconcile district datasets", "Prepare monthly briefings"] },
    { id: "p3", title: "Software Engineering Intern", org_id: "o5", courses: ["Computer Science", "Information Technology", "Engineering"], grade: "CGPA 3.4+", loc: "Berlin", mode: "Hybrid", duration: "6 months", stipend: "€1,900 / month", deadline: "2027-03-09", slots: 3, status: "Open", applicants: 120, docs: ["Transcript", "CV", "Portfolio"], testimonial: false, about: "Payments engineering team. You will work on merchant onboarding flows and internal tooling.", duties: ["Ship features in a two-week cycle", "Write tests for onboarding flows", "Join incident reviews"] },
    { id: "p4", title: "Health Records Intern", org_id: "o6", courses: ["Public Health", "Statistics", "Information Technology"], grade: "Second Class Lower", loc: "Nairobi", mode: "On-site", duration: "4 months", stipend: "KSh 75,000 / month", deadline: "2027-02-21", slots: 8, status: "Closing", applicants: 64, docs: ["Transcript", "Student ID", "Immunisation card"], testimonial: true, about: "Support the digitisation of patient records across a 120-clinic network.", duties: ["Digitise and validate patient files", "Flag incomplete records", "Support clinic audits"] },
    { id: "p5", title: "Frontend Intern", org_id: "o7", courses: ["Computer Science", "Design", "Information Technology"], grade: "CGPA 3.0+", loc: "Kampala", mode: "Hybrid", duration: "6 months", stipend: "UGX 900,000 / month", deadline: "2027-03-05", slots: 2, status: "Open", applicants: 33, docs: ["Transcript", "Portfolio"], testimonial: false, about: "Build the passenger-facing experience for route planning and fare payment.", duties: ["Build accessible booking flows", "Improve offline behaviour", "Test with conductors in the field"] },
    { id: "p6", title: "Policy Research Assistant", org_id: "o1", courses: ["Law", "Economics", "Mass Communication"], grade: "Second Class Upper", loc: "Kampala", mode: "On-site", duration: "5 months", stipend: "UGX 1,000,000 / month", deadline: "2027-03-18", slots: 5, status: "Open", applicants: 52, docs: ["Transcript", "Recommendation letter", "Writing sample"], testimonial: true, about: "Support the ICT policy unit with comparative research, briefings and stakeholder mapping.", duties: ["Draft policy briefs", "Map stakeholder positions", "Support consultation workshops"] },
    { id: "p7", title: "Civic Data Intern", org_id: "o8", courses: ["Statistics", "Economics", "Public Health"], grade: "CGPA 3.0+", loc: "Dar es Salaam", mode: "Hybrid", duration: "3 months", stipend: "TZS 700,000 / month", deadline: "2027-04-02", slots: 4, status: "Open", applicants: 29, docs: ["Transcript", "Student ID", "Writing sample"], testimonial: false, about: "Work with the survey team on public service delivery data used in national advocacy.", duties: ["Clean survey data", "Produce district summaries", "Support field enumerators"] },
    { id: "p8", title: "Urban Planning Intern", org_id: "o3", courses: ["Engineering", "Economics", "Design"], grade: "Second Class Lower", loc: "Kampala", mode: "On-site", duration: "6 months", stipend: "UGX 850,000 / month", deadline: "2027-02-25", slots: 3, status: "Closing", applicants: 47, docs: ["Transcript", "Student ID", "Recommendation letter"], testimonial: true, about: "Support the planning directorate on transport corridors and market redevelopment.", duties: ["Survey corridor usage", "Draft planning notes", "Support community consultations"] },
    { id: "p9", title: "Development Programmes Intern", org_id: "o9", courses: ["Business", "Economics", "Public Health"], grade: "Second Class Lower", loc: "Kampala", mode: "On-site", duration: "4 months", stipend: "UGX 750,000 / month", deadline: "2027-03-30", slots: 7, status: "Open", applicants: 71, docs: ["Transcript", "National ID", "Recommendation letter"], testimonial: true, about: "Support field programme delivery and monitoring across three districts.", duties: ["Support monitoring visits", "Maintain programme records", "Draft field notes"] },
    { id: "p10", title: "HCI Research Assistant", org_id: "o10", courses: ["Computer Science", "Design", "Statistics"], grade: "CGPA 3.6+", loc: "Kampala", mode: "On-site", duration: "10 weeks", stipend: "UGX 700,000 / month", deadline: "2027-03-15", slots: 2, status: "Open", applicants: 18, docs: ["Transcript", "Recommendation letter", "Writing sample"], testimonial: true, about: "Join a research group studying public-interest technology in Kampala.", duties: ["Run interview studies", "Code and synthesise transcripts", "Co-author a short paper"] },
    { id: "p11", title: "Brand Design Intern", org_id: "o4", courses: ["Design", "Mass Communication"], grade: "CGPA 3.0+", loc: "Remote", mode: "Remote", duration: "8 weeks", stipend: "$1,200 / month", deadline: "2027-04-20", slots: 2, status: "Open", applicants: 26, docs: ["Portfolio", "CV"], testimonial: false, about: "Identity and campaign design for a studio launch.", duties: ["Build identity variants", "Produce campaign assets", "Document the system"] },
    { id: "p12", title: "Monitoring & Evaluation Intern", org_id: "o2", courses: ["Statistics", "Economics", "Business"], grade: "Second Class Upper", loc: "Kampala", mode: "On-site", duration: "5 months", stipend: "UGX 950,000 / month", deadline: "2027-04-08", slots: 4, status: "Open", applicants: 39, docs: ["Transcript", "Student ID", "Writing sample"], testimonial: true, about: "Track outcomes across national digital skills programmes.", duties: ["Maintain indicator frameworks", "Run quarterly reviews", "Produce analysis notes"] },
    { id: "p13", title: "Website Redesign Gig", org_id: "o4", courses: ["Design", "Computer Science"], grade: "CGPA 2.5+", loc: "Remote", mode: "Remote", duration: "4 weeks", stipend: "$1,500 flat", deadline: "2027-03-15", slots: 1, status: "Open", applicants: 12, docs: ["Portfolio"], testimonial: false, about: "Redesign the marketing website for a product launch. Deliver Figma mockups and a style guide.", duties: ["Audit current site", "Design new pages in Figma", "Deliver component library"], opportunity_type: "gig", duration_hours: 40, budget_range: "$1,000-$2,000", milestones: ["Discovery & audit", "Wireframes", "High-fidelity mockups", "Style guide & handoff"], remote_ok: true, skills_required: ["Figma", "UI Design", "Design Systems"] },
    { id: "p14", title: "Junior Data Analyst", org_id: "o2", courses: ["Statistics", "Computer Science", "Economics"], grade: "Second Class Lower", loc: "Kampala", mode: "On-site", duration: "12 months", stipend: "UGX 2,500,000 / month", deadline: "2027-04-30", slots: 3, status: "Open", applicants: 45, docs: ["Transcript", "National ID", "Recommendation letter"], testimonial: false, about: "Full-time entry-level role analysing public sector data. Includes structured onboarding and mentorship.", duties: ["Build and maintain dashboards", "Analyse district-level indicators", "Present findings to stakeholders"], opportunity_type: "entry_level", salary_range: "UGX 2,200,000 - 3,000,000 / month", probation_period: "3 months", training_included: true, career_path: "Progress to Senior Data Analyst within 18 months", skills_required: ["SQL", "Excel", "Data Cleaning", "Dashboards", "Statistics"] },
  ];

  const placements: DbPlacement[] = basePlacements.map((p, idx) => ({
    ...p,
    review_status: "approved",
    published_at: `2026-0${Math.min(9, (idx % 6) + 1)}-15`,
    closes_at: p.deadline,
    starts_at: "2027-05-01",
    requirements: REQUIRED_SKILLS[p.id] || p.skills_required || [],
    review_reason: "",
    opportunity_type: (p as Partial<DbPlacement>).opportunity_type || "internship",
    duration_hours: (p as Partial<DbPlacement>).duration_hours ?? null,
    budget_range: (p as Partial<DbPlacement>).budget_range ?? null,
    milestones: (p as Partial<DbPlacement>).milestones ?? null,
    remote_ok: (p as Partial<DbPlacement>).remote_ok ?? null,
    salary_range: (p as Partial<DbPlacement>).salary_range ?? null,
    probation_period: (p as Partial<DbPlacement>).probation_period ?? null,
    training_included: (p as Partial<DbPlacement>).training_included ?? null,
    career_path: (p as Partial<DbPlacement>).career_path ?? null,
    skills_required: (p as Partial<DbPlacement>).skills_required ?? REQUIRED_SKILLS[p.id] ?? null,
  }));

  const jobs: DbJob[] = [
    { id: "j1", title: "Junior Product Designer", org_id: "o4", loc: "Remote", mode: "Remote", employment_type: "Full time", salary: "$1,800 / month", closes_at: "2026-12-15", summary: "Design clear product experiences with a small senior team.", requirements: ["Figma", "UI Design", "Portfolio"], status: "Open", review_status: "approved", published_at: "2026-02-01", review_reason: "", applicants: 14 },
    { id: "j2", title: "Graduate Data Analyst", org_id: "o2", loc: "Kampala", mode: "On-site", employment_type: "Full time", salary: "UGX 2,000,000 / month", closes_at: "2026-12-10", summary: "Turn public-sector datasets into useful decisions and reports.", requirements: ["SQL", "Excel", "Statistics"], status: "Open", review_status: "approved", published_at: "2026-02-05", review_reason: "", applicants: 22 },
    { id: "j3", title: "Software Engineer I", org_id: "o5", loc: "Berlin", mode: "Hybrid", employment_type: "Full time", salary: "€3,200 / month", closes_at: "2026-12-20", summary: "Build reliable payment tools for merchants across East Africa.", requirements: ["Python", "APIs", "Git"], status: "Open", review_status: "approved", published_at: "2026-02-10", review_reason: "", applicants: 31 },
    { id: "j4", title: "Monitoring and Evaluation Officer", org_id: "o9", loc: "Kampala", mode: "On-site", employment_type: "Full time", salary: "UGX 2,400,000 / month", closes_at: "2026-12-08", summary: "Support evidence-led programmes that improve livelihoods.", requirements: ["Monitoring & Evaluation", "Report Writing"], status: "Open", review_status: "approved", published_at: "2026-02-12", review_reason: "", applicants: 19 },
  ];

  const users: DbUser[] = [
    { id: "u-student-1", email: "amina@makerere.ac.ug", name: "Amina Nakato", role: "student", password: "password123", org_id: null, created_at: "2026-01-20", is_active: true },
    { id: "u-jobseeker-1", email: "brian@example.com", name: "Brian Ssekandi", role: "jobseeker", password: "password123", org_id: null, created_at: "2026-01-21", is_active: true },
    { id: "u-employer-1", email: "hiring@lumenlabs.example", name: "Lumen Labs", role: "employer", password: "password123", org_id: "o4", created_at: "2026-01-15", is_active: true },
    { id: "u-admin-1", email: "office@makerere.ac.ug", name: "Makerere University", role: "admin", password: "password123", org_id: "o10", created_at: "2026-01-10", is_active: true },
    { id: "u-admin-2", email: "admin@example.com", name: "Admin User", role: "admin", password: "changeme", org_id: null, created_at: "2026-01-10", is_active: true },
  ];

  const profiles = new Map<string, DbStudentProfile>();
  profiles.set("u-student-1", {
    user_id: "u-student-1",
    course: "Design",
    year: "Year 3",
    cgpa: 3.7,
    university: "Makerere University",
    skills: ["Figma", "UI Design", "Prototyping", "Communication", "Teamwork"],
    talent_search_opt_in: true,
    skills_confidence: { Figma: 3, "UI Design": 3, Prototyping: 2 },
    skills_source: { Figma: "manual", "UI Design": "manual", Prototyping: "project" },
  });

  const packs = new Map<string, { user_id: string; statement: string; targets: string[] }>();
  packs.set("u-student-1", {
    user_id: "u-student-1",
    statement: "I am a third-year Design student at Makerere University. I have shipped a 42-component design system into production, run 18 research interviews, and tested a wayfinding prototype across two iterations. I am looking for a 12-week placement where handoff quality matters.",
    targets: ["Product design", "Design systems", "Research"],
  });

  const documents: DbDocument[] = [
    { id: "doc-1", user_id: "u-student-1", document_type: "Transcript", filename: "transcript-2026.pdf", content_type: "application/pdf", size_bytes: 1240000, status: "verified", rejection_reason: "", uploaded_at: "2026-02-01T10:00:00Z", is_public: false },
    { id: "doc-2", user_id: "u-student-1", document_type: "Student ID", filename: "student-id.jpg", content_type: "image/jpeg", size_bytes: 480000, status: "verified", rejection_reason: "", uploaded_at: "2026-02-01T10:05:00Z", is_public: false },
    { id: "doc-3", user_id: "u-student-1", document_type: "Portfolio", filename: "portfolio-2025.pdf", content_type: "application/pdf", size_bytes: 8400000, status: "pending", rejection_reason: "", uploaded_at: "2026-02-10T14:20:00Z", is_public: false },
  ];

  const applications: DbApplication[] = [
    {
      id: "app-1",
      user_id: "u-student-1",
      placement_id: "p1",
      status: "In Review",
      statement: "I have built a 42-component design system and conducted 18 user research interviews.",
      cover_letter: "Dear Lumen Labs team, I am excited to apply for the Product Design Intern role.",
      cv_url: null,
      github_url: "https://github.com/amina-design",
      linkedin_url: "https://linkedin.com/in/amina-nakato",
      portfolio_url: "https://amina.design",
      academic_papers: [],
      reference_1_name: "Dr. Sarah Kigozi",
      reference_1_email: "s.kigozi@makerere.ac.ug",
      reference_1_phone: "+256700112233",
      reference_1_relationship: "Academic Supervisor",
      reference_2_name: "Paul Mugisha",
      reference_2_email: "pmugisha@studio.ug",
      reference_2_phone: "+256772445566",
      reference_2_relationship: "Studio Lead",
      document_ids: ["doc-1", "doc-2"],
      shortlisted: true,
      created_at: "2026-02-14T09:30:00Z",
      updated_at: "2026-02-15T11:00:00Z",
    },
  ];

  const learningResources = [
    { id: "lr-1", title: "Figma Component Systems in Practice", url: "https://help.figma.com/hc/en-us", provider: "Figma Learn", description: "Master design tokens, variants, and auto-layout for handoff.", skill: "Design Systems", placement_id: "p1", level: "Intermediate", resource_type: "Course", duration: "4 hours", created_at: today },
    { id: "lr-2", title: "SQL for Public Sector Data Analysis", url: "https://mode.com/sql-tutorial/", provider: "Mode Analytics", description: "Joins, aggregations, and data cleaning for analyst roles.", skill: "SQL", placement_id: "p2", level: "Beginner", resource_type: "Tutorial", duration: "6 hours", created_at: today },
    { id: "lr-3", title: "REST APIs with Python & FastAPI", url: "https://fastapi.tiangolo.com/tutorial/", provider: "FastAPI Docs", description: "Build typed APIs, validation schemas, and integration tests.", skill: "APIs", placement_id: "p3", level: "Intermediate", resource_type: "Guide", duration: "5 hours", created_at: today },
    { id: "lr-4", title: "React & TypeScript Essentials", url: "https://react.dev/learn", provider: "React Docs", description: "Hooks, state patterns, and accessible UI components.", skill: "React", placement_id: "p5", level: "Beginner", resource_type: "Course", duration: "8 hours", created_at: today },
  ];

  const subscriptions = new Map<string, DbSubscription>();
  subscriptions.set("o4", {
    org_id: "o4",
    plan: "Pro",
    billing_cycle: "monthly",
    payment_gateway: "stripe",
    seats: 3,
    since: "2026-01-15",
    status: "active",
    current_period_start: "2026-02-01T00:00:00Z",
    current_period_end: "2026-03-01T00:00:00Z",
    cancel_at_period_end: false,
    is_premium: true,
  });

  const chatGroups = [
    {
      id: "cg-1",
      name: "Makerere Placement Cohort 2026",
      type: "placement",
      description: "Official cohort channel for verified students and placement officers.",
      member_ids: ["u-student-1", "u-admin-1", "u-employer-1"],
      messages: [
        {
          id: "cm-1",
          group_id: "cg-1",
          sender_id: "u-admin-1",
          recipient_id: null,
          type: "text",
          content: "Welcome to the 2026 placement cycle! Upload your transcripts early so verification finishes within 48 hours.",
          original_language: "en",
          duration_seconds: null,
          file_name: null,
          file_size: null,
          mime_type: null,
          created_at: nowIso,
          updated_at: null,
          deleted_at: null,
          is_edited: false,
          reply_to_id: null,
          translations: {},
          translated_content: null,
          sender_name: "Makerere University",
        },
      ],
    },
  ];

  const testimonials = [
    { id: "t-1", uploaded_at: "2026-02-01", author_role: "student", testimonial_text: "I knew I qualified before I applied. BrighterWorks verified my transcript in 24 hours and Lumen Labs called that same week." },
    { id: "t-2", uploaded_at: "2026-02-05", author_role: "employer", testimonial_text: "Every applicant arrived with verified transcripts and clear eligibility checks. Shortlisting took half a morning." },
    { id: "t-3", uploaded_at: "2026-02-10", author_role: "admin", testimonial_text: "Having companies, ministries, and NGOs use one set of requirement fields cut our placement office review queue in half." },
  ];

  return {
    orgs,
    placements,
    jobs,
    users,
    tokens: new Map(),
    profiles,
    packs,
    resumes: new Map(),
    documents,
    savedPlacements: new Map([["u-student-1", ["p1", "p2"]]]),
    savedJobs: new Map(),
    applications,
    jobApplications: [],
    learningResources,
    completedModules: new Map(),
    subscriptions,
    paymentMethods: new Map([
      [
        "o4",
        [
          {
            id: "pm-1",
            org_id: "o4",
            type: "card",
            details: { brand: "Visa", last4: "4242" },
            is_default: true,
            gateway_payment_method_id: "pm_sandbox_4242",
            created_at: "2026-01-15T00:00:00Z",
          },
        ],
      ],
    ]),
    invoices: [],
    transactions: [],
    studentPlans: new Map(),
    studentInvoices: new Map(),
    orgMembers: new Map([
      [
        "o4",
        [
          {
            id: "mem-1",
            org_id: "o4",
            user_id: "u-employer-1",
            user_name: "Lumen Labs",
            user_email: "hiring@lumenlabs.example",
            role: "owner",
            invited_by: null,
            invited_at: "2026-01-15T00:00:00Z",
            joined_at: "2026-01-15T00:00:00Z",
            status: "active",
            created_at: "2026-01-15T00:00:00Z",
            updated_at: null,
          },
        ],
      ],
    ]),
    actionLogs: [],
    chatGroups,
    directMessages: [],
    testimonials,
  };
}

function getStore(): Store {
  const g = globalThis as unknown as { __brighterworksStore?: Store };
  if (!g.__brighterworksStore) {
    g.__brighterworksStore = createInitialStore();
  }
  return g.__brighterworksStore;
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function getCurrentUser(req: NextRequest, store: Store): DbUser | null {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7).trim();
  const userId = store.tokens.get(token);
  if (userId) {
    return store.users.find((u) => u.id === userId) || null;
  }
  // Support stateless token format `bw:<userId>` across hot reloads
  if (token.startsWith("bw:")) {
    const id = token.slice(3);
    const u = store.users.find((x) => x.id === id) || null;
    if (u) store.tokens.set(token, u.id);
    return u;
  }
  return null;
}

function enrichPlacement(p: DbPlacement, store: Store) {
  return {
    ...p,
    org: store.orgs.find((o) => o.id === p.org_id) || null,
  };
}

function enrichJob(j: DbJob, store: Store) {
  return {
    ...j,
    org: store.orgs.find((o) => o.id === j.org_id) || null,
  };
}

function defaultProfile(userId: string): DbStudentProfile {
  return {
    user_id: userId,
    course: "Computer Science",
    year: "Year 3",
    cgpa: 3.5,
    university: "Makerere University",
    skills: ["JavaScript", "Communication"],
    talent_search_opt_in: false,
    skills_confidence: {},
    skills_source: {},
  };
}

function jsonErr(status: number, detail: unknown) {
  return NextResponse.json({ detail }, { status });
}

export async function handleApiRequest(
  req: NextRequest,
  pathParts: string[]
): Promise<NextResponse> {
  const store = getStore();
  const method = req.method.toUpperCase();
  const path = "/" + pathParts.join("/");
  const sp = req.nextUrl.searchParams;

  let body: Record<string, any> = {};
  if (method !== "GET" && method !== "HEAD" && method !== "DELETE") {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      try {
        body = (await req.json()) as Record<string, any>;
      } catch {
        body = {};
      }
    }
  }

  // ---- Health & Public Home & Contact ----
  if (method === "GET" && path === "/health") {
    return NextResponse.json({ status: "ok", service: "BrighterWorks", environment: "development" });
  }

  if (method === "GET" && path === "/contact/info") {
    return NextResponse.json({ email: "akandwanahojonan256@gmail.com", whatsapp: "+256756348528" });
  }

  if (method === "GET" && path === "/home/stats") {
    const approved = store.placements.filter((p) => p.review_status === "approved");
    const orgCounts: Record<string, number> = {};
    for (const o of store.orgs) {
      orgCounts[o.type] = (orgCounts[o.type] || 0) + 1;
    }
    return NextResponse.json({
      total_placements: approved.length,
      total_organizations: store.orgs.length,
      total_students: store.users.filter((u) => u.role === "student").length + 41200,
      total_applications: store.applications.length + 1280,
      recent_placements: approved.slice(0, 6).map((p) => {
        const org = store.orgs.find((o) => o.id === p.org_id);
        return {
          id: p.id,
          title: p.title,
          organization: org?.name || "Organisation",
          organization_type: org?.type || "Company",
          opportunity_type: p.opportunity_type,
          deadline: p.deadline,
        };
      }),
      org_counts: orgCounts,
    });
  }

  if (method === "GET" && path === "/admin/testimonials") {
    const limit = Number(sp.get("limit") || 10);
    const roleFilter = sp.get("role");
    const list = roleFilter
      ? store.testimonials.filter((t) => t.author_role === roleFilter)
      : store.testimonials;
    return NextResponse.json(list.slice(0, limit));
  }

  // ---- Auth ----
  if (method === "POST" && path === "/auth/login") {
    const email = String(body.username || body.email || "").trim().toLowerCase();
    const pw = String(body.password || "");
    const user = store.users.find((u) => u.email.toLowerCase() === email);
    if (!user || user.password !== pw) {
      return jsonErr(401, "Incorrect email or password");
    }
    if (!user.is_active) {
      return jsonErr(403, "Account is suspended");
    }
    const token = `bw:${user.id}`;
    store.tokens.set(token, user.id);
    return NextResponse.json({
      access_token: token,
      token_type: "bearer",
      user: { id: user.id, email: user.email, name: user.name, role: user.role, org_id: user.org_id },
    });
  }

  if (method === "POST" && path === "/auth/register") {
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim() || email.split("@")[0];
    const role = String(body.role || "student");
    const password = String(body.password || "");
    if (!email || !password) {
      return jsonErr(422, "Email and password are required");
    }
    if (store.users.some((u) => u.email.toLowerCase() === email)) {
      return jsonErr(409, "Email already registered");
    }
    let orgId: string | null = null;
    if (role === "employer") {
      orgId = uid("o");
      store.orgs.push({
        id: orgId,
        name: String(body.org_name || name || "New Organisation"),
        type: String(body.org_type || "Company"),
        sector: String(body.org_sector || "Technology"),
        loc: String(body.org_loc || "Kampala"),
        seal: String(body.org_name || name || "NO").slice(0, 2).toUpperCase(),
        about: String(body.org_about || "Verified host organisation."),
        billing_email: email,
        tax_id: null,
        billing_address: {},
        created_at: new Date().toISOString().slice(0, 10),
        is_active: true,
      });
    }
    const user: DbUser = {
      id: uid("u"),
      email,
      name,
      role,
      password,
      org_id: orgId,
      created_at: new Date().toISOString().slice(0, 10),
      is_active: true,
    };
    store.users.push(user);
    if (role === "student") {
      store.profiles.set(user.id, defaultProfile(user.id));
    }
    const token = `bw:${user.id}`;
    store.tokens.set(token, user.id);
    return NextResponse.json(
      {
        access_token: token,
        token_type: "bearer",
        user: { id: user.id, email: user.email, name: user.name, role: user.role, org_id: user.org_id },
      },
      { status: 201 }
    );
  }

  if (method === "GET" && path === "/auth/me") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      org_id: user.org_id,
    });
  }

  // ---- Placements & Meta ----
  if (method === "GET" && path === "/placements/meta") {
    const courses = Array.from(new Set(store.placements.flatMap((p) => p.courses))).sort();
    const orgTypes = Array.from(new Set(store.orgs.map((o) => o.type))).sort();
    const locations = Array.from(new Set(store.placements.map((p) => p.loc))).sort();
    const reqSkills: Record<string, string[]> = {};
    for (const p of store.placements) {
      reqSkills[p.id] = requiredSkillsFor(p);
    }
    return NextResponse.json({
      courses,
      org_types: orgTypes,
      locations,
      grade_rules: GRADE_RANK,
      required_skills: reqSkills,
      skills: SKILLS,
    });
  }

  if (method === "GET" && path === "/placements") {
    const q = (sp.get("q") || "").toLowerCase();
    const orgType = sp.get("org_type");
    const loc = sp.get("location");
    const mode = sp.get("mode");
    const opp = sp.get("opportunity_type");
    const items = store.placements
      .filter((p) => p.review_status === "approved")
      .filter((p) => {
        const org = store.orgs.find((o) => o.id === p.org_id);
        if (orgType && org?.type !== orgType) return false;
        if (loc && p.loc !== loc) return false;
        if (mode && p.mode !== mode) return false;
        if (opp && p.opportunity_type !== opp) return false;
        if (q && !(p.title + " " + (org?.name || "") + " " + p.about).toLowerCase().includes(q)) {
          return false;
        }
        return true;
      })
      .map((p) => enrichPlacement(p, store));
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "GET" && pathParts.length === 2 && pathParts[0] === "placements") {
    const p = store.placements.find((x) => x.id === pathParts[1]);
    if (!p) return jsonErr(404, "Placement not found");
    return NextResponse.json(enrichPlacement(p, store));
  }

  if (method === "PATCH" && pathParts.length === 3 && pathParts[0] === "placements" && pathParts[2] === "requirements") {
    const p = store.placements.find((x) => x.id === pathParts[1]);
    if (!p) return jsonErr(404, "Placement not found");
    if (body.courses) p.courses = body.courses;
    if (body.grade) p.grade = body.grade;
    if (body.docs) p.docs = body.docs;
    if (typeof body.testimonial === "boolean") p.testimonial = body.testimonial;
    if (body.requirements) p.requirements = body.requirements;
    return NextResponse.json(enrichPlacement(p, store));
  }

  if (method === "GET" && pathParts.length === 3 && pathParts[0] === "placements" && pathParts[2] === "applicants") {
    const pid = pathParts[1];
    const items = store.applications
      .filter((a) => a.placement_id === pid)
      .map((a) => {
        const u = store.users.find((x) => x.id === a.user_id);
        const pl = store.placements.find((x) => x.id === a.placement_id);
        return {
          ...a,
          user_name: u?.name || "Student",
          user_email: u?.email || "",
          placement_title: pl?.title || "",
        };
      });
    return NextResponse.json({ total: items.length, items });
  }

  // ---- Matching & Skills ----
  if (method === "POST" && path === "/match") {
    const skills: string[] = Array.isArray(body.skills) ? body.skills : [];
    const course = String(body.course || "");
    const cgpa = Number(body.cgpa || 0);
    const limit = Number(body.limit || 20);
    const opp = body.opportunity_type ? String(body.opportunity_type) : undefined;
    const confidence = (body.skills_confidence || {}) as Record<string, number>;

    const ranked = store.placements
      .filter((p) => p.review_status === "approved")
      .filter((p) => (!opp || p.opportunity_type === opp))
      .map((p) => ({
        placement: enrichPlacement(p, store),
        match: matchPlacement(p, skills, course, cgpa, confidence),
      }))
      .sort((a, b) => b.match.score - a.match.score)
      .slice(0, limit);

    return NextResponse.json({ total: ranked.length, items: ranked });
  }

  if (method === "GET" && path === "/skills/suggestions") {
    const course = sp.get("course") || "";
    const user = getCurrentUser(req, store);
    const profile = user ? store.profiles.get(user.id) : undefined;
    const owned = new Set(profile?.skills || []);
    const hits = new Map<string, string[]>();

    for (const p of store.placements) {
      if (course && !p.courses.includes(course)) continue;
      for (const s of requiredSkillsFor(p)) {
        if (owned.has(s)) continue;
        const arr = hits.get(s) || [];
        arr.push(p.id);
        hits.set(s, arr);
      }
    }
    const items = Array.from(hits.entries())
      .map(([name, placement_ids]) => {
        const def = SKILLS.find((s) => s.name === name);
        return {
          name,
          category: def?.category || "General",
          demand: placement_ids.length,
          placement_ids,
        };
      })
      .sort((a, b) => b.demand - a.demand);
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "POST" && path === "/skills/match") {
    const text = String(body.text || "");
    const existing = new Set<string>(Array.isArray(body.skills) ? body.skills : []);
    const found = extractSkills(text);
    const items = found.map((name) => {
      const def = SKILLS.find((s) => s.name === name);
      return {
        name,
        category: def?.category || "General",
        level: 2,
        reason: "Detected in your statement or project description.",
        owned: existing.has(name),
      };
    });
    return NextResponse.json({
      total: items.length,
      items,
      source: "keywords",
      note: "Matched against the platform skill taxonomy.",
    });
  }

  if (method === "GET" && path === "/enrich/status") {
    return NextResponse.json({ configured: false, model: null });
  }

  if (method === "POST" && path === "/enrich") {
    const user = getCurrentUser(req, store);
    const statement = String(body.personal_statement || "");
    const found = extractSkills(statement);
    return NextResponse.json({
      message: "Enriched using platform taxonomy.",
      profile: {
        user_id: user?.id || "guest",
        skills: found.map((name) => ({
          skill_id: name.toLowerCase().replace(/\s+/g, "-"),
          canonical_name: name,
          aliases: [],
          category: SKILLS.find((s) => s.name === name)?.category || "General",
          proficiency: 2,
          confidence_score: 0.85,
          evidence: [statement.slice(0, 80)],
          years_experience: 1,
          learning_velocity: 0.8,
        })),
        career_trajectory: {
          current_stage: "Undergraduate",
          target_roles: ["Intern"],
          career_aspirations: [],
          domain_interests: [],
          learning_goals: [],
          work_preferences: "Hybrid",
          values_signals: [],
        },
        soft_skills: {
          leadership: 75,
          communication: 82,
          teamwork: 85,
          adaptability: 80,
          problem_solving: 78,
          initiative: 76,
          organization: 74,
          cultural_awareness: 80,
        },
        cultural_values: {
          autonomy_preference: 70,
          mission_alignment: 80,
          collaboration_style: "Collaborative",
          risk_tolerance: 65,
          learning_appetite: 90,
          work_life_integration: 75,
          feedback_receptivity: 85,
          diversity_value: 80,
        },
        profile_embedding: [],
        skills_embedding: [],
        bio_embedding: [],
        course: "Design",
        university: "Makerere University",
        cgpa: 3.7,
        graduation_year: 2027,
        location_preferences: ["Kampala", "Remote"],
        remote_ok: true,
        availability: "Immediate",
      },
    });
  }

  // ---- Saved Placements ----
  if (method === "GET" && path === "/saved") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    return NextResponse.json({ saved_ids: store.savedPlacements.get(user.id) || [] });
  }

  if (method === "POST" && path === "/saved/toggle") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const pid = String(body.placement_id || "");
    const cur = store.savedPlacements.get(user.id) || [];
    const exists = cur.includes(pid);
    const next = exists ? cur.filter((x) => x !== pid) : [...cur, pid];
    store.savedPlacements.set(user.id, next);
    return NextResponse.json({ saved: !exists, saved_ids: next });
  }

  // ---- Student Profile / Pack / Resume / Documents ----
  if (path === "/profile") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    if (method === "GET") {
      let prof = store.profiles.get(user.id);
      if (!prof) {
        prof = defaultProfile(user.id);
        store.profiles.set(user.id, prof);
      }
      return NextResponse.json(prof);
    }
    if (method === "PUT") {
      const existing = store.profiles.get(user.id) || defaultProfile(user.id);
      const updated: DbStudentProfile = {
        ...existing,
        course: body.course ?? existing.course,
        year: body.year ?? existing.year,
        cgpa: typeof body.cgpa === "number" ? body.cgpa : existing.cgpa,
        university: body.university ?? existing.university,
        skills: Array.isArray(body.skills) ? body.skills : existing.skills,
        talent_search_opt_in: typeof body.talent_search_opt_in === "boolean" ? body.talent_search_opt_in : existing.talent_search_opt_in,
        skills_confidence: body.skills_confidence ?? existing.skills_confidence,
        skills_source: body.skills_source ?? existing.skills_source,
      };
      store.profiles.set(user.id, updated);
      return NextResponse.json(updated);
    }
  }

  if (path === "/application-pack") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    if (method === "GET") {
      const pack = store.packs.get(user.id) || { user_id: user.id, statement: "", targets: [] };
      return NextResponse.json(pack);
    }
    if (method === "PUT") {
      const pack = {
        user_id: user.id,
        statement: String(body.statement || "").slice(0, 600),
        targets: Array.isArray(body.targets) ? body.targets : [],
      };
      store.packs.set(user.id, pack);
      return NextResponse.json(pack);
    }
  }

  if (path === "/resume") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    if (method === "GET") {
      const r = store.resumes.get(user.id);
      if (!r) return jsonErr(404, "No resume uploaded");
      return NextResponse.json(r);
    }
    if (method === "PUT") {
      const form = await req.formData().catch(() => null);
      const file = form?.get("file") as File | null;
      const resume = {
        filename: file?.name || "resume.pdf",
        content_type: file?.type || "application/pdf",
        size_bytes: file?.size || 245000,
        uploaded_at: new Date().toISOString(),
      };
      store.resumes.set(user.id, resume);
      return NextResponse.json(resume);
    }
  }

  if (method === "GET" && path === "/documents") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    return NextResponse.json({
      items: store.documents.filter((d) => d.user_id === user.id),
    });
  }

  if (method === "PUT" && pathParts.length === 2 && pathParts[0] === "documents") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const docType = decodeURIComponent(pathParts[1]);
    const form = await req.formData().catch(() => null);
    const file = form?.get("file") as File | null;
    const existingIdx = store.documents.findIndex(
      (d) => d.user_id === user.id && d.document_type === docType
    );
    const doc: DbDocument = {
      id: existingIdx >= 0 ? store.documents[existingIdx].id : uid("doc"),
      user_id: user.id,
      document_type: docType,
      filename: file?.name || `${docType.toLowerCase()}.pdf`,
      content_type: file?.type || "application/pdf",
      size_bytes: file?.size || 320000,
      status: "pending",
      rejection_reason: "",
      uploaded_at: new Date().toISOString(),
      is_public: false,
    };
    if (existingIdx >= 0) store.documents[existingIdx] = doc;
    else store.documents.push(doc);
    return NextResponse.json(doc);
  }

  // ---- Applications ----
  if (method === "GET" && path === "/applications") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const items = store.applications.filter((a) => a.user_id === user.id);
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "POST" && (path === "/applications" || (pathParts.length === 2 && pathParts[0] === "apply"))) {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const pid = pathParts[0] === "apply" ? pathParts[1] : String(body.placement_id || "");
    const placement = store.placements.find((p) => p.id === pid);
    if (!placement) return jsonErr(404, "Placement not found");
    const existing = store.applications.find((a) => a.user_id === user.id && a.placement_id === pid);
    if (existing) return NextResponse.json(existing);

    const now = new Date().toISOString();
    const app: DbApplication = {
      id: uid("app"),
      user_id: user.id,
      placement_id: pid,
      status: "Submitted",
      statement: String(body.statement || ""),
      cover_letter: String(body.cover_letter || ""),
      cv_url: body.cv_url || null,
      github_url: body.github_url || null,
      linkedin_url: body.linkedin_url || null,
      portfolio_url: body.portfolio_url || null,
      academic_papers: Array.isArray(body.academic_papers) ? body.academic_papers : [],
      reference_1_name: String(body.reference_1_name || ""),
      reference_1_email: String(body.reference_1_email || ""),
      reference_1_phone: String(body.reference_1_phone || ""),
      reference_1_relationship: String(body.reference_1_relationship || ""),
      reference_2_name: String(body.reference_2_name || ""),
      reference_2_email: String(body.reference_2_email || ""),
      reference_2_phone: String(body.reference_2_phone || ""),
      reference_2_relationship: String(body.reference_2_relationship || ""),
      document_ids: Array.isArray(body.document_ids) ? body.document_ids : [],
      shortlisted: false,
      created_at: now,
      updated_at: now,
    };
    store.applications.unshift(app);
    placement.applicants += 1;
    return NextResponse.json(app, { status: 201 });
  }

  if (method === "POST" && pathParts.length === 3 && pathParts[0] === "applications" && pathParts[2] === "withdraw") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const app = store.applications.find((a) => a.id === pathParts[1] && a.user_id === user.id);
    if (!app) return jsonErr(404, "Application not found");
    app.status = "Withdrawn";
    app.updated_at = new Date().toISOString();
    return NextResponse.json(app);
  }

  if (method === "PATCH" && pathParts.length === 3 && pathParts[0] === "applications" && pathParts[2] === "shortlist") {
    const app = store.applications.find((a) => a.id === pathParts[1]);
    if (!app) return jsonErr(404, "Application not found");
    app.shortlisted = !app.shortlisted;
    app.updated_at = new Date().toISOString();
    return NextResponse.json(app);
  }

  // ---- Learning Resources & Student Learning ----
  if (path === "/learning-resources") {
    if (method === "GET") {
      const skill = sp.get("skill");
      const placementId = sp.get("placement_id");
      const items = store.learningResources.filter((r) => {
        if (skill && r.skill.toLowerCase() !== skill.toLowerCase()) return false;
        if (placementId && r.placement_id !== placementId) return false;
        return true;
      });
      return NextResponse.json({ total: items.length, items });
    }
    if (method === "POST") {
      const item = {
        id: uid("lr"),
        title: String(body.title || ""),
        url: String(body.url || ""),
        provider: String(body.provider || ""),
        description: String(body.description || ""),
        skill: String(body.skill || ""),
        placement_id: String(body.placement_id || ""),
        level: String(body.level || "Beginner"),
        resource_type: String(body.resource_type || "Course"),
        duration: String(body.duration || "2 hours"),
        created_at: new Date().toISOString().slice(0, 10),
      };
      store.learningResources.unshift(item);
      return NextResponse.json(item, { status: 201 });
    }
  }

  if (pathParts.length === 2 && pathParts[0] === "learning-resources") {
    const idx = store.learningResources.findIndex((r) => r.id === pathParts[1]);
    if (idx === -1) return jsonErr(404, "Learning resource not found");
    if (method === "PUT") {
      store.learningResources[idx] = { ...store.learningResources[idx], ...body };
      return NextResponse.json(store.learningResources[idx]);
    }
    if (method === "DELETE") {
      store.learningResources.splice(idx, 1);
      return new NextResponse(null, { status: 204 });
    }
  }

  if (method === "GET" && path === "/student/learning/profile") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const completed = store.completedModules.get(user.id) || new Set<string>();
    return NextResponse.json({
      user_id: user.id,
      completed_courses: completed.size > 0
        ? [{ course_id: "lr-1", course_name: "Figma Component Systems", completed_modules: 3, total_modules: 3, progress_percentage: 100, last_accessed: new Date().toISOString(), badge_earned: "Design Systems" }]
        : [],
      in_progress_courses: [
        { course_id: "lr-2", course_name: "SQL for Public Sector Data Analysis", completed_modules: completed.size, total_modules: 4, progress_percentage: Math.min(100, completed.size * 25), last_accessed: new Date().toISOString(), badge_earned: null },
      ],
      achievements: [],
      badges: [
        { id: "b-1", name: "First Verification", icon: "check", earned: true, earned_at: "2026-02-01" },
      ],
    });
  }

  if (method === "POST" && path === "/student/learning/complete-module") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const set = store.completedModules.get(user.id) || new Set<string>();
    set.add(`${body.course_id}:${body.module_id}`);
    store.completedModules.set(user.id, set);
    return NextResponse.json({ success: true });
  }

  // ---- Jobs Portal ----
  if (method === "GET" && path === "/jobs") {
    const items = store.jobs.map((j) => enrichJob(j, store));
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "GET" && path === "/jobs/saved") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    return NextResponse.json(store.savedJobs.get(user.id) || []);
  }

  if (method === "GET" && pathParts.length === 3 && pathParts[0] === "jobs" && pathParts[1] === "saved") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const list = store.savedJobs.get(user.id) || [];
    return NextResponse.json(list.includes(pathParts[2]));
  }

  if (method === "POST" && pathParts.length === 4 && pathParts[0] === "jobs" && pathParts[1] === "saved" && pathParts[3] === "toggle") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const jid = pathParts[2];
    const cur = store.savedJobs.get(user.id) || [];
    const exists = cur.includes(jid);
    store.savedJobs.set(user.id, exists ? cur.filter((x) => x !== jid) : [...cur, jid]);
    return NextResponse.json(!exists);
  }

  if (method === "GET" && path === "/jobs/my/applications") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const items = store.jobApplications.filter((a) => a.user_id === user.id);
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "GET" && pathParts.length === 2 && pathParts[0] === "jobs") {
    const job = store.jobs.find((j) => j.id === pathParts[1]);
    if (!job) return jsonErr(404, "Job not found");
    return NextResponse.json(enrichJob(job, store));
  }

  if (method === "POST" && pathParts.length === 3 && pathParts[0] === "jobs" && pathParts[2] === "apply") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const jid = pathParts[1];
    const job = store.jobs.find((j) => j.id === jid);
    if (!job) return jsonErr(404, "Job not found");
    const now = new Date().toISOString();
    const ja: DbJobApplication = {
      id: uid("ja"),
      user_id: user.id,
      job_id: jid,
      status: "Submitted",
      statement: String(body.statement || ""),
      cover_letter: String(body.cover_letter || ""),
      cv_url: body.cv_url || null,
      github_url: body.github_url || null,
      linkedin_url: body.linkedin_url || null,
      portfolio_url: body.portfolio_url || null,
      academic_papers: Array.isArray(body.academic_papers) ? body.academic_papers : [],
      reference_1_name: String(body.reference_1_name || ""),
      reference_1_email: String(body.reference_1_email || ""),
      reference_1_phone: String(body.reference_1_phone || ""),
      reference_1_relationship: String(body.reference_1_relationship || ""),
      reference_2_name: String(body.reference_2_name || ""),
      reference_2_email: String(body.reference_2_email || ""),
      reference_2_phone: String(body.reference_2_phone || ""),
      reference_2_relationship: String(body.reference_2_relationship || ""),
      document_ids: Array.isArray(body.document_ids) ? body.document_ids : [],
      shortlisted: false,
      created_at: now,
      updated_at: now,
    };
    store.jobApplications.unshift(ja);
    job.applicants += 1;
    return NextResponse.json(ja, { status: 201 });
  }

  if (method === "GET" && pathParts.length === 3 && pathParts[0] === "jobs" && pathParts[2] === "applicants") {
    const items = store.jobApplications.filter((a) => a.job_id === pathParts[1]);
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "PATCH" && pathParts.length === 4 && pathParts[0] === "jobs" && pathParts[1] === "applications" && pathParts[3] === "status") {
    const ja = store.jobApplications.find((a) => a.id === pathParts[2]);
    if (!ja) return jsonErr(404, "Job application not found");
    ja.status = String(body.status || ja.status);
    ja.updated_at = new Date().toISOString();
    return NextResponse.json(ja);
  }

  if (method === "POST" && pathParts.length === 4 && pathParts[0] === "jobs" && pathParts[1] === "applications" && pathParts[3] === "withdraw") {
    const ja = store.jobApplications.find((a) => a.id === pathParts[2]);
    if (!ja) return jsonErr(404, "Job application not found");
    ja.status = "Withdrawn";
    ja.updated_at = new Date().toISOString();
    return NextResponse.json(ja);
  }

  if (method === "PATCH" && pathParts.length === 4 && pathParts[0] === "jobs" && pathParts[1] === "applications" && pathParts[3] === "shortlist") {
    const ja = store.jobApplications.find((a) => a.id === pathParts[2]);
    if (!ja) return jsonErr(404, "Job application not found");
    ja.shortlisted = !ja.shortlisted;
    ja.updated_at = new Date().toISOString();
    return NextResponse.json(ja);
  }

  // ---- Organization (Employer) ----
  if (method === "GET" && pathParts.length === 3 && pathParts[0] === "organization" && pathParts[1] === "public") {
    const org = store.orgs.find((o) => o.id === pathParts[2]);
    if (!org) return jsonErr(404, "Organization not found");
    return NextResponse.json(org);
  }

  if (path === "/organization/profile") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const org = store.orgs.find((o) => o.id === user.org_id) || store.orgs[3];
    if (method === "GET") return NextResponse.json(org);
    if (method === "PATCH") {
      Object.assign(org, body);
      return NextResponse.json(org);
    }
  }

  if (path === "/organization/internships") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const orgId = user.org_id || "o4";
    if (method === "GET") {
      const items = store.placements
        .filter((p) => p.org_id === orgId)
        .map((p) => enrichPlacement(p, store));
      return NextResponse.json({ total: items.length, items });
    }
    if (method === "POST") {
      const p: DbPlacement = {
        id: uid("p"),
        title: String(body.title || "New Placement"),
        org_id: orgId,
        courses: Array.isArray(body.courses) ? body.courses : ["Computer Science"],
        grade: String(body.grade || "CGPA 3.0+"),
        loc: String(body.loc || "Kampala"),
        mode: String(body.mode || "On-site"),
        duration: String(body.duration || "6 months"),
        stipend: String(body.stipend || "Unpaid"),
        deadline: String(body.closes_at || "2027-06-01"),
        slots: Number(body.slots || 2),
        status: "Open",
        applicants: 0,
        docs: Array.isArray(body.docs) ? body.docs : ["Transcript"],
        testimonial: Boolean(body.testimonial),
        about: String(body.about || ""),
        duties: Array.isArray(body.duties) ? body.duties : [],
        review_status: "approved",
        published_at: String(body.published_at || new Date().toISOString().slice(0, 10)),
        closes_at: String(body.closes_at || "2027-06-01"),
        starts_at: String(body.starts_at || "2027-07-01"),
        requirements: Array.isArray(body.requirements) ? body.requirements : [],
        review_reason: "",
        opportunity_type: String(body.opportunity_type || "internship"),
        duration_hours: body.duration_hours ?? null,
        budget_range: body.budget_range ?? null,
        milestones: body.milestones ?? null,
        remote_ok: body.remote_ok ?? null,
        salary_range: body.salary_range ?? null,
        probation_period: body.probation_period ?? null,
        training_included: body.training_included ?? null,
        career_path: body.career_path ?? null,
        skills_required: body.skills_required ?? null,
      };
      store.placements.unshift(p);
      return NextResponse.json(enrichPlacement(p, store), { status: 201 });
    }
  }

  if (path === "/organization/jobs") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const orgId = user.org_id || "o4";
    if (method === "GET") {
      const items = store.jobs.filter((j) => j.org_id === orgId).map((j) => enrichJob(j, store));
      return NextResponse.json({ total: items.length, items });
    }
    if (method === "POST") {
      const job: DbJob = {
        id: uid("j"),
        title: String(body.title || "New Role"),
        org_id: orgId,
        loc: String(body.loc || "Remote"),
        mode: String(body.mode || "Remote"),
        employment_type: String(body.employment_type || "Full time"),
        salary: String(body.salary || "Competitive"),
        closes_at: String(body.closes_at || "2027-06-01"),
        summary: String(body.summary || ""),
        requirements: Array.isArray(body.requirements) ? body.requirements : [],
        status: "Open",
        review_status: "approved",
        published_at: new Date().toISOString().slice(0, 10),
        review_reason: "",
        applicants: 0,
      };
      store.jobs.unshift(job);
      return NextResponse.json(enrichJob(job, store), { status: 201 });
    }
  }

  if (method === "GET" && path === "/organization/shortlisted") {
    return NextResponse.json(store.applications.filter((a) => a.shortlisted));
  }

  if (method === "GET" && path === "/organization/shortlisted/jobs") {
    return NextResponse.json(store.jobApplications.filter((a) => a.shortlisted));
  }

  if (method === "GET" && pathParts.length === 4 && pathParts[0] === "organization" && pathParts[1] === "applicants" && pathParts[3] === "detail") {
    const appId = pathParts[2];
    const app = store.applications.find((a) => a.id === appId);
    if (!app) return jsonErr(404, "Application not found");
    const student = store.users.find((u) => u.id === app.user_id);
    const prof = store.profiles.get(app.user_id) || defaultProfile(app.user_id);
    const pl = store.placements.find((p) => p.id === app.placement_id);
    const match = pl ? matchPlacement(pl, prof.skills, prof.course, prof.cgpa, prof.skills_confidence) : null;
    return NextResponse.json({
      application_id: app.id,
      application_type: "internship",
      status: app.status,
      statement: app.statement,
      cover_letter: app.cover_letter,
      cv_url: app.cv_url,
      github_url: app.github_url,
      linkedin_url: app.linkedin_url,
      portfolio_url: app.portfolio_url,
      academic_papers: app.academic_papers,
      reference_1_name: app.reference_1_name,
      reference_1_email: app.reference_1_email,
      reference_1_phone: app.reference_1_phone,
      reference_1_relationship: app.reference_1_relationship,
      reference_2_name: app.reference_2_name,
      reference_2_email: app.reference_2_email,
      reference_2_phone: app.reference_2_phone,
      reference_2_relationship: app.reference_2_relationship,
      document_ids: app.document_ids,
      shortlisted: app.shortlisted,
      created_at: app.created_at,
      updated_at: app.updated_at,
      student_id: app.user_id,
      student_name: student?.name || "Student",
      student_email: student?.email || "",
      student_course: prof.course,
      student_year: prof.year,
      student_cgpa: prof.cgpa,
      student_university: prof.university,
      student_skills: prof.skills,
      talent_search_opt_in: prof.talent_search_opt_in,
      placement_id: pl?.id || null,
      placement_title: pl?.title || null,
      placement_opportunity_type: pl?.opportunity_type || null,
      job_id: null,
      job_title: null,
      documents: store.documents.filter((d) => d.user_id === app.user_id),
      match_score: match
        ? {
            score: match.score,
            matched_skills: match.matched,
            missing_skills: match.missing,
            course_fit: match.course_fit,
            grade_fit: match.grade_fit,
          }
        : null,
    });
  }

  if (method === "POST" && path === "/organization/talent-search") {
    const skills: string[] = Array.isArray(body.skills) ? body.skills : [];
    const course = body.course ? String(body.course) : "";
    const results = Array.from(store.profiles.values()).filter((p) => {
      if (!p.talent_search_opt_in) return false;
      if (course && p.course !== course) return false;
      if (skills.length && !skills.some((s) => p.skills.includes(s))) return false;
      return true;
    });
    return NextResponse.json(results);
  }

  if (method === "GET" && path === "/organization/talent-search/courses") {
    return NextResponse.json(Array.from(new Set(Array.from(store.profiles.values()).map((p) => p.course))));
  }
  if (method === "GET" && path === "/organization/talent-search/locations") {
    return NextResponse.json(["Kampala", "Nairobi", "Remote"]);
  }
  if (method === "GET" && path === "/organization/talent-search/universities") {
    return NextResponse.json(Array.from(new Set(Array.from(store.profiles.values()).map((p) => p.university))));
  }

  if (path === "/organization/members") {
    const user = getCurrentUser(req, store);
    const orgId = user?.org_id || "o4";
    const items = store.orgMembers.get(orgId) || [];
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "POST" && path === "/organization/members/invite") {
    const user = getCurrentUser(req, store);
    const orgId = user?.org_id || "o4";
    const list = store.orgMembers.get(orgId) || [];
    const member = {
      id: uid("mem"),
      org_id: orgId,
      user_id: uid("u"),
      user_name: String(body.email || "Invited Member").split("@")[0],
      user_email: String(body.email || ""),
      role: String(body.role || "member"),
      invited_by: user?.id || null,
      invited_at: new Date().toISOString(),
      joined_at: null,
      status: "invited",
      created_at: new Date().toISOString(),
      updated_at: null,
    };
    list.push(member);
    store.orgMembers.set(orgId, list);
    return NextResponse.json({ member, message: "Invitation sent" }, { status: 201 });
  }

  if (method === "GET" && path === "/organization/analytics/hiring-funnel") {
    const user = getCurrentUser(req, store);
    const orgId = user?.org_id || "o4";
    const orgPlacements = store.placements.filter((p) => p.org_id === orgId);
    return NextResponse.json({
      organization_id: orgId,
      period_start: sp.get("period_start") || "2026-01-01",
      period_end: sp.get("period_end") || "2026-12-31",
      total_postings: orgPlacements.length,
      total_applications: store.applications.length,
      applications_by_status: { Submitted: 1, "In Review": 1 },
      applications_by_type: { internship: orgPlacements.length },
      stages: [
        { stage: "Applied", count: 42, conversion_rate: 100, avg_days_in_stage: 1.5 },
        { stage: "Shortlisted", count: 14, conversion_rate: 33.3, avg_days_in_stage: 3.0 },
        { stage: "Accepted", count: 4, conversion_rate: 9.5, avg_days_in_stage: 5.0 },
      ],
      avg_time_to_hire_days: 9.5,
      top_skills_in_demand: [{ skill: "Figma", count: 4 }, { skill: "UI Design", count: 3 }],
      conversion_by_posting: orgPlacements.map((p) => ({
        placement_id: p.id,
        placement_title: p.title,
        opportunity_type: p.opportunity_type,
        total_applications: p.applicants,
        accepted: 1,
        conversion_rate: p.applicants ? Math.round((1 / p.applicants) * 100) : 0,
      })),
    });
  }

  // ---- Admin ----
  if (method === "GET" && path === "/admin/metrics") {
    const open = store.placements.filter((p) => p.review_status === "approved" && p.status === "Open").length;
    const pendingDocs = store.documents.filter((d) => d.status === "pending").length;
    const verifiedDocs = store.documents.filter((d) => d.status === "verified").length;
    const orgTypes: Record<string, number> = {};
    for (const o of store.orgs) orgTypes[o.type] = (orgTypes[o.type] || 0) + 1;
    const usersByRole: Record<string, number> = {};
    for (const u of store.users) usersByRole[u.role] = (usersByRole[u.role] || 0) + 1;
    return NextResponse.json({
      open_placements: open,
      pending_documents: pendingDocs,
      students_placed: store.applications.filter((a) => a.status === "Accepted").length,
      placement_record_complete: 68,
      total_users: store.users.length,
      users_by_role: usersByRole,
      total_organizations: store.orgs.length,
      total_applications: store.applications.length,
      total_revenue_cents: 9000,
      verification_rate: store.documents.length ? Math.round((verifiedDocs / store.documents.length) * 1000) / 10 : 100,
      org_types: orgTypes,
    });
  }

  if (method === "GET" && path === "/admin/queue") {
    const items = store.applications.map((a) => {
      const u = store.users.find((x) => x.id === a.user_id);
      const pl = store.placements.find((x) => x.id === a.placement_id);
      const prof = store.profiles.get(a.user_id);
      const verifiedCount = store.documents.filter((d) => d.user_id === a.user_id && d.status === "verified").length;
      const reqCount = pl?.docs.length || 3;
      return {
        n: u?.name || "Student",
        i: (u?.name || "ST").slice(0, 2).toUpperCase(),
        c: prof?.course || "Design",
        y: prof?.year || "Year 3",
        p: pl?.title || "Placement",
        d: `${verifiedCount} of ${reqCount}`,
        st: verifiedCount >= reqCount ? "Ready" : "Review",
      };
    });
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "GET" && path === "/admin/activity") {
    return NextResponse.json([
      { who: "Ministry of ICT", action: "posted 2 placements", time: "today, 09:12" },
      { who: "Amina Nakato", action: "uploaded Portfolio", time: "today, 08:40" },
      { who: "Lumen Labs", action: "shortlisted 1 candidate", time: "yesterday" },
    ]);
  }

  if (method === "GET" && path === "/admin/internships/review") {
    const items = store.placements
      .filter((p) => p.review_status === "pending_review")
      .map((p) => enrichPlacement(p, store));
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "PATCH" && pathParts.length === 4 && pathParts[0] === "admin" && pathParts[1] === "internships" && pathParts[3] === "review") {
    const p = store.placements.find((x) => x.id === pathParts[2]);
    if (!p) return jsonErr(404, "Placement not found");
    p.review_status = String(body.decision || "approved");
    p.review_reason = String(body.reason || "");
    return NextResponse.json(enrichPlacement(p, store));
  }

  if (method === "GET" && path === "/admin/placements") {
    const items = store.placements.map((p) => enrichPlacement(p, store));
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "PATCH" && pathParts.length === 4 && pathParts[0] === "admin" && pathParts[1] === "placements") {
    const p = store.placements.find((x) => x.id === pathParts[2]);
    if (!p) return jsonErr(404, "Placement not found");
    if (pathParts[3] === "close") p.status = "Closed";
    if (pathParts[3] === "reopen") p.status = "Open";
    return NextResponse.json(enrichPlacement(p, store));
  }

  if (method === "GET" && path === "/admin/documents") {
    const st = sp.get("status");
    const items = st ? store.documents.filter((d) => d.status === st) : store.documents;
    return NextResponse.json(items);
  }

  if (method === "PATCH" && pathParts.length === 4 && pathParts[0] === "admin" && pathParts[1] === "documents") {
    const doc = store.documents.find((d) => d.id === pathParts[2]);
    if (!doc) return jsonErr(404, "Document not found");
    if (pathParts[3] === "verify") {
      doc.status = String(body.status || "verified");
      doc.rejection_reason = String(body.rejection_reason || "");
    } else if (pathParts[3] === "public") {
      doc.is_public = Boolean(body.is_public);
    }
    return NextResponse.json(doc);
  }

  if (method === "GET" && path === "/admin/applications") {
    const items = store.applications.map((a) => {
      const u = store.users.find((x) => x.id === a.user_id);
      const pl = store.placements.find((x) => x.id === a.placement_id);
      return {
        ...a,
        user_name: u?.name || "Student",
        user_email: u?.email || "",
        placement_title: pl?.title || "",
        type: "internship",
      };
    });
    return NextResponse.json({ total: items.length, items });
  }

  if (method === "GET" && path === "/admin/action-logs") {
    return NextResponse.json({ total: store.actionLogs.length, items: store.actionLogs });
  }

  if (method === "GET" && path === "/admin/organizations") {
    return NextResponse.json({ total: store.orgs.length, items: store.orgs });
  }

  if (method === "GET" && pathParts.length === 3 && pathParts[0] === "admin" && pathParts[1] === "organizations") {
    const org = store.orgs.find((o) => o.id === pathParts[2]);
    if (!org) return jsonErr(404, "Organization not found");
    const activePlacements = store.placements.filter((p) => p.org_id === org.id && p.status === "Open").length;
    return NextResponse.json({
      organization: org,
      stats: { placements: activePlacements },
      active_placements: activePlacements,
      total_hired: 3,
      total_revenue_cents: 3000,
      compliance_score: 98,
      active_postings: activePlacements,
      subscription: { plan: "Pro", billing: "monthly", seats: 3, status: "active" },
      billing_email: org.billing_email || undefined,
      tax_id: org.tax_id || undefined,
    });
  }

  if (method === "PATCH" && pathParts.length === 4 && pathParts[0] === "admin" && pathParts[1] === "organizations" && pathParts[3] === "sanction") {
    const org = store.orgs.find((o) => o.id === pathParts[2]);
    if (!org) return jsonErr(404, "Organization not found");
    org.is_active = body.action === "unsuspend";
    return NextResponse.json({ organization: org, action: body.action, reason: body.reason || "", message: "Updated" });
  }

  if (method === "GET" && path === "/admin/users") {
    return NextResponse.json({ total: store.users.length, items: store.users });
  }

  if (method === "GET" && pathParts.length === 3 && pathParts[0] === "admin" && pathParts[1] === "users") {
    const u = store.users.find((x) => x.id === pathParts[2]);
    if (!u) return jsonErr(404, "User not found");
    return NextResponse.json({
      user: u,
      stats: {},
      applications_count: store.applications.filter((a) => a.user_id === u.id).length,
      documents_count: store.documents.filter((d) => d.user_id === u.id).length,
      testimonials_count: 0,
      applications: [],
      documents: [],
      testimonials: [],
      subscription: null,
    });
  }

  if (method === "PATCH" && pathParts.length === 4 && pathParts[0] === "admin" && pathParts[1] === "users" && pathParts[3] === "action") {
    const u = store.users.find((x) => x.id === pathParts[2]);
    if (!u) return jsonErr(404, "User not found");
    if (body.action === "suspend") u.is_active = false;
    if (body.action === "activate") u.is_active = true;
    if (body.action === "change_role" && body.new_role) u.role = String(body.new_role);
    return NextResponse.json({ user: u, action: body.action, reason: body.reason || "", message: "Updated" });
  }

  if (method === "POST" && path.startsWith("/admin/reports/")) {
    return NextResponse.json({ total: 0, items: [], summary: {} });
  }

  if (method === "GET" && path === "/admin/analytics/hiring-funnel") {
    return NextResponse.json({
      period_start: sp.get("period_start") || "2026-01-01",
      period_end: sp.get("period_end") || "2026-12-31",
      total_organizations: store.orgs.length,
      total_postings: store.placements.length,
      total_applications: store.applications.length,
      applications_by_type: { internship: store.applications.length },
      applications_by_status: { "In Review": store.applications.length },
      overall_stages: [
        { stage: "Applied", count: 120, conversion_rate: 100, avg_days_in_stage: 1.2 },
        { stage: "Verified", count: 94, conversion_rate: 78.3, avg_days_in_stage: 2.0 },
        { stage: "Accepted", count: 31, conversion_rate: 25.8, avg_days_in_stage: 4.1 },
      ],
      avg_time_to_hire_days: 7.3,
      top_organizations_by_hires: [{ organization_id: "o4", organization_name: "Lumen Labs", hires: 6 }],
      top_skills_platform: [{ skill: "Figma", count: 14 }, { skill: "SQL", count: 12 }],
      conversion_by_org_type: { Company: 28, Government: 22, NGO: 25 },
      conversion_by_opportunity_type: { internship: 26, gig: 32, entry_level: 19 },
    });
  }

  if (path.includes("/export/") && path.endsWith(".csv")) {
    return new NextResponse("id,title,status\n", {
      status: 200,
      headers: { "Content-Type": "text/csv" },
    });
  }

  // ---- Billing ----
  if (method === "GET" && path === "/billing/gateways") {
    return NextResponse.json({
      sandbox_mode: true,
      gateways: [
        { id: "stripe", name: "Stripe (Cards)", currencies: ["USD", "EUR", "GBP", "UGX", "KES"] },
        { id: "paypal", name: "PayPal", currencies: ["USD", "EUR", "GBP"] },
        { id: "flutterwave", name: "Flutterwave (Africa)", currencies: ["USD", "UGX", "KES", "NGN"] },
        { id: "mpesa", name: "M-Pesa", currencies: ["KES", "USD"] },
        { id: "bank_transfer", name: "Bank Transfer", currencies: ["USD", "UGX", "EUR"] },
        { id: "crypto", name: "Crypto (USDC/USDT)", currencies: ["USD"] },
      ],
    });
  }

  if (path.startsWith("/billing/subscriptions")) {
    const user = getCurrentUser(req, store);
    const orgId = sp.get("org_id") || user?.org_id || "o4";
    const cur = store.subscriptions.get(orgId) || {
      org_id: orgId,
      plan: "Free",
      billing_cycle: "",
      payment_gateway: "",
      seats: 1,
      since: "",
      status: "active",
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
      is_premium: false,
    };

    if (method === "GET" && path === "/billing/subscriptions/current") {
      return NextResponse.json(cur);
    }
    if (method === "POST" && path === "/billing/subscriptions") {
      const next: DbSubscription = {
        org_id: orgId,
        plan: String(body.plan || "Pro"),
        billing_cycle: String(body.billing_cycle || "monthly"),
        payment_gateway: String(body.payment_gateway || "stripe"),
        seats: 3,
        since: new Date().toISOString().slice(0, 10),
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
        cancel_at_period_end: false,
        is_premium: body.plan !== "Free",
      };
      store.subscriptions.set(orgId, next);
      return NextResponse.json(next);
    }
    if (method === "PATCH" && path === "/billing/subscriptions/current") {
      if (body.plan) {
        cur.plan = String(body.plan);
        cur.is_premium = cur.plan !== "Free";
      }
      if (body.billing_cycle) cur.billing_cycle = String(body.billing_cycle);
      store.subscriptions.set(orgId, cur);
      return NextResponse.json(cur);
    }
    if (method === "POST" && path === "/billing/subscriptions/current/cancel") {
      cur.cancel_at_period_end = true;
      store.subscriptions.set(orgId, cur);
      return NextResponse.json(cur);
    }
    if (method === "POST" && path === "/billing/subscriptions/current/resume") {
      cur.cancel_at_period_end = false;
      cur.status = "active";
      store.subscriptions.set(orgId, cur);
      return NextResponse.json(cur);
    }
  }

  if (method === "POST" && path === "/billing/checkout/preview") {
    const cycle = body.billing_cycle === "annual" ? "annual" : "monthly";
    const subtotal = cycle === "annual" ? 30000 : 3000;
    return NextResponse.json({
      plan: body.plan || "Pro",
      billing_cycle: cycle,
      payment_gateway: body.payment_gateway || "stripe",
      currency: "USD",
      period: cycle,
      line_items: [{ description: `${body.plan || "Pro"} (${cycle})`, quantity: 1, unit_amount_cents: subtotal, amount_cents: subtotal }],
      subtotal_cents: subtotal,
      tax_cents: 0,
      total_cents: subtotal,
      gateway: body.payment_gateway || "stripe",
      supported_currencies: ["USD", "EUR", "UGX", "KES"],
    });
  }

  if (method === "POST" && path === "/billing/checkout") {
    const user = getCurrentUser(req, store);
    const orgId = user?.org_id || "o4";
    const sub: DbSubscription = {
      org_id: orgId,
      plan: String(body.plan || "Pro"),
      billing_cycle: String(body.billing_cycle || "monthly"),
      payment_gateway: String(body.payment_gateway || "stripe"),
      seats: 3,
      since: new Date().toISOString().slice(0, 10),
      status: "active",
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
      cancel_at_period_end: false,
      is_premium: true,
    };
    store.subscriptions.set(orgId, sub);
    return NextResponse.json({ subscription: sub, invoice: null, transaction: null, replayed: false });
  }

  if (path.startsWith("/billing/payment-methods")) {
    const user = getCurrentUser(req, store);
    const orgId = user?.org_id || "o4";
    const list = store.paymentMethods.get(orgId) || [];
    if (method === "GET") return NextResponse.json(list);
    if (method === "POST" && path === "/billing/payment-methods") {
      const pm = {
        id: uid("pm"),
        org_id: orgId,
        type: String(body.type || "card"),
        details: body.details || { sandbox: true },
        is_default: list.length === 0,
        gateway_payment_method_id: uid("gw"),
        created_at: new Date().toISOString(),
      };
      list.unshift(pm);
      store.paymentMethods.set(orgId, list);
      return NextResponse.json(pm, { status: 201 });
    }
    if (method === "DELETE" && pathParts.length === 3) {
      store.paymentMethods.set(orgId, list.filter((m) => m.id !== pathParts[2]));
      return NextResponse.json({ message: "Removed" });
    }
  }

  if (method === "GET" && path === "/billing/invoices") return NextResponse.json(store.invoices);
  if (method === "GET" && path === "/billing/transactions") return NextResponse.json(store.transactions);

  if (method === "GET" && path === "/billing/usage") {
    const user = getCurrentUser(req, store);
    const orgId = user?.org_id || "o4";
    const sub = store.subscriptions.get(orgId);
    const count = store.placements.filter((p) => p.org_id === orgId).length;
    const isPro = sub && sub.plan !== "Free";
    return NextResponse.json({
      plan: sub?.plan || "Free",
      billing_cycle: sub?.billing_cycle || "monthly",
      status: sub?.status || "active",
      current_period_start: sub?.current_period_start || null,
      current_period_end: sub?.current_period_end || null,
      seats: sub?.seats || 1,
      current_placements: count,
      placement_limit: isPro ? 999 : 3,
      remaining_placements: isPro ? null : Math.max(0, 3 - count),
    });
  }

  if (method === "GET" && path === "/billing/student/usage") {
    const user = getCurrentUser(req, store);
    const appsCount = user ? store.applications.filter((a) => a.user_id === user.id).length : 0;
    const plan = user ? store.studentPlans.get(user.id) : undefined;
    return NextResponse.json({
      id: "su-1",
      month: new Date().toISOString().slice(0, 7),
      application_count: appsCount,
      billed_count: 0,
      last_billed_at: null,
      free_limit: 30,
      application_limit: plan?.application_limit ?? 30,
      plan: plan?.plan ?? "Free",
      subscription_status: plan?.status ?? "free",
      price_cents: plan?.price_cents ?? 0,
      checkout_enabled: true,
      current_period_start: plan?.current_period_start ?? null,
      current_period_end: plan?.current_period_end ?? null,
      cancel_at_period_end: plan?.cancel_at_period_end ?? false,
      overage_apps: 0,
      overage_cents: 0,
      unpaid_invoice_id: null,
    });
  }

  if (method === "GET" && path === "/billing/student/invoices") {
    const user = getCurrentUser(req, store);
    return NextResponse.json(user ? store.studentInvoices.get(user.id) || [] : []);
  }

  if (method === "POST" && path === "/billing/student/checkout") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const plan = {
      plan: "Student Plus",
      status: "active",
      billing_cycle: "monthly",
      application_limit: 100,
      price_cents: 500,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString(),
      cancel_at_period_end: false,
    };
    store.studentPlans.set(user.id, plan);
    return NextResponse.json({ plan, invoice: {}, transaction: {} });
  }

  if (method === "GET" && path === "/billing/admin/revenue") {
    return NextResponse.json({
      total_revenue_cents: 9000,
      total_revenue_usd: 90,
      period: { start: "2026-01-01", end: "2026-12-31" },
      by_gateway: [{ gateway: "stripe", count: 3, revenue_cents: 9000, revenue_usd: 90 }],
      by_plan: [{ plan: "Pro", subscriptions: 1 }],
    });
  }
  if (method === "GET" && path === "/billing/admin/invoices") return NextResponse.json([]);
  if (method === "GET" && path === "/billing/admin/transactions") return NextResponse.json([]);
  if (method === "GET" && path === "/billing/admin/stats") {
    return NextResponse.json({
      total_students: store.users.filter((u) => u.role === "student").length,
      active_subscriptions: store.subscriptions.size,
      total_revenue_cents: 9000,
      overage_revenue_cents: 0,
      collection_rate: 100,
    });
  }

  // ---- Advisor (grounded career coach) ----
  if (method === "POST" && path === "/advisor") {
    const skills: string[] = Array.isArray(body.skills) ? body.skills : [];
    const course = String(body.course || "");
    const cgpa = Number(body.cgpa || 0);
    const msg = String(body.message || "").toLowerCase();

    const ranked = store.placements
      .map((p) => ({ p, m: matchPlacement(p, skills, course, cgpa) }))
      .sort((a, b) => b.m.score - a.m.score);

    const top = ranked[0];
    let reply = "";
    if (msg.includes("learn") || msg.includes("skill") || msg.includes("gap")) {
      const missing = top?.m.missing || [];
      reply = missing.length
        ? `For **${top.p.title}**, adding **${missing.join(", ")}** will lift your match score right away.`
        : `You already cover the core required skills for **${top?.p.title || "your top match"}**!`;
    } else if (top) {
      const org = store.orgs.find((o) => o.id === top.p.org_id);
      reply = `Based on your profile (${course || "your course"}, CGPA ${cgpa || "—"}), your strongest match is **${top.p.title} at ${org?.name || "the host organisation"}** (${top.m.score}% match, closes ${top.p.deadline}).`;
    } else {
      reply = "Ask me about eligibility, skill gaps, deadlines, or which placements fit your profile best.";
    }
    return NextResponse.json({ reply, actions: [] });
  }

  // ---- Chat / Messaging ----
  if (method === "GET" && path === "/chat/threads") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const threads = store.chatGroups.map((g) => {
      const last = g.messages[g.messages.length - 1] || null;
      return {
        id: g.id,
        kind: "group",
        title: g.name,
        type: g.type,
        description: g.description,
        initials: g.name.slice(0, 2).toUpperCase(),
        subtitle: `${g.member_ids.length} members`,
        member_count: g.member_ids.length,
        my_role: "member",
        unread_count: 0,
        last_message: last
          ? {
              id: last.id,
              content: last.content,
              type: last.type,
              sender_id: last.sender_id,
              sender_name: last.sender_name,
              created_at: last.created_at,
              is_mine: last.sender_id === user.id,
            }
          : null,
        last_activity: last?.created_at || new Date().toISOString(),
      };
    });
    return NextResponse.json({ threads });
  }

  if (method === "GET" && path === "/chat/groups") {
    return NextResponse.json({ groups: store.chatGroups });
  }

  if (method === "GET" && path === "/chat/direct") {
    return NextResponse.json({ chats: [] });
  }

  if (method === "GET" && path === "/chat/contacts") {
    const user = getCurrentUser(req, store);
    const contacts = store.users
      .filter((u) => u.id !== user?.id)
      .map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        initials: u.name.slice(0, 2).toUpperCase(),
      }));
    return NextResponse.json({ contacts });
  }

  if (pathParts.length === 4 && pathParts[0] === "chat" && pathParts[1] === "groups" && pathParts[3] === "messages") {
    const g = store.chatGroups.find((x) => x.id === pathParts[2]);
    if (!g) return jsonErr(404, "Group not found");
    if (method === "GET") return NextResponse.json({ messages: g.messages });
    if (method === "POST") {
      const user = getCurrentUser(req, store);
      if (!user) return jsonErr(401, "Not authenticated");
      const msg = {
        id: uid("cm"),
        group_id: g.id,
        sender_id: user.id,
        recipient_id: null,
        type: String(body.type || "text"),
        content: String(body.content || ""),
        original_language: "en",
        duration_seconds: null,
        file_name: null,
        file_size: null,
        mime_type: null,
        created_at: new Date().toISOString(),
        updated_at: null,
        deleted_at: null,
        is_edited: false,
        reply_to_id: null,
        translations: {},
        translated_content: null,
        sender_name: user.name,
      };
      g.messages.push(msg);
      return NextResponse.json({ message: msg }, { status: 201 });
    }
  }

  if (method === "GET" && pathParts.length === 4 && pathParts[0] === "chat" && pathParts[1] === "groups" && pathParts[3] === "members") {
    const g = store.chatGroups.find((x) => x.id === pathParts[2]);
    if (!g) return jsonErr(404, "Group not found");
    const participants = g.member_ids.map((id) => {
      const u = store.users.find((x) => x.id === id);
      return {
        id: `${g.id}-${id}`,
        group_id: g.id,
        user_id: id,
        role: "member",
        joined_at: "2026-01-15T00:00:00Z",
        is_muted: false,
        name: u?.name || "Member",
        initials: (u?.name || "MB").slice(0, 2).toUpperCase(),
      };
    });
    return NextResponse.json({ participants });
  }

  if (method === "POST" && path === "/chat/groups") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const g = {
      id: uid("cg"),
      name: String(body.name || "New Group"),
      type: String(body.type || "mixed"),
      description: String(body.description || ""),
      member_ids: Array.from(new Set([user.id, ...(Array.isArray(body.member_ids) ? body.member_ids : [])])),
      messages: [],
    };
    store.chatGroups.push(g);
    return NextResponse.json({
      group: {
        id: g.id,
        kind: "group",
        title: g.name,
        type: g.type,
        description: g.description,
        initials: g.name.slice(0, 2).toUpperCase(),
        subtitle: `${g.member_ids.length} members`,
        member_count: g.member_ids.length,
        my_role: "owner",
        unread_count: 0,
        last_message: null,
        last_activity: new Date().toISOString(),
      },
    });
  }

  if (method === "POST" && path.startsWith("/chat/threads/") && path.endsWith("/read")) {
    return NextResponse.json({ ok: true });
  }

  if (pathParts.length === 3 && pathParts[0] === "chat" && pathParts[1] === "direct") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const otherId = pathParts[2];
    if (method === "GET") {
      const messages = store.directMessages.filter(
        (m) =>
          (m.sender_id === user.id && m.recipient_id === otherId) ||
          (m.sender_id === otherId && m.recipient_id === user.id)
      );
      return NextResponse.json({ messages });
    }
  }

  if (method === "POST" && path === "/chat/direct") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const msg = {
      id: uid("dm"),
      group_id: null,
      sender_id: user.id,
      recipient_id: String(body.recipient_id || ""),
      type: String(body.type || "text"),
      content: String(body.content || ""),
      original_language: "en",
      duration_seconds: null,
      file_name: null,
      file_size: null,
      mime_type: null,
      created_at: new Date().toISOString(),
      updated_at: null,
      deleted_at: null,
      is_edited: false,
      reply_to_id: null,
      translations: {},
      translated_content: null,
      sender_name: user.name,
    };
    store.directMessages.push(msg);
    return NextResponse.json({ message: msg }, { status: 201 });
  }

  return jsonErr(404, `Endpoint not found: ${method} ${path}`);
}
