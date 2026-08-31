// iKhedut AI Assistant - Service Worker for Offline Scheme Caching
// Enables Gujarat farmers to browse schemes, eligibility criteria, and document checklists without active internet.

const CACHE_VERSION = 'ikhedut-v1.2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const SCHEMES_CACHE = `${CACHE_VERSION}-schemes`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Pre-cache essential app assets and the primary schemes API endpoint
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/api/v1/schemes',
  '/api/v1/health'
];

// Offline fallback response for schemes API when completely disconnected
const OFFLINE_SCHEMES_FALLBACK = [
  {
    "id": "tractor-sahay-2025",
    "name_en": "Tractor Assistance Scheme (Khetiwadi)",
    "name_gu": "ટ્રેક્ટર સહાય યોજના (ખેતીવાડી)",
    "name_hi": "ट्रैक्टर सहायता योजना",
    "department": "Department of Agriculture, Farmers Welfare & Co-operation",
    "department_gu": "કૃષિ, ખેડૂત કલ્યાણ અને સહકાર વિભાગ, ગુજરાત સરકાર",
    "category": "Khetiwadi (Agriculture)",
    "category_gu": "ખેતીવાડી યોજનાઓ",
    "subsidy_percentage": "25% to 50%",
    "max_subsidy_amount": 60000,
    "eligibility_criteria_en": [
      "Must own agricultural land in Gujarat (name in 7/12, 8-A)",
      "General farmers receive ₹45,000 subsidy (up to 20-40 PTO HP)",
      "SC / ST / Small & Marginal / Women farmers receive ₹60,000 subsidy",
      "Subsidy once in 10 years per account holder"
    ],
    "eligibility_criteria_gu": [
      "ખેડૂત ગુજરાત રાજ્યમાં ખેતીની જમીન (૭/૧૨ અને ૮-અ ખાતાધારક) ધરાવતો હોવો જોઈએ",
      "સામાન્ય જાતિના ખેડૂતોને કિંમતના ૨૫% અથવા મહત્તમ ₹૪૫,૦૦૦ સહાય",
      "અનુસૂચિત જાતિ (SC), અનુસૂચિત જનજાતિ (ST), નાના/સીમાંત અને મહિલા ખેડૂતોને ૩૫% અથવા મહત્તમ ₹૬૦,૦૦૦ સહાય",
      "એક ખાતાધારક ખેડૂતને દર ૧૦ વર્ષે એક વખત આ યોજનાનો લાભ મળે છે"
    ],
    "required_documents_en": [
      "Updated 7/12 and 8-A Land Records",
      "Aadhaar Card Copy",
      "Bank Passbook or Cancelled Cheque (with IFSC)",
      "Caste Certificate (if SC/ST)",
      "Authorized Tractor Dealer Proforma Invoice / Quotation"
    ],
    "required_documents_gu": [
      "નવીનતમ ૭/૧૨ અને ૮-અ જમીન ઉતારો",
      "આધાર કાર્ડની નકલ",
      "બેંક પાસબુક અથવા કેન્સલ ચેક (IFSC કોડ સાથે)",
      "જાતિનો દાખલો (SC/ST ખેડૂતો માટે)",
      "માન્ય ડીલરનું અસલ પ્રોફોર્મા ઇનવોઇસ / ક્વોટેશન"
    ],
    "application_portal_url": "https://ikhedut.gujarat.gov.in",
    "tags": ["Tractor", "ટ્રેક્ટર", "Khetiwadi", "Mechanization", "Subsidy", "૭/૧૨", "૮-અ"]
  },
  {
    "id": "drip-irrigation-ggrc-2025",
    "name_en": "Drip Irrigation Micro Subsidy (GGRC)",
    "name_gu": "ટપક પિયત પદ્ધતિ સહાય યોજના (GGRC)",
    "name_hi": "ड्रिप सिंचाई योजना",
    "department": "Gujarat Green Revolution Company (GGRC) / Water Resources",
    "department_gu": "ગુજરાત ગ્રીન રિવોલ્યુશન કંપની (GGRC)",
    "category": "Khetiwadi (Agriculture)",
    "category_gu": "ખેતીવાડી યોજનાઓ",
    "subsidy_percentage": "50% to 70%",
    "max_subsidy_amount": 100000,
    "eligibility_criteria_en": [
      "Any landholder farmer in Gujarat with an assured irrigation source (well, bore, canal)",
      "Dark Zone / Tribal / Small farmers: 70% government contribution",
      "General farmers: 50% government subsidy"
    ],
    "eligibility_criteria_gu": [
      "ગુજરાતના તમામ જમીનધારક ખેડૂતો જેમની પાસે પિયત પાણીનો સ્ત્રોત (કૂવો, બોરવેલ કે કેનાલ) હોય",
      "નાના, સીમાંત અને SC/ST ખેડૂતોને ૭૦% સુધીની જંગી સબસિડી",
      "સામાન્ય કેટેગરીના ખેડૂતોને ૫૦% સુધી સહાય"
    ],
    "required_documents_en": [
      "7/12 & 8-A Land Records",
      "Aadhaar Card",
      "Bank Passbook copy",
      "Electricity Bill / Water Source Proof",
      "Soil & Water Testing Report (if applicable)"
    ],
    "required_documents_gu": [
      "૭/૧૨ અને ૮-અ જમીન નકલ",
      "આધાર કાર્ડ",
      "બેંક પાસબુકની નકલ",
      "વીજ બિલ અથવા પાણીના સ્ત્રોતનો પુરાવો"
    ],
    "application_portal_url": "https://ggrc.co.in",
    "tags": ["Drip", "ટપક", "Irrigation", "GGRC", "પાણી", "સબસિડી"]
  },
  {
    "id": "barbed-wire-fencing-2025",
    "name_en": "Barbed Wire Fencing Assistance Scheme",
    "name_gu": "કાંટાળી તારની વાડ બનાવવાની યોજના",
    "name_hi": "तारबंदी सहायता योजना",
    "department": "Department of Agriculture, Gujarat",
    "department_gu": "કૃષિ વિભાગ, ગુજરાત સરકાર",
    "category": "Khetiwadi (Agriculture)",
    "category_gu": "ખેતીવાડી યોજનાઓ",
    "subsidy_percentage": "50% or ₹200/meter",
    "max_subsidy_amount": 200000,
    "eligibility_criteria_en": [
      "Farmers suffering crop damage from wild animals (blue bulls, boars)",
      "Individual application: ₹200/running meter up to ₹40,000",
      "Group application (min 5 hectares contiguity): Up to ₹2,00,000"
    ],
    "eligibility_criteria_gu": [
      "જંગલી પ્રાણીઓ (રોઝ, ભૂંડ) થી પાક રક્ષણ મેળવવા માંગતા ખેડૂતો",
      "વ્યક્તિગત ખેડૂતને રનિંગ મીટર દીઠ ₹૨૦૦ અથવા ૫૦% (મહત્તમ ₹૪૦,૦૦૦)",
      "જૂથ પદ્ધતિ (ઓછામાં ઓછી ૫ હેક્ટર સળંગ જમીન) માટે મહત્તમ ₹૨,૦૦,૦૦૦ સુધી સહાય"
    ],
    "required_documents_en": [
      "7/12, 8-A land records of all group farmers",
      "Aadhaar Cards",
      "Group Consent Agreement on Stamp Paper",
      "Bank Details"
    ],
    "required_documents_gu": [
      "તમામ ખેડૂતોના ૭/૧૨, ૮-અ કાગળો",
      "આધાર કાર્ડ",
      "સંમતિ પત્રક (ગ્રુપ અરજી માટે)",
      "બેંક પાસબુક"
    ],
    "application_portal_url": "https://ikhedut.gujarat.gov.in",
    "tags": ["Fencing", "તાર વાડ", "વાડ", "રોઝ", "ભૂંડ", "સુરક્ષા"]
  },
  {
    "id": "desi-cow-maintenance-2025",
    "name_en": "Indigenous Desi Cow Maintenance Subsidy",
    "name_gu": "દેશી ગાય આધારિત પ્રાકૃતિક ખેતી નિભાવ ખર્ચ સહાય",
    "name_hi": "देशी गाय रख-रखाव सहायता",
    "department": "Animal Husbandry & Natural Farming Department",
    "department_gu": "પશુપાલન અને પ્રાકૃતિક કૃષિ વિભાગ",
    "category": "Pashupalan (Animal Husbandry)",
    "category_gu": "પશુપાલન યોજનાઓ",
    "subsidy_percentage": "100% DBT (₹900/month)",
    "max_subsidy_amount": 10800,
    "eligibility_criteria_en": [
      "Farmer practicing natural farming with at least 1 indigenous Desi Cow (Gir / Kankrej)",
      "Cow must have official INAF / Tag ID",
      "Monthly DBT of ₹900 directly credited to farmer bank account (₹10,800/year)"
    ],
    "eligibility_criteria_gu": [
      "પ્રાકૃતિક ખેતી કરતા અને ઓછામાં ઓછી ૧ દેશી ગાય (ગીર અથવા કાંકરેજ) ધરાવતા ખેડૂત",
      "ગાયના કાનમાં સત્તાવાર INAF ટેગ લાગેલો હોવો જરૂરી",
      "દર મહિને ₹૯૦૦ (વાર્ષિક ₹૧૦,૮૦૦) સીધા બેંક ખાતામાં જમા"
    ],
    "required_documents_en": [
      "7/12 & 8-A land records",
      "Aadhaar Card",
      "Bank Passbook",
      "Cow Tag ID & Photo with Farmer",
      "Natural Farming Training Certificate"
    ],
    "required_documents_gu": [
      "૭/૧૨, ૮-અ જમીન નકલ",
      "આધાર કાર્ડ",
      "બેંક ખાતાની વિગત",
      "ગાયના ટેગ નંબર અને ખેડૂત સાથેનો ફોટો",
      "પ્રાકૃતિક કૃષિ તાલીમ પ્રમાણપત્ર"
    ],
    "application_portal_url": "https://ikhedut.gujarat.gov.in",
    "tags": ["Cow", "દેશી ગાય", "ગાય સહાય", "પ્રાકૃતિક ખેતી", "Pashupalan", "₹900"]
  }
];

