"""Seed data — the current catalogue, moved out of the frontend's hardcoded
module and into the database. Idempotent per table: orgs/placements are only
inserted when empty, and demo accounts only when the users table is empty, so
repeated startup (and the test harness) is safe.

SENSITIVE DATA (passwords, real emails) are loaded from environment variables.
This file only contains non-sensitive demo data for development.
"""
import os
from datetime import date
from uuid import uuid4
import os

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.infrastructure.orm import JobORM, OrganisationORM, PlacementORM, UserORM

# --- Non-sensitive demo data (safe for public repo) ---

ORGS: list[dict] = [
    {"id": "o1", "name": "Ministry of ICT and National Guidance", "type": "Government", "sector": "Public sector", "loc": "Kampala", "seal": "MIC", "about": "National ministry responsible for digital government services, ICT policy and public-sector innovation."},
    {"id": "o2", "name": "National Information Technology Authority", "type": "Government", "sector": "Public sector", "loc": "Kampala", "seal": "NITA", "about": "Statutory body delivering national ICT infrastructure, e-government systems and digital skills programmes."},
    {"id": "o3", "name": "Kampala Capital City Authority", "type": "Government", "sector": "Public services", "loc": "Kampala", "seal": "KCCA", "about": "City authority responsible for urban planning, transport, sanitation and municipal digital services."},
    {"id": "o4", "name": "Lumen Labs", "type": "Company", "sector": "Design & software", "loc": "Remote, Europe", "seal": "LL", "about": "Product studio building design tooling used by 40,000 teams. Small, senior team, ships weekly."},
    {"id": "o5", "name": "Northwind", "type": "Company", "sector": "Financial technology", "loc": "Berlin, hybrid", "seal": "NW", "about": "Payments infrastructure for small merchants across East Africa and Europe."},
    {"id": "o6", "name": "Atlas Health", "type": "Company", "sector": "Health", "loc": "Nairobi", "seal": "AH", "about": "Primary-care network digitising patient records across 120 clinics."},
    {"id": "o7", "name": "Kite Mobility", "type": "Company", "sector": "Transport", "loc": "Kampala", "seal": "KM", "about": "Route planning and fare payments for minibus operators."},
    {"id": "o8", "name": "Twaweza Foundation", "type": "NGO", "sector": "Civic research", "loc": "Dar es Salaam", "seal": "TW", "about": "Research and advocacy on public service delivery in East Africa."},
    {"id": "o9", "name": "Brac Uganda", "type": "NGO", "sector": "Development", "loc": "Kampala", "seal": "BU", "about": "Development organisation working on livelihoods, education and financial inclusion."},
    {"id": "o10", "name": "Makerere University — School of Computing", "type": "University", "sector": "Research", "loc": "Kampala", "seal": "MU", "about": "Research group on human-computer interaction and public-interest technology."},
    {"id": "o11", "name": "Uganda Revenue Authority", "type": "Government", "sector": "Revenue & tax administration", "loc": "Kampala", "seal": "URA", "about": "National tax administration body overseeing domestic revenue, customs, EFRIS compliance and fiscal analysis across Uganda."},
    {"id": "o12", "name": "Centenary Bank Uganda", "type": "Company", "sector": "Banking & microfinance", "loc": "Mbarara", "seal": "CBL", "about": "Leading commercial and microfinance bank serving SMEs, agribusinesses and households across every region of Uganda."},
    {"id": "o13", "name": "MTN Uganda", "type": "Company", "sector": "Telecommunications & fintech", "loc": "Kampala", "seal": "MTN", "about": "National telecommunications and mobile-money operator powering 4G/5G connectivity and MoMo merchant APIs."},
    {"id": "o14", "name": "Ministry of Health Uganda", "type": "Government", "sector": "Public health", "loc": "Entebbe", "seal": "MOH", "about": "National ministry coordinating disease surveillance, DHIS2 health information systems and district hospital delivery."},
    {"id": "o15", "name": "National Water and Sewerage Corporation", "type": "Government", "sector": "Utilities & civil infrastructure", "loc": "Jinja", "seal": "NWSC", "about": "Public utility engineering and operating urban water treatment plants and piped distribution networks across Uganda."},
    {"id": "o16", "name": "SafeBoda Uganda", "type": "Company", "sector": "Mobility & fintech", "loc": "Kampala", "seal": "SB", "about": "Kampala mobility and digital payments super-app connecting thousands of riders, drivers and urban merchants."},
    {"id": "o17", "name": "Jesa Farm Dairy", "type": "Company", "sector": "Agribusiness & manufacturing", "loc": "Wakiso", "seal": "JFD", "about": "Integrated Ugandan dairy producer partnering with smallholder farmers on extension services, cold-chain logistics and quality processing."},
    {"id": "o18", "name": "Gulu Regional Innovation Hub", "type": "NGO", "sector": "Digital skills & youth", "loc": "Gulu", "seal": "GRIH", "about": "Northern Uganda community innovation hub equipping university graduates with practical ICT, entrepreneurship and teaching skills."},
    {"id": "o19", "name": "Mulago National Referral Hospital", "type": "Government", "sector": "Clinical & health systems", "loc": "Kampala", "seal": "MNRH", "about": "Uganda's flagship national referral and teaching hospital advancing electronic medical records and clinical research."},
    {"id": "o20", "name": "Katende, Ssempebwa & Co. Advocates", "type": "Company", "sector": "Corporate & commercial law", "loc": "Kampala", "seal": "KSC", "about": "Full-service Kampala commercial law firm advising energy, infrastructure, banking and technology clients."},
]

