/* ==========================================================================
   DIRECTORY.JS - Verified Sindhi Samaj, Panchayat & Ancestral Origins Directory
   Source Documentation: docs/SINDHI_SAMAJ_DIRECTORY.md
   ========================================================================== */

const SINDHI_DIRECTORY = {
  // Category A: Sindhi Panchayats & Samaj Organizations
  panchayats: [
    {
      id: 'pan_jacobabad_jpr',
      name: 'Jacobabad Sindhi Panchayat, Jaipur',
      hindiName: 'जैकबाबाद सिंधी पंचायत, जयपुर',
      category: 'Panchayat',
      type: 'Ancestral Biradari Panchayat',
      city: 'Jaipur',
      state: 'Rajasthan',
      aliases: ['Jacobabadi Panchayat', 'Sindhi Jacobabad Seva Samiti', 'Jaipur Jacobabad Samaj']
    },
    {
      id: 'pan_jacobabad_ajm',
      name: 'Jacobabad Sindhi Panchayat, Ajmer',
      hindiName: 'जैकबाबाद सिंधी पंचायत, अजमेर',
      category: 'Panchayat',
      type: 'Ancestral Biradari Panchayat',
      city: 'Ajmer',
      state: 'Rajasthan',
      aliases: ['Shree Jacobabad Panchayat Ajmer', 'Ajmer Jacobabad Biradari']
    },
    {
      id: 'pan_shikarpur_mum',
      name: 'Shikarpur Sindhi Panchayat, Mumbai',
      hindiName: 'शिकारपुर सिंधी पंचायत, मुंबई',
      category: 'Panchayat',
      type: 'Ancestral Biradari Panchayat',
      city: 'Mumbai',
      state: 'Maharashtra',
      aliases: ['Shikarpuri Sindhi Association', 'Shikarpur Seva Mandal Mumbai']
    },
    {
      id: 'pan_shikarpur_ulh',
      name: 'Shikarpur Sindhi Panchayat, Ulhasnagar',
      hindiName: 'शिकारपुर सिंधी पंचायत, उल्हासनगर',
      category: 'Panchayat',
      type: 'Ancestral Biradari Panchayat',
      city: 'Ulhasnagar',
      state: 'Maharashtra',
      aliases: ['Shikarpuri Panchayat Camp 3', 'Ulhasnagar Shikarpur Samaj']
    },
    {
      id: 'pan_khanpur_jalg',
      name: 'Khanpur Sindhi Panchayat, Jalgaon',
      hindiName: 'खानपुर सिंधी पंचायत, जलगांव',
      category: 'Panchayat',
      type: 'Ancestral Biradari Panchayat',
      city: 'Jalgaon',
      state: 'Maharashtra',
      aliases: ['Khanpuri Sindhi Samaj Jalgaon', 'Jalgaon Khanpur Biradari']
    },
    {
      id: 'pan_khanpur_ind',
      name: 'Khanpur Sindhi Panchayat, Indore',
      hindiName: 'खानपुर सिंधी पंचायत, इंदौर',
      category: 'Panchayat',
      type: 'Ancestral Biradari Panchayat',
      city: 'Indore',
      state: 'Madhya Pradesh',
      aliases: ['Khanpuri Sindhi Panchayat Indore', 'Indore Khanpur Samaj']
    },
    {
      id: 'pan_larkana_ulh',
      name: 'Larkana Sindhi Panchayat, Ulhasnagar',
      hindiName: 'लरकाना सिंधी पंचायत, उल्हासनगर',
      category: 'Panchayat',
      type: 'Ancestral Biradari Panchayat',
      city: 'Ulhasnagar',
      state: 'Maharashtra',
      aliases: ['Larkani Panchayat', 'Larkana Seva Samiti Camp 1']
    },
    {
      id: 'pan_sadhwani_pun',
      name: 'Sadhwani Sindhi Panchayat & Parivar Trust, Pune',
      hindiName: 'साधवानी सिंधी पंचायत एवं परिवार ट्रस्ट, पुणे',
      category: 'Panchayat',
      type: 'Lineage / Gotra Biradari Trust',
      city: 'Pune',
      state: 'Maharashtra',
      aliases: ['Sadhwani Parivar Seva Trust Pune', 'Sadhwani Biradari Panchayat']
    },
    {
      id: 'pan_central_jpr',
      name: 'Pujya Sindhi Central Panchayat (Mahanagar Jaipur)',
      hindiName: 'पूज्य सिंधी सेंट्रल पंचायत (महानगर जयपुर)',
      category: 'Panchayat',
      type: 'City Apex Central Council',
      city: 'Jaipur',
      state: 'Rajasthan',
      aliases: ['Jaipur Sindhi Mahapanchayat', 'Central Sindhi Panchayat Raja Park', 'Sindhi Central Council Jaipur']
    },
    {
      id: 'pan_ellisbridge_ahd',
      name: 'Pujya Sindhi Panchayat, Ellisbridge, Ahmedabad',
      hindiName: 'पूज्य सिंधी पंचायत, एलिसब्रिज, अहमदाबाद',
      category: 'Panchayat',
      type: 'City Zonal Panchayat & Trust',
      city: 'Ahmedabad',
      state: 'Gujarat',
      aliases: ['Sindhi Panchayat Ambawadi', 'Ellisbridge Sindhi Samaj', 'Ahmedabad West Sindhi Panchayat']
    },
    {
      id: 'pan_maninagar_ahd',
      name: 'Maninagar Sindhi Panchayat, Ahmedabad',
      hindiName: 'मणिनगर सिंधी पंचायत, अहमदाबाद',
      category: 'Panchayat',
      type: 'City Zonal Panchayat',
      city: 'Ahmedabad',
      state: 'Gujarat',
      aliases: ['Maninagar Sindhi Seva Samiti', 'Sindhi Panchayat Tulsibag']
    },
    {
      id: 'pan_mahapanch_ind',
      name: 'Pujya Sindhi Mahapanchayat, Indore',
      hindiName: 'पूज्य सिंधी महापंचायत, इंदौर',
      category: 'Panchayat',
      type: 'City Apex Central Council',
      city: 'Indore',
      state: 'Madhya Pradesh',
      aliases: ['Indore Sindhi Mahapanchayat', 'Katju Colony Sindhi Panchayat', 'Jawahar Nagar Sindhi Council']
    },
    {
      id: 'pan_central_bho',
      name: 'Sindhi Central Panchayat, Bhopal',
      hindiName: 'सिंधी सेंट्रल पंचायत, भोपाल',
      category: 'Panchayat',
      type: 'City Apex Central Council',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      aliases: ['Bhopal Sindhi Central Panchayat', 'Bairagarh Sindhi Panchayat', 'Sant Hirdaram Nagar Panchayat']
    },
    {
      id: 'pan_sindhu_ulh',
      name: 'Sindhu Seva Samiti & Central Council, Ulhasnagar',
      hindiName: 'सिंधू सेवा समिति एवं सेंट्रल काउंसिल, उल्हासनगर',
      category: 'Panchayat',
      type: 'Apex Municipal Council',
      city: 'Ulhasnagar',
      state: 'Maharashtra',
      aliases: ['Ulhasnagar Sindhi Panchayat', 'Sindhu Bhavan Trust', 'Sindhunagar Central Council']
    },
    {
      id: 'pan_samaj_del',
      name: 'Delhi Sindhi Samaj (Bharatiya Sindhu Sabha Delhi)',
      hindiName: 'दिल्ली सिंधी समाज (भारतीय सिंधु सभा)',
      category: 'Samaj',
      type: 'State Apex Association',
      city: 'New Delhi',
      state: 'Delhi NCR',
      aliases: ['Delhi Sindhi Council', 'Bharatiya Sindhu Sabha Delhi', 'Sindhi Samaj Lajpat Nagar']
    },
    {
      id: 'pan_gandhidham_kut',
      name: 'Sindhi Seva Samiti, Gandhidham-Adipur',
      hindiName: 'सिंधी सेवा समिति, गांधीधाम-आदीपुर',
      category: 'Samaj',
      type: 'Regional Diaspora Trust',
      city: 'Gandhidham',
      state: 'Gujarat',
      aliases: ['Gandhidham Sindhi Panchayat', 'Maitri Mandal Adipur', 'Kutch Sindhi Association']
    },
    {
      id: 'pan_central_rai',
      name: 'Pujya Sindhi Central Panchayat, Raipur',
      hindiName: 'पूज्य सिंधी सेंट्रल पंचायत, रायपुर',
      category: 'Panchayat',
      type: 'City Apex Council',
      city: 'Raipur',
      state: 'Chhattisgarh',
      aliases: ['Raipur Sindhi Mahapanchayat', 'Pujya Jhulelal Panchayat Raipur']
    },
    {
      id: 'pan_nagpur_mah',
      name: 'Pujya Sindhi Panchayat, Jaripatka, Nagpur',
      hindiName: 'पूज्य सिंधी पंचायत, जरीपटका, नागपुर',
      category: 'Panchayat',
      type: 'City Zonal Panchayat',
      city: 'Nagpur',
      state: 'Maharashtra',
      aliases: ['Jaripatka Sindhi Panchayat', 'Nagpur Sindhi Samaj', 'Dayalbandh Sindhi Council']
    },
    {
      id: 'pan_sabha_lko',
      name: 'Sindhi Sabha, Lucknow',
      hindiName: 'सिंधी सभा, लखनऊ',
      category: 'Samaj',
      type: 'City Central Association',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      aliases: ['Lucknow Sindhi Panchayat', 'Sindhi Seva Trust Lucknow', 'Charbagh Sindhi Samaj']
    },
    {
      id: 'pan_sasi_chn',
      name: 'Sindhi Association of Southern India (SASI), Chennai',
      hindiName: 'सिंधी एसोसिएशन ऑफ सदर्न इंडिया, चेन्नई',
      category: 'Samaj',
      type: 'Regional Diaspora Association',
      city: 'Chennai',
      state: 'Tamil Nadu',
      aliases: ['SASI Chennai', 'Madras Sindhi Association', 'Sindhi Centre Kilpauk']
    },
    {
      id: 'pan_sevablr_blr',
      name: 'Sindhi Seva Samiti, Bengaluru',
      hindiName: 'सिंधी सेवा समिति, बेंगलुरु',
      category: 'Samaj',
      type: 'Regional Diaspora Association',
      city: 'Bengaluru',
      state: 'Karnataka',
      aliases: ['Bangalore Sindhi Association', 'Sindhi Youth Association BLR', 'Sindhi Hospital Trust']
    }
  ],

  // Category B1: Ancestral Places in Sindh (Pakistan)
  ancestralOrigins: [
    {
      id: 'anc_jacobabad',
      name: 'Jacobabad (खानगढ़ / जैकबाबाद)',
      hindiName: 'जैकबाबाद (खानगढ़)',
      region: 'Upper Sindh (Larkana Division)',
      desc: 'Historic trade hub of northern Sindh and gateway to Central Asian caravans',
      surnames: ['Advani', 'Hotchandani', 'Chhabria', 'Daryani', 'Gidwani']
    },
    {
      id: 'anc_shikarpur',
      name: 'Shikarpur (शिकारपुर)',
      hindiName: 'शिकारपुर',
      region: 'Upper Sindh',
      desc: 'Historic financial capital and international banking hub (Shikarpuri Shroffs)',
      surnames: ['Bajaj', 'Lalwani', 'Melwani', 'Bhojwani', 'Bhatia']
    },
    {
      id: 'anc_hyderabad',
      name: 'Hyderabad (हैदराबाद सिंध)',
      hindiName: 'हैदराबाद (सिंध)',
      region: 'Central Sindh',
      desc: 'Historic capital, cultural cradle, intellectual hub of Amils and Sindhwarkis',
      surnames: ['Advani', 'Gidwani', 'Mansukhani', 'Mirchandani', 'Sipahimalani']
    },
    {
      id: 'anc_larkana',
      name: 'Larkana (लरकाना)',
      hindiName: 'लरकाना',
      region: 'North-Western Sindh (Chandka)',
      desc: 'Ancient agrarian heartland and historic gateway to Mohenjo-daro',
      surnames: ['Chandiramani', 'Kriplani', 'Tolani', 'Jagtiani', 'Gidwani']
    },
    {
      id: 'anc_sukkur',
      name: 'Sukkur (सक्खर)',
      hindiName: 'सक्खर',
      region: 'Upper Sindh (Indus Basin)',
      desc: 'Prominent riverine port and commercial trade center opposite Rohri',
      surnames: ['Thadani', 'Ramchandani', 'Vaswani', 'Asrani', 'Nankani']
    },
    {
      id: 'anc_rohri',
      name: 'Rohri (रोहड़ी)',
      hindiName: 'रोहड़ी',
      region: 'Upper Sindh',
      desc: 'Historic sacred riverside town on the left bank of the Indus',
      surnames: ['Wadhwani', 'Motwani', 'Rohra', 'Nankani']
    },
    {
      id: 'anc_khanpur',
      name: 'Khanpur (खानपुर)',
      hindiName: 'खानपुर',
      region: 'Shikarpur District',
      desc: 'Historic transit trade town between northern Sindh and Quetta trade pass',
      surnames: ['Ahuja', 'Makhija', 'Khanpuri', 'Chawla']
    },
    {
      id: 'anc_sehwan',
      name: 'Sehwan (सेहवण)',
      hindiName: 'सेहवण',
      region: 'Dadu District (Central Sindh)',
      desc: 'Ancient spiritual cradle along the Indus known for historic Shaivite and Sufi harmony',
      surnames: ['Keswani', 'Sachdev', 'Sehwani']
    },
    {
      id: 'anc_dadu',
      name: 'Dadu (दादू)',
      hindiName: 'दादू',
      region: 'Central-Western Sindh',
      desc: 'Fertile agricultural basin along the western banks of the Indus',
      surnames: ['Balani', 'Israni', 'Dadui', 'Rupchandani']
    },
    {
      id: 'anc_nawabshah',
      name: 'Nawabshah / Sahiti (नवाबशाह)',
      hindiName: 'नवाबशाह / साहिती',
      region: 'Central Sindh (Sahiti Pargana)',
      desc: 'Agricultural and commercial center of the historic Sahiti territory',
      surnames: ['Lakhiani', 'Chawla', 'Harjani', 'Khubchandani']
    },
    {
      id: 'anc_karachi',
      name: 'Karachi (कराची)',
      hindiName: 'कराची',
      region: 'Lower Sindh (Arabian Sea Port)',
      desc: 'Cosmopolitan metropolis, maritime gateway, and industrial trade center',
      surnames: ['Multiple cosmopolitan lineages', 'Panjwani', 'Somani']
    },
    {
      id: 'anc_thatta',
      name: 'Thatta / Laar (ठट्टा / लार)',
      hindiName: 'ठट्टा / लार',
      region: 'Lower Sindh Indus Delta',
      desc: 'Ancient medieval capital of Sindh and cultural hub of the Laar delta',
      surnames: ['Larai lineages', 'Punjabi', 'Rohra', 'Bhatia']
    },
    {
      id: 'anc_mirpurkhas',
      name: 'Mirpurkhas / Tharparkar (मीरपुरखास)',
      hindiName: 'मीरपुरखास',
      region: 'South-Eastern Sindh',
      desc: 'Agricultural trade center linking lower Sindh with Rajasthan border',
      surnames: ['Thari lineages', 'Kewalramani', 'Vaswani']
    }
  ],

  // Category B2: Traditional Community Identities & Lineages
  subCommunities: [
    {
      id: 'sub_bhaiband',
      name: 'Bhaiband (भाईबंद / सिंधवर्की)',
      hindiName: 'भाईबंद',
      type: 'Traditional Socio-Occupational Lineage',
      desc: 'Historic mercantile, merchant, and global trade community (Sindhworkis) with global presence'
    },
    {
      id: 'sub_amil',
      name: 'Amil (आमिल / दीवान)',
      hindiName: 'आमिल',
      type: 'Traditional Socio-Occupational Lineage',
      desc: 'Historic administrative, civil, and professional scholarly class (Diwans) known for high education'
    },
    {
      id: 'sub_sahiti',
      name: 'Sahiti (साहिती)',
      hindiName: 'साहिती',
      type: 'Regional Cultural Grouping',
      desc: 'Families tracing roots to the fertile Sahiti Pargana (central Sindh, Nawabshah/Naushahro)'
    },
    {
      id: 'sub_larai',
      name: 'Larai (लराई)',
      hindiName: 'लराई',
      type: 'Regional Cultural Grouping',
      desc: 'Families hailing from the Laar region (lower Indus delta around Thatta and Badin)'
    },
    {
      id: 'sub_uttaradi',
      name: 'Uttaradi (उत्तरादी)',
      hindiName: 'उत्तरादी',
      type: 'Regional Cultural Grouping',
      desc: 'Northern/Upper Sindh lineage hailing from Sukkur, Shikarpur, and Jacobabad areas'
    },
    {
      id: 'sub_radhaswami',
      name: 'Radhaswami Sindhi Satsangi (राधास्वामी सत्संगी)',
      hindiName: 'राधास्वामी सिंधी सत्संगी',
      type: 'Spiritual Faith Community Identity',
      desc: 'Sindhi families dedicated to the Radha Soami spiritual tradition with strict vegetarian lifestyle'
    },
    {
      id: 'sub_lohana',
      name: 'Sindhi Lohana (सिंधी लोहाना)',
      hindiName: 'सिंधी लोहाना',
      type: 'Ancient Overarching Jati',
      desc: 'The broad ancient mercantile lineage of Sindh venerating Lord Jhulelal'
    },
    {
      id: 'sub_brahmin',
      name: 'Sindhi Brahmin / Maharaj (सिंधी ब्राह्मण)',
      hindiName: 'सिंधी ब्राह्मण',
      type: 'Traditional Priestly Lineage',
      desc: 'Hereditary spiritual scholars, astrologers, and ceremonial ritual conductors'
    },
    {
      id: 'sub_bhatia',
      name: 'Sindhi Bhatia (सिंधी भाटिया)',
      hindiName: 'सिंधी भाटिया',
      type: 'Ancient Maritime & Merchant Lineage',
      desc: 'Ancient merchant community with historic ties across Thatta, Kutch, and Arabian Sea trade'
    }
  ]
};

