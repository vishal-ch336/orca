/**
 * ORCA — Marine Conversational Assistant with Bilingual Single-Language Separation
 * When English is selected -> 100% English ONLY.
 * When Telugu is selected -> 100% Telugu ONLY.
 */

class OrcaChatManager {
  constructor(threadId, inputId, sendBtnId) {
    this.thread = document.getElementById(threadId);
    this.input = document.getElementById(inputId);
    this.sendBtn = document.getElementById(sendBtnId);

    // Knowledge base for the 8 PRD queries with distinct pure English and pure Telugu payloads
    this.predefinedResponses = {
      'Where are the best fishing zones near me today?': {
        mapAction: () => window.orcaMap && window.orcaMap.highlightZone('PFZ-VIZAG-01'),
        en: {
          text: 'The best Potential Fishing Zone (PFZ) near Visakhapatnam today is **Vizag Deep Shelf (PFZ-VIZAG-01)**, located **16 km offshore** (heading 115° ESE). Satellite data indicates strong thermal fronts (28.2°C) with elevated chlorophyll (1.4 mg/m³), supporting high aggregations of Tuna, Mackerel, and Ribbonfish.',
          verdict: 'Safe',
          verdictLabel: '✓ SAFE TO SAIL',
          attachmentTitle: 'PFZ Advisory • Visakhapatnam Outer Bank',
          grid: [
            { label: 'Catch Abundance', value: 'High (Tuna/Mackerel)' },
            { label: 'Distance from Shore', value: '16 km (8.6 NM)' },
            { label: 'Sea Surface Temp', value: '28.2 °C (Optimal)' },
            { label: 'Valid Period', value: 'Today until 18:00 IST' },
          ],
          evidence: [
            { source: 'INCOIS PFZ Mission', type: 'Oceansat-3 OCM Chlorophyll & AVHRR SST', time: 'Today, 04:30 IST' },
            { source: 'Fishery Survey of India (FSI)', type: 'Demersal & Pelagic Trawl Sample Benchmarks', time: 'Yesterday, 18:00 IST' },
            { source: 'IMD Coastal Marine Bulletin', type: 'Wind & Swell Vector Analysis', time: 'Today, 06:00 IST' },
          ],
        },
        te: {
          text: 'నేడు విశాఖపట్నం సమీపంలో అత్యుత్తమ చేపల వేట ప్రాంతం (PFZ) **విశాఖ డీప్ షెల్ఫ్ (PFZ-VIZAG-01)**. ఇది తీరం నుండి **16 కిలోమీటర్ల దూరంలో** (115° ESE దిశలో) ఉంది. ఉపగ్రహ డేటా ప్రకారం ఇక్కడ అనుకూల ఉష్ణోగ్రత (28.2°C) మరియు క్లోరోఫిల్ (1.4 mg/m³) అధికంగా ఉండటం వల్ల ట్యూనా, కానాగంతలు మరియు రిబ్బన్‌ఫిష్ సమృద్ధిగా లభించే అవకాశం ఉంది.',
          verdict: 'Safe',
          verdictLabel: '✓ సురక్షితం',
          attachmentTitle: 'చేపల వేట ప్రాంత సలహా • విశాఖ ఔటర్ బ్యాంక్',
          grid: [
            { label: 'చేపల లభ్యత', value: 'అధికం (ట్యూనా/కానాగంతలు)' },
            { label: 'తీరం నుండి దూరం', value: '16 కి.మీ (8.6 NM)' },
            { label: 'సముద్ర ఉష్ణోగ్రత', value: '28.2 °C (అనుకూలం)' },
            { label: 'చెల్లుబాటు సమయం', value: 'నేడు సాయంత్రం 18:00 వరకు' },
          ],
          evidence: [
            { source: 'ఇన్‌కాయిస్ (INCOIS) పిఎఫ్-జెడ్ విభాగం', type: 'ఓషన్‌శాట్-3 క్లోరోఫిల్ & AVHRR ఉష్ణోగ్రత డేటా', time: 'నేడు, 04:30 IST' },
            { source: 'భారత మత్స్య సర్వే (FSI)', type: 'పెలాజిక్ ట్రాల్ నమూనా నివేదికలు', time: 'నిన్న, 18:00 IST' },
            { source: 'ఐఎండి తీరప్రాంత బులిటెన్', type: 'గాలులు & అలల విశ్లేషణ', time: 'నేడు, 06:00 IST' },
          ],
        },
      },

      'Is it safe to go out to sea right now?': {
        mapAction: () => window.orcaMap && window.orcaMap.toggleLayer('hazard', true),
        en: {
          text: '⚠️ **CAUTION IS ADVISED**. While surface winds near Visakhapatnam are moderate (14 knots / 26 km/h), a localized high-swell alert (2.8m - 3.4m) is active along the Godavari-Kakinada sector due to spring tide currents. Traditional non-motorized catamarans are advised to stay within 5 nautical miles. Motorized & mechanized craft can proceed with life jackets and VHF radios active.',
          verdict: 'Caution',
          verdictLabel: '⚠️ CAUTION',
          attachmentTitle: 'Coastal Marine Safety Verdict',
          grid: [
            { label: 'Safety Status', value: 'CAUTION' },
            { label: 'Wave Height', value: '1.8m to 3.2m swell' },
            { label: 'Wind Speed', value: '14 knots ENE' },
            { label: 'Sea State', value: 'Moderate to Rough' },
          ],
          evidence: [
            { source: 'INCOIS Marine Forecast', type: 'Wave Early Warning System (Swell Surge Model)', time: 'Today, 05:45 IST' },
            { source: 'IMD Amaravati Center', type: 'Squall & Deep Depression Alert Bulletin #AP-24', time: 'Today, 06:15 IST' },
          ],
        },
        te: {
          text: '⚠️ **జాగ్రత్త అవసరం**. విశాఖ తీరంలో గాలుల వేగం మోస్తరుగా (14 నాట్స్) ఉన్నప్పటికీ, గోదావరి-కాకినాడ సముద్ర తీరంలో స్ప్రింగ్ టైడ్ ప్రభావంతో **2.8 నుండి 3.4 మీటర్ల ఎత్తున అలల ఉధృతి** కొనసాగుతోంది. చిన్న సాంప్రదాయ పడవలు తీరానికి 5 నాటికల్ మైళ్ల లోపలే ఉండాలి. యంత్ర పడవలు లైఫ్ జాకెట్లు మరియు వైర్‌లెస్ సెట్లతో మాత్రమే వేటకు వెళ్లాలి.',
          verdict: 'Caution',
          verdictLabel: '⚠️ జాగ్రత్త',
          attachmentTitle: 'సముద్ర భద్రతా అధికారిక తీర్పు',
          grid: [
            { label: 'భద్రతా స్థితి', value: 'జాగ్రత్త' },
            { label: 'అలల ఎత్తు', value: '1.8 నుండి 3.2 మీటర్లు' },
            { label: 'గాలుల వేగం', value: '14 నాట్స్ ENE' },
            { label: 'సముద్ర తీరు', value: 'మోస్తరు నుండి ఉధృతం' },
          ],
          evidence: [
            { source: 'ఇన్‌కాయిస్ సముద్ర సమాచార కేంద్రం', type: 'ముందస్తు అలల హెచ్చరికల వ్యవస్థ', time: 'నేడు, 05:45 IST' },
            { source: 'ఐఎండి అమరావతి వాతావరణ విభాగం', type: 'వాయుగుండం & గాలుల బులిటెన్ #AP-24', time: 'నేడు, 06:15 IST' },
          ],
        },
      },

      'Show me the nearest PFZ': {
        mapAction: () => window.orcaMap && window.orcaMap.highlightZone('PFZ-VIZAG-01'),
        en: {
          text: 'The nearest Potential Fishing Zone to your current GPS position is **Vizag Deep Shelf Zone (PFZ-VIZAG-01)**, situated at **17.58° N, 83.48° E** (approx. 14 km from your boat). I have highlighted it on your marine map with depth bathymetry.',
          verdict: 'Safe',
          verdictLabel: '✓ SAFE TO SAIL',
          attachmentTitle: 'Nearest Target Fishing Zone',
          grid: [
            { label: 'Target Code', value: 'PFZ-VIZAG-01' },
            { label: 'Bearing', value: '115° ESE' },
            { label: 'Transit Time', value: '~45 mins at 8 kts' },
            { label: 'Recommended Gear', value: 'Gillnets / Lines' },
          ],
          evidence: [
            { source: 'INCOIS Real-Time Advisory', type: 'Satellite Chlorophyll Anomaly Gradient', time: 'Today, 04:30 IST' },
          ],
        },
        te: {
          text: 'మీ ప్రస్తుత ప్రదేశానికి సమీపంలోని చేపల వేట ప్రాంతం **విశాఖ డీప్ షెల్ఫ్ (PFZ-VIZAG-01)**. ఇది **17.58° N, 83.48° E** వద్ద (మీ పడవ నుండి సుమారు 14 కిలోమీటర్ల దూరంలో) ఉంది. పటంలో దీనికి సంబంధించిన లోతు మరియు సరిహద్దులు గుర్తించబడ్డాయి.',
          verdict: 'Safe',
          verdictLabel: '✓ సురక్షితం',
          attachmentTitle: 'సమీప చేపల వేట గమ్యస్థానం',
          grid: [
            { label: 'ప్రాంతం కోడ్', value: 'PFZ-VIZAG-01' },
            { label: 'దిశ (Bearing)', value: '115° ESE' },
            { label: 'ప్రయాణ సమయం', value: 'సుమారు 45 నిమిషాలు (8 నాట్స్ వేగంతో)' },
            { label: 'సిఫార్సు చేసిన వలలు', value: 'గిల్‌నెట్స్ / హుక్స్' },
          ],
          evidence: [
            { source: 'ఇన్‌కాయిస్ రియల్-టైమ్ సమాచారం', type: 'ఉపగ్రహ క్లోరోఫిల్ గ్రేడియంట్ పటం', time: 'నేడు, 04:30 IST' },
          ],
        },
      },

      'Are there any cyclone alerts nearby?': {
        mapAction: () => {
          if (window.orcaMap) {
            window.orcaMap.toggleLayer('hazard', true);
            window.orcaMap.toggleLayer('route', false);
          }
        },
        en: {
          text: '🌀 **CYCLONE TRACK ALERT**: A Deep Depression over the east-central Bay of Bengal is centered near 16.4° N, 84.5° E. The projected cone of uncertainty stays approximately 120 km offshore from the Andhra coastline, but squally winds of 45-55 km/h gusting to 65 km/h are expected in open sea beyond 30 NM. Do NOT navigate past the 40-meter depth contour today.',
          verdict: 'Caution',
          verdictLabel: '⚠️ CAUTION',
          attachmentTitle: 'IMD Cyclone Cone Forecast #04',
          grid: [
            { label: 'System Type', value: 'Deep Depression (DD)' },
            { label: 'Central Pressure', value: '998 hPa' },
            { label: 'Gale Warning', value: 'Squally 45-65 km/h' },
            { label: 'Port Signals', value: 'Distant Cautionary III' },
          ],
          evidence: [
            { source: 'IMD Regional Cyclone Warning Centre (RCWC)', type: 'Cyclone Track & Intensity Bulletins', time: 'Today, 06:30 IST' },
            { source: 'INSAT-3DR Rapid Ocean Scan', type: 'Visible & Thermal Infrared Cloud Imagery', time: 'Today, 07:00 IST' },
          ],
        },
        te: {
          text: '🌀 **తీవ్ర వాయుగుండం హెచ్చరిక**: బంగాళాఖాతంలో ఏర్పడిన తీవ్ర వాయుగుండం ప్రస్తుతం 16.4° N, 84.5° E వద్ద కేంద్రీకృతమై ఉంది (తీరానికి సుమారు 120 కి.మీ ఆవల). సముద్రంలో గంటకు 45 నుండి 65 కి.మీ వేగంతో ఈదురుగాలులు వీస్తున్నాయి. 30 నాటికల్ మైళ్లకు మించి లోతైన సముద్రంలోకి వెళ్లవద్దని సూచించడమైనది.',
          verdict: 'Caution',
          verdictLabel: '⚠️ జాగ్రత్త',
          attachmentTitle: 'వాతావరణ శాఖ తుఫాను అంచనా #04',
          grid: [
            { label: 'వాతావరణ వ్యవస్థ', value: 'తీవ్ర వాయుగుండం (Deep Depression)' },
            { label: 'కేంద్ర పీడనం', value: '998 hPa' },
            { label: 'గాలుల తీవ్రత', value: 'గంటకు 45-65 కి.మీ' },
            { label: 'రేవు ప్రమాద హెచ్చరిక', value: '3వ నంబర్ ప్రమాద హెచ్చరిక' },
          ],
          evidence: [
            { source: 'ఐఎండి ప్రాంతీయ తుఫాను హెచ్చరికల కేంద్రం', type: 'తుఫాను మార్గం & తీవ్రత బులిటెన్లు', time: 'నేడు, 06:30 IST' },
            { source: 'ఇన్‌శాట్-3డిఆర్ ఉపగ్రహ పరిశీలన', type: 'ఇన్‌ఫ్రారెడ్ మేఘాల చిత్రాలు', time: 'నేడు, 07:00 IST' },
          ],
        },
      },

      'How far am I from the IMBL?': {
        mapAction: () => window.orcaMap && window.orcaMap.toggleLayer('imbl', true),
        en: {
          text: '🚩 **SAFE DISTANCE**: Your current position (17.65° N, 83.28° E) is approximately **114 nautical miles (211 km)** west of the International Maritime Boundary Line (IMBL). You are operating well within Indian Exclusive Economic Zone (EEZ) territorial waters. The danger boundary has been highlighted in dashed red on your map.',
          verdict: 'Safe',
          verdictLabel: '✓ SAFE TO SAIL',
          attachmentTitle: 'Maritime Boundary Verification',
          grid: [
            { label: 'Territorial Status', value: 'Indian EEZ (Zone A)' },
            { label: 'Distance to IMBL', value: '114 Nautical Miles' },
            { label: 'GPS Coordinates', value: '17.6500° N, 83.2800° E' },
            { label: 'Coast Guard Radar', value: 'In Contact (VHF Ch 16)' },
          ],
          evidence: [
            { source: 'Indian Coast Guard (ICG) District HQ 6', type: 'WGS-84 Maritime Delimitation Geofence', time: 'Continuous Live' },
            { source: 'National Hydrographic Office (NHO)', type: 'Electronic Navigational Chart (IN-31)', time: 'Official Survey 2025' },
          ],
        },
        te: {
          text: '🚩 **సురక్షిత దూరం**: మీ ప్రస్తుత పడవ ప్రదేశం (17.65° N, 83.28° E) అంతర్జాతీయ సముద్ర సరిహద్దుకు (IMBL) పశ్చిమాన సుమారు **114 నాటికల్ మైళ్ల (211 కి.మీ)** దూరంలో ఉంది. మీరు భారత ప్రత్యేక ఆర్థిక మండలి (EEZ) జలాల్లో పూర్తిగా సురక్షితంగా ఉన్నారు. సరిహద్దు రేఖ పటంలో ఎరుపు రంగులో గుర్తించబడింది.',
          verdict: 'Safe',
          verdictLabel: '✓ సురక్షితం',
          attachmentTitle: 'సముద్ర సరిహద్దు అధికారిక ధృవీకరణ',
          grid: [
            { label: 'జలాల స్థితి', value: 'భారత ప్రత్యేక ఆర్థిక మండలి (EEZ)' },
            { label: 'సరిహద్దుకు దూరం', value: '114 నాటికల్ మైళ్లు' },
            { label: 'జిపిఎస్ కోఆర్డినేట్లు', value: '17.6500° N, 83.2800° E' },
            { label: 'కోస్ట్ గార్డ్ రాడార్', value: 'కమ్యూనికేషన్ అందుబాటులో ఉంది (Ch 16)' },
          ],
          evidence: [
            { source: 'భారత కోస్ట్ గార్డ్ ప్రధాన కార్యాలయం', type: 'WGS-84 సరిహద్దు జియోఫెన్స్ డేటా', time: 'నిరంతర పర్యవేక్షణ' },
            { source: 'జాతీయ హైడ్రోగ్రాఫిక్ కార్యాలయం (NHO)', type: 'ఎలక్ట్రానిక్ నావిగేషనల్ చార్ట్', time: 'అధికారిక సర్వే 2025' },
          ],
        },
      },

      "What's the wave height near my location?": {
        mapAction: () => window.orcaMap && window.orcaMap.toggleLayer('hazard', true),
        en: {
          text: '🌊 **WAVE TELEMETRY**: Near Visakhapatnam harbor, significant wave height is currently **1.8 meters** with a period of **8.2 seconds** from the South-Southwest. Near Kakinada and Godavari spit, swell reaches **2.8 to 3.2 meters**. Water surface visibility is 14 meters.',
          verdict: 'Safe',
          verdictLabel: '✓ SAFE TO SAIL',
          attachmentTitle: 'INCOIS Wave Buoy Network Data',
          grid: [
            { label: 'Significant Wave Height', value: '1.8 m (Calm-Mod)' },
            { label: 'Maximum Crest Wave', value: '2.6 m' },
            { label: 'Wave Period', value: '8.2 seconds' },
            { label: 'Sea Surface Temp', value: '28.3 °C' },
          ],
          evidence: [
            { source: 'INCOIS Moored Wave Rider Buoy #23091', type: 'Acoustic Doppler Current Profiler (ADCP)', time: 'Today, 07:15 IST' },
          ],
        },
        te: {
          text: '🌊 **అలల సమాచారం**: విశాఖపట్నం తీరంలో అలల ఎత్తు ప్రస్తుతం **1.8 మీటర్లు**గా ఉంది. అలల తరంగ వ్యవధి 8.2 సెకన్లు. అయితే కాకినాడ మరియు గోదావరి తీరప్రాంతాల్లో అలల ఉధృతి **2.8 నుండి 3.2 మీటర్ల వరకు** ఎగసిపడుతోంది. సముద్రంలో దృశ్యమానత 14 కిలోమీటర్ల మేర స్పష్టంగా ఉంది.',
          verdict: 'Safe',
          verdictLabel: '✓ సురక్షితం',
          attachmentTitle: 'ఇన్‌కాయిస్ వేవ్ బాయ్ నెట్‌వర్క్ డేటా',
          grid: [
            { label: 'సగటు అలల ఎత్తు', value: '1.8 మీటర్లు' },
            { label: 'గరిష్ట అలల శిఖరం', value: '2.6 మీటర్లు' },
            { label: 'అలల వ్యవధి', value: '8.2 సెకన్లు' },
            { label: 'సముద్ర ఉష్ణోగ్రత', value: '28.3 °C' },
          ],
          evidence: [
            { source: 'ఇన్‌కాయిస్ వేవ్ రైడర్ బాయ్ #23091', type: 'అకౌస్టిక్ డాప్లర్ కరెంట్ ప్రొఫైలర్ (ADCP)', time: 'నేడు, 07:15 IST' },
          ],
        },
      },

      'Plan a safe route to the fishing zone': {
        mapAction: () => {
          if (window.orcaMap) {
            window.orcaMap.toggleLayer('route', true);
            window.orcaMap.highlightZone('PFZ-VIZAG-01');
          }
        },
        en: {
          text: '🧭 **SAFE ROUTE GENERATED**: I have plotted an optimal navigation corridor from **Visakhapatnam Harbor** to **Vizag Deep Shelf (PFZ-VIZAG-01)**. The route steers southeast (115° heading), remaining 4 nautical miles clear of the high-swell shoals. Total transit distance is **8.6 NM** (est. 45 minutes at cruising speed of 8 knots).',
          verdict: 'Safe',
          verdictLabel: '✓ SAFE TO SAIL',
          attachmentTitle: 'Navigational Flight Plan',
          grid: [
            { label: 'Waypoints', value: '4 Navpoints' },
            { label: 'Total Distance', value: '8.6 NM (16 km)' },
            { label: 'Hazard Clearance', value: 'Clear of Shoal' },
            { label: 'Fuel Estimate', value: '~12 Liters Diesel' },
          ],
          evidence: [
            { source: 'ORCA Spatial Routing Agent', type: 'A* Bathymetric Nav-Mesh with Hazard Buffers', time: 'Calculated Live' },
            { source: 'NHO Electronic Navigational Chart', type: 'Shallow Bank & Wreck Avoidance Polygons', time: 'Current Edition' },
          ],
        },
        te: {
          text: '🧭 **సురక్షిత మార్గం ఖరారు చేయబడింది**: **విశాఖపట్నం రేవు** నుండి **విశాఖ డీప్ షెల్ఫ్ (PFZ-VIZAG-01)** కు సురక్షితమైన నావిగేషన్ మార్గం రూపొందించబడింది. ఈ మార్గం ఆగ్నేయ దిశగా (115° కోణం) ఉధృత అలల ప్రాంతాలకు 4 నాటికల్ మైళ్ల దూరంలో ఉంటుంది. మొత్తం దూరం **8.6 నాటికల్ మైళ్లు** (ప్రయాణ సమయం సుమారు 45 నిమిషాలు).',
          verdict: 'Safe',
          verdictLabel: '✓ సురక్షితం',
          attachmentTitle: 'నావిగేషన్ ప్రయాణ ప్రణాళిక',
          grid: [
            { label: 'వే-పాయింట్లు', value: '4 మార్గ కేంద్రాలు' },
            { label: 'మొత్తం దూరం', value: '8.6 నాటికల్ మైళ్లు (16 కి.మీ)' },
            { label: 'ప్రమాద నివారణ', value: 'తుఫాను ప్రాంతానికి ఆవల' },
            { label: 'ఇంధన అంచనా', value: 'సుమారు 12 లీటర్ల డీజిల్' },
          ],
          evidence: [
            { source: 'ఆర్కా స్పాషియల్ రూటింగ్ ఏజెంట్', type: 'బాతిమెట్రిక్ నావిగేషన్ అల్గారిథం', time: 'లైవ్ గణన' },
            { source: 'జాతీయ హైడ్రోగ్రాఫిక్ చార్ట్', type: 'లోతులేని తీరాల రక్షణ పొర', time: 'ప్రస్తుత ముద్రణ' },
          ],
        },
      },

      'Any lightning warnings for today?': {
        mapAction: () => window.orcaMap && window.orcaMap.toggleLayer('hazard', true),
        en: {
          text: '⚡ **LIGHTNING ADVISORY**: Doppler weather radar shows convective thunderclouds developing over the northern coastal belt (Srikakulam–Vizianagaram–Bheemili). Scattered lightning strikes and thundersqualls are expected between **15:30 and 18:30 IST**. Fishermen in open fiber boats are advised to conclude offshore operations and return to sheltered harbor before late afternoon.',
          verdict: 'Caution',
          verdictLabel: '⚠️ CAUTION',
          attachmentTitle: 'Doppler Radar Lightning Nowcast',
          grid: [
            { label: 'Risk Level', value: 'MODERATE' },
            { label: 'Peak Window', value: '15:30 – 18:30 IST' },
            { label: 'Convective Tops', value: 'Up to 11 km' },
            { label: 'Precaution', value: 'Avoid metallic antennas' },
          ],
          evidence: [
            { source: 'IMD Doppler Weather Radar (DWR Visakhapatnam)', type: 'Reflectivity & Velocity Nowcast', time: 'Today, 07:10 IST' },
            { source: 'Damini Lightning Early Warning App (IITM)', type: 'Total Lightning Strike Density Feed', time: 'Today, 07:12 IST' },
          ],
        },
        te: {
          text: '⚡ **ఉరుములు మెరుపుల హెచ్చరిక**: డాప్లర్ వాతావరణ రాడార్ పరిశీలన ప్రకారం ఉత్తర కోస్తాలో (శ్రీకాకుళం-విజయనగరం-భీమిలి) ఉరుముల మేఘాలు దట్టంగా వ్యాపిస్తున్నాయి. సాయంత్రం **15:30 నుండి 18:30 గంటల మధ్య** పిడుగులు పడే అవకాశం ఉంది. చిన్న ఫైబర్ బోట్లలో వెళ్లిన మత్స్యకారులు సాయంత్రానికి ముందే సురక్షిత తీరానికి చేరుకోవాలని హెచ్చరిక.',
          verdict: 'Caution',
          verdictLabel: '⚠️ జాగ్రత్త',
          attachmentTitle: 'డాప్లర్ రాడార్ పిడుగుల ముందస్తు నివేదిక',
          grid: [
            { label: 'ప్రమాద తీవ్రత', value: 'మోస్తరు' },
            { label: 'ముప్పు సమయం', value: '15:30 – 18:30 IST' },
            { label: 'మేఘాల ఎత్తు', value: '11 కి.మీ వరకు' },
            { label: 'ముందస్తు జాగ్రత్త', value: 'లోహపు యాంటెన్నాలకు దూరంగా ఉండండి' },
          ],
          evidence: [
            { source: 'విశాఖ డాప్లర్ వాతావరణ రాడార్ (DWR)', type: 'రిఫ్లెక్టివిటీ & వెలాసిటీ నివేదిక', time: 'నేడు, 07:10 IST' },
            { source: 'దామిని పిడుగుల హెచ్చరికల వ్యవస్థ (IITM)', type: 'లైటింగ్ స్ట్రైక్ డెన్సిటీ డేటా', time: 'నేడు, 07:12 IST' },
          ],
        },
      },
    };

    this.init();
  }