PLACEMENTS: list[dict] = [
    {"id": "p1", "title": "Product Design Intern", "org_id": "o4", "courses": ["Design", "Computer Science"], "grade": "CGPA 3.0+", "loc": "Remote", "mode": "Remote", "duration": "12 weeks", "stipend": "$2,400 / month",     "deadline": "2027-03-12", "slots": 4, "status": "Open", "applicants": 41, "docs": ["Transcript", "Student ID", "Portfolio"], "testimonial": True, "about": "You will own one workstream from brief to handover, review weekly with a named mentor and present at the end-of-term critique.", "duties": ["Own one end-to-end product workstream", "Join weekly critiques and ship to production", "Present at the end-of-term review"]},
    {"id": "p2", "title": "Data Analyst Intern", "org_id": "o2", "courses": ["Statistics", "Computer Science", "Economics"], "grade": "Second Class Upper", "loc": "Kampala", "mode": "On-site", "duration": "6 months", "stipend": "UGX 1,200,000 / month", "deadline": "2027-02-28", "slots": 6, "status": "Open", "applicants": 87, "docs": ["Transcript", "National ID", "Recommendation letter"], "testimonial": True, "about": "Placement within the national data office, supporting dashboards used by ministries and district offices.", "duties": ["Maintain national indicator dashboards", "Clean and reconcile district datasets", "Prepare monthly briefings"]},
    {"id": "p3", "title": "Software Engineering Intern", "org_id": "o5", "courses": ["Computer Science", "Information Technology", "Engineering"], "grade": "CGPA 3.4+", "loc": "Berlin", "mode": "Hybrid", "duration": "6 months", "stipend": "€1,900 / month", "deadline": "2027-03-09", "slots": 3, "status": "Open", "applicants": 120, "docs": ["Transcript", "CV", "Portfolio"], "testimonial": False, "about": "Payments engineering team. You will work on merchant onboarding flows and internal tooling.", "duties": ["Ship features in a two-week cycle", "Write tests for onboarding flows", "Join incident reviews"]},
    {"id": "p4", "title": "Health Records Intern", "org_id": "o6", "courses": ["Public Health", "Statistics", "Information Technology"], "grade": "Second Class Lower", "loc": "Nairobi", "mode": "On-site", "duration": "4 months", "stipend": "KSh 75,000 / month", "deadline": "2027-02-21", "slots": 8, "status": "Closing", "applicants": 64, "docs": ["Transcript", "Student ID", "Immunisation card"], "testimonial": True, "about": "Support the digitisation of patient records across a 120-clinic network.", "duties": ["Digitise and validate patient files", "Flag incomplete records", "Support clinic audits"]},
    {"id": "p5", "title": "Frontend Intern", "org_id": "o7", "courses": ["Computer Science", "Design", "Information Technology"], "grade": "CGPA 3.0+", "loc": "Kampala", "mode": "Hybrid", "duration": "6 months", "stipend": "UGX 900,000 / month", "deadline": "2027-03-05", "slots": 2, "status": "Open", "applicants": 33, "docs": ["Transcript", "Portfolio"], "testimonial": False, "about": "Build the passenger-facing experience for route planning and fare payment.", "duties": ["Build accessible booking flows", "Improve offline behaviour", "Test with conductors in the field"]},
    {"id": "p6", "title": "Policy Research Assistant", "org_id": "o1", "courses": ["Law", "Economics", "Mass Communication"], "grade": "Second Class Upper", "loc": "Kampala", "mode": "On-site", "duration": "5 months", "stipend": "UGX 1,000,000 / month", "deadline": "2027-03-18", "slots": 5, "status": "Open", "applicants": 52, "docs": ["Transcript", "Recommendation letter", "Writing sample"], "testimonial": True, "about": "Support the ICT policy unit with comparative research, briefings and stakeholder mapping.", "duties": ["Draft policy briefs", "Map stakeholder positions", "Support consultation workshops"]},
    {"id": "p7", "title": "Civic Data Intern", "org_id": "o8", "courses": ["Statistics", "Economics", "Public Health"], "grade": "CGPA 3.0+", "loc": "Dar es Salaam", "mode": "Hybrid", "duration": "3 months", "stipend": "TZS 700,000 / month", "deadline": "2027-04-02", "slots": 4, "status": "Open", "applicants": 29, "docs": ["Transcript", "Student ID", "Writing sample"], "testimonial": False, "about": "Work with the survey team on public service delivery data used in national advocacy.", "duties": ["Clean survey data", "Produce district summaries", "Support field enumerators"]},
    {"id": "p8", "title": "Urban Planning Intern", "org_id": "o3", "courses": ["Engineering", "Economics", "Design"], "grade": "Second Class Lower", "loc": "Kampala", "mode": "On-site", "duration": "6 months", "stipend": "UGX 850,000 / month", "deadline": "2027-02-25", "slots": 3, "status": "Closing", "applicants": 47, "docs": ["Transcript", "Student ID", "Recommendation letter"], "testimonial": True, "about": "Support the planning directorate on transport corridors and market redevelopment.", "duties": ["Survey corridor usage", "Draft planning notes", "Support community consultations"]},
    {"id": "p9", "title": "Development Programmes Intern", "org_id": "o9", "courses": ["Business", "Economics", "Public Health"], "grade": "Second Class Lower", "loc": "Kampala", "mode": "On-site", "duration": "4 months", "stipend": "UGX 750,000 / month", "deadline": "2027-03-30", "slots": 7, "status": "Open", "applicants": 71, "docs": ["Transcript", "National ID", "Recommendation letter"], "testimonial": True, "about": "Support field programme delivery and monitoring across three districts.", "duties": ["Support monitoring visits", "Maintain programme records", "Draft field notes"]},
    {"id": "p10", "title": "HCI Research Assistant", "org_id": "o10", "courses": ["Computer Science", "Design", "Statistics"], "grade": "CGPA 3.6+", "loc": "Kampala", "mode": "On-site", "duration": "10 weeks", "stipend": "UGX 700,000 / month", "deadline": "2027-03-15", "slots": 2, "status": "Open", "applicants": 18, "docs": ["Transcript", "Recommendation letter", "Writing sample"], "testimonial": True, "about": "Join a research group studying public-interest technology in Kampala.", "duties": ["Run interview studies", "Code and synthesise transcripts", "Co-author a short paper"]},
    {"id": "p11", "title": "Brand Design Intern", "org_id": "o4", "courses": ["Design", "Mass Communication"], "grade": "CGPA 3.0+", "loc": "Remote", "mode": "Remote", "duration": "8 weeks", "stipend": "$1,200 / month", "deadline": "2027-04-20", "slots": 2, "status": "Open", "applicants": 26, "docs": ["Portfolio", "CV"], "testimonial": False, "about": "Identity and campaign design for a studio launch.", "duties": ["Build identity variants", "Produce campaign assets", "Document the system"]},
    {"id": "p12", "title": "Monitoring & Evaluation Intern", "org_id": "o2", "courses": ["Statistics", "Economics", "Business"], "grade": "Second Class Upper", "loc": "Kampala", "mode": "On-site", "duration": "5 months", "stipend": "UGX 950,000 / month", "deadline": "2027-04-08", "slots": 4, "status": "Open", "applicants": 39, "docs": ["Transcript", "Student ID", "Writing sample"], "testimonial": True, "about": "Track outcomes across national digital skills programmes.", "duties": ["Maintain indicator frameworks", "Run quarterly reviews", "Produce analysis notes"]},
    # Gig example
    {"id": "p13", "title": "Website Redesign Gig", "org_id": "o4", "courses": ["Design", "Computer Science"], "grade": "CGPA 2.5+", "loc": "Remote", "mode": "Remote", "duration": "4 weeks", "stipend": "$1,500 flat", "deadline": "2027-03-15", "slots": 1, "status": "Open", "applicants": 12, "docs": ["Portfolio"], "testimonial": False, "about": "Redesign the marketing website for a product launch. Deliver Figma mockups and a style guide.", "duties": ["Audit current site", "Design new pages in Figma", "Deliver component library"], "opportunity_type": "gig", "duration_hours": 40, "budget_range": "$1,000-$2,000", "milestones": ["Discovery & audit", "Wireframes", "High-fidelity mockups", "Style guide & handoff"], "remote_ok": True, "skills_required": ["Figma", "UI Design", "Design Systems"]},
    # Entry-level example
    {"id": "p14", "title": "Junior Data Analyst", "org_id": "o2", "courses": ["Statistics", "Computer Science", "Economics"], "grade": "Second Class Lower", "loc": "Kampala", "mode": "On-site", "duration": "12 months", "stipend": "UGX 2,500,000 / month", "deadline": "2027-04-30", "slots": 3, "status": "Open", "applicants": 45, "docs": ["Transcript", "National ID", "Recommendation letter"], "testimonial": False, "about": "Full-time entry-level role analysing public sector data. Includes structured onboarding and mentorship.", "duties": ["Build and maintain dashboards", "Analyse district-level indicators", "Present findings to stakeholders"], "opportunity_type": "entry_level", "salary_range": "UGX 2,200,000 - 3,000,000 / month", "probation_period": "3 months", "training_included": True, "career_path": "Progress to Senior Data Analyst within 18 months", "skills_required": ["SQL", "Excel", "Data Cleaning", "Dashboards", "Statistics"]},
    # Ugandan careers, degrees & professional tracks
    {"id": "p15", "title": "Domestic Tax & Accounting Intern", "org_id": "o11", "courses": ["Accounting & Finance", "Economics", "Business", "Statistics"], "grade": "Second Class Upper", "loc": "Kampala", "mode": "On-site", "duration": "6 months", "stipend": "UGX 1,100,000 / month", "deadline": "2027-05-15", "slots": 8, "status": "Open", "applicants": 64, "docs": ["Transcript", "National ID", "Recommendation letter"], "testimonial": True, "about": "Hands-on placement with URA domestic revenue teams supporting EFRIS taxpayer onboarding, VAT reconciliation and audit schedules.", "duties": ["Assist taxpayers with EFRIS return reconciliations", "Prepare monthly sector revenue summaries", "Support compliance verification files"], "skills_required": ["Accounting & Tax", "Excel", "Financial Modelling", "Report Writing"]},
    {"id": "p16", "title": "Civil & Water Infrastructure Intern", "org_id": "o15", "courses": ["Civil Engineering", "Engineering", "Architecture"], "grade": "Second Class Upper", "loc": "Jinja", "mode": "On-site", "duration": "4 months", "stipend": "UGX 950,000 / month", "deadline": "2027-05-10", "slots": 5, "status": "Open", "applicants": 38, "docs": ["Transcript", "Student ID", "Recommendation letter"], "testimonial": True, "about": "Field and engineering office placement on treated water mains expansion and pump-station maintenance along the Lake Victoria basin.", "duties": ["Draft pipe-network layouts in AutoCAD", "Log hydraulic pressure and GIS field surveys", "Assist site engineers during inspections"], "skills_required": ["AutoCAD", "Civil & Structural Design", "GIS & Mapping", "Report Writing"]},
    {"id": "p17", "title": "Telecoms & MoMo Systems Intern", "org_id": "o13", "courses": ["Electrical Engineering", "Telecommunications Engineering", "Computer Science", "Software Engineering"], "grade": "CGPA 3.4+", "loc": "Kampala", "mode": "Hybrid", "duration": "6 months", "stipend": "UGX 1,400,000 / month", "deadline": "2027-05-20", "slots": 4, "status": "Open", "applicants": 92, "docs": ["Transcript", "Student ID", "CV"], "testimonial": True, "about": "Join Uganda's core network reliability and MoMo API integration engineers supporting national uptime and merchant sandboxes.", "duties": ["Monitor core network telemetry alerts", "Build Python automation scripts for API health checks", "Document merchant integration guides"], "skills_required": ["Networking & Telecoms", "Python", "APIs", "SQL"]},
    {"id": "p18", "title": "Graduate Software Engineer", "org_id": "o16", "courses": ["Software Engineering", "Computer Science", "Information Technology"], "grade": "Second Class Lower", "loc": "Kampala", "mode": "Hybrid", "duration": "12 months", "stipend": "UGX 3,200,000 / month", "deadline": "2027-06-01", "slots": 3, "status": "Open", "applicants": 78, "docs": ["Transcript", "CV", "Portfolio"], "testimonial": False, "about": "Full-time graduate engineering track building Kampala rider dispatch, cashless wallet settlement and merchant web portals.", "duties": ["Ship TypeScript services and React dashboards", "Integrate mobile-money settlement webhooks", "Pair with senior engineers on code reviews"], "opportunity_type": "entry_level", "salary_range": "UGX 2,800,000 - 3,800,000 / month", "probation_period": "3 months", "training_included": True, "career_path": "Graduate Engineer to Mid-Level Backend/Frontend Engineer in 12 months", "skills_required": ["TypeScript", "React", "Node.js", "APIs", "Git"]},
    {"id": "p19", "title": "Corporate & Commercial Legal Clerkship", "org_id": "o20", "courses": ["Law"], "grade": "Second Class Upper", "loc": "Kampala", "mode": "On-site", "duration": "5 months", "stipend": "UGX 1,000,000 / month", "deadline": "2027-05-18", "slots": 3, "status": "Open", "applicants": 44, "docs": ["Transcript", "Recommendation letter", "Writing sample"], "testimonial": True, "about": "Clerkship for LLB candidates and Law Development Centre finalists supporting commercial agreements, regulatory filings and Ugandan court briefs.", "duties": ["Draft commercial contracts and board resolutions", "Conduct statutory and East African case research", "Prepare transaction due-diligence bundles"], "skills_required": ["Legal Research", "Contract Drafting", "Policy Analysis", "Report Writing"]},
    {"id": "p20", "title": "Agribusiness Value-Chain Intern", "org_id": "o17", "courses": ["Agribusiness", "Agriculture", "Business", "Economics"], "grade": "Second Class Lower", "loc": "Wakiso", "mode": "On-site", "duration": "4 months", "stipend": "UGX 850,000 / month", "deadline": "2027-05-25", "slots": 6, "status": "Open", "applicants": 31, "docs": ["Transcript", "National ID", "Recommendation letter"], "testimonial": True, "about": "Work across Wakiso and central dairy cooperatives on milk quality testing, farmer extension training and cold-chain dispatch tracking.", "duties": ["Coordinate farmer cooperative collection records", "Track cold-chain transport volumes in Excel", "Support field agronomy and feed workshops"], "skills_required": ["Agribusiness", "Field Agronomy", "Excel", "Stakeholder Engagement"]},
    {"id": "p21", "title": "Clinical Health Informatics Officer", "org_id": "o19", "courses": ["Medicine & Nursing", "Public Health", "Statistics", "Information Technology"], "grade": "Second Class Lower", "loc": "Kampala", "mode": "On-site", "duration": "12 months", "stipend": "UGX 2,600,000 / month", "deadline": "2027-06-05", "slots": 4, "status": "Open", "applicants": 53, "docs": ["Transcript", "National ID", "Recommendation letter"], "testimonial": False, "about": "Entry-level clinical informatics appointment supporting Mulago wards in DHIS2 reporting, triage records and patient outcome audits.", "duties": ["Audit electronic ward admissions and DHIS2 feeds", "Train clinical records clerks on quality standards", "Generate monthly epidemiology summaries"], "opportunity_type": "entry_level", "salary_range": "UGX 2,400,000 - 2,900,000 / month", "probation_period": "3 months", "training_included": True, "career_path": "Clinical Informatics Officer to Regional HMIS Lead", "skills_required": ["Clinical Data", "Patient Records", "Health Informatics", "Data Cleaning"]},
    {"id": "p22", "title": "SME Banking & Microfinance Graduate Trainee", "org_id": "o12", "courses": ["Accounting & Finance", "Business", "Economics", "Procurement & Supply Chain"], "grade": "Second Class Upper", "loc": "Mbarara", "mode": "On-site", "duration": "12 months", "stipend": "UGX 2,400,000 / month", "deadline": "2027-06-10", "slots": 5, "status": "Open", "applicants": 67, "docs": ["Transcript", "National ID", "Recommendation letter"], "testimonial": True, "about": "Structured graduate banking rotation across Western Uganda branches covering SME credit appraisal, agricultural loans and branch operations.", "duties": ["Build cashflow models for SME loan appraisals", "Review collateral and financial statements", "Conduct client field visits across Ankole districts"], "opportunity_type": "entry_level", "salary_range": "UGX 2,200,000 - 2,700,000 / month", "probation_period": "6 months", "training_included": True, "career_path": "Graduate Trainee to Credit Relationship Manager", "skills_required": ["Financial Modelling", "Accounting & Tax", "Excel", "Communication"]},
    {"id": "p23", "title": "Youth Digital Literacy & Training Intern", "org_id": "o18", "courses": ["Education", "Information Technology", "Mass Communication", "Journalism & Communication"], "grade": "Second Class Lower", "loc": "Gulu", "mode": "Hybrid", "duration": "6 months", "stipend": "UGX 900,000 / month", "deadline": "2027-05-28", "slots": 4, "status": "Open", "applicants": 29, "docs": ["Transcript", "Student ID", "Recommendation letter"], "testimonial": True, "about": "Facilitate hands-on digital literacy, career readiness and practical office software bootcamps for secondary school and TVET youth across Acholi.", "duties": ["Facilitate weekly youth ICT workshops", "Organise community curriculum handbooks", "Track graduate attendance and mentorship outcomes"], "skills_required": ["Curriculum Design", "Communication", "Stakeholder Engagement", "Teamwork"]},
    {"id": "p24", "title": "GIS District Health & Water Mapping Gig", "org_id": "o14", "courses": ["Civil Engineering", "Public Health", "Statistics", "Agriculture"], "grade": "CGPA 2.5+", "loc": "Entebbe", "mode": "Hybrid", "duration": "6 weeks", "stipend": "UGX 1,800,000 flat", "deadline": "2027-05-12", "slots": 2, "status": "Open", "applicants": 21, "docs": ["Transcript", "Portfolio"], "testimonial": False, "about": "Short-term geospatial project compiling district health-centre coordinates and borehole coverage layers into Ministry briefings.", "duties": ["Clean district GPS coordinates and facility registries", "Produce QGIS regional coverage maps", "Deliver summary indicator dashboard"], "opportunity_type": "gig", "duration_hours": 60, "budget_range": "UGX 1,500,000 - 2,200,000", "milestones": ["Coordinate cleanup", "QGIS map layers", "Executive briefing export"], "remote_ok": True, "skills_required": ["GIS & Mapping", "Data Cleaning", "Dashboards", "Report Writing"]},
]