// Install Event: Pre-cache core shell & scheme data
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      console.log('[ServiceWorker] Pre-caching offline app shell & scheme data');
      try {
        await cache.addAll(PRECACHE_URLS);
      } catch (err) {
        console.warn('[ServiceWorker] Some pre-cache URLs failed, continuing:', err);
      }
      
      // Store default schemes fallback in schemes cache
      const schemesCache = await caches.open(SCHEMES_CACHE);
      const fallbackResponse = new Response(JSON.stringify(OFFLINE_SCHEMES_FALLBACK), {
        headers: {
          'Content-Type': 'application/json',
          'X-Offline-Cached': 'true'
        }
      });
      await schemesCache.put('/api/v1/schemes', fallbackResponse);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Cleanup stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, SCHEMES_CACHE, RUNTIME_CACHE].includes(cacheName)) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Smart routing & offline fallbacks
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests or chrome-extension requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Strategy 1: Schemes API & Status API (Network-First with Cache Fallback)
  if (url.pathname.startsWith('/api/v1/schemes') || url.pathname.startsWith('/api/v1/status')) {
    event.respondWith(
      fetch(request)
        .then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            const schemesCache = await caches.open(SCHEMES_CACHE);
            schemesCache.put(request, cacheCopy);
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('[ServiceWorker] Network failed, serving cached scheme data:', request.url);
          const schemesCache = await caches.open(SCHEMES_CACHE);
          const cachedResponse = await schemesCache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Default offline JSON response
          return new Response(JSON.stringify(OFFLINE_SCHEMES_FALLBACK), {
            headers: { 
              'Content-Type': 'application/json',
              'X-Offline-Cached': 'true'
            }
          });
        })
    );
    return;
  }

  // Strategy 2: Static Assets & Web App Shell (Stale-While-Revalidate)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and request is for navigation/HTML, return index.html
          if (request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Listen for messages from client (e.g. manual cache refresh)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CACHE_SCHEMES_DATA' && event.data.payload) {
    caches.open(SCHEMES_CACHE).then((cache) => {
      const response = new Response(JSON.stringify(event.data.payload), {
        headers: { 'Content-Type': 'application/json', 'X-Offline-Cached': 'true' }
      });
      cache.put('/api/v1/schemes', response);
      console.log('[ServiceWorker] Updated offline scheme cache with client payload');
    });
  }
});
