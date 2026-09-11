/**
 * ORCA — Bilingual Localization Engine with Morphicons Integration
 * Seamlessly pairs pure English and Telugu with animated vector Morphicons.
 */

function mIcon(name, opts = {}) {
  if (typeof window !== 'undefined' && window.Morphicons) {
    return window.Morphicons.get(name, opts);
  }
  return '';
}

const ORCA_TRANSLATIONS = {
  en: {
    // Navigation Tabs
    nav_overview: "Overview",
    nav_chatbot: "AI Chatbot",
    nav_map: "Marine Map",
    nav_alerts: "Alerts",
    nav_evidences: "Evidences",
    base_port_label: "Base Port:",

    // Landing Page Hero
    hero_badge: "Marine Ecosystem Reasoning • PS 26176",
    hero_h1_highlight: "Know the Sea",
    hero_h1_rest: "Before You Sail.",
    hero_sub: "ORCA gives Andhra Pradesh's coastal fisherfolk real-time, explainable guidance on Potential Fishing Zones (PFZ), ocean weather, and hazard warnings — in your own language.",
    hero_cta: "Ask ORCA Chatbot",
    hero_map_btn: "Explore Marine Map",
    telugu_support: "English Language Guidance Active",

    // Coastal Conditions Snapshot Card
    snap_port_title: "COASTAL CONDITIONS • VISAKHAPATNAM",
    verdict_caution: "CAUTION",
    verdict_safe: "SAFE TO SAIL",
    snap_wind_label: "Wind Speed",
    snap_wind_val: "14 kts ENE",
    snap_wind_sub: "Moderate Breeze",
    snap_waves_label: "Wave Height",
    snap_waves_val: "1.8m swell",
    snap_waves_sub: "Spring Tide Active",
    snap_temp_label: "Sea Surface Temp",
    snap_temp_val: "28.3 °C",
    snap_temp_sub: "Optimal Thermal Front",
    snap_boundary_label: "Boundary Status",
    snap_boundary_val: "114 NM Clear",
    snap_boundary_sub: "Inside Indian EEZ",
    snap_advisory: "Safe for motorized & mechanized vessels up to 15 NM. Non-motorized catamarans advised to stay within 5 NM due to swell near Godavari spit.",
    snap_data_footer: "Data: INCOIS & IMD",
    snap_refresh_footer: "Refreshed 12m ago",

    // How It Works
    how_tag: "Workflow & Usability",
    how_h2: "Ask a question. Get a clear answer, backed by real data.",
    how_sub: "Designed for coastal fisherfolk to make complex marine science immediately understandable before leaving harbor.",
    how_step1_title: "Ask in your language",
    how_step1_desc: "Type or speak questions in plain language directly into the AI chatbot. Clean, intuitive, and non-technical.",
    how_step1_sub: "Natural conversational guidance",
    how_step2_title: "See it on the map",
    how_step2_desc: "Live Potential Fishing Zones (PFZ), wave heights, cyclone cones, and the International Maritime Boundary Line (IMBL) rendered with clear colors.",
    how_step2_sub: "Real-time visual maritime map",
    how_step3_title: "Know why & sail safely",
    how_step3_desc: "Every AI recommendation displays an expandable Evidence Drawer with the exact satellite telemetry and weather bulletins used.",
    how_step3_sub: "Traceable satellite & radar telemetry",

    // Query Showcase Section
    query_sec_tag: "Instant Answers",
    query_sec_h2: "Try asking ORCA questions like:",
    query_sec_sub: "Tap any query below to launch directly into the live Chatbot with pre-calculated geospatial reasoning.",
    query_ask_action: "Ask in Chat",

    // Explainability Section
    explain_tag: "Traceability & Rigor",
    explain_h3: "Every answer, fully explained.",
    explain_desc: "ORCA never produces an unverified recommendation. Every safety verdict and fishing zone suggestion is cross-checked across real-time satellite oceanography, Indian Meteorological Department radar sweeps, and Coast Guard boundary geofences.",
    explain_btn: "View Data Sources & Audits",

    // Chatbot View
    chat_welcome_badge: "COLLABORATIVE REASONING AGENTS ACTIVE",
    chat_welcome_title: "How can ORCA help you sail safely today?",
    chat_welcome_sub: "Ask about fishing zones, wave conditions, weather, or boundary alerts.",
    chat_placeholder: "Ask ORCA in plain English (e.g., Where are the best fishing zones today?)...",
    chat_send_btn: "Send",

    // Map Overlays
    map_overlays_title: "Map Overlays",
    toggle_pfz: "Potential Fishing Zones (PFZ)",
    toggle_hazard: "Cyclone & Wave Hazards",
    toggle_imbl: "IMBL International Border",
    toggle_route: "Safe Navigation Route",

    // Alerts View
    alerts_tag: "Active Maritime Warnings",
    alerts_h2: "Andhra Pradesh Coastal Hazard Bulletins",
    alerts_sub: "Verified bulletins from IMD Regional Cyclone Warning Centre & INCOIS Early Warning Systems.",
    alert_banner_title: "CRITICAL SWELL SURGE ALERT • GODAVARI DELTA TO KAKINADA",
    alert_banner_desc: "Spring tide swell heights reaching 2.8m to 3.4m. Traditional non-motorized catamarans and country craft are strongly advised not to venture into deep sea beyond 5 nautical miles.",
    alert1_badge: "Caution",
    alert1_title: "Bay of Bengal Deep Depression",
    alert1_body: "Centered near 16.4°N, 84.5°E (~120 km offshore). Squally winds of 45–55 km/h gusting to 65 km/h expected in offshore waters. Port cautionary signal #3 hoisted.",
    alert1_source: "Source: IMD RCWC Amaravati",
    alert1_valid: "Valid: Today 23:59 IST",

    alert2_badge: "Warning",
    alert2_title: "High Wave Surge Advisory",
    alert2_body: "Wave period 8–10 seconds with steep cresting breakers near river mouths. Nearshore operations should exercise extreme vigilance during low-to-high tide transition.",
    alert2_source: "Source: INCOIS Moored Buoy Network",
    alert2_valid: "Valid: Next 18 Hours",

    alert3_badge: "Advisory",
    alert3_title: "Afternoon Thundersqualls",
    alert3_body: "Doppler radar indicates convective cloud tops up to 11 km over northern coastal AP. Fishermen in open fiber boats should conclude operations before 16:00 IST.",
    alert3_source: "Source: DWR Visakhapatnam Radar",
    alert3_valid: "Valid: 15:30 – 19:00 IST",

    alert4_badge: "Territorial",
    alert4_title: "International Border Geofence",
    alert4_body: "All vessels operating from Visakhapatnam and Kakinada must maintain a minimum 15 nautical mile buffer from the IMBL datum. Indian Coast Guard patrols are monitoring VHF Ch 16.",
    alert4_source: "Source: Indian Coast Guard HQ-06",
    alert4_valid: "Status: Active Geofence",

    // Evidence View
    ev_tag: "Explainable AI & Trust Architecture",
    ev_h2: "Data Feeds, Bulletins & Verification Sources",
    ev_sub: "Every recommendation delivered by ORCA is traceable to authenticated national oceanographic and meteorological sensors.",
    ev_zero_title: "Zero Black-Box Recommendations",
    ev_zero_desc: "ORCA uses collaborative multi-agent reasoning. Before answering any query about fishing zones or sail safety, specialized agents synthesize telemetry from Oceansat-3, AVHRR, Doppler weather radars, and Coast Guard boundary layers. If data is stale or conflicting, a caution warning is automatically issued.",

    // Footer
    footer_tag: "ORCA — Built for the coastal fisherfolk of Andhra Pradesh • Smart India Hackathon 2026 (PS 26176)",
  },

  te: {
    // Navigation Tabs
    nav_overview: "అవలోకనం",
    nav_chatbot: "AI చాట్‌బాట్",
    nav_map: "సముద్ర పటం",
    nav_alerts: "హెచ్చరికలు",
    nav_evidences: "ఆధారాలు",
    base_port_label: "ప్రధాన రేవు:",

    // Landing Page Hero
    hero_badge: "సముద్ర పర్యావరణ వ్యవస్థ విశ్లేషణ • PS 26176",
    hero_h1_highlight: "సముద్రాన్ని తెలుసుకోండి",
    hero_h1_rest: "వేటకు వెళ్లే ముందే.",
    hero_sub: "ORCA ఆంధ్రప్రదేశ్ తీరప్రాంత మత్స్యకారులకు నిజ-సమయ చేపల వేట ప్రాంతాలు (PFZ), వాతావరణం మరియు ప్రమాదాల సమాచారాన్ని మీ స్వంత భాషలోనే అందిస్తుంది.",
    hero_cta: "ఆర్కా చాట్‌బాట్‌ను అడగండి",
    hero_map_btn: "సముద్ర పటం చూడండి",
    telugu_support: "పూర్తి తెలుగు మార్గదర్శకత్వం అందుబాటులో ఉంది",

    // Coastal Conditions Snapshot Card
    snap_port_title: "తీరప్రాంత పరిస్థితులు • విశాఖపట్నం",
    verdict_caution: "జాగ్రత్త",
    verdict_safe: "సురక్షితం",
    snap_wind_label: "గాలుల వేగం",
    snap_wind_val: "14 నాట్స్ ENE",
    snap_wind_sub: "మోస్తరు గాలులు",
    snap_waves_label: "అలల ఎత్తు",
    snap_waves_val: "1.8 మీటర్లు",
    snap_waves_sub: "ఉధృత అలలు చురుగ్గా ఉన్నాయి",
    snap_temp_label: "సముద్ర ఉష్ణోగ్రత",
    snap_temp_val: "28.3 °C",
    snap_temp_sub: "అనుకూలమైన ఉష్ణోగ్రత",
    snap_boundary_label: "సరిహద్దు స్థితి",
    snap_boundary_val: "114 NM దూరం",
    snap_boundary_sub: "భారత జలాల్లోనే సురక్షితం",
    snap_advisory: "మోటరైజ్డ్ బోట్లు 15 నాటికల్ మైళ్ల వరకు సురక్షితంగా వెళ్లవచ్చు. గోదావరి తీరంలో 3.2 మీటర్ల అలల కారణంగా చిన్న పడవలు తీరానికి సమీపంలోనే ఉండాలి.",
    snap_data_footer: "మూలం: ఇన్‌కాయిస్ & ఐఎండి",
    snap_refresh_footer: "12 నిమిషాల క్రితం అప్‌డేట్",

    // How It Works
    how_tag: "వినియోగ విధానం",
    how_h2: "ఒక ప్రశ్న అడగండి. ఉపగ్రహ ఆధారాలతో స్పష్టమైన సమాధానం పొందండి.",
    how_sub: "మత్స్యకారులు రేవు దాటే ముందే సంక్లిష్టమైన సముద్ర శాస్త్రాన్ని సులభంగా అర్థం చేసుకునేలా రూపొందించబడింది.",
    how_step1_title: "మీ భాషలోనే అడగండి",
    how_step1_desc: "తెలుగులో మాట్లాడండి లేదా ప్రశ్నను టైప్ చేయండి. ఎలాంటి సాంకేతిక చిక్కులు లేని సరళమైన వ్యవస్థ.",
    how_step1_sub: "సులభమైన సంభాషణ మార్గదర్శకత్వం",
    how_step2_title: "పటంలో స్పష్టంగా చూడండి",
    how_step2_desc: "చేపల వేట ప్రాంతాలు (PFZ), అలల ఎత్తు, తుఫాను కేంద్రాలు మరియు అంతర్జాతీయ సముద్ర సరిహద్దులను రంగుల గుర్తుల ద్వారా చూడండి.",
    how_step2_sub: "ప్రత్యక్ష సముద్ర పటం",
    how_step3_title: "ఆధారాలు చూసి సురక్షితంగా సాగండి",
    how_step3_desc: "ప్రతి సిఫార్సు వెనుక ఉన్న ఉపగ్రహ వివరాలు మరియు వాతావరణ శాఖ సమాచారాన్ని మీరు నేరుగా పరిశీలించవచ్చు.",
    how_step3_sub: "ధృవీకరించబడిన ఉపగ్రహ పరిశీలనలు",

    // Query Showcase Section
    query_sec_tag: "తక్షణ సమాధానాలు",
    query_sec_h2: "ఆర్కాను ఇలాంటి ప్రశ్నలు అడగండి:",
    query_sec_sub: "నేరుగా ఆర్కా చాట్‌బాట్‌లో సమాధానం తెలుసుకోవడానికి క్రింది ప్రశ్నలపై క్లిక్ చేయండి.",
    query_ask_action: "చాట్‌లో అడగండి",

    // Explainability Section
    explain_tag: "పారదర్శకత & విశ్వసనీయత",
    explain_h3: "ప్రతి సమాధానం పూర్తిగా ధృవీకరించబడింది.",
    explain_desc: "ఆర్కా ఎలాంటి ఊహాగానాలు లేకుండా వాస్తవ సమాచారాన్ని మాత్రమే అందిస్తుంది. ఉపగ్రహ చిత్రాలు, రాడార్ పరిశీలనలు మరియు కోస్ట్ గార్డ్ సరిహద్దులను క్రోడీకరించి సిఫార్సులు రూపొందిస్తుంది.",
    explain_btn: "డేటా మూలాలను పరిశీలించండి",

    // Chatbot View
    chat_welcome_badge: "ఆర్కా రీజనింగ్ ఏజెంట్లు సిద్ధంగా ఉన్నాయి",
    chat_welcome_title: "ఈరోజు మీకు సముద్రంలో ఎలా సహాయపడగలను?",
    chat_welcome_sub: "చేపల వేట ప్రాంతాలు, అలల పరిస్థితి, తుఫాను హెచ్చరికలు లేదా సరిహద్దు వివరాలను అడగండి.",
    chat_placeholder: "మీ ప్రశ్నను తెలుగులో అడగండి (ఉదా: ఈరోజు చేపల వేట ప్రాంతాలు ఎక్కడ ఉన్నాయి?)...",
    chat_send_btn: "పంపండి",

    // Map Overlays
    map_overlays_title: "పటాల పొరలు",
    toggle_pfz: "చేపల వేట ప్రాంతాలు (PFZ)",
    toggle_hazard: "తుఫాను & అలల హెచ్చరికలు",
    toggle_imbl: "సముద్ర సరిహద్దు (IMBL)",
    toggle_route: "సురక్షిత నావిగేషన్ మార్గం",

    // Alerts View
    alerts_tag: "ప్రస్తుత సముద్ర హెచ్చరికలు",
    alerts_h2: "ఆంధ్రప్రదేశ్ తీరప్రాంత ప్రమాద హెచ్చరికల బులిటెన్",
    alerts_sub: "భారత వాతావరణ శాఖ (IMD) మరియు ఇన్‌కాయిస్ (INCOIS) జారీ చేసిన అధికారిక హెచ్చరికలు.",
    alert_banner_title: "తీవ్ర అలల ఉధృతి హెచ్చరిక • గోదావరి డెల్టా నుండి కాకినాడ",
    alert_banner_desc: "స్ప్రింగ్ టైడ్ ప్రభావంతో అలలు 2.8 నుండి 3.4 మీటర్ల ఎత్తుకు ఎగసిపడుతున్నాయి. సాంప్రదాయ పడవలు మరియు చిన్న క్రాఫ్ట్‌లు 5 నాటికల్ మైళ్ల కంటే లోపలికి వెళ్లవద్దని హెచ్చరిక.",
    alert1_badge: "జాగ్రత్త",
    alert1_title: "బంగాళాఖాతంలో తీవ్ర వాయుగుండం",
    alert1_body: "తీరానికి 120 కి.మీ ఆవల కేంద్రీకృతమై ఉంది. గంటకు 45-65 కి.మీ వేగంతో ఈదురుగాలులు వీచే అవకాశం ఉంది. 3వ నంబర్ ప్రమాద హెచ్చరిక జారీ చేయబడింది.",
    alert1_source: "మూలం: ఐఎండి అమరావతి",
    alert1_valid: "చెల్లుబాటు: నేడు రాత్రి 23:59 వరకు",

    alert2_badge: "తీవ్రమైనది",
    alert2_title: "తీవ్ర అలల ఉధృతి హెచ్చరిక",
    alert2_body: "నదీ ముఖద్వారాల వద్ద అలల తీవ్రత అధికంగా ఉంది. తీరప్రాంత పడవలు ఆటు-పోట్ల సమయంలో తీవ్ర అప్రమత్తత పాటించాలి.",
    alert2_source: "మూలం: ఇన్‌కాయిస్ వేవ్ బాయ్ నెట్‌వర్క్",
    alert2_valid: "చెల్లుబాటు: రాబోయే 18 గంటలు",

    alert3_badge: "సూచన",
    alert3_title: "సాయంత్రం ఉరుములు, మెరుపుల వర్షం",
    alert3_body: "ఉత్తర కోస్తాలో దట్టమైన ఉరుముల మేఘాలు వ్యాపిస్తున్నాయి. చిన్న ఫైబర్ బోట్లు సాయంత్రం 16:00 లోపు సురక్షిత తీరానికి చేరుకోవాలి.",
    alert3_source: "మూలం: విశాఖ డాప్లర్ రాడార్",
    alert3_valid: "చెల్లుబాటు: 15:30 – 19:00 IST",

    alert4_badge: "సరిహద్దు",
    alert4_title: "అంతర్జాతీయ సముద్ర సరిహద్దు హెచ్చరిక",
    alert4_body: "విశాఖపట్నం, కాకినాడ నుండి వెళ్లే పడవలు అంతర్జాతీయ సరిహద్దుకు 15 నాటికల్ మైళ్ల దూరంలో ఉండాలి. కోస్ట్ గార్డ్ పర్యవేక్షణ కొనసాగుతోంది.",
    alert4_source: "మూలం: భారత కోస్ట్ గార్డ్ HQ-06",
    alert4_valid: "స్థితి: చురుకైన సరిహద్దు రక్షణ",

    // Evidence View
    ev_tag: "వివరణాత్మక AI & పారదర్శకత",
    ev_h2: "ఉపగ్రహ డేటా & ధృవీకరణ మూలాలు",
    ev_sub: "ఆర్కా అందించే ప్రతి సిఫార్సు జాతీయ ఉపగ్రహ మరియు సముద్ర పరిశోధనా సెన్సార్ల ఆధారంగా ధృవీకరించబడుతుంది.",
    ev_zero_title: "పూర్తిగా పారదర్శకమైన సిఫార్సులు",
    ev_zero_desc: "ఆర్కా ఓషన్‌శాట్-3 ఉపగ్రహం, డాప్లర్ వాతావరణ రాడార్ మరియు కోస్ట్ గార్డ్ సరిహద్దు సమాచారాన్ని విశ్లేషించి మాత్రమే సలహాలు ఇస్తుంది. ఏవైనా అనుమానాలుంటే హెచ్చరికలను జారీ చేస్తుంది.",

    // Footer
    footer_tag: "ORCA — ఆంధ్రప్రదేశ్ మత్స్యకారుల కోసం ప్రత్యేకంగా రూపొందించబడింది • స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 (PS 26176)",
  },
};