JOBS: list[dict] = [
    {"id": "j1", "title": "Junior Product Designer", "org_id": "o4", "loc": "Remote", "mode": "Remote", "employment_type": "Full time", "salary": "$1,800 / month", "closes_at": "2026-12-15", "summary": "Design clear product experiences with a small senior team.", "requirements": ["Figma", "UI Design", "Portfolio"], "status": "Open", "review_status": "approved"},
    {"id": "j2", "title": "Graduate Data Analyst", "org_id": "o2", "loc": "Kampala", "mode": "On-site", "employment_type": "Full time", "salary": "UGX 2,000,000 / month", "closes_at": "2026-12-10", "summary": "Turn public-sector datasets into useful decisions and reports.", "requirements": ["SQL", "Excel", "Statistics"], "status": "Open"},
    {"id": "j3", "title": "Software Engineer I", "org_id": "o5", "loc": "Berlin", "mode": "Hybrid", "employment_type": "Full time", "salary": "€3,200 / month", "closes_at": "2026-12-20", "summary": "Build reliable payment tools for merchants across East Africa.", "requirements": ["Python", "APIs", "Git"], "status": "Open"},
    {"id": "j4", "title": "Monitoring and Evaluation Officer", "org_id": "o9", "loc": "Kampala", "mode": "On-site", "employment_type": "Full time", "salary": "UGX 2,400,000 / month", "closes_at": "2026-12-08", "summary": "Support evidence-led programmes that improve livelihoods.", "requirements": ["Monitoring & Evaluation", "Report Writing"], "status": "Open"},
    {"id": "j5", "title": "Tax Compliance & EFRIS Officer", "org_id": "o11", "loc": "Kampala", "mode": "On-site", "employment_type": "Full time", "salary": "UGX 4,200,000 / month", "closes_at": "2027-06-15", "summary": "Lead domestic taxpayer audits, EFRIS compliance reviews and revenue reconciliations across Kampala sectors.", "requirements": ["BCom / Accounting & Finance", "CPA Uganda Part II+", "Accounting & Tax"], "status": "Open", "review_status": "approved"},
    {"id": "j6", "title": "Full-Stack Software Engineer (Fintech)", "org_id": "o16", "loc": "Kampala", "mode": "Hybrid", "employment_type": "Full time", "salary": "UGX 5,500,000 / month", "closes_at": "2027-06-20", "summary": "Build high-availability transport and mobile-money settlement services for Uganda's largest urban mobility network.", "requirements": ["BSc Software Engineering / CS", "TypeScript", "Node.js", "APIs"], "status": "Open", "review_status": "approved"},
    {"id": "j7", "title": "Civil & Water Network Engineer", "org_id": "o15", "loc": "Jinja", "mode": "On-site", "employment_type": "Full time", "salary": "UGX 4,500,000 / month", "closes_at": "2027-06-18", "summary": "Manage municipal water pipeline rehabilitation, hydraulic modelling and plant expansion works in Eastern Uganda.", "requirements": ["BSc Civil Engineering", "UIPE Registration Track", "AutoCAD", "GIS & Mapping"], "status": "Open", "review_status": "approved"},
    {"id": "j8", "title": "Core Telecoms & MoMo Engineer", "org_id": "o13", "loc": "Kampala", "mode": "Hybrid", "employment_type": "Full time", "salary": "UGX 5,200,000 / month", "closes_at": "2027-06-25", "summary": "Maintain carrier-grade IP/MPLS telecom links and automate mobile-money gateway observability.", "requirements": ["BSc Electrical / Telecoms Engineering", "Networking & Telecoms", "Python", "SQL"], "status": "Open", "review_status": "approved"},
    {"id": "j9", "title": "SME Credit & Relationship Officer", "org_id": "o12", "loc": "Mbarara", "mode": "On-site", "employment_type": "Full time", "salary": "UGX 3,100,000 / month", "closes_at": "2027-06-12", "summary": "Appraise commercial, school and agribusiness credit facilities and grow sustainable SME portfolios in Western Uganda.", "requirements": ["BBA / Accounting & Finance", "Financial Modelling", "Communication"], "status": "Open", "review_status": "approved"},
    {"id": "j10", "title": "Procurement & PPDA Contracts Specialist", "org_id": "o14", "loc": "Kampala", "mode": "On-site", "employment_type": "Full time", "salary": "UGX 3,800,000 / month", "closes_at": "2027-06-22", "summary": "Coordinate medical supply tendering, vendor evaluation and public-sector contract compliance under PPDA guidelines.", "requirements": ["Bachelor of Procurement & Supply Chain", "Procurement & PPDA", "Contract Drafting"], "status": "Open", "review_status": "approved"},
    {"id": "j11", "title": "Corporate & Commercial Legal Associate", "org_id": "o20", "loc": "Kampala", "mode": "On-site", "employment_type": "Full time", "salary": "UGX 4,000,000 / month", "closes_at": "2027-06-28", "summary": "Advise Ugandan and regional enterprises on corporate structuring, infrastructure PPPs and regulatory compliance.", "requirements": ["LLB Honours", "LDC Bar Course", "Contract Drafting", "Legal Research"], "status": "Open", "review_status": "approved"},
    {"id": "j12", "title": "Agronomy & Dairy Supply Chain Lead", "org_id": "o17", "loc": "Wakiso", "mode": "On-site", "employment_type": "Full time", "salary": "UGX 2,900,000 / month", "closes_at": "2027-06-14", "summary": "Oversee smallholder cooperative milk sourcing, forage extension programmes and refrigerated fleet scheduling.", "requirements": ["BSc Agriculture / Agribusiness", "Agribusiness", "Field Agronomy"], "status": "Open", "review_status": "approved"},
    {"id": "j13", "title": "Public Health Surveillance & HMIS Officer", "org_id": "o19", "loc": "Kampala", "mode": "On-site", "employment_type": "Full time", "salary": "UGX 4,400,000 / month", "closes_at": "2027-06-30", "summary": "Coordinate hospital DHIS2 clinical reporting, outbreak indicator tracking and quality improvement audits.", "requirements": ["MBChB / BSc Public Health", "Clinical Data", "Health Informatics"], "status": "Open", "review_status": "approved"},
    {"id": "j14", "title": "STEM Curriculum & Community Training Lead", "org_id": "o18", "loc": "Gulu", "mode": "Hybrid", "employment_type": "Contract", "salary": "UGX 2,600,000 / month", "closes_at": "2027-06-24", "summary": "Deliver applied software, digital literacy and career coaching tracks for Northern Uganda university and TVET graduates.", "requirements": ["BEd / BA Education / ICT", "Curriculum Design", "Stakeholder Engagement"], "status": "Open", "review_status": "approved"},
]