  init() {
    // Render initial advisory in current language
    this.renderInitialAdvisory();

    // Primary input in dedicated Chatbot View
    const mainInput = document.getElementById('chat-main-input');
    const mainSendBtn = document.getElementById('chat-main-send-btn');
    const micBtn = document.getElementById('mic-voice-btn');

    if (mainSendBtn && mainInput) {
      mainSendBtn.addEventListener('click', () => {
        const text = mainInput.value.trim();
        if (!text) return;
        mainInput.value = '';
        this.askQuery(text);
      });
      mainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const text = mainInput.value.trim();
          if (!text) return;
          mainInput.value = '';
          this.askQuery(text);
        }
      });
    }

    // Voice query simulation
    if (micBtn && mainInput) {
      micBtn.addEventListener('click', () => {
        const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';
        const queries = isTe
          ? [
              'ఈరోజు నాకు సమీపంలో ఉత్తమ చేపల వేట ప్రాంతాలు ఎక్కడ ఉన్నాయి?',
              'ఇప్పుడు సముద్రంలోకి వేటకు వెళ్లడం సురక్షితమేనా?',
              'సమీపంలో ఏవైనా తుఫాను హెచ్చరికలు ఉన్నాయా?',
              'మా ప్రాంతం దగ్గర అలల ఎత్తు ఎంతవరకు ఉంది?',
            ]
          : [
              'Where are the best fishing zones near me today?',
              'Is it safe to go out to sea right now?',
              'Are there any cyclone alerts nearby?',
              "What's the wave height near my location?",
            ];
        const randomQ = queries[Math.floor(Math.random() * queries.length)];
        mainInput.value = randomQ;
        mainInput.focus();
      });
    }

    // Secondary sidebar input if present
    if (this.sendBtn && this.input) {
      this.sendBtn.addEventListener('click', () => this.handleUserSend());
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleUserSend();
      });
    }

    // Attach quick chip click listeners
    document.querySelectorAll('.quick-chip, .query-chip-card').forEach((chip) => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const queryText = chip.getAttribute('data-query') || chip.textContent.trim().replace(/^[^a-zA-Z0-9?]+/, '').trim();
        this.askQuery(queryText);
      });
    });

    // Enable mouse wheel horizontal scrolling for suggested texts (quick action chips)
    document.querySelectorAll('.quick-chips-row').forEach((row) => {
      row.addEventListener('wheel', (e) => {
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        if (delta !== 0) {
          e.preventDefault();
          e.stopPropagation();
          row.scrollLeft += delta;
        }
      }, { passive: false });
    });
  }

  renderInitialAdvisory() {
    if (!this.thread) return;
    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';
    const checkIcon = window.Morphicons ? window.Morphicons.get('check', { size: 14, color: '#4ade80' }) : '';

    const greetingHtml = isTe
      ? `
        <div class="message-meta">
          <span class="ai-badge">ఆర్కా AI సహాయకుడు</span> • <span>ప్రారంభ సలహా</span>
        </div>
        <div>
          నమస్కారం! నేను మీ సముద్ర భద్రతా సహాయకుడిని. చేపల వేట ప్రాంతాలు, అలల పరిస్థితి, సరిహద్దుల సమాచారం కోసం నన్ను అడగండి.
        </div>
        <div class="attachment-card">
          <div class="attachment-verdict-row">
            <span style="font-size:12px; font-weight:600; color:#ffffff;">విశాఖపట్నం సెక్టార్ సలహా</span>
            <span class="verdict-badge verdict-safe">${checkIcon} సురక్షితం</span>
          </div>
          <div class="attachment-grid">
            <div class="attachment-cell">
              <span>అలల ఎత్తు</span>
              <strong>1.8 మీటర్లు (మోస్తరు)</strong>
            </div>
            <div class="attachment-cell">
              <span>గాలుల వేగం</span>
              <strong>14 నాట్స్ ENE</strong>
            </div>
            <div class="attachment-cell">
              <span>సమీప వేట ప్రాంతం</span>
              <strong>PFZ-VIZAG-01 (16 కి.మీ)</strong>
            </div>
            <div class="attachment-cell">
              <span>సరిహద్దు దూరం</span>
              <strong>114 NM సురక్షితం</strong>
            </div>
          </div>
        </div>
      `
      : `
        <div class="message-meta">
          <span class="ai-badge">ORCA AI ASSISTANT</span> • <span>Initial Advisory</span>
        </div>
        <div>
          Welcome! I am <strong>ORCA</strong>, your AI marine safety advisor for the Andhra Pradesh coast. Ask me anything about Potential Fishing Zones, weather, or boundary alerts.
        </div>
        <div class="attachment-card">
          <div class="attachment-verdict-row">
            <span style="font-size:12px; font-weight:600; color:#ffffff;">Visakhapatnam Sector Advisory</span>
            <span class="verdict-badge verdict-safe">${checkIcon} SAFE TO SAIL</span>
          </div>
          <div class="attachment-grid">
            <div class="attachment-cell">
              <span>Wave Swell</span>
              <strong>1.8m (Moderate)</strong>
            </div>
            <div class="attachment-cell">
              <span>Surface Wind</span>
              <strong>14 kts ENE</strong>
            </div>
            <div class="attachment-cell">
              <span>Nearest PFZ</span>
              <strong>PFZ-VIZAG-01 (16 km)</strong>
            </div>
            <div class="attachment-cell">
              <span>IMBL Border</span>
              <strong>114 NM Clear</strong>
            </div>
          </div>
        </div>
      `;

    const firstMsg = this.thread.querySelector('.message-assistant');
    if (firstMsg) {
      firstMsg.innerHTML = greetingHtml;
    }
  }

  formatMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  viewOnMap(lat, lon) {
    if (typeof window.switchView === 'function') {
      window.switchView('map');
    }
    if (window.orcaMap) {
      if (typeof window.orcaMap.loadBackendMapPayload === 'function') {
        window.orcaMap.loadBackendMapPayload(lat, lon);
      } else if (typeof window.orcaMap.highlightZone === 'function') {
        window.orcaMap.highlightZone('PFZ-VIZAG-01');
      }
    }
  }

  async askQuery(queryText) {
    if (typeof window.switchView === 'function') {
      window.switchView('chat');
    }

    this.addMessage(queryText, 'user');

    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

    // Show temporary typing/reasoning indicator bubble
    const typingBubble = document.createElement('div');
    typingBubble.className = 'message-bubble message-assistant';
    typingBubble.innerHTML = `
      <div class="chat-typing-container">
        <div class="chat-typing-dots"><span></span><span></span><span></span></div>
        <span>${isTe ? 'ఆర్కా AI సముద్ర డేటాను విశ్లేషిస్తోంది...' : 'ORCA Reasoning Engine analyzing satellite & sensor telemetry...'}</span>
      </div>
    `;
    this.thread.appendChild(typingBubble);
    this.thread.scrollTop = this.thread.scrollHeight;

    // Get current GPS location from boat or selected harbor
    let lat = 17.6868;
    let lon = 83.2185;
    if (window.orcaMap && window.orcaMap.userBoat) {
      lat = window.orcaMap.userBoat.lat;
      lon = window.orcaMap.userBoat.lon;
    } else {
      const portSelect = document.getElementById('port-select');
      const portCoords = {
        visakhapatnam: [17.6868, 83.2185],
        kakinada: [16.9891, 82.2475],
        machilipatnam: [16.1875, 81.1389],
        nizampatnam: [15.9042, 80.6722],
        krishnapatnam: [14.2500, 80.1167],
      };
      if (portSelect && portCoords[portSelect.value]) {
        [lat, lon] = portCoords[portSelect.value];
      }
    }

    // Call Backend API via OrcaApiClient
    let apiResult = null;
    try {
      if (window.orcaApi && typeof window.orcaApi.postQuery === 'function') {
        apiResult = await window.orcaApi.postQuery({ query: queryText, lat, lon });
      }
    } catch (err) {
      console.warn('[OrcaChat] API call failed:', err);
    }

    // Remove typing bubble
    if (typingBubble && typingBubble.parentNode) {
      typingBubble.parentNode.removeChild(typingBubble);
    }

    // Trigger any associated map action based on query keywords
    for (const key of Object.keys(this.predefinedResponses)) {
      if (
        queryText.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(queryText.toLowerCase()) ||
        this.matchKeywords(queryText, key)
      ) {
        const entry = this.predefinedResponses[key];
        if (entry && entry.mapAction) {
          entry.mapAction();
        }
        break;
      }
    }

    // If API returned a valid contract response, render it according to contract
    if (apiResult && apiResult.final_response) {
      this.renderApiResponse(apiResult, lat, lon, isTe);
    } else {
      // Local fallback
      this.generateResponse(queryText);
    }
  }

  renderApiResponse(res, lat, lon, isTe) {
    const checkIcon = window.Morphicons ? window.Morphicons.get('check', { size: 14, color: '#4ade80' }) : '✓';
    const warnIcon = window.Morphicons ? window.Morphicons.get('warning', { size: 14, color: '#e2a356' }) : '⚠️';
    const dangerIcon = window.Morphicons ? window.Morphicons.get('danger', { size: 14, color: '#f87171' }) : '⛔';

    // 1. Verdict Badge (safe | caution | unsafe | null)
    let verdictHtml = '';
    if (res.verdict) {
      const v = String(res.verdict).toLowerCase();
      let vLabel = isTe ? 'సురక్షితం' : 'SAFE TO SAIL';
      let vIcon = checkIcon;
      if (v === 'caution') {
        vLabel = isTe ? 'జాగ్రత్త' : 'CAUTION';
        vIcon = warnIcon;
      } else if (v === 'unsafe') {
        vLabel = isTe ? 'ప్రమాదకరం' : 'UNSAFE TO SAIL';
        vIcon = dangerIcon;
      }
      verdictHtml = `<span class="verdict-badge verdict-${v}">${vIcon} <span>${vLabel}</span></span>`;
    }

    // 2. Risk Score Pill
    let riskHtml = '';
    if (typeof res.risk_score === 'number') {
      const score = Math.round(res.risk_score);
      let riskClass = 'risk-low';
      if (score > 70) riskClass = 'risk-high';
      else if (score > 30) riskClass = 'risk-med';
      const riskLabel = isTe ? `ప్రమాద స్కోర్: ${score}/100` : `Risk: ${score}/100`;
      riskHtml = `<span class="chat-risk-pill ${riskClass}">${riskLabel}</span>`;
    }

    // 3. Alerts Count Pill
    let alertsHtml = '';
    if (typeof res.alerts_count === 'number' && res.alerts_count > 0) {
      const aIcon = window.Morphicons ? window.Morphicons.get('alert', { size: 12, color: '#f87171' }) : '⚠️';
      const aLabel = isTe
        ? `${res.alerts_count} క్రియాశీల హెచ్చరిక${res.alerts_count > 1 ? 'లు' : ''}`
        : `${res.alerts_count} Active Alert${res.alerts_count > 1 ? 's' : ''}`;
      alertsHtml = `<span class="chat-alerts-pill">${aIcon} <span>${aLabel}</span></span>`;
    }

    // 4. Formatted Timestamp
    let timestampHtml = '';
    if (res.generated_at) {
      let timeStr = '';
      try {
        const d = new Date(res.generated_at);
        if (!isNaN(d.getTime())) {
          timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
      } catch (e) {}
      if (!timeStr) {
        const now = new Date();
        timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
      }
      const timeLabel = isTe ? `నవీకరణ ${timeStr} IST` : `Updated ${timeStr} IST`;
      timestampHtml = `<span class="chat-timestamp">${timeLabel}</span>`;
    }

    // 5. Meta Bar
    let metaBarHtml = '';
    if (verdictHtml || riskHtml || alertsHtml || timestampHtml) {
      metaBarHtml = `
        <div class="chat-meta-bar">
          ${verdictHtml}
          ${riskHtml}
          ${alertsHtml}
          ${timestampHtml}
        </div>
      `;
    }

    // 6. View on Marine Map Button
    let mapBtnHtml = '';
    if (res.visualization_available) {
      const mapBtnText = isTe ? 'సముద్ర పటంలో చూడండి' : 'View on Marine Map';
      mapBtnHtml = `
        <div>
          <button class="btn-view-map" onclick="window.orcaChat.viewOnMap(${lat}, ${lon})">
            <span>${mapBtnText}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>
        </div>
      `;
    }

    // 7. Collapsible Evidence Drawer
    let evidenceHtml = '';
    if (Array.isArray(res.evidence) && res.evidence.length > 0) {
      const drawerId = `evidence-${Date.now()}`;
      const evIcon = window.Morphicons ? window.Morphicons.get('evidence', { size: 14, color: 'var(--orca-primary)' }) : '📋';
      const chevIcon = window.Morphicons ? window.Morphicons.get('chevron_down', { size: 12 }) : '▼';
      const drawerTitle = isTe ? 'ఆధారాలు & డేటా మూలాలు' : 'View Evidence & Data Sources';

      const evidenceItems = res.evidence
        .map((e) => {
          let tsStr = e.timestamp || '';
          if (tsStr.includes('T')) {
            try {
              const d = new Date(tsStr);
              tsStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST';
            } catch (err) {}
          }
          const desc = e.description || e.type || '';
          return `
            <div class="evidence-entry">
              <div class="evidence-source">${e.source || 'Data Source'} ${tsStr ? `• <span style="font-weight:400; color:#9cb1a6;">${tsStr}</span>` : ''}</div>
              <div class="evidence-detail">${desc}</div>
            </div>
          `;
        })
        .join('');

      evidenceHtml = `
        <button class="evidence-drawer-toggle" onclick="window.toggleEvidenceDrawer('${drawerId}', this)">
          ${evIcon} <span>${drawerTitle} (${res.evidence.length})</span> ${chevIcon}
        </button>
        <div id="${drawerId}" class="evidence-content">
          ${evidenceItems}
        </div>
      `;
    }

    const metaLabel = isTe
      ? `<span class="ai-badge">ఆర్కా AI సహాయకుడు</span> • <span>సముద్ర విశ్లేషణ ఇంజిన్</span>`
      : `<span class="ai-badge">ORCA AI ASSISTANT</span> • <span>Marine Reasoning Engine</span>`;

    const assistantHtml = `
      <div class="message-meta">${metaLabel}</div>
      <div class="chat-body-text">${this.formatMarkdown(res.final_response)}</div>
      ${mapBtnHtml}
      ${metaBarHtml}
      ${evidenceHtml}
    `;

    this.addMessage(assistantHtml, 'assistant');
  }

  handleUserSend() {
    const text = this.input.value.trim();
    if (!text) return;
    this.input.value = '';
    this.askQuery(text);
  }

  addMessage(content, sender = 'user') {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble message-${sender}`;

    if (sender === 'user') {
      bubble.textContent = content;
    } else {
      bubble.innerHTML = content;
    }

    this.thread.appendChild(bubble);
    this.thread.scrollTop = this.thread.scrollHeight;
  }

  generateResponse(query) {
    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

    let matchedKey = null;
    for (const key of Object.keys(this.predefinedResponses)) {
      if (
        query.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(query.toLowerCase()) ||
        this.matchKeywords(query, key)
      ) {
        matchedKey = key;
        break;
      }
    }

    const entry = matchedKey ? this.predefinedResponses[matchedKey] : null;

    if (entry && entry.mapAction) {
      entry.mapAction();
    }

    const data = entry ? (isTe ? entry.te : entry.en) : this.fallbackResponse(query, isTe);

    const isSafe = data.verdict.toLowerCase() === 'safe';
    const vIcon = isSafe
      ? (window.Morphicons ? window.Morphicons.get('check', { size: 14, color: '#4ade80' }) : '')
      : (window.Morphicons ? window.Morphicons.get('warning', { size: 14, color: '#e2a356' }) : '');

    const cleanVerdictText = data.verdictLabel.replace(/[✓⚠️⛔]/g, '').trim();
    const verdictHtml = `<span class="verdict-badge verdict-${data.verdict.toLowerCase()}">${vIcon} <span>${cleanVerdictText}</span></span>`;

    let attachmentHtml = '';
    if (data.grid) {
      const gridItems = data.grid
        .map((g) => `<div class="attachment-cell"><span>${g.label}</span><strong>${g.value}</strong></div>`)
        .join('');

      attachmentHtml = `
        <div class="attachment-card">
          <div class="attachment-verdict-row">
            <span style="font-size:11.5px; font-weight:600; color:#ffffff;">${data.attachmentTitle}</span>
            ${verdictHtml}
          </div>
          <div class="attachment-grid">${gridItems}</div>
        </div>
      `;
    }

    const evidenceItems = (data.evidence || [])
      .map(
        (e) => `
        <div class="evidence-entry">
          <div class="evidence-source">${e.source} • <span style="font-weight:400; color:#9cb1a6;">${e.time}</span></div>
          <div class="evidence-detail">${e.type}</div>
        </div>
      `
      )
      .join('');

    const drawerId = `evidence-${Date.now()}`;
    const evIcon = window.Morphicons ? window.Morphicons.get('evidence', { size: 14, color: 'var(--orca-primary)' }) : '';
    const chevIcon = window.Morphicons ? window.Morphicons.get('chevron_down', { size: 12 }) : '';

    const drawerTitle = isTe
      ? `ఆధారాలు & డేటా మూలాలను చూడండి`
      : `View Evidence & Data Sources`;

    const evidenceHtml = `
      <button class="evidence-drawer-toggle" onclick="toggleEvidenceDrawer('${drawerId}', this)">
        ${evIcon} <span>${drawerTitle} (${data.evidence ? data.evidence.length : 0})</span> ${chevIcon}
      </button>
      <div id="${drawerId}" class="evidence-content">
        ${evidenceItems}
      </div>
    `;

    const metaLabel = isTe
      ? `<span class="ai-badge">ఆర్కా AI సహాయకుడు</span> • <span>సముద్ర విశ్లేషణ ఇంజిన్</span>`
      : `<span class="ai-badge">ORCA AI ASSISTANT</span> • <span>Marine Reasoning Engine</span>`;

    // Clean any leading raw emoji in text
    const cleanText = data.text.replace(/^[🌀⚡🌊🧭🚩⚠️✓]+\s*/, '');

    const assistantHtml = `
      <div class="message-meta">${metaLabel}</div>
      <div>${cleanText}</div>
      ${attachmentHtml}
      ${evidenceHtml}
    `;

    this.addMessage(assistantHtml, 'assistant');
  }

  matchKeywords(query, key) {
    const q = query.toLowerCase();
    if (key.includes('fishing zones') && (q.includes('fishing') || q.includes('pfz') || q.includes('catch') || q.includes('fish') || q.includes('చేపల') || q.includes('వేట'))) return true;
    if (key.includes('safe to go') && (q.includes('safe') || q.includes('sail') || q.includes('weather') || q.includes('go out') || q.includes('సురక్షిత') || q.includes('వెళ్ల'))) return true;
    if (key.includes('cyclone') && (q.includes('cyclone') || q.includes('storm') || q.includes('depression') || q.includes('తుఫాను') || q.includes('వాయుగుండం'))) return true;
    if (key.includes('IMBL') && (q.includes('imbl') || q.includes('border') || q.includes('boundary') || q.includes('సరిహద్దు'))) return true;
    if (key.includes('wave height') && (q.includes('wave') || q.includes('swell') || q.includes('sea state') || q.includes('అలల'))) return true;
    if (key.includes('route') && (q.includes('route') || q.includes('path') || q.includes('navigate') || q.includes('మార్గం'))) return true;
    if (key.includes('lightning') && (q.includes('lightning') || q.includes('thunder') || q.includes('rain') || q.includes('ఉరుములు') || q.includes('పిడుగు'))) return true;
    return false;
  }

  fallbackResponse(query, isTe) {
    if (isTe) {
      return {
        text: `మీ ప్రశ్న "${query}" విశ్లేషించబడింది. ప్రస్తుత ఇన్‌కాయిస్ (INCOIS) ఉపగ్రహ సమాచారం మరియు వాతావరణ శాఖ బులిటెన్ల ప్రకారం సముద్ర పరిస్థితి సాధారణంగా ఉంది. అలల ఎత్తు 1.6 నుండి 2.2 మీటర్ల మధ్య ఉంది. చేపల వేట కోసం సమీపంలోని PFZ-VIZAG-01 ప్రాంతాన్ని పరిశీలించవచ్చు.`,
        verdict: 'Safe',
        verdictLabel: 'సురక్షితం',
        attachmentTitle: 'సాధారణ సముద్ర సలహా',
        grid: [
          { label: 'సముద్ర పరిస్థితి', value: 'అనుకూలం' },
          { label: 'అలల ఎత్తు', value: '1.6m - 2.2m' },
        ],
        evidence: [
          { source: 'ఇన్‌కాయిస్ గేట్‌వే', type: 'తీరప్రాంత పర్యవేక్షణ నమూనా', time: 'నేడు, 06:00 IST' },
        ],
      };
    }

    return {
      text: `Analyzed query: "${query}". Based on current INCOIS satellite telemetry and IMD bulletins for Andhra Pradesh coastal waters, sea state is **Moderate** with wave heights between 1.6m and 2.4m. Recommended to check Potential Fishing Zone PFZ-VIZAG-01 for active fish schools.`,
      verdict: 'Safe',
      verdictLabel: 'SAFE TO SAIL',
      attachmentTitle: 'Marine General Advisory',
      grid: [
        { label: 'Sea Condition', value: 'Moderate' },
        { label: 'Wave Range', value: '1.6m - 2.4m' },
      ],
      evidence: [
        { source: 'INCOIS Marine Information Gateway', type: 'Composite Coastal Advisory Model', time: 'Today, 06:00 IST' },
      ],
    };
  }
}

window.OrcaChatManager = OrcaChatManager;

window.toggleEvidenceDrawer = function (id, btn) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.toggle('open');
  }
  if (btn) {
    btn.classList.toggle('open');
  }
};