// 8 Canned PRD Queries with Morphicon keys
const ORCA_QUERIES_I18N = {
  en: [
    { morphicon: "fish", text: "Where are the best fishing zones near me today?", query: "Where are the best fishing zones near me today?" },
    { morphicon: "warning", text: "Is it safe to go out to sea right now?", query: "Is it safe to go out to sea right now?" },
    { morphicon: "location", text: "Show me the nearest PFZ", query: "Show me the nearest PFZ" },
    { morphicon: "cyclone", text: "Are there any cyclone alerts nearby?", query: "Are there any cyclone alerts nearby?" },
    { morphicon: "flag", text: "How far am I from the IMBL?", query: "How far am I from the IMBL?" },
    { morphicon: "wave", text: "What's the wave height near my location?", query: "What's the wave height near my location?" },
    { morphicon: "route", text: "Plan a safe route to the fishing zone", query: "Plan a safe route to the fishing zone" },
    { morphicon: "lightning", text: "Any lightning warnings for today?", query: "Any lightning warnings for today?" },
  ],
  te: [
    { morphicon: "fish", text: "ఈరోజు నాకు సమీపంలో ఉత్తమ చేపల వేట ప్రాంతాలు ఎక్కడ ఉన్నాయి?", query: "Where are the best fishing zones near me today?" },
    { morphicon: "warning", text: "ఇప్పుడు సముద్రంలోకి వేటకు వెళ్లడం సురక్షితమేనా?", query: "Is it safe to go out to sea right now?" },
    { morphicon: "location", text: "నాకు దగ్గర్లోని చేపల వేట ప్రాంతాన్ని (PFZ) చూపించు", query: "Show me the nearest PFZ" },
    { morphicon: "cyclone", text: "సమీపంలో ఏవైనా తుఫాను హెచ్చరికలు ఉన్నాయా?", query: "Are there any cyclone alerts nearby?" },
    { morphicon: "flag", text: "నేను అంతర్జాతీయ సముద్ర సరిహద్దుకు (IMBL) ఎంత దూరంలో ఉన్నాను?", query: "How far am I from the IMBL?" },
    { morphicon: "wave", text: "మా ప్రాంతం దగ్గర అలల ఎత్తు ఎంతవరకు ఉంది?", query: "What's the wave height near my location?" },
    { morphicon: "route", text: "చేపల వేట ప్రాంతానికి సురక్షితమైన మార్గాన్ని ప్లాన్ చేయి", query: "Plan a safe route to the fishing zone" },
    { morphicon: "lightning", text: "ఈరోజు ఉరుములు, మెరుపుల హెచ్చరికలు ఏమైనా ఉన్నాయా?", query: "Any lightning warnings for today?" },
  ],
};