// ==========================================
// DIRECTORY LOOKUP & QUERY HELPERS
// ==========================================

function getPanchayatById(id) {
  if (!id) return null;
  return SINDHI_DIRECTORY.panchayats.find(p => p.id === id) || null;
}

function getAncestralOriginById(id) {
  if (!id) return null;
  return SINDHI_DIRECTORY.ancestralOrigins.find(a => a.id === id) || null;
}

function getSubCommunityById(id) {
  if (!id) return null;
  return SINDHI_DIRECTORY.subCommunities.find(s => s.id === id) || null;
}

function searchDirectory(query = '', category = 'all') {
  const cleanQ = (query || '').toLowerCase().trim();
  const results = {
    panchayats: [],
    ancestralOrigins: [],
    subCommunities: []
  };

  if (category === 'all' || category === 'panchayats') {
    results.panchayats = SINDHI_DIRECTORY.panchayats.filter(p => {
      if (!cleanQ) return true;
      return p.name.toLowerCase().includes(cleanQ) ||
             p.city.toLowerCase().includes(cleanQ) ||
             p.state.toLowerCase().includes(cleanQ) ||
             (p.hindiName && p.hindiName.includes(cleanQ)) ||
             p.aliases.some(a => a.toLowerCase().includes(cleanQ));
    });
  }

  if (category === 'all' || category === 'ancestralOrigins') {
    results.ancestralOrigins = SINDHI_DIRECTORY.ancestralOrigins.filter(a => {
      if (!cleanQ) return true;
      return a.name.toLowerCase().includes(cleanQ) ||
             a.region.toLowerCase().includes(cleanQ) ||
             (a.hindiName && a.hindiName.includes(cleanQ)) ||
             a.surnames.some(s => s.toLowerCase().includes(cleanQ));
    });
  }

  if (category === 'all' || category === 'subCommunities') {
    results.subCommunities = SINDHI_DIRECTORY.subCommunities.filter(s => {
      if (!cleanQ) return true;
      return s.name.toLowerCase().includes(cleanQ) ||
             (s.hindiName && s.hindiName.includes(cleanQ)) ||
             s.desc.toLowerCase().includes(cleanQ);
    });
  }

  return results;
}

// Attach to window object for browser access
if (typeof window !== 'undefined') {
  window.SINDHI_DIRECTORY = SINDHI_DIRECTORY;
  window.getPanchayatById = getPanchayatById;
  window.getAncestralOriginById = getAncestralOriginById;
  window.getSubCommunityById = getSubCommunityById;
  window.searchDirectory = searchDirectory;
}
