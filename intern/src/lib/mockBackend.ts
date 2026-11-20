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
  { name: "AutoCAD", category: "Engineering", keywords: ["autocad", "cad", "civil 3d", "revit", "drafting"] },
  { name: "Civil & Structural Design", category: "Engineering", keywords: ["structural", "hydraulics", "water network", "surveying"] },
  { name: "Networking & Telecoms", category: "Engineering", keywords: ["cisco", "ccna", "telecom", "fiber", "networking", "rf"] },
  { name: "GIS & Mapping", category: "Data", keywords: ["gis", "qgis", "arcgis", "geospatial", "mapping"] },
  { name: "Accounting & Tax", category: "Finance", keywords: ["accounting", "cpa", "efris", "ura", "tax", "ifrs", "bookkeeping"] },
  { name: "Financial Modelling", category: "Finance", keywords: ["financial model", "valuation", "budgeting", "credit analysis"] },
  { name: "Procurement & PPDA", category: "Operations", keywords: ["procurement", "ppda", "tendering", "supply chain", "logistics"] },
  { name: "Legal Research", category: "Law", keywords: ["legal research", "case law", "statute", "judiciary", "ldc"] },
  { name: "Contract Drafting", category: "Law", keywords: ["contract", "legal drafting", "mou", "compliance"] },
  { name: "Agribusiness", category: "Agriculture", keywords: ["agribusiness", "value chain", "dairy", "cold chain", "cooperatives"] },
  { name: "Field Agronomy", category: "Agriculture", keywords: ["agronomy", "crop", "soil", "extension"] },
  { name: "Clinical Data", category: "Health", keywords: ["dhis2", "epidemiology", "clinical data", "hmis"] },
  { name: "Curriculum Design", category: "Education", keywords: ["curriculum", "pedagogy", "training module", "facilitation"] },
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
  p15: ["Accounting & Tax", "Excel", "Financial Modelling", "Report Writing"],
  p16: ["AutoCAD", "Civil & Structural Design", "GIS & Mapping", "Report Writing"],
  p17: ["Networking & Telecoms", "Python", "APIs", "SQL"],
  p18: ["TypeScript", "React", "Node.js", "APIs", "Git"],
  p19: ["Legal Research", "Contract Drafting", "Policy Analysis", "Report Writing"],
  p20: ["Agribusiness", "Field Agronomy", "Excel", "Stakeholder Engagement"],
  p21: ["Clinical Data", "Patient Records", "Health Informatics", "Data Cleaning"],
  p22: ["Financial Modelling", "Accounting & Tax", "Excel", "Communication"],
  p23: ["Curriculum Design", "Communication", "Stakeholder Engagement", "Teamwork"],
  p24: ["GIS & Mapping", "Data Cleaning", "Dashboards", "Report Writing"],
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
    owner_id: string;
    is_active: boolean;
    member_ids: string[];
    member_roles: Record<string, string>;
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
  threadReadAt: Map<string, Record<string, string>>;
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
    { id: "o11", name: "Uganda Revenue Authority", type: "Government", sector: "Revenue & tax administration", loc: "Kampala", seal: "URA", about: "National tax administration body overseeing domestic revenue, customs, EFRIS compliance and fiscal analysis across Uganda.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-29", is_active: true },
    { id: "o12", name: "Centenary Bank Uganda", type: "Company", sector: "Banking & microfinance", loc: "Mbarara", seal: "CBL", about: "Leading commercial and microfinance bank serving SMEs, agribusinesses and households across every region of Uganda.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-01-30", is_active: true },
    { id: "o13", name: "MTN Uganda", type: "Company", sector: "Telecommunications & fintech", loc: "Kampala", seal: "MTN", about: "National telecommunications and mobile-money operator powering 4G/5G connectivity and MoMo merchant APIs.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-02-01", is_active: true },
    { id: "o14", name: "Ministry of Health Uganda", type: "Government", sector: "Public health", loc: "Entebbe", seal: "MOH", about: "National ministry coordinating disease surveillance, DHIS2 health information systems and district hospital delivery.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-02-02", is_active: true },
    { id: "o15", name: "National Water and Sewerage Corporation", type: "Government", sector: "Utilities & civil infrastructure", loc: "Jinja", seal: "NWSC", about: "Public utility engineering and operating urban water treatment plants and piped distribution networks across Uganda.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-02-03", is_active: true },
    { id: "o16", name: "SafeBoda Uganda", type: "Company", sector: "Mobility & fintech", loc: "Kampala", seal: "SB", about: "Kampala mobility and digital payments super-app connecting thousands of riders, drivers and urban merchants.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-02-04", is_active: true },
    { id: "o17", name: "Jesa Farm Dairy", type: "Company", sector: "Agribusiness & manufacturing", loc: "Wakiso", seal: "JFD", about: "Integrated Ugandan dairy producer partnering with smallholder farmers on extension services, cold-chain logistics and quality processing.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-02-05", is_active: true },
    { id: "o18", name: "Gulu Regional Innovation Hub", type: "NGO", sector: "Digital skills & youth", loc: "Gulu", seal: "GRIH", about: "Northern Uganda community innovation hub equipping university graduates with practical ICT, entrepreneurship and teaching skills.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-02-06", is_active: true },
    { id: "o19", name: "Mulago National Referral Hospital", type: "Government", sector: "Clinical & health systems", loc: "Kampala", seal: "MNRH", about: "Uganda's flagship national referral and teaching hospital advancing electronic medical records and clinical research.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-02-07", is_active: true },
    { id: "o20", name: "Katende, Ssempebwa & Co. Advocates", type: "Company", sector: "Corporate & commercial law", loc: "Kampala", seal: "KSC", about: "Full-service Kampala commercial law firm advising energy, infrastructure, banking and technology clients.", billing_email: null, tax_id: null, billing_address: {}, created_at: "2026-02-08", is_active: true },
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
    { id: "p15", title: "Domestic Tax & Accounting Intern", org_id: "o11", courses: ["Accounting & Finance", "Economics", "Business", "Statistics"], grade: "Second Class Upper", loc: "Kampala", mode: "On-site", duration: "6 months", stipend: "UGX 1,100,000 / month", deadline: "2027-05-15", slots: 8, status: "Open", applicants: 64, docs: ["Transcript", "National ID", "Recommendation letter"], testimonial: true, about: "Hands-on placement with URA domestic revenue teams supporting EFRIS taxpayer onboarding, VAT reconciliation and audit schedules.", duties: ["Assist taxpayers with EFRIS return reconciliations", "Prepare monthly sector revenue summaries", "Support compliance verification files"], skills_required: ["Accounting & Tax", "Excel", "Financial Modelling", "Report Writing"] },
    { id: "p16", title: "Civil & Water Infrastructure Intern", org_id: "o15", courses: ["Civil Engineering", "Engineering", "Architecture"], grade: "Second Class Upper", loc: "Jinja", mode: "On-site", duration: "4 months", stipend: "UGX 950,000 / month", deadline: "2027-05-10", slots: 5, status: "Open", applicants: 38, docs: ["Transcript", "Student ID", "Recommendation letter"], testimonial: true, about: "Field and engineering office placement on treated water mains expansion and pump-station maintenance along the Lake Victoria basin.", duties: ["Draft pipe-network layouts in AutoCAD", "Log hydraulic pressure and GIS field surveys", "Assist site engineers during inspections"], skills_required: ["AutoCAD", "Civil & Structural Design", "GIS & Mapping", "Report Writing"] },
    { id: "p17", title: "Telecoms & MoMo Systems Intern", org_id: "o13", courses: ["Electrical Engineering", "Telecommunications Engineering", "Computer Science", "Software Engineering"], grade: "CGPA 3.4+", loc: "Kampala", mode: "Hybrid", duration: "6 months", stipend: "UGX 1,400,000 / month", deadline: "2027-05-20", slots: 4, status: "Open", applicants: 92, docs: ["Transcript", "Student ID", "CV"], testimonial: true, about: "Join Uganda's core network reliability and MoMo API integration engineers supporting national uptime and merchant sandboxes.", duties: ["Monitor core network telemetry alerts", "Build Python automation scripts for API health checks", "Document merchant integration guides"], skills_required: ["Networking & Telecoms", "Python", "APIs", "SQL"] },
    { id: "p18", title: "Graduate Software Engineer", org_id: "o16", courses: ["Software Engineering", "Computer Science", "Information Technology"], grade: "Second Class Lower", loc: "Kampala", mode: "Hybrid", duration: "12 months", stipend: "UGX 3,200,000 / month", deadline: "2027-06-01", slots: 3, status: "Open", applicants: 78, docs: ["Transcript", "CV", "Portfolio"], testimonial: false, about: "Full-time graduate engineering track building Kampala rider dispatch, cashless wallet settlement and merchant web portals.", duties: ["Ship TypeScript services and React dashboards", "Integrate mobile-money settlement webhooks", "Pair with senior engineers on code reviews"], opportunity_type: "entry_level", salary_range: "UGX 2,800,000 - 3,800,000 / month", probation_period: "3 months", training_included: true, career_path: "Graduate Engineer to Mid-Level Backend/Frontend Engineer in 12 months", skills_required: ["TypeScript", "React", "Node.js", "APIs", "Git"] },
    { id: "p19", title: "Corporate & Commercial Legal Clerkship", org_id: "o20", courses: ["Law"], grade: "Second Class Upper", loc: "Kampala", mode: "On-site", duration: "5 months", stipend: "UGX 1,000,000 / month", deadline: "2027-05-18", slots: 3, status: "Open", applicants: 44, docs: ["Transcript", "Recommendation letter", "Writing sample"], testimonial: true, about: "Clerkship for LLB candidates and Law Development Centre finalists supporting commercial agreements, regulatory filings and Ugandan court briefs.", duties: ["Draft commercial contracts and board resolutions", "Conduct statutory and East African case research", "Prepare transaction due-diligence bundles"], skills_required: ["Legal Research", "Contract Drafting", "Policy Analysis", "Report Writing"] },
    { id: "p20", title: "Agribusiness Value-Chain Intern", org_id: "o17", courses: ["Agribusiness", "Agriculture", "Business", "Economics"], grade: "Second Class Lower", loc: "Wakiso", mode: "On-site", duration: "4 months", stipend: "UGX 850,000 / month", deadline: "2027-05-25", slots: 6, status: "Open", applicants: 31, docs: ["Transcript", "National ID", "Recommendation letter"], testimonial: true, about: "Work across Wakiso and central dairy cooperatives on milk quality testing, farmer extension training and cold-chain dispatch tracking.", duties: ["Coordinate farmer cooperative collection records", "Track cold-chain transport volumes in Excel", "Support field agronomy and feed workshops"], skills_required: ["Agribusiness", "Field Agronomy", "Excel", "Stakeholder Engagement"] },
    { id: "p21", title: "Clinical Health Informatics Officer", org_id: "o19", courses: ["Medicine & Nursing", "Public Health", "Statistics", "Information Technology"], grade: "Second Class Lower", loc: "Kampala", mode: "On-site", duration: "12 months", stipend: "UGX 2,600,000 / month", deadline: "2027-06-05", slots: 4, status: "Open", applicants: 53, docs: ["Transcript", "National ID", "Recommendation letter"], testimonial: false, about: "Entry-level clinical informatics appointment supporting Mulago wards in DHIS2 reporting, triage records and patient outcome audits.", duties: ["Audit electronic ward admissions and DHIS2 feeds", "Train clinical records clerks on quality standards", "Generate monthly epidemiology summaries"], opportunity_type: "entry_level", salary_range: "UGX 2,400,000 - 2,900,000 / month", probation_period: "3 months", training_included: true, career_path: "Clinical Informatics Officer to Regional HMIS Lead", skills_required: ["Clinical Data", "Patient Records", "Health Informatics", "Data Cleaning"] },
    { id: "p22", title: "SME Banking & Microfinance Graduate Trainee", org_id: "o12", courses: ["Accounting & Finance", "Business", "Economics", "Procurement & Supply Chain"], grade: "Second Class Upper", loc: "Mbarara", mode: "On-site", duration: "12 months", stipend: "UGX 2,400,000 / month", deadline: "2027-06-10", slots: 5, status: "Open", applicants: 67, docs: ["Transcript", "National ID", "Recommendation letter"], testimonial: true, about: "Structured graduate banking rotation across Western Uganda branches covering SME credit appraisal, agricultural loans and branch operations.", duties: ["Build cashflow models for SME loan appraisals", "Review collateral and financial statements", "Conduct client field visits across Ankole districts"], opportunity_type: "entry_level", salary_range: "UGX 2,200,000 - 2,700,000 / month", probation_period: "6 months", training_included: true, career_path: "Graduate Trainee to Credit Relationship Manager", skills_required: ["Financial Modelling", "Accounting & Tax", "Excel", "Communication"] },
    { id: "p23", title: "Youth Digital Literacy & Training Intern", org_id: "o18", courses: ["Education", "Information Technology", "Mass Communication", "Journalism & Communication"], grade: "Second Class Lower", loc: "Gulu", mode: "Hybrid", duration: "6 months", stipend: "UGX 900,000 / month", deadline: "2027-05-28", slots: 4, status: "Open", applicants: 29, docs: ["Transcript", "Student ID", "Recommendation letter"], testimonial: true, about: "Facilitate hands-on digital literacy, career readiness and practical office software bootcamps for secondary school and TVET youth across Acholi.", duties: ["Facilitate weekly youth ICT workshops", "Organise community curriculum handbooks", "Track graduate attendance and mentorship outcomes"], skills_required: ["Curriculum Design", "Communication", "Stakeholder Engagement", "Teamwork"] },
    { id: "p24", title: "GIS District Health & Water Mapping Gig", org_id: "o14", courses: ["Civil Engineering", "Public Health", "Statistics", "Agriculture"], grade: "CGPA 2.5+", loc: "Entebbe", mode: "Hybrid", duration: "6 weeks", stipend: "UGX 1,800,000 flat", deadline: "2027-05-12", slots: 2, status: "Open", applicants: 21, docs: ["Transcript", "Portfolio"], testimonial: false, about: "Short-term geospatial project compiling district health-centre coordinates and borehole coverage layers into Ministry briefings.", duties: ["Clean district GPS coordinates and facility registries", "Produce QGIS regional coverage maps", "Deliver summary indicator dashboard"], opportunity_type: "gig", duration_hours: 60, budget_range: "UGX 1,500,000 - 2,200,000", milestones: ["Coordinate cleanup", "QGIS map layers", "Executive briefing export"], remote_ok: true, skills_required: ["GIS & Mapping", "Data Cleaning", "Dashboards", "Report Writing"] },
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
    { id: "j5", title: "Tax Compliance & EFRIS Officer", org_id: "o11", loc: "Kampala", mode: "On-site", employment_type: "Full time", salary: "UGX 4,200,000 / month", closes_at: "2027-06-15", summary: "Lead domestic taxpayer audits, EFRIS compliance reviews and revenue reconciliations across Kampala sectors.", requirements: ["BCom / Accounting & Finance", "CPA Uganda Part II+", "Accounting & Tax"], status: "Open", review_status: "approved", published_at: "2026-02-14", review_reason: "", applicants: 28 },
    { id: "j6", title: "Full-Stack Software Engineer (Fintech)", org_id: "o16", loc: "Kampala", mode: "Hybrid", employment_type: "Full time", salary: "UGX 5,500,000 / month", closes_at: "2027-06-20", summary: "Build high-availability transport and mobile-money settlement services for Uganda's largest urban mobility network.", requirements: ["BSc Software Engineering / CS", "TypeScript", "Node.js", "APIs"], status: "Open", review_status: "approved", published_at: "2026-02-16", review_reason: "", applicants: 35 },
    { id: "j7", title: "Civil & Water Network Engineer", org_id: "o15", loc: "Jinja", mode: "On-site", employment_type: "Full time", salary: "UGX 4,500,000 / month", closes_at: "2027-06-18", summary: "Manage municipal water pipeline rehabilitation, hydraulic modelling and plant expansion works in Eastern Uganda.", requirements: ["BSc Civil Engineering", "UIPE Registration Track", "AutoCAD", "GIS & Mapping"], status: "Open", review_status: "approved", published_at: "2026-02-18", review_reason: "", applicants: 17 },
    { id: "j8", title: "Core Telecoms & MoMo Engineer", org_id: "o13", loc: "Kampala", mode: "Hybrid", employment_type: "Full time", salary: "UGX 5,200,000 / month", closes_at: "2027-06-25", summary: "Maintain carrier-grade IP/MPLS telecom links and automate mobile-money gateway observability.", requirements: ["BSc Electrical / Telecoms Engineering", "Networking & Telecoms", "Python", "SQL"], status: "Open", review_status: "approved", published_at: "2026-02-20", review_reason: "", applicants: 29 },
    { id: "j9", title: "SME Credit & Relationship Officer", org_id: "o12", loc: "Mbarara", mode: "On-site", employment_type: "Full time", salary: "UGX 3,100,000 / month", closes_at: "2027-06-12", summary: "Appraise commercial, school and agribusiness credit facilities and grow sustainable SME portfolios in Western Uganda.", requirements: ["BBA / Accounting & Finance", "Financial Modelling", "Communication"], status: "Open", review_status: "approved", published_at: "2026-02-22", review_reason: "", applicants: 24 },
    { id: "j10", title: "Procurement & PPDA Contracts Specialist", org_id: "o14", loc: "Kampala", mode: "On-site", employment_type: "Full time", salary: "UGX 3,800,000 / month", closes_at: "2027-06-22", summary: "Coordinate medical supply tendering, vendor evaluation and public-sector contract compliance under PPDA guidelines.", requirements: ["Bachelor of Procurement & Supply Chain", "Procurement & PPDA", "Contract Drafting"], status: "Open", review_status: "approved", published_at: "2026-02-24", review_reason: "", applicants: 21 },
    { id: "j11", title: "Corporate & Commercial Legal Associate", org_id: "o20", loc: "Kampala", mode: "On-site", employment_type: "Full time", salary: "UGX 4,000,000 / month", closes_at: "2027-06-28", summary: "Advise Ugandan and regional enterprises on corporate structuring, infrastructure PPPs and regulatory compliance.", requirements: ["LLB Honours", "LDC Bar Course", "Contract Drafting", "Legal Research"], status: "Open", review_status: "approved", published_at: "2026-02-26", review_reason: "", applicants: 16 },
    { id: "j12", title: "Agronomy & Dairy Supply Chain Lead", org_id: "o17", loc: "Wakiso", mode: "On-site", employment_type: "Full time", salary: "UGX 2,900,000 / month", closes_at: "2027-06-14", summary: "Oversee smallholder cooperative milk sourcing, forage extension programmes and refrigerated fleet scheduling.", requirements: ["BSc Agriculture / Agribusiness", "Agribusiness", "Field Agronomy"], status: "Open", review_status: "approved", published_at: "2026-02-28", review_reason: "", applicants: 15 },
    { id: "j13", title: "Public Health Surveillance & HMIS Officer", org_id: "o19", loc: "Kampala", mode: "On-site", employment_type: "Full time", salary: "UGX 4,400,000 / month", closes_at: "2027-06-30", summary: "Coordinate hospital DHIS2 clinical reporting, outbreak indicator tracking and quality improvement audits.", requirements: ["MBChB / BSc Public Health", "Clinical Data", "Health Informatics"], status: "Open", review_status: "approved", published_at: "2026-03-01", review_reason: "", applicants: 27 },
    { id: "j14", title: "STEM Curriculum & Community Training Lead", org_id: "o18", loc: "Gulu", mode: "Hybrid", employment_type: "Contract", salary: "UGX 2,600,000 / month", closes_at: "2027-06-24", summary: "Deliver applied software, digital literacy and career coaching tracks for Northern Uganda university and TVET graduates.", requirements: ["BEd / BA Education / ICT", "Curriculum Design", "Stakeholder Engagement"], status: "Open", review_status: "approved", published_at: "2026-03-03", review_reason: "", applicants: 13 },
  ];

  const users: DbUser[] = [
    { id: "u-student-1", email: "amina@makerere.ac.ug", name: "Amina Nakato", role: "student", password: "password123", org_id: null, created_at: "2026-01-20", is_active: true },
    { id: "u-jobseeker-1", email: "brian@example.com", name: "Brian Ssekandi", role: "jobseeker", password: "password123", org_id: null, created_at: "2026-01-21", is_active: true },
    { id: "u-employer-1", email: "hiring@lumenlabs.example", name: "Lumen Labs", role: "employer", password: "password123", org_id: "o4", created_at: "2026-01-15", is_active: true },
    { id: "u-admin-1", email: "office@makerere.ac.ug", name: "Makerere University", role: "admin", password: "password123", org_id: "o10", created_at: "2026-01-10", is_active: true },
    { id: "u-admin-2", email: "admin@example.com", name: "Admin User", role: "admin", password: "changeme", org_id: null, created_at: "2026-01-10", is_active: true },
    { id: "u-employee-1", email: "james@uganda.example", name: "James Okello", role: "employee", password: "password123", org_id: "o16", created_at: "2026-01-22", is_active: true },
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

  const chatGroups: Store["chatGroups"] = [
    {
      id: "cg-1",
      name: "Makerere Placement Cohort 2026",
      type: "placement",
      description: "Official cohort channel for verified students and placement officers.",
      owner_id: "u-admin-1",
      is_active: true,
      member_ids: ["u-student-1", "u-admin-1", "u-employer-1", "u-admin-2"],
      member_roles: {
        "u-admin-1": "owner",
        "u-admin-2": "admin",
        "u-employer-1": "admin",
        "u-student-1": "member",
      },
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
    {
      id: "cg-2",
      name: "Kampala Graduates & Engineers Guild",
      type: "mixed",
      description: "Open coordination channel for Ugandan graduates, employers and career mentors.",
      owner_id: "u-admin-1",
      is_active: true,
      member_ids: ["u-jobseeker-1", "u-employee-1", "u-employer-1", "u-admin-1"],
      member_roles: {
        "u-admin-1": "owner",
        "u-employer-1": "admin",
        "u-jobseeker-1": "member",
        "u-employee-1": "member",
      },
      messages: [
        {
          id: "cm-2",
          group_id: "cg-2",
          sender_id: "u-employee-1",
          recipient_id: null,
          type: "text",
          content: "Welcome! Feel free to ask about graduate interviews, CPA/UIPE tracks and Ugandan employer expectations.",
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
          sender_name: "James Okello",
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
    directMessages: [
      {
        id: "dm-seed-1",
        group_id: null,
        sender_id: "u-employer-1",
        recipient_id: "u-student-1",
        type: "text",
        content: "Hi Amina, we reviewed your Product Design portfolio and would love to schedule a brief portfolio walkthrough this week.",
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
        sender_name: "Lumen Labs",
      },
    ],
    threadReadAt: new Map(),
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

  if (method === "GET" && path === "/resume/download") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const r = store.resumes.get(user.id);
    if (!r) return jsonErr(404, "No resume uploaded");
    const safeName = r.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const summary = `BrighterWorks Resume File\nCandidate: ${user.name}\nEmail: ${user.email}\nFilename: ${r.filename}\nUploaded: ${r.uploaded_at}\n`;
    return new NextResponse(summary, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safeName}"`,
      },
    });
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
    return NextResponse.json(
      store.applications
        .filter((a) => a.shortlisted)
        .map((a) => {
          const u = store.users.find((x) => x.id === a.user_id);
          return { ...a, user_name: u?.name || "Candidate", user_email: u?.email || "" };
        })
    );
  }

  if (method === "GET" && path === "/organization/shortlisted/jobs") {
    return NextResponse.json(
      store.jobApplications
        .filter((a) => a.shortlisted)
        .map((a) => {
          const u = store.users.find((x) => x.id === a.user_id);
          return { ...a, user_name: u?.name || "Candidate", user_email: u?.email || "" };
        })
    );
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
  const initialsOf = (n: string) => {
    const parts = (n || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "··";
    return parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const VALID_GROUP_TYPES = new Set(["placement", "student", "employer", "organization", "mixed", "admin"]);

  const buildGroupThread = (g: Store["chatGroups"][number], userId: string) => {
    const activeMsgs = g.messages.filter((m) => !m.deleted_at);
    const last = activeMsgs[activeMsgs.length - 1] || null;
    const readMap = store.threadReadAt.get(userId) || {};
    const lastRead = readMap[g.id];
    const unread = activeMsgs.filter(
      (m) => m.sender_id !== userId && (!lastRead || m.created_at > lastRead)
    ).length;
    return {
      id: g.id,
      kind: "group" as const,
      title: g.name,
      type: g.type,
      description: g.description,
      initials: initialsOf(g.name),
      subtitle: `${g.member_ids.length} member${g.member_ids.length === 1 ? "" : "s"}`,
      member_count: g.member_ids.length,
      my_role: g.member_roles[userId] || "member",
      unread_count: unread,
      last_message: last
        ? {
            id: last.id,
            content: last.content,
            type: last.type,
            sender_id: last.sender_id,
            sender_name: last.sender_name,
            created_at: last.created_at,
            is_mine: last.sender_id === userId,
          }
        : null,
      last_activity: last?.created_at || new Date().toISOString(),
    };
  };

  if (method === "GET" && path === "/chat/threads") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const groupThreads = store.chatGroups
      .filter((g) => g.is_active && g.member_ids.includes(user.id))
      .map((g) => buildGroupThread(g, user.id));

    const directByOther = new Map<string, Store["directMessages"]>();
    for (const m of store.directMessages) {
      if (m.deleted_at) continue;
      if (m.sender_id !== user.id && m.recipient_id !== user.id) continue;
      const otherId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
      if (!otherId) continue;
      const list = directByOther.get(otherId) || [];
      list.push(m);
      directByOther.set(otherId, list);
    }

    const readMap = store.threadReadAt.get(user.id) || {};
    const directThreads = Array.from(directByOther.entries())
      .map(([otherId, msgs]) => {
        const other = store.users.find((u) => u.id === otherId && u.is_active);
        if (!other) return null;
        const last = msgs[msgs.length - 1];
        const threadKey = `dm:${otherId}`;
        const lastRead = readMap[threadKey];
        const unread = msgs.filter(
          (m) => m.sender_id === otherId && (!lastRead || m.created_at > lastRead)
        ).length;
        return {
          id: threadKey,
          kind: "direct" as const,
          title: other.name,
          type: other.role,
          description: "",
          initials: initialsOf(other.name),
          subtitle: other.role ? other.role.charAt(0).toUpperCase() + other.role.slice(1) : "Direct message",
          member_count: 2,
          my_role: "member",
          unread_count: unread,
          other_user: { id: other.id, name: other.name, role: other.role },
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
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);

    const threads = [...groupThreads, ...directThreads].sort((a, b) =>
      b.last_activity.localeCompare(a.last_activity)
    );
    return NextResponse.json({ threads });
  }

  if (method === "GET" && path === "/chat/groups") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const groups = store.chatGroups
      .filter((g) => g.is_active && g.member_ids.includes(user.id))
      .map((g) => buildGroupThread(g, user.id));
    return NextResponse.json({ groups });
  }

  if (method === "POST" && path === "/chat/groups") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const name = String(body.name || "").trim();
    if (!name || name.length > 120) {
      return jsonErr(400, "Group name must be between 1 and 120 characters");
    }
    const gtype = String(body.type || "mixed");
    if (!VALID_GROUP_TYPES.has(gtype)) {
      return jsonErr(400, "Invalid group type");
    }
    if (gtype === "admin" && user.role !== "admin") {
      return jsonErr(403, "Only admins can create placement office channels");
    }
    const requestedMembers = Array.isArray(body.member_ids)
      ? body.member_ids.map((id: unknown) => String(id).trim()).filter(Boolean)
      : [];
    const activeUsersMap = new Map(store.users.filter((u) => u.is_active).map((u) => [u.id, u]));
    for (const mid of requestedMembers) {
      if (!activeUsersMap.has(mid)) {
        return jsonErr(404, `User '${mid}' not found`);
      }
    }
    const memberIds = Array.from(new Set([user.id, ...requestedMembers]));
    const memberRoles: Record<string, string> = {};
    for (const mid of memberIds) {
      memberRoles[mid] = mid === user.id ? "owner" : "member";
    }
    const g = {
      id: uid("cg"),
      name,
      type: gtype,
      description: String(body.description || "").trim(),
      owner_id: user.id,
      is_active: true,
      member_ids: memberIds,
      member_roles: memberRoles,
      messages: [],
    };
    store.chatGroups.push(g);
    return NextResponse.json({ group: buildGroupThread(g, user.id) }, { status: 201 });
  }

  if (pathParts.length === 3 && pathParts[0] === "chat" && pathParts[1] === "groups") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const g = store.chatGroups.find((x) => x.id === pathParts[2] && x.is_active);
    if (!g) return jsonErr(404, "Group not found");
    const isMember = g.member_ids.includes(user.id);
    const myRole = g.member_roles[user.id];

    if (method === "GET") {
      if (!isMember && user.role !== "admin") return jsonErr(403, "Not a member of this group");
      return NextResponse.json({ group: buildGroupThread(g, user.id) });
    }
    if (method === "PATCH") {
      if (!myRole || !["owner", "admin"].includes(myRole)) {
        if (user.role !== "admin") return jsonErr(403, "Only group admins can update this group");
      }
      if (body.name !== undefined) {
        const clean = String(body.name || "").trim();
        if (!clean || clean.length > 120) {
          return jsonErr(400, "Group name must be between 1 and 120 characters");
        }
        g.name = clean;
      }
      if (body.description !== undefined) {
        g.description = String(body.description || "").trim();
      }
      return NextResponse.json({ group: buildGroupThread(g, user.id) });
    }
    if (method === "DELETE") {
      if (myRole !== "owner" && user.role !== "admin") {
        return jsonErr(403, "Only group owners can delete this group");
      }
      g.is_active = false;
      return NextResponse.json({ ok: true });
    }
  }

  if (method === "GET" && path === "/chat/direct") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const byOther = new Map<string, Store["directMessages"]>();
    for (const m of store.directMessages) {
      if (m.deleted_at) continue;
      if (m.sender_id !== user.id && m.recipient_id !== user.id) continue;
      const otherId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
      if (!otherId) continue;
      const list = byOther.get(otherId) || [];
      list.push(m);
      byOther.set(otherId, list);
    }
    const chats = Array.from(byOther.entries())
      .map(([otherId, msgs]) => {
        const other = store.users.find((u) => u.id === otherId && u.is_active);
        if (!other) return null;
        return {
          other_user: { id: other.id, name: other.name, role: other.role },
          last_message: msgs[msgs.length - 1] || null,
        };
      })
      .filter(Boolean);
    return NextResponse.json({ chats });
  }

  if (method === "GET" && path === "/chat/contacts") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const contacts = store.users
      .filter((u) => u.is_active && u.id !== user.id)
      .map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        initials: initialsOf(u.name),
      }));
    return NextResponse.json({ contacts });
  }

  if (pathParts.length === 4 && pathParts[0] === "chat" && pathParts[1] === "groups" && pathParts[3] === "messages") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const g = store.chatGroups.find((x) => x.id === pathParts[2] && x.is_active);
    if (!g) return jsonErr(404, "Group not found");
    const isMember = g.member_ids.includes(user.id);
    if (method === "GET") {
      if (!isMember && user.role !== "admin") return jsonErr(403, "Not a member of this group");
      const limit = Math.max(1, Math.min(200, Number(sp.get("limit") || 60)));
      const msgs = g.messages.filter((m) => !m.deleted_at);
      return NextResponse.json({ messages: msgs.slice(-limit) });
    }
    if (method === "POST") {
      if (!isMember) return jsonErr(403, "Join the group before sending messages");
      const msgType = String(body.type || "text");
      const content = String(body.content || "").trim();
      if (msgType === "text" && (!content || content.length > 4000)) {
        return jsonErr(400, "Message content must be between 1 and 4000 characters");
      }
      const replyToId = body.reply_to_id ? String(body.reply_to_id) : null;
      if (replyToId && !g.messages.some((m) => m.id === replyToId && !m.deleted_at)) {
        return jsonErr(404, "Referenced reply message not found");
      }
      const msg = {
        id: uid("cm"),
        group_id: g.id,
        sender_id: user.id,
        recipient_id: null,
        type: msgType,
        content,
        original_language: String(body.original_language || "en"),
        duration_seconds: null,
        file_name: null,
        file_size: null,
        mime_type: null,
        created_at: new Date().toISOString(),
        updated_at: null,
        deleted_at: null,
        is_edited: false,
        reply_to_id: replyToId,
        translations: {},
        translated_content: null,
        sender_name: user.name,
      };
      g.messages.push(msg);
      return NextResponse.json({ message: msg }, { status: 201 });
    }
  }

  if (pathParts.length === 4 && pathParts[0] === "chat" && pathParts[1] === "groups" && pathParts[3] === "members") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const g = store.chatGroups.find((x) => x.id === pathParts[2] && x.is_active);
    if (!g) return jsonErr(404, "Group not found");
    const isMember = g.member_ids.includes(user.id);
    const myRole = g.member_roles[user.id];

    if (method === "GET") {
      if (!isMember && user.role !== "admin") return jsonErr(403, "Not a member of this group");
      const participants = g.member_ids.map((id) => {
        const u = store.users.find((x) => x.id === id);
        return {
          id: `${g.id}-${id}`,
          group_id: g.id,
          user_id: id,
          role: g.member_roles[id] || "member",
          joined_at: "2026-01-15T00:00:00Z",
          is_muted: false,
          name: u?.name || "Member",
          initials: initialsOf(u?.name || "Member"),
        };
      });
      return NextResponse.json({ participants });
    }

    if (method === "POST") {
      if ((!myRole || !["owner", "admin"].includes(myRole)) && user.role !== "admin") {
        return jsonErr(403, "Only group admins can add members");
      }
      const targetUserId = String(body.user_id || "").trim();
      const targetRole = String(body.role || "member").trim();
      if (!["member", "admin"].includes(targetRole)) {
        return jsonErr(400, "Invalid participant role");
      }
      if (targetRole === "admin" && myRole !== "owner" && user.role !== "admin") {
        return jsonErr(403, "Only group owners can promote members to admin");
      }
      const target = store.users.find((u) => u.id === targetUserId && u.is_active);
      if (!target) return jsonErr(404, "User not found");
      if (g.member_ids.includes(targetUserId)) {
        return jsonErr(409, "User is already a member of this group");
      }
      g.member_ids.push(targetUserId);
      g.member_roles[targetUserId] = targetRole;
      return NextResponse.json({
        participant: {
          id: `${g.id}-${targetUserId}`,
          group_id: g.id,
          user_id: targetUserId,
          role: targetRole,
          joined_at: new Date().toISOString(),
          is_muted: false,
          name: target.name,
          initials: initialsOf(target.name),
        },
      }, { status: 201 });
    }
  }

  if (pathParts.length === 5 && pathParts[0] === "chat" && pathParts[1] === "groups" && pathParts[3] === "members") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const g = store.chatGroups.find((x) => x.id === pathParts[2] && x.is_active);
    if (!g) return jsonErr(404, "Group not found");
    const targetUserId = pathParts[4];
    if (!g.member_ids.includes(targetUserId)) return jsonErr(404, "Member not found");
    const myRole = g.member_roles[user.id];

    if (method === "PATCH") {
      const canManage = myRole === "owner" || myRole === "admin" || user.role === "admin";
      if (!canManage && targetUserId !== user.id) {
        return jsonErr(403, "Not authorized to update member");
      }
      if (body.role !== undefined) {
        const nextRole = String(body.role);
        if (!["member", "admin"].includes(nextRole)) return jsonErr(400, "Invalid role");
        if (myRole !== "owner" && user.role !== "admin") {
          return jsonErr(403, "Only owners can change member roles");
        }
        if (g.member_roles[targetUserId] === "owner") {
          return jsonErr(400, "Cannot change the group owner's role");
        }
        g.member_roles[targetUserId] = nextRole;
      }
      return NextResponse.json({ ok: true });
    }

    if (method === "DELETE") {
      const canRemove = myRole === "owner" || myRole === "admin" || user.role === "admin" || targetUserId === user.id;
      if (!canRemove) return jsonErr(403, "Not authorized to remove member");
      if (g.member_roles[targetUserId] === "owner" && user.role !== "admin" && targetUserId !== user.id) {
        return jsonErr(403, "Cannot remove the group owner");
      }
      g.member_ids = g.member_ids.filter((id) => id !== targetUserId);
      delete g.member_roles[targetUserId];
      return NextResponse.json({ ok: true });
    }
  }

  if (method === "POST" && pathParts.length === 4 && pathParts[0] === "chat" && pathParts[1] === "groups" && pathParts[3] === "leave") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const g = store.chatGroups.find((x) => x.id === pathParts[2] && x.is_active);
    if (!g) return jsonErr(404, "Group not found");
    if (!g.member_ids.includes(user.id)) return jsonErr(404, "Not a member of this group");
    g.member_ids = g.member_ids.filter((id) => id !== user.id);
    delete g.member_roles[user.id];
    if (g.member_ids.length === 0) {
      g.is_active = false;
    } else if (g.owner_id === user.id) {
      const nextOwner = g.member_ids[0];
      g.owner_id = nextOwner;
      g.member_roles[nextOwner] = "owner";
    }
    return NextResponse.json({ ok: true });
  }

  if (pathParts.length === 3 && pathParts[0] === "chat" && pathParts[1] === "messages") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const msgId = pathParts[2];
    const groupMsg = store.chatGroups.flatMap((g) => g.messages).find((m) => m.id === msgId);
    const directMsg = store.directMessages.find((m) => m.id === msgId);
    const msg = groupMsg || directMsg;
    if (!msg || msg.deleted_at) return jsonErr(404, "Message not found");

    if (method === "PATCH") {
      if (msg.sender_id !== user.id) return jsonErr(403, "You can only edit your own messages");
      const content = String(body.content || "").trim();
      if (!content || content.length > 4000) {
        return jsonErr(400, "Message content must be between 1 and 4000 characters");
      }
      msg.content = content;
      msg.is_edited = true;
      msg.updated_at = new Date().toISOString();
      return NextResponse.json({ message: msg });
    }

    if (method === "DELETE") {
      const g = msg.group_id ? store.chatGroups.find((x) => x.id === msg.group_id) : null;
      const gRole = g ? g.member_roles[user.id] : undefined;
      const canDelete = msg.sender_id === user.id || user.role === "admin" || gRole === "owner" || gRole === "admin";
      if (!canDelete) return jsonErr(403, "Not authorized to delete this message");
      msg.deleted_at = new Date().toISOString();
      return NextResponse.json({ ok: true });
    }
  }

  if (method === "POST" && pathParts.length === 4 && pathParts[0] === "chat" && pathParts[1] === "threads" && pathParts[3] === "read") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const rawId = decodeURIComponent(pathParts[2]);
    if (rawId.startsWith("dm:")) {
      const otherId = rawId.slice(3);
      const other = store.users.find((u) => u.id === otherId && u.is_active);
      if (!other) return jsonErr(404, "Conversation partner not found");
    } else {
      const g = store.chatGroups.find((x) => x.id === rawId && x.is_active);
      if (!g) return jsonErr(404, "Group not found");
      if (!g.member_ids.includes(user.id) && user.role !== "admin") {
        return jsonErr(403, "Not a member of this group");
      }
    }
    const existing = store.threadReadAt.get(user.id) || {};
    existing[rawId] = new Date().toISOString();
    store.threadReadAt.set(user.id, existing);
    return NextResponse.json({ ok: true });
  }

  if (pathParts.length === 3 && pathParts[0] === "chat" && pathParts[1] === "direct") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const otherId = pathParts[2];
    if (otherId === user.id) return jsonErr(400, "Cannot open a direct chat with yourself");
    const other = store.users.find((u) => u.id === otherId && u.is_active);
    if (!other) return jsonErr(404, "User not found");
    if (method === "GET") {
      const limit = Math.max(1, Math.min(200, Number(sp.get("limit") || 60)));
      const messages = store.directMessages.filter(
        (m) =>
          !m.deleted_at &&
          ((m.sender_id === user.id && m.recipient_id === otherId) ||
            (m.sender_id === otherId && m.recipient_id === user.id))
      );
      return NextResponse.json({ messages: messages.slice(-limit) });
    }
  }

  if (method === "POST" && path === "/chat/direct") {
    const user = getCurrentUser(req, store);
    if (!user) return jsonErr(401, "Not authenticated");
    const recipientId = String(body.recipient_id || "").trim();
    if (!recipientId) return jsonErr(400, "Recipient is required");
    if (recipientId === user.id) return jsonErr(400, "Cannot send a direct message to yourself");
    const recipient = store.users.find((u) => u.id === recipientId && u.is_active);
    if (!recipient) return jsonErr(404, "Recipient not found");
    const msgType = String(body.type || "text");
    const content = String(body.content || "").trim();
    if (msgType === "text" && (!content || content.length > 4000)) {
      return jsonErr(400, "Message content must be between 1 and 4000 characters");
    }
    const msg = {
      id: uid("dm"),
      group_id: null,
      sender_id: user.id,
      recipient_id: recipientId,
      type: msgType,
      content,
      original_language: String(body.original_language || "en"),
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