# --- Sensitive data loaded from environment variables ---

DEMO_PASSWORD = os.getenv("DEMO_PASSWORD", "password123")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "changeme")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@example.com")

DEMO_USERS: list[dict] = [
    {"email": "amina@makerere.ac.ug", "name": "Amina Nakato", "role": "student"},
    {"email": "brian@example.com", "name": "Brian Ssekandi", "role": "jobseeker"},
    {"email": "hiring@lumenlabs.example", "name": "Lumen Labs", "role": "employer", "org_id": "o4"},
    {"email": "office@makerere.ac.ug", "name": "Makerere University", "role": "admin"},
    {"email": ADMIN_EMAIL, "name": "Admin User", "role": "admin", "password": ADMIN_PASSWORD},
]


def seed_if_empty(session: Session) -> None:
    existing_org_ids = {row[0] for row in session.query(OrganisationORM.id).all()}
    missing_orgs = [OrganisationORM(**org) for org in ORGS if org["id"] not in existing_org_ids]
    if missing_orgs:
        session.add_all(missing_orgs)
        session.commit()

    existing_placement_ids = {row[0] for row in session.query(PlacementORM.id).all()}
    missing_placements = [PlacementORM(**p) for p in PLACEMENTS if p["id"] not in existing_placement_ids]
    if missing_placements:
        session.add_all(missing_placements)
        session.commit()

    existing_job_ids = {row[0] for row in session.query(JobORM.id).all()}
    missing_jobs = [JobORM(**job) for job in JOBS if job["id"] not in existing_job_ids]
    if missing_jobs:
        session.add_all(missing_jobs)
        session.commit()
    if session.query(UserORM).count() == 0:
        today = date.today().isoformat()
        session.add_all(
            [
                UserORM(
                    id=uuid4().hex,
                    email=u["email"],
                    name=u["name"],
                    role=u["role"],
                    password_hash=hash_password(u.get("password", DEMO_PASSWORD)),
                    created_at=today,
                    org_id=u.get("org_id"),
                )
                for u in DEMO_USERS
            ]
        )
        session.commit()
    else:
        # Ensure admin user exists with correct role (handles pre-existing student accounts)
        admin_email = "akandwanahojonanrwangoga@gmail.com"
        admin_user = session.query(UserORM).filter_by(email=admin_email).first()
        if admin_user and admin_user.role != "admin":
            admin_user.role = "admin"
            admin_user.password_hash = hash_password(ADMIN_PASSWORD)
            session.commit()
        elif not admin_user:
            today = date.today().isoformat()
            session.add(
                UserORM(
                    id=uuid4().hex,
                    email=admin_email,
                    name="Admin User",
                    role="admin",
                    password_hash=hash_password(ADMIN_PASSWORD),
                    created_at=today,
                )
            )
            session.commit()

    # Backfill the employer→org link on accounts that predate the org_id column
    # (the real Neon database was seeded before R1d, so its employer row still
    # has org_id NULL). Idempotent and scoped to rows that are still unlinked,
    # so it never overwrites a deliberate change.
    for u in DEMO_USERS:
        desired = u.get("org_id")
        if not desired:
            continue
        row = session.query(UserORM).filter_by(email=u["email"], org_id=None).first()
        if row is not None:
            row.org_id = desired
            session.commit()