const ORCA_PORTS_I18N = {
  en: [
    { value: 'visakhapatnam', text: 'Visakhapatnam Harbor' },
    { value: 'kakinada', text: 'Kakinada Fishery Port' },
    { value: 'machilipatnam', text: 'Machilipatnam Coast' },
    { value: 'nizampatnam', text: 'Nizampatnam Harbor' },
  ],
  te: [
    { value: 'visakhapatnam', text: 'విశాఖపట్నం రేవు' },
    { value: 'kakinada', text: 'కాకినాడ మత్స్య రేవు' },
    { value: 'machilipatnam', text: 'మచిలీపట్నం తీరం' },
    { value: 'nizampatnam', text: 'నిజాంపట్నం రేవు' },
  ],
};

class OrcaI18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('orca_lang') || 'en';
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang);

    // Bind Language Toggle Buttons
    const btnEn = document.getElementById('lang-btn-en');
    const btnTe = document.getElementById('lang-btn-te');

    if (btnEn && btnTe) {
      btnEn.addEventListener('click', () => this.setLanguage('en'));
      btnTe.addEventListener('click', () => this.setLanguage('te'));
    }
  }

  setLanguage(lang) {
    if (lang !== 'en' && lang !== 'te') return;
    this.currentLang = lang;
    localStorage.setItem('orca_lang', lang);
    this.applyLanguage(lang);
  }

  applyLanguage(lang) {
    document.documentElement.lang = lang;
    const dict = ORCA_TRANSLATIONS[lang] || ORCA_TRANSLATIONS.en;

    // Update Language Toggle Button States
    const btnEn = document.getElementById('lang-btn-en');
    const btnTe = document.getElementById('lang-btn-te');
    if (btnEn && btnTe) {
      if (lang === 'te') {
        btnTe.classList.add('lang-active');
        btnEn.classList.remove('lang-active');
      } else {
        btnEn.classList.add('lang-active');
        btnTe.classList.remove('lang-active');
      }
    }

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Update input placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update Port Selector Options to pure language
    const portSelect = document.getElementById('port-select');
    if (portSelect) {
      const currentVal = portSelect.value;
      const portList = ORCA_PORTS_I18N[lang] || ORCA_PORTS_I18N.en;
      portSelect.innerHTML = portList
        .map((p) => `<option value="${p.value}" ${p.value === currentVal ? 'selected' : ''}>${p.text}</option>`)
        .join('');
    }

    // Update Quick Action Chips Text & Morphicons
    this.updateQueryChips(lang);

    // Update Chat Initial Advisory message if present
    if (window.orcaChat && typeof window.orcaChat.renderInitialAdvisory === 'function') {
      window.orcaChat.renderInitialAdvisory();
    }

    // Redraw map with selected language labels
    if (window.orcaMap && typeof window.orcaMap.draw === 'function') {
      window.orcaMap.draw();
    }
  }

  updateQueryChips(lang) {
    const list = ORCA_QUERIES_I18N[lang] || ORCA_QUERIES_I18N.en;

    // 1. Landing Page Showcase Chips
    const showcaseContainer = document.querySelector('.query-chips-grid');
    if (showcaseContainer) {
      const cards = showcaseContainer.querySelectorAll('.query-chip-card');
      cards.forEach((card, index) => {
        if (list[index]) {
          const iconContainer = card.querySelector('.query-chip-icon');
          if (iconContainer && window.Morphicons) {
            iconContainer.innerHTML = window.Morphicons.get(list[index].morphicon, { size: 16 });
          }
          const textEl = card.querySelector('.query-chip-text');
          if (textEl) textEl.textContent = list[index].text;
          card.setAttribute('data-query', list[index].query);
        }
      });
    }

    // 2. Chatbot View Quick Chips
    const quickChipsContainers = document.querySelectorAll('.quick-chips-row');
    quickChipsContainers.forEach((row) => {
      const chips = row.querySelectorAll('.quick-chip');
      chips.forEach((chip, index) => {
        if (list[index]) {
          const iconSvg = window.Morphicons ? window.Morphicons.get(list[index].morphicon, { size: 15 }) : '';
          const chipLabel = list[index].text.split('?')[0].split('(')[0].trim();
          chip.innerHTML = `${iconSvg} <span>${chipLabel}</span>`;
          chip.setAttribute('data-query', list[index].query);
        }
      });
    });
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.orcaI18n = new OrcaI18nManager();
});
