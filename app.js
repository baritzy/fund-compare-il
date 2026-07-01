(function() {
        'use strict';

        // ===== CONFIG =====
        const API_BASE = 'https://data.gov.il/api/3/action/datastore_search';
        const RESOURCE_ID = 'a30dcbea-a1d2-482c-ae29-8f781f5025fb';
        const PAGE_SIZE = 1000;
        const MAYA_URL = 'https://maya.tase.co.il/he/funds/mutual-funds/';
        const YAHOO_URL = 'https://finance.yahoo.com/quote/';

        const CATEGORIES = [
            { id: 'hishtalmut', name: 'קרנות השתלמות', icon: '🎓', filter: 'קרנות השתלמות' },
            { id: 'tagmulim', name: 'תגמולים ופיצויים', icon: '💼', filter: 'תגמולים ואישית לפיצויים' },
            { id: 'gemel', name: 'גמל להשקעה', icon: '📈', filter: 'קופת גמל להשקעה' },
            { id: 'child', name: 'חסכון לילד', icon: '👶', filter: 'קופת גמל להשקעה - חסכון לילד' },
            { id: 'pitzuim', name: 'מרכזית לפיצויים', icon: '🏢', filter: 'מרכזית לפיצויים' },
        ];

        // ===== HEBREW INDEX ALIASES =====
        const INDEX_ALIASES = {
            // === TASE Israeli indices ===
            'ת"א 125': ['תל אביב 125', 'תא 125', 'TA-125', 'TA 125'],
            'ת"א-35': ['תל אביב 35', 'ת"א 35', 'תא 35', 'TA-35', 'TA 35'],
            'ת"א 90': ['תל אביב 90', 'תא 90', 'TA-90', 'TA 90'],
            'ת"א All-Share ': ['תל אביב כל המניות', 'ת"א כל המניות', 'TA-AllShare', 'כל המניות'],
            'ת"א סקטור-באלאנס': ['באלאנס', 'סקטור באלאנס'],
            'ת"א 90 ובנקים': ['תא 90 ובנקים'],
            'אינדקס בנקים ישראל': ['בנקים 5', 'ת"א בנקים', 'TA-Banks5', 'TA-Banks', 'בנקים ישראל'],
            'ת"א-SME60': ['סמי 60', 'ת"א סמי', 'SME60', 'TA-SME60'],
            'ת"א נדל"ן': ['נדלן', 'ת"א נדלן', 'TA-RealEstate', 'נדל"ן'],
            'ת"א-צמיחה': ['צמיחה', 'ת"א צמיחה', 'TA-Growth'],
            'ת"א-טכנולוגיה': ['טכנולוגיה', 'ת"א טכנולוגיה', 'TA Technology'],
            'ת"א ביטחוניות': ['בטחוניות', 'ת"א בטחוניות', 'TA Defense', 'ביטחוניות'],
            'ת"א פיננסים': ['פיננסים ישראל', 'TA-Finance'],
            'ת"א נדל"ן-35': ['נדלן 35', 'ת"א נדלן 35', 'TA Real Estate-35'],
            'ת"א-בנייה': ['בנייה', 'ת"א בנייה'],
            'ת"א-ביטוח': ['ביטוח', 'ת"א ביטוח'],
            'ת"א-נפט וגז': ['נפט וגז', 'ת"א נפט וגז'],
            'ת"א-פמילי': ['פמילי', 'ת"א פמילי'],
            'ת"א-מניב ישראל': ['מניב ישראל', 'ת"א מניב'],
            'ת"א תשתיות': ['תשתיות ישראל'],
            'תל דיב': ['תל דיבידנד', 'דיבידנד ישראל'],
            // === TASE NTR indices (tracking funds) ===
            'S&P 500 - NTR': ['אס אנד פי 500', 'אס פי 500', 'S&P 500', 'SP500', 'SP 500', 'SNP 500', 'SNP500', 'S&P500', 'sp500'],
            'S&P 500 - NTR,דולר ארה"ב': ['אס אנד פי 500 דולר', 'S&P 500 דולר', 'SP500 דולר', 'S&P 500 - NTR,Dollar'],
            'NASDAQ 100 - NTR': ['נאסדק 100', 'נסדאק 100', 'NASDAQ 100', 'NASDAQ100', 'NDX', 'nasdaq'],
            'NASDAQ 100 - NTR,דולר ארה"ב': ['נאסדק 100 דולר', 'נסדאק דולר', 'NASDAQ דולר', 'NDX דולר', 'NASDAQ 100 - NTR,Dollar'],
            'DAX - NTR': ['דאקס', 'DAX'],
            'DAX - NTR,אירו': ['דאקס אירו', 'DAX אירו'],
            'EURO STOXX 50 - NTR': ['יורו סטוקס 50', 'אירופה 50', 'Euro Stoxx 50'],
            'EURO STOXX 50 - NTR,אירו': ['יורו סטוקס 50 אירו', 'יורו סטוקס 50', 'אירופה 50', 'Euro Stoxx 50'],
            'STOXX Europe 600 - NTR': ['סטוקס אירופה 600', 'אירופה 600'],
            'STOXX Europe 600 - NTR,אירו': ['סטוקס אירופה 600 אירו'],
            'NIKKEI 225 - NTR,יין יפני': ['ניקיי 225', 'יפן', 'NIKKEI 225 - NTR', 'Nikkei 225'],
            'HANG SENG - NTR,דולר הונג קונג': ['האנג סנג', 'הונג קונג', 'HANG SENG - NTR', 'Hang Seng'],
            'RUSSELL 2000 - NTR': ['ראסל 2000 NTR', 'Russell 2000 NTR'],
            'RUSSELL 2000 - NTR,דולר ארה"ב': ['ראסל 2000 דולר'],
            'MSCI WORLD INDEX - NTR': ['MSCI עולמי', 'אמ אס סי איי עולמי'],
            'MSCI WORLD INDEX - NTR,דולר ארה"ב': ['MSCI עולמי דולר'],
            'MSCI EMERGING MARKETS - NTR': ['שווקים מתעוררים NTR', 'MSCI שווקים מתעוררים'],
            'MSCI EMERGING MARKETS - NTR,דולר ארה"ב': ['שווקים מתעוררים דולר'],
            'MSCI AC WORLD INDEX - NTR': ['MSCI כל העולם'],
            'MSCI AC WORLD INDEX - NTR,דולר ארה"ב': ['MSCI כל העולם דולר'],
            'S&P 500 Dividend Aristocrats - NTR': ['דיבידנד אריסטוקרטים NTR', 'אריסטוקרטים NTR'],
            'S&P 500 Dividend Aristocrats - NTR,דולר ארה"ב': ['דיבידנד אריסטוקרטים דולר'],
            'S&P 500 Equal Weight - NTR': ['משקל שווה NTR'],
            'S&P 500 Equal Weight - NTR,דולר ארה"ב': ['משקל שווה NTR דולר'],
            'S&P Technology Select Sector Index - NTR': ['טכנולוגיה ארהב NTR', 'S&P Technology NTR'],
            'S&P Technology Select Sector Index - NTR,דולר ארה"ב': ['טכנולוגיה ארהב NTR דולר'],
            'S&P Health Care Select Sector Index- NTR': ['בריאות ארהב NTR', 'S&P Health Care NTR'],
            'S&P Health Care Select Sector Index- NTR,דולר ארה"ב': ['בריאות ארהב NTR דולר'],
            'S&P Financial Select Sector- NTR': ['פיננסים ארהב NTR', 'S&P Financial NTR'],
            'S&P Financial Select Sector- NTR,דולר ארה"ב': ['פיננסים ארהב NTR דולר'],
            'S&P Consumer Discretionary Select Sector - NTR': ['צריכה מחזורית NTR'],
            'S&P Consumer Staples Select Sector - NTR': ['צריכה בסיסית NTR'],
            'S&P Consumer Staples Select Sector - NTR,דולר ארה"ב': ['צריכה בסיסית NTR דולר'],
            'S&P Industrial Select Sector - NTR': ['תעשייה NTR'],
            'S&P Aerospace & Defense Select Industry Index - NTR': ['ביטחון NTR', 'תעופה וביטחון NTR'],
            'S&P 500 Momentum': ['מומנטום S&P'],
            'S&P 500 Momentum,דולר ארה"ב': ['מומנטום S&P דולר'],
            'S&P 500 TOP 50': ['טופ 50', 'S&P טופ 50'],
            'S&P 500 TOP 50,דולר ארה"ב': ['טופ 50 דולר'],
            'S&P 500 Market Leaders': ['מובילות שוק S&P'],
            'S&P MidCap 400 - NTR': ['מידקאפ 400 NTR'],
            'RUSSELL 1000 Growth - NTR,דולר ארה"ב': ['ראסל צמיחה NTR דולר'],
            'Nasdaq Biotechnology - NTR': ['ביוטק NTR', 'נאסדק ביוטכנולוגיה NTR'],
            'PHLX Semiconductor Sector Index - NTR': ['שבבים NTR', 'PHLX NTR'],
            'ISE Cyber Security - NTR': ['סייבר NTR', 'ISE Cyber NTR'],
            'ISE Cyber Security - NTR,דולר ארה"ב': ['סייבר NTR דולר'],
            'ISE CTA Cloud Computing - NTR': ['מחשוב ענן NTR'],
            'Morningstar Wide Moat Focus - GTR': ['מורנינגסטאר מואט', 'Wide Moat'],
            'MSCI INDIA - NTR,רופי הודי': ['הודו', 'MSCI הודו'],
            'S&P 500 Growth': ['צמיחה S&P 500'],
            'S&P 500 Growth,דולר ארה"ב': ['צמיחה S&P 500 דולר'],
            'S&P 500 Value Index': ['ערך S&P 500 NTR'],
            'Dow Jones Industrial Average - NTR': ['דאו ג\'ונס NTR'],
            'Dow Jones Industrial Average - NTR,דולר ארה"ב': ['דאו ג\'ונס NTR דולר'],
            'S&P 500 Low Volatility High Dividend Index - NTR': ['תנודתיות נמוכה דיבידנד'],
            'S&P 500 Low Volatility High Dividend Index - NTR,דולר ארה"ב': ['תנודתיות נמוכה דיבידנד דולר'],
            'Shiller Barclays CAPE® US Core Mid-Month Sector Net TR Index': ['שילר CAPE'],
            'S&P 500 Scored & Screened Index - NTR': ['S&P סינון'],
            // === TASE Bond indices ===
            'תל בונד שקלי': ['אגח שקלי', 'Tel Bond-Shekel', 'תל בונד-שקלי'],
            'תל בונד צמודות': ['אגח צמוד מדד', 'Tel Bond-CPI Linked', 'תל בונד צמוד'],
            'תל בונד מאגר': ['תל בונד-מאגר', 'אגח מאגר', 'Tel Bond-Composite', 'תל בונד מרכב'],
            'תל גוב-שקלי': ['אגח ממשלתי שקלי', 'Tel Gov - Shekel', 'תל גוב שקלי'],
            'תל גוב-צמודות': ['אגח ממשלתי צמוד', 'Tel Gov - CPI Linked', 'תל גוב צמודות'],
            'תל גוב-כללי': ['אגח ממשלתי כללי', 'תל גוב כללי'],
            'תל גוב-שקלי 2-5': ['אגח ממשלתי שקלי 2-5'],
            'תל גוב-צמודות 2-5': ['אגח ממשלתי צמוד 2-5'],
            'תל גוב-שקלי 5+': ['אגח ממשלתי שקלי 5+'],
            'תל גוב-צמודות 5-10': ['אגח ממשלתי צמוד 5-10'],
            'תל בונד 20 צמודות': ['תל בונד 20', 'אגח 20 צמודות'],
            'תל בונד 40 צמודות': ['תל בונד 40', 'אגח 40 צמודות'],
            'תל בונד 60 צמודות': ['תל בונד 60', 'אגח 60 צמודות'],
            'תל בונד צמודות - בנקים ללא COCO': ['תל בונד בנקים ללא COCO'],
            'תל בונד תשואות צמודות': ['תשואות צמודות'],
            'תל בונד שקלי-50': ['תל בונד שקלי 50'],
            'תל בונד-צמודות 1-3': ['אגח צמוד 1-3'],
            'תל בונד-צמודות 3-5': ['אגח צמוד 3-5'],
            'תל בונד-צמודות 5-15': ['אגח צמוד 5-15'],
            'תל בונד-שקלי 5-15': ['אגח שקלי 5-15'],
            'תל בונד-שקלי 3-5': ['אגח שקלי 3-5'],
            'תל בונד-שקלי 1-3': ['אגח שקלי 1-3'],
            'תל בונד-שקלי AA-AAA': ['אגח שקלי AA-AAA'],
            'תל בונד-צמודות AA-AAA': ['אגח צמוד AA-AAA'],
            'תל בונד-שקלי A': ['אגח שקלי A'],
            'תל בונד-צמודות A': ['אגח צמוד A'],
            'תל בונד צמודות-יתר': ['תל בונד צמודות יתר'],
            'תל בונד-תשואות שקל': ['תשואות שקל'],
            'תל בונד שקלי- בנקים וביטוח': ['בנקים וביטוח שקלי'],
            'All-Bond - ריבית משתנה שקלי': ['ריבית משתנה שקלי'],
            'תל גוב-מק"מ': ['מקמ', 'מק"מ'],
            'תל גוב-שקלי 5-10': ['אגח ממשלתי שקלי 5-10'],
            'תל גוב-משתנה שקלי': ['ממשלתי משתנה שקלי'],
            'תל גוב-צמודות 0-2': ['אגח ממשלתי צמוד 0-2'],
            'IBOXX USD LIQUID INVESTMENT GRADE TOP 30 INDEX - GTR': ['iBoxx USD', 'אגח דולר iBoxx'],
            // === Crypto TASE ===
            'CME CF Bitcoin Reference Rate - New York Variant': ['ביטקוין TASE', 'Bitcoin TASE'],
            'CME CF Bitcoin Reference Rate - New York Variant,דולר ארה"ב': ['ביטקוין דולר TASE'],
            'CME CF Ether – Dollar Reference Rate New York Variant': ['אתריום TASE', 'Ethereum TASE', 'את\'ריום'],
            'CME CF Ether – Dollar Reference Rate New York Variant,דולר ארה"ב': ['אתריום דולר TASE', 'אתריום', 'את\'ריום', 'Ethereum', 'אתריום TASE', 'Ethereum TASE'],
            'LBMA Gold Price AM USD': ['זהב TASE', 'Gold TASE'],
            // === US ETF indices ===
            'S&P 500': ['אס אנד פי 500', 'SP500', 'SNP500', 'SNP', 'VOO', 'SPY', 'IVV', 'SPLG'],
            'NASDAQ 100': ['נאסדק 100', 'נסדאק', 'QQQ', 'QQQM', 'NDX'],
            'Dow Jones Industrial Average': ['דאו ג\'ונס', 'DIA', 'DJIA'],
            'Total US Stock Market': ['כל השוק האמריקאי', 'VTI', 'ITOT', 'SPTM', 'שוק אמריקאי'],
            'Russell 2000': ['ראסל 2000', 'IWM', 'VTWO', 'חברות קטנות ארהב'],
            'Russell 1000': ['ראסל 1000', 'IWB'],
            'Russell 1000 Growth': ['ראסל צמיחה', 'IWF'],
            'Russell 1000 Value': ['ראסל ערך', 'IWD'],
            'S&P 500 Equal Weight': ['משקל שווה', 'RSP'],
            'S&P 500 Dividend Aristocrats': ['דיבידנד אריסטוקרטים', 'NOBL', 'אריסטוקרטים'],
            'Dow Jones US Dividend 100': ['דיבידנד 100', 'SCHD', 'דיבידנד ארהב'],
            'Dividend Appreciation': ['דיבידנד עולה', 'VIG'],
            'S&P 500 Value': ['ערך S&P 500', 'SPYV'],
            'S&P 500 Growth': ['צמיחה S&P', 'SPYG'],
            'S&P 500 Low Volatility': ['תנודתיות נמוכה', 'SPLV'],
            'S&P MidCap 400': ['מידקאפ 400', 'IJH', 'MDY'],
            'CRSP US Mid Cap': ['מידקאפ CRSP', 'VO'],
            'S&P SmallCap 600': ['סמולקאפ 600', 'IJR'],
            'CRSP US Small Cap': ['סמולקאפ CRSP', 'VB'],
            'Technology Select Sector': ['טכנולוגיה ארהב', 'XLK', 'סקטור טכנולוגיה'],
            'Information Technology': ['טכנולוגיית מידע', 'VGT'],
            'Semiconductor': ['שבבים', 'SMH', 'מוליכים למחצה', 'צ\'יפים'],
            'PHLX Semiconductor': ['שבבים SOXX', 'SOXX'],
            'ARK Innovation': ['חדשנות ARK', 'ARKK'],
            'Health Care Select Sector': ['בריאות ארהב', 'XLV', 'סקטור בריאות'],
            'Health Care': ['בריאות', 'VHT'],
            'NASDAQ Biotechnology': ['ביוטק', 'IBB', 'ביוטכנולוגיה'],
            'Financial Select Sector': ['פיננסים ארהב', 'XLF', 'בנקים ארהב'],
            'Financials': ['פיננסים', 'VFH'],
            'S&P Banks': ['בנקים ארהב S&P', 'KBE'],
            'Energy Select Sector': ['אנרגיה ארהב', 'XLE', 'נפט'],
            'Energy': ['אנרגיה', 'VDE'],
            'Real Estate': ['נדלן ארהב', 'VNQ', 'ריטים', 'REIT'],
            'Real Estate Select Sector': ['נדלן XLRE', 'XLRE'],
            'US Real Estate': ['נדלן ארהב IYR', 'IYR'],
            'Consumer Discretionary': ['צריכה מחזורית', 'XLY'],
            'Consumer Staples': ['צריכה בסיסית', 'XLP'],
            'Industrial Select Sector': ['תעשייה ארהב', 'XLI'],
            'Industrials': ['תעשייה', 'VIS'],
            'Utilities Select Sector': ['שירותי חשמל', 'XLU', 'תשתיות'],
            'Communication Services': ['תקשורת', 'XLC'],
            'Materials Select Sector': ['חומרי גלם', 'XLB'],
            'FTSE Developed Markets': ['שווקים מפותחים', 'VEA'],
            'FTSE Europe': ['אירופה FTSE', 'VGK'],
            'MSCI Japan': ['יפן MSCI', 'EWJ'],
            'MSCI Germany': ['גרמניה', 'EWG'],
            'MSCI United Kingdom': ['בריטניה', 'EWU'],
            'FTSE Emerging Markets': ['שווקים מתעוררים', 'VWO'],
            'MSCI Emerging Markets': ['שווקים מתעוררים MSCI', 'EEM', 'IEMG'],
            'MSCI EAFE': ['אירופה אסיה', 'EFA', 'IEFA'],
            'FTSE All-World ex-US': ['עולם חוץ ארהב', 'VXUS'],
            'FTSE Global All Cap': ['עולם כולל', 'VT'],
            'MSCI ACWI': ['כל העולם MSCI', 'ACWI'],
            'MSCI China': ['סין MSCI', 'MCHI'],
            'FTSE China 50': ['סין 50', 'FXI'],
            'China Internet': ['אינטרנט סין', 'KWEB'],
            'MSCI India': ['הודו MSCI', 'INDA'],
            'Gold': ['זהב', 'GLD', 'IAU'],
            'Silver': ['כסף', 'SLV'],
            'Crude Oil': ['נפט גולמי', 'USO'],
            'Commodity Index': ['סחורות', 'DBC'],
            'Bitcoin': ['ביטקוין', 'IBIT', 'BTC'],
            'Bitcoin Futures': ['ביטקוין פיוצ\'רס', 'BITO'],
            'Ethereum': ['אתריום', 'ETHA', 'ETH'],
            'US Aggregate Bond': ['אגח אמריקאי', 'BND', 'AGG'],
            'Treasury 20+ Year': ['אגח ממשלתי ארוך', 'TLT'],
            'Treasury 7-10 Year': ['אגח ממשלתי 7-10', 'IEF'],
            'Treasury 1-3 Year': ['אגח ממשלתי קצר', 'SHY'],
            'US Treasury Bond': ['אגח ממשלתי ארהב', 'GOVT'],
            'TIPS Bond': ['אגח צמוד אינפלציה', 'TIP', 'TIPS'],
            'Short-Term Treasury': ['אגח קצר', 'VGSH'],
            'Intermediate-Term Treasury': ['אגח בינוני', 'VGIT'],
            'Long-Term Treasury': ['אגח ארוך', 'VGLT'],
            'Investment Grade Corporate': ['אגח חברות מדורג', 'LQD'],
            'High Yield Corporate': ['אגח תשואה גבוהה', 'HYG', 'JNK', 'ג\'אנק'],
            'Intermediate-Term Corporate': ['אגח חברות בינוני', 'VCIT'],
            'Short-Term Corporate': ['אגח חברות קצר', 'VCSH'],
            'Cybersecurity': ['סייבר', 'CIBR', 'HACK'],
            'Robotics & AI': ['בינה מלאכותית', 'רובוטיקה', 'BOTZ', 'AI'],
            'Robotics & Automation': ['אוטומציה', 'ROBO'],
            'Cloud Computing': ['מחשוב ענן', 'SKYY', 'WCLD', 'ענן'],
            'Global Clean Energy': ['אנרגיה נקייה', 'ICLN', 'אנרגיה ירוקה'],
            'Solar Energy': ['אנרגיה סולארית', 'TAN'],
            'Clean Edge Green Energy': ['אנרגיה ירוקה QCLN', 'QCLN'],
            'US Aerospace & Defense': ['ביטחון ארהב', 'ITA', 'תעשייה ביטחונית'],
        };

        // Build reverse lookup: hebrew term -> index name
        const hebrewToIndex = {};
        for (const [idx, aliases] of Object.entries(INDEX_ALIASES)) {
            for (const alias of aliases) {
                hebrewToIndex[alias.toLowerCase()] = idx;
            }
        }

        // Build reverse lookup: normalized alias/key -> all terms in that group
        // This lets us find aliases for fund idx values that appear as alias VALUES (not keys)
        function findAliasGroup(fundIdx) {
            const n = norm(fundIdx);
            for (const [key, aliases] of Object.entries(INDEX_ALIASES)) {
                if (norm(key) === n) return [key, ...aliases];
                for (const a of aliases) {
                    if (norm(a) === n) return [key, ...aliases];
                }
            }
            return [];
        }

        // US-related indices
        const US_INDICES = new Set([
            'S&P 500 - NTR', 'S&P 500 - NTR,דולר ארה"ב', 'NASDAQ 100 - NTR', 'NASDAQ 100 - NTR,דולר ארה"ב',
            'RUSSELL 2000 - NTR', 'RUSSELL 2000 - NTR,דולר ארה"ב', 'RUSSELL 1000 Growth - NTR,דולר ארה"ב',
            'Dow Jones Industrial Average - NTR', 'Dow Jones Industrial Average - NTR,דולר ארה"ב',
            'S&P 500 Dividend Aristocrats - NTR', 'S&P 500 Dividend Aristocrats - NTR,דולר ארה"ב',
            'S&P 500 Equal Weight - NTR', 'S&P 500 Equal Weight - NTR,דולר ארה"ב',
            'S&P 500 TOP 50', 'S&P 500 TOP 50,דולר ארה"ב',
            'S&P 500 Growth', 'S&P 500 Growth,דולר ארה"ב', 'S&P 500 Value Index',
            'S&P 500 Momentum', 'S&P 500 Momentum,דולר ארה"ב',
            'S&P 500 Market Leaders', 'S&P 500 Market Leaders,דולר ארה"ב',
            'S&P MidCap 400 - NTR', 'Nasdaq Biotechnology - NTR',
            'PHLX Semiconductor Sector Index - NTR', 'PHLX Semiconductor Sector Index - GTR,דולר ארה"ב',
            'S&P Technology Select Sector Index - NTR', 'S&P Technology Select Sector Index - NTR,דולר ארה"ב',
            'S&P Health Care Select Sector Index- NTR', 'S&P Health Care Select Sector Index- NTR,דולר ארה"ב',
            'S&P Financial Select Sector- NTR', 'S&P Financial Select Sector- NTR,דולר ארה"ב',
            'S&P Consumer Discretionary Select Sector - NTR', 'S&P Consumer Staples Select Sector - NTR',
            'S&P Industrial Select Sector - NTR', 'S&P Aerospace & Defense Select Industry Index - NTR',
            'S&P 500 Low Volatility High Dividend Index - NTR',
            'S&P 500 Scored & Screened Index - NTR',
            'ISE Cyber Security - NTR', 'ISE CTA Cloud Computing - NTR',
        ]);
        const TASE_INDICES = new Set([
            'ת"א 125', 'ת"א-35', 'ת"א 90', 'ת"א סקטור-באלאנס', 'ת"א 90 ובנקים',
            'אינדקס בנקים ישראל', 'ת"א-SME60', 'ת"א נדל"ן', 'ת"א-צמיחה',
            'ת"א-טכנולוגיה', 'ת"א נדל"ן-35', 'ת"א-בנייה', 'ת"א-ביטוח',
            'ת"א-נפט וגז', 'ת"א-פמילי', 'ת"א-מניב ישראל', 'תל דיב',
            'תל בונד שקלי', 'תל בונד צמודות', 'תל בונד מאגר', 'תל בונד תשואות צמודות',
            'תל גוב-שקלי', 'תל גוב-צמודות', 'תל גוב-כללי',
            'תל גוב-שקלי 2-5', 'תל גוב-צמודות 2-5', 'תל גוב-שקלי 5+', 'תל גוב-צמודות 5-10',
        ]);

        // ===== STATE =====
        let allFunds = [], filteredFunds = [], activeCategory = null, activeSpec = null, latestPeriod = null;
        let activeTab = 'index';
        let trackingData = null, trackingFunds = [], filteredTrackingFunds = [];
        let usEtfData = null;
        let selectedIdx = null; // selected index for tracking tab

        // ===== DOM =====
        const categoriesGrid = document.getElementById('categoriesGrid');
        const specFilters = document.getElementById('specFilters');
        const controlsBar = document.getElementById('controlsBar');
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');
        const exchangeSelect = document.getElementById('exchangeSelect');
        const resultsInfo = document.getElementById('resultsInfo');
        const resultsCount = document.getElementById('resultsCount');
        const dataFreshness = document.getElementById('dataFreshness');
        const fundList = document.getElementById('fundList');
        const autocompleteDropdown = document.getElementById('autocompleteDropdown');
        const selectedIndexEl = document.getElementById('selectedIndex');

        // ===== INIT =====
        renderCategories();
        initTabs();
        // Default to index tab
        document.querySelector('.categories-section').classList.add('hidden');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'index'));
        loadTrackingFunds();

        // ===== CATEGORIES (GEMEL TAB) =====
        function renderCategories() {
            categoriesGrid.innerHTML = CATEGORIES.map(cat => `
                <button class="category-btn" data-category="${cat.id}">
                    <span class="category-icon">${cat.icon}</span>
                    ${cat.name}
                </button>
            `).join('');
            categoriesGrid.querySelectorAll('.category-btn').forEach(btn => {
                btn.addEventListener('click', () => selectCategory(btn.dataset.category));
            });
        }

        async function selectCategory(categoryId) {
            const cat = CATEGORIES.find(c => c.id === categoryId);
            if (!cat) return;
            activeCategory = categoryId;
            activeSpec = null;
            categoriesGrid.querySelectorAll('.category-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.category === categoryId));
            controlsBar.classList.remove('hidden');
            resultsInfo.classList.remove('hidden');
            searchInput.value = '';
            searchInput.placeholder = 'חיפוש לפי שם קרן או חברה מנהלת...';
            showLoading();
            try {
                const data = await fetchFunds(cat.filter);
                allFunds = deduplicateLatest(data);
                renderSpecFilters();
                applyFiltersAndSort();
            } catch (err) { showError(err.message); }
        }

        async function fetchFunds(classification) {
            const cacheKey = `gemel_${classification}`;
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) return JSON.parse(cached);
            let allRecords = [], offset = 0, total = Infinity;
            while (offset < total) {
                const params = new URLSearchParams({ resource_id: RESOURCE_ID, limit: PAGE_SIZE, offset, filters: JSON.stringify({ FUND_CLASSIFICATION: classification }), sort: 'REPORT_PERIOD desc' });
                const response = await fetch(`${API_BASE}?${params}`);
                if (!response.ok) throw new Error('שגיאה בטעינת הנתונים.');
                const json = await response.json();
                if (!json.success) throw new Error('שגיאה בתשובת השרת.');
                total = json.result.total;
                allRecords = allRecords.concat(json.result.records);
                offset += PAGE_SIZE;
            }
            try { sessionStorage.setItem(cacheKey, JSON.stringify(allRecords)); } catch(e) {}
            return allRecords;
        }

        function deduplicateLatest(records) {
            const map = new Map(); let maxPeriod = 0;
            for (const rec of records) {
                const period = rec.REPORT_PERIOD || 0;
                if (period > maxPeriod) maxPeriod = period;
                const existing = map.get(rec.FUND_ID);
                if (!existing || period > existing.REPORT_PERIOD) map.set(rec.FUND_ID, rec);
            }
            latestPeriod = maxPeriod;
            return Array.from(map.values());
        }

        function renderSpecFilters() {
            const specs = new Set();
            for (const fund of allFunds) { if (fund.SPECIALIZATION) specs.add(fund.SPECIALIZATION); }
            if (specs.size <= 1) { specFilters.classList.add('hidden'); return; }
            specFilters.classList.remove('hidden');
            specFilters.innerHTML = `<button class="spec-chip active" data-spec="all">הכל</button>` +
                Array.from(specs).sort().map(s => `<button class="spec-chip" data-spec="${s}">${s}</button>`).join('');
            specFilters.querySelectorAll('.spec-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    activeSpec = chip.dataset.spec === 'all' ? null : chip.dataset.spec;
                    specFilters.querySelectorAll('.spec-chip').forEach(c => c.classList.toggle('active', (activeSpec === null && c.dataset.spec === 'all') || c.dataset.spec === activeSpec));
                    applyFiltersAndSort();
                });
            });
        }

        function applyFiltersAndSort() {
            const query = searchInput.value.trim().toLowerCase();
            const sortKey = sortSelect.value;
            filteredFunds = allFunds.filter(fund => {
                if (activeSpec && fund.SPECIALIZATION !== activeSpec) return false;
                if (query) {
                    const name = (fund.FUND_NAME || '').toLowerCase();
                    const manager = (fund.MANAGING_CORPORATION || '').toLowerCase();
                    const isNumeric = /^\d+$/.test(query);
                    const idMatch = isNumeric && String(fund.FUND_ID || '') === query;
                    if (!name.includes(query) && !manager.includes(query) && !idMatch) return false;
                }
                return true;
            });
            // Fund needs YTD + at least one long-term metric to be considered "has data"
            function hasGemelData(f) {
                const hasYtd = f.YEAR_TO_DATE_YIELD != null && f.YEAR_TO_DATE_YIELD !== 0;
                const has3y = f.AVG_ANNUAL_YIELD_TRAILING_3YRS != null && f.AVG_ANNUAL_YIELD_TRAILING_3YRS !== 0;
                const has5y = f.AVG_ANNUAL_YIELD_TRAILING_5YRS != null && f.AVG_ANNUAL_YIELD_TRAILING_5YRS !== 0;
                return hasYtd && (has3y || has5y);
            }
            filteredFunds.sort((a, b) => {
                // Push funds without data to the end
                const aHas = hasGemelData(a), bHas = hasGemelData(b);
                if (aHas && !bHas) return -1;
                if (!aHas && bHas) return 1;
                switch (sortKey) {
                    case 'fee-asc': return num(a.AVG_ANNUAL_MANAGEMENT_FEE) - num(b.AVG_ANNUAL_MANAGEMENT_FEE);
                    case 'fee-desc': return num(b.AVG_ANNUAL_MANAGEMENT_FEE) - num(a.AVG_ANNUAL_MANAGEMENT_FEE);
                    case 'return-ytd-desc': return num(b.YEAR_TO_DATE_YIELD) - num(a.YEAR_TO_DATE_YIELD);
                    case 'return-3y-desc': return num(b.YIELD_TRAILING_3_YRS) - num(a.YIELD_TRAILING_3_YRS);
                    case 'return-5y-desc': return num(b.YIELD_TRAILING_5_YRS) - num(a.YIELD_TRAILING_5_YRS);
                    case 'aum-desc': return num(b.TOTAL_ASSETS) - num(a.TOTAL_ASSETS);
                    case 'sd-asc': return num(a.STANDARD_DEVIATION) - num(b.STANDARD_DEVIATION);
                    default: return 0;
                }
            });
            renderGemelResults();
        }

        function renderGemelResults() {
            resultsCount.innerHTML = `נמצאו <strong>${filteredFunds.length}</strong> קרנות`;
            if (latestPeriod) {
                const year = Math.floor(latestPeriod / 100), month = latestPeriod % 100;
                const mn = ['','ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
                dataFreshness.innerHTML = `<span class="freshness-dot"></span> נתונים: ${mn[month]||month}/${year}`;
            }
            if (filteredFunds.length === 0) { fundList.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>לא נמצאו קרנות</p></div>`; return; }
            const gsk = sortSelect.value;
            fundList.innerHTML = filteredFunds.map((fund, i) => {
                const fee = num(fund.AVG_ANNUAL_MANAGEMENT_FEE), depositFee = num(fund.AVG_DEPOSIT_FEE);
                const tags = [];
                if (fund.SPECIALIZATION) tags.push(fund.SPECIALIZATION);
                if (fund.SUB_SPECIALIZATION && fund.SUB_SPECIALIZATION !== fund.SPECIALIZATION) tags.push(fund.SUB_SPECIALIZATION);
                const inception = fund.INCEPTION_DATE; if (inception) { const m = inception.match(/^(\d{4})/); if (m) tags.push(`פעילה מ-${m[1]}`); }
                if (depositFee > 0) tags.push(`דמי הפקדה: ${fmt(depositFee)}%`);
                // Cumulative return boxes (only when sorting by 3yr/5yr)
                let cumBox = '';
                if (gsk === 'return-5y-desc') cumBox = metricBox('מצטברת 5 שנים', fund.YIELD_TRAILING_5_YRS, true);
                else if (gsk === 'return-3y-desc') cumBox = metricBox('מצטברת 3 שנים', fund.YIELD_TRAILING_3_YRS, true);
                return `<div class="fund-card" style="animation-delay:${Math.min(i*0.03,0.3)}s">
                    <div class="fund-card-top"><div><div class="fund-name"><a href="https://gemelnet.mof.gov.il/fund/${fund.FUND_ID}" target="_blank" rel="noopener" class="fund-link">${esc(fund.FUND_NAME||'')} ↗</a></div><div class="fund-manager">${esc(fund.MANAGING_CORPORATION||'')}</div></div>
                    <div class="fund-fee-badge">${fmt(fee)}%<small>דמי ניהול</small></div></div>
                    <div class="fund-metrics">${metricBox('תשואה מתחילת שנה',fund.YEAR_TO_DATE_YIELD,true)}${metricBox('ממוצע שנתי 3 שנים',fund.AVG_ANNUAL_YIELD_TRAILING_3YRS,true)}${metricBox('ממוצע שנתי 5 שנים',fund.AVG_ANNUAL_YIELD_TRAILING_5YRS,true)}${cumBox}${metricBox('גודל קרן (מ׳ ₪)',fund.TOTAL_ASSETS,false,true)}${metricBox('סטיית תקן',fund.STANDARD_DEVIATION,false)}${metricBox('מדד שארפ',fund.SHARPE_RATIO,false)}</div>
                    ${tags.length?`<div class="fund-tags">${tags.map(t=>`<span class="fund-tag">${esc(t)}</span>`).join('')}</div>`:''}</div>`;
            }).join('');
        }

        // ===== TAB SWITCHING =====
        function initTabs() {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tab = btn.dataset.tab;
                    if (tab === activeTab) return;
                    activeTab = tab;
                    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
                    controlsBar.classList.add('hidden'); resultsInfo.classList.add('hidden');
                    specFilters.classList.add('hidden'); fundList.innerHTML = '';
                    searchInput.value = ''; selectedIdx = null;
                    selectedIndexEl.classList.add('hidden');
                    autocompleteDropdown.classList.add('hidden');
                    if (tab === 'gemel') {
                        document.querySelector('.categories-section').classList.remove('hidden');
                        exchangeSelect.classList.add('hidden');
                        renderCategories();
                    } else if (tab === 'index') {
                        document.querySelector('.categories-section').classList.add('hidden');
                        loadTrackingFunds();
                    } else if (tab === 'favorites') {
                        document.querySelector('.categories-section').classList.add('hidden');
                        exchangeSelect.classList.add('hidden');
                        controlsBar.classList.add('hidden');
                        resultsInfo.classList.remove('hidden');
                        showFavorites();
                    }
                });
            });
        }

        // ===== TRACKING FUNDS (INDEX TAB) =====
        async function loadTrackingFunds() {
            controlsBar.classList.remove('hidden');
            resultsInfo.classList.remove('hidden');
            exchangeSelect.classList.remove('hidden');
            searchInput.placeholder = 'חפש מדד... (למשל: תל אביב 125, S&P 500, נאסדק)';
            showLoading();
            try {
                if (!trackingData) {
                    const DATA_BASE = 'https://raw.githubusercontent.com/baritzy/fund-compare-data/master/';
                    const [taseResp, usResp] = await Promise.all([
                        fetch(DATA_BASE + 'tracking-funds.json'),
                        fetch(DATA_BASE + 'us-etfs.json')
                    ]);
                    if (!taseResp.ok) throw new Error('שגיאה בטעינת נתוני קרנות ישראליות.');
                    trackingData = await taseResp.json();
                    if (usResp.ok) usEtfData = await usResp.json();
                }
                // Merge: Israeli tracking funds + US ETFs
                trackingFunds = [...trackingData.funds];
                if (usEtfData) trackingFunds = trackingFunds.concat(usEtfData.funds);
                renderTop5Dashboard();
            } catch (err) { showError(err.message); }
        }

        function matchesIndex(fundIdx, query) {
            if (!fundIdx) return false;
            const normIdx = norm(fundIdx);
            const normQ = norm(query);
            if (normIdx.includes(normQ)) return true;
            // Find all terms in the alias group for this fund's index (by key OR by value)
            const group = findAliasGroup(fundIdx);
            if (group.length) {
                for (const term of group) {
                    const normT = norm(term);
                    // Short terms (tickers like VO, XL) require exact match to avoid false positives
                    if (normT.length <= 4 || normQ.length <= 4) {
                        if (normT === normQ) return true;
                    } else {
                        if (normT.includes(normQ) || normQ.includes(normT)) return true;
                    }
                }
            }
            return false;
        }

        function getExchangeForIndex(idx) {
            if (!idx) return 'other';
            for (const ti of TASE_INDICES) { if (idx.includes(ti)) return 'tase'; }
            for (const ui of US_INDICES) { if (idx.includes(ui)) return 'us'; }
            // Heuristic: if it contains Hebrew, it's TASE
            if (/[\u0590-\u05FF]/.test(idx)) return 'tase';
            // If it contains Dollar or NTR without TA prefix, likely US/intl
            if (idx.includes('Dollar') || idx.includes('NTR')) return 'us';
            return 'other';
        }

        // ===== TOP 5 DASHBOARD (default view) =====
        function renderTop5Dashboard() {
            resultsCount.innerHTML = `<strong>${trackingFunds.length}</strong> קרנות מחקות זמינות — חפש מדד או עיין בדירוגים`;
            dataFreshness.innerHTML = `<span class="freshness-dot"></span> נתונים: ${trackingData.updated} (מאיה — הבורסה)`;


            // Helper: get best funds for an index sorted by effective fee (mf + vf)
            function topByIndex(idxName, limit) {
                return trackingFunds.filter(f => f.idx && f.idx.includes(idxName)).sort((a,b) => effectiveFee(a) - effectiveFee(b)).slice(0, limit);
            }

            // Helper: render a TOP5 table
            function top5Table(title, icon, funds, highlightCol) {
                if (!funds.length) return '';
                return `<div class="top5-card">
                    <div class="top5-header"><span class="top5-icon">${icon}</span> ${title}</div>
                    <div class="top5-list">
                        ${funds.map((f, i) => {
                            const trendCls = num(f.yy) >= 0 ? 'trend-up' : 'trend-down';
                            const trendSvg = num(f.yy) >= 0
                                ? '<svg class="trend-svg" viewBox="0 0 40 20"><polyline points="2,18 10,14 20,8 30,10 38,2" fill="none" stroke="var(--accent)" stroke-width="2"/></svg>'
                                : '<svg class="trend-svg" viewBox="0 0 40 20"><polyline points="2,2 10,6 20,12 30,10 38,18" fill="none" stroke="var(--danger)" stroke-width="2"/></svg>';
                            return `<a href="${MAYA_URL}${f.id}" target="_blank" rel="noopener" class="top5-row">
                                <span class="top5-rank">${i+1}</span>
                                <span class="top5-name">${esc(f.n||'')}<span class="top5-mgr">${esc(f.mgr||'')}</span></span>
                                <span class="top5-fee">${formatFeeShort(f)}</span>
                                <span class="top5-return ${trendCls}">${trendSvg} ${fmt(num(f.yy))}%</span>
                            </a>`;
                        }).join('')}
                    </div>
                </div>`;
            }

            // TOP 5 by lowest fee for popular indices
            const ta125 = topByIndex('ת"א 125', 5);
            const sp500 = topByIndex('S&P 500 - NTR', 5);
            const nasdaq = topByIndex('NASDAQ 100 - NTR', 5);

            // TOP 5 by highest YTD return (across all)
            const topYtd = [...trackingFunds].sort((a,b) => num(b.yy) - num(a.yy)).slice(0, 5);

            // TOP 5 largest funds
            const topAum = [...trackingFunds].sort((a,b) => num(b.av) - num(a.av)).slice(0, 5);

            // TOP 5 lowest fees overall (with some return data)
            const topCheap = [...trackingFunds].filter(f => num(f.av) > 10).sort((a,b) => effectiveFee(a) - effectiveFee(b) || num(b.av) - num(a.av)).slice(0, 5);

            fundList.innerHTML = `
                <div class="top5-grid">
                    ${top5Table('ת"א 125 — דמי ניהול נמוכים', '🇮🇱', ta125)}
                    ${top5Table('S&P 500 — דמי ניהול נמוכים', '🇺🇸', sp500)}
                    ${top5Table('NASDAQ 100 — דמי ניהול נמוכים', '🇺🇸', nasdaq)}
                    ${top5Table('תשואה מתחילת השנה — TOP 5', '🔥', topYtd)}
                    ${top5Table('הקרנות הגדולות ביותר', '🏦', topAum)}
                    ${top5Table('דמי ניהול הנמוכים ביותר', '💰', topCheap)}
                </div>
            `;
        }

        function applyTrackingFiltersAndSort() {
            const query = searchInput.value.trim().toLowerCase();
            const sortKey = sortSelect.value;
            const exchange = exchangeSelect.value;

            filteredTrackingFunds = trackingFunds.filter(f => {
                // Selected index filter
                if (selectedIdx && f.idx !== selectedIdx) return false;
                // Exchange filter
                if (exchange !== 'all') {
                    if (exchange === 'us' && f.src !== 'yahoo') return false;
                    if (exchange === 'tase' && f.src === 'yahoo') return false;
                }
                // Text search (only when no index is selected)
                if (!selectedIdx && query) {
                    const n = (f.n || '').toLowerCase();
                    const m = (f.mgr || '').toLowerCase();
                    const tk = (f.tk || '').toLowerCase();
                    const isNumeric = /^\d+$/.test(query);
                    const idMatch = isNumeric && String(f.id || '') === query;
                    if (!n.includes(query) && !m.includes(query) && tk !== query && !idMatch && !matchesIndex(f.idx, query)) return false;
                }
                return true;
            });

            // Push funds without key data to the end
            function hasTrackingData(f) {
                return (f.yy != null && f.yy !== 0) || (f.l12 != null && f.l12 !== 0) || f.y3 != null || f.y5 != null;
            }
            filteredTrackingFunds.sort((a, b) => {
                const aHas = hasTrackingData(a), bHas = hasTrackingData(b);
                if (aHas && !bHas) return -1;
                if (!aHas && bHas) return 1;
                switch (sortKey) {
                    case 'fee-asc': return effectiveFee(a) - effectiveFee(b);
                    case 'fee-desc': return effectiveFee(b) - effectiveFee(a);
                    case 'return-ytd-desc': return num(b.yy) - num(a.yy);
                    case 'return-3y-desc': return (b.y3 != null ? num(b.y3) : -9999) - (a.y3 != null ? num(a.y3) : -9999);
                    case 'return-5y-desc': return (b.y5 != null ? num(b.y5) : -9999) - (a.y5 != null ? num(a.y5) : -9999);
                    case 'aum-desc': return num(b.av) - num(a.av);
                    case 'sd-asc': return num(a.sd) - num(b.sd);
                    default: return 0;
                }
            });
            renderTrackingResults();
        }

        function renderTrackingResults() {
            resultsCount.innerHTML = `נמצאו <strong>${filteredTrackingFunds.length}</strong> קרנות`;
            const sources = [trackingData.updated + ' (TASE)'];
            if (usEtfData) sources.push(usEtfData.updated + ' (Yahoo)');
            dataFreshness.innerHTML = `<span class="freshness-dot"></span> נתונים: ${sources.join(' | ')}`;
            if (filteredTrackingFunds.length === 0) { fundList.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>לא נמצאו קרנות</p></div>`; return; }
            // Return period: show correct label per data source
            const sk = sortSelect.value;
            // Returns { label, value, years, cumLabel, cumValue, useYoungFund }.
            // useYoungFund = true means caller should call metricBoxReturn (young-fund aware).
            function getReturnInfo(f) {
                if (sk === 'return-5y-desc') {
                    const v = (f.y5 != null && f.y5 !== 0) ? f.y5 : null;
                    return { label: 'ממוצע שנתי 5 שנים', value: v, years: 5, cumLabel: 'מצטברת 5 שנים', cumValue: f.y5c != null ? f.y5c : null, cumYears: 5, useYoungFund: true };
                } else if (sk === 'return-3y-desc') {
                    const v = f.y3 != null ? f.y3 : (f.src === 'yahoo' ? f.l12 : null);
                    return { label: 'ממוצע שנתי 3 שנים', value: v, years: 3, cumLabel: 'מצטברת 3 שנים', cumValue: f.y3c != null ? f.y3c : null, cumYears: 3, useYoungFund: true };
                }
                if (f.src === 'yahoo') return { label: 'ממוצע שנתי 3 שנים', value: f.l12, years: 3, cumLabel: null, cumValue: null, useYoungFund: false };
                return { label: 'תשואה 12 חודשים', value: f.l12, years: 1, cumLabel: null, cumValue: null, useYoungFund: false };
            }
            fundList.innerHTML = filteredTrackingFunds.map((f, i) => {
                const trendCls = num(f.yy) >= 0 ? 'trend-up' : 'trend-down';
                const trendSvg = num(f.yy) >= 0
                    ? '<svg class="trend-svg-lg" viewBox="0 0 60 24"><polyline points="2,22 12,16 24,10 36,12 48,6 58,2" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/></svg>'
                    : '<svg class="trend-svg-lg" viewBox="0 0 60 24"><polyline points="2,2 12,6 24,14 36,12 48,18 58,22" fill="none" stroke="var(--danger)" stroke-width="2.5" stroke-linecap="round"/></svg>';
                const isFav = isFavorite(f.src === 'yahoo' ? f.tk : f.id);
                const fundUrl = f.src === 'yahoo' ? YAHOO_URL + f.tk : MAYA_URL + f.id;
                const favId = f.src === 'yahoo' ? f.tk : f.id;
                const tickerBadge = f.tk ? `<span class="fund-tag" style="font-weight:700">${esc(f.tk)}</span>` : '';
                const ri = getReturnInfo(f);
                const mainReturnBox = ri.useYoungFund
                    ? metricBoxReturn(ri.label, ri.value, ri.years, f.inc)
                    : metricBox(ri.label, ri.value, true);
                const cumBox = ri.cumLabel
                    ? (ri.useYoungFund ? metricBoxReturn(ri.cumLabel, ri.cumValue, ri.cumYears, f.inc) : metricBox(ri.cumLabel, ri.cumValue, true))
                    : '';
                return `<div class="fund-card" style="animation-delay:${Math.min(i*0.03,0.3)}s">
                    <div class="fund-card-top"><div><div class="fund-name"><a href="${fundUrl}" target="_blank" rel="noopener" class="fund-link">${esc(f.n||'')} ↗</a><button class="fav-btn${isFav?' active':''}" data-id="${favId}" title="${isFav?'הסר ממועדפים':'הוסף למועדפים'}">★</button></div><div class="fund-manager">${esc(f.mgr||'')}</div>${inceptionSubtitle(f.inc)}</div>
                    ${formatFeeBadge(f)}</div>
                    <div class="fund-metrics">${metricBox('תשואה מתחילת שנה',f.yy,true)}${mainReturnBox}${cumBox}${metricBox(f.src === 'yahoo' ? 'גודל קרן (מ׳ $)' : 'גודל קרן (מ׳ ₪)',f.av,false,true)}${metricBox('סטיית תקן',f.sd,false)}
                    <div class="metric"><div class="metric-label">מגמה</div><div class="metric-value ${trendCls}">${trendSvg}</div></div></div>
                    <div class="fund-tags">${tickerBadge}<span class="fund-tag">${esc(f.idx||'')}</span>${f.tf?`<span class="fund-tag">דמי נאמן: ${fmt(num(f.tf))}%</span>`:''}${f.cls?`<span class="fund-tag">${esc(f.cls)}</span>`:''}</div></div>`;
            }).join('');
        }

        // ===== AUTOCOMPLETE =====
        function buildIndexList() {
            if (!trackingFunds.length) return [];
            const exchange = exchangeSelect.value;
            const idxCount = {};
            for (const f of trackingFunds) {
                if (!f.idx) continue;
                // Respect exchange filter
                if (exchange === 'us' && f.src !== 'yahoo') continue;
                if (exchange === 'tase' && f.src === 'yahoo') continue;
                idxCount[f.idx] = (idxCount[f.idx] || 0) + 1;
            }
            return Object.entries(idxCount).sort((a,b) => b[1] - a[1]).map(([name, count]) => {
                let aliases = INDEX_ALIASES[name] || [];
                // If no direct key match, try reverse lookup (fund idx appears as alias value)
                if (!aliases.length) {
                    const group = findAliasGroup(name);
                    if (group.length) aliases = group.filter(t => norm(t) !== norm(name));
                }
                const heName = aliases.find(a => /[\u0590-\u05FF]/.test(a)) || aliases[0] || '';
                return { name, heName, count, searchStr: norm(name + ' ' + aliases.join(' ')) };
            });
        }

        function showAutocomplete(query) {
            if (!query || activeTab !== 'index' || selectedIdx) { autocompleteDropdown.classList.add('hidden'); return; }
            const indices = buildIndexList();
            const q = norm(query);
            const matches = indices.filter(idx => idx.searchStr.includes(q)).slice(0, 8);
            if (matches.length === 0) { autocompleteDropdown.classList.add('hidden'); return; }
            autocompleteDropdown.classList.remove('hidden');
            autocompleteDropdown.innerHTML = matches.map(idx =>
                `<div class="autocomplete-item" data-idx="${esc(idx.name)}">
                    <span><span class="idx-name">${esc(idx.name)}</span>${idx.heName ? `<span class="idx-he">${esc(idx.heName)}</span>` : ''}</span>
                    <span class="idx-count">${idx.count} קרנות</span>
                </div>`
            ).join('');
            autocompleteDropdown.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', () => selectIndex(item.dataset.idx));
            });
        }

        function selectIndex(idxName) {
            selectedIdx = idxName;
            searchInput.value = '';
            autocompleteDropdown.classList.add('hidden');
            // Save to history
            const aliases = INDEX_ALIASES[idxName] || [];
            saveToHistory(aliases.length ? aliases[0] : idxName);
            // Show badge
            const label = aliases.length ? `${idxName} — ${aliases[0]}` : idxName;
            selectedIndexEl.classList.remove('hidden');
            selectedIndexEl.innerHTML = `<span class="selected-index-badge">${esc(label)}<button class="selected-index-clear" title="נקה בחירה">&times;</button></span>`;
            selectedIndexEl.querySelector('.selected-index-clear').addEventListener('click', clearSelectedIndex);
            applyTrackingFiltersAndSort();
        }

        function clearSelectedIndex() {
            selectedIdx = null;
            selectedIndexEl.classList.add('hidden');
            applyTrackingFiltersAndSort();
        }

        // ===== SHARED =====
        function metricBox(label, value, isReturn, isAum) {
            let display, cls = '';
            if (value === null || value === undefined || value === '') { display = '—'; }
            else if (isAum) { display = formatAum(num(value)); }
            else { const n = num(value); display = fmt(n) + '%'; if (isReturn) cls = n >= 0 ? 'positive' : 'negative'; }
            return `<div class="metric"><div class="metric-label">${label}</div><div class="metric-value ${cls}">${display}</div></div>`;
        }

        function showLoading() {
            fundList.innerHTML = `<div class="loading"><div class="spinner"></div><div class="loading-text">טוען נתונים...</div></div>`;
            resultsCount.innerHTML = ''; dataFreshness.innerHTML = '';
        }
        function showError(msg) { fundList.innerHTML = `<div class="error-state"><p>${esc(msg)}</p><button class="retry-btn" onclick="location.reload()">נסה שוב</button></div>`; }

        function num(v) { return (v === null || v === undefined || v === '') ? 0 : Number(v); }
        function fmt(n) { if (n === null || n === undefined) return '—'; return Number(n).toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
        function formatAum(m) { return m >= 1000 ? (m/1000).toLocaleString('he-IL',{minimumFractionDigits:1,maximumFractionDigits:1})+' מיליארד' : m.toLocaleString('he-IL',{minimumFractionDigits:0,maximumFractionDigits:0}); }
        function esc(str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML.replace(/"/g, '&quot;'); }

        // ===== FEE / VARIABLE FEE / INCEPTION HELPERS =====
        // Effective fee = fixed + variable. Used for sorting & filter ranges.
        // Treats undefined vf as 0 — backward compatible with old data.
        function effectiveFee(f) {
            const mfRaw = f.mf;
            const vfRaw = f.vf;
            const mf = (mfRaw === null || mfRaw === undefined || mfRaw === '') ? 0 : Number(mfRaw);
            const vf = (vfRaw === null || vfRaw === undefined || vfRaw === '') ? 0 : Number(vfRaw);
            return mf + vf;
        }

        // Returns full <div class="fund-fee-badge">…</div> string for the big card badge.
        function formatFeeBadge(f) {
            const mfRaw = f.mf;
            const vfRaw = f.vf;
            const hasMf = !(mfRaw === null || mfRaw === undefined || mfRaw === '');
            const hasVf = !(vfRaw === null || vfRaw === undefined || vfRaw === '');
            const mf = hasMf ? Number(mfRaw) : null;
            const vf = hasVf ? Number(vfRaw) : 0;
            if (!hasMf) {
                return `<div class="fund-fee-badge">—<small>דמי ניהול</small></div>`;
            }
            if (mf > 0 && vf === 0) {
                return `<div class="fund-fee-badge">${fmt(mf)}%<small>דמי ניהול</small></div>`;
            }
            if (mf === 0 && vf > 0) {
                const tip = `דמי ניהול קבוע: 0%, שכר ניהול משתנה: ${fmt(vf)}%`;
                return `<div class="fund-fee-badge" title="${esc(tip)}">0%<span class="fee-variable-badge">+ ${fmt(vf)}% משתנה</span><small>דמי ניהול</small></div>`;
            }
            if (mf > 0 && vf > 0) {
                const tip = `דמי ניהול קבוע: ${fmt(mf)}%, שכר ניהול משתנה: ${fmt(vf)}%`;
                return `<div class="fund-fee-badge" title="${esc(tip)}">${fmt(mf)}%<span class="fee-variable-badge">+ ${fmt(vf)}% משתנה</span><small>דמי ניהול</small></div>`;
            }
            // mf === 0 here. Distinguish vf=0 (verified) from vf=null (unknown).
            if (hasVf) {
                const tip = `ללא דמי ניהול קבוע וללא שכר משתנה (מאומת)`;
                return `<div class="fund-fee-badge" title="${esc(tip)}">0%<small>דמי ניהול</small></div>`;
            }
            return `<div class="fund-fee-badge">0%<small>דמי ניהול</small></div>`;
        }

        // Compact fee for Top5 rows / inline displays.
        function formatFeeShort(f) {
            const mfRaw = f.mf;
            const vfRaw = f.vf;
            const hasMf = !(mfRaw === null || mfRaw === undefined || mfRaw === '');
            const mf = hasMf ? Number(mfRaw) : null;
            const vf = (vfRaw === null || vfRaw === undefined || vfRaw === '') ? 0 : Number(vfRaw);
            if (!hasMf) return '—';
            if (vf > 0) {
                const tip = `דמי ניהול קבוע: ${fmt(mf)}%, שכר ניהול משתנה: ${fmt(vf)}%`;
                return `<span title="${esc(tip)}">${fmt(mf)}%<span class="fee-variable-badge fee-variable-badge-sm">+${fmt(vf)}%v</span></span>`;
            }
            return fmt(mf) + '%';
        }

        // Inception helpers — return null on missing/invalid input.
        function fundAgeYears(inc) {
            if (!inc || typeof inc !== 'string') return null;
            const d = new Date(inc);
            if (isNaN(d.getTime())) return null;
            const ms = Date.now() - d.getTime();
            if (ms < 0) return null;
            return ms / (365.25 * 24 * 60 * 60 * 1000);
        }
        function inceptionLabel(inc) {
            if (!inc || typeof inc !== 'string') return null;
            const d = new Date(inc);
            if (isNaN(d.getTime())) return null;
            const m = String(d.getMonth() + 1).padStart(2, '0');
            return `${m}/${d.getFullYear()}`;
        }

        // Subtle inception subtitle — shown under fund manager for funds < 3 years old.
        // Lets users see at a glance that a fund is young (and may lack 3y/5y data),
        // regardless of which sort is active. Returns '' if fund is >= 3y or inception unknown.
        function inceptionSubtitle(inc) {
            const age = fundAgeYears(inc);
            if (age === null || age >= 3) return '';
            const lbl = inceptionLabel(inc);
            if (!lbl) return '';
            const tip = `קרן צעירה — הוקמה ${lbl}, ייתכן שאין עדיין היסטוריית 3/5 שנים`;
            return `<div class="fund-inception" title="${esc(tip)}">הוקמה ${lbl}</div>`;
        }

        // metricBox variant for 3y/5y returns: shows "קרן צעירה" if value missing
        // and the fund is younger than `years` years (per `inc`). Otherwise falls back to "—".
        function metricBoxReturn(label, value, years, inc) {
            if (value !== null && value !== undefined && value !== '') {
                return metricBox(label, value, true);
            }
            const age = fundAgeYears(inc);
            if (age !== null && age < years) {
                const incLbl = inceptionLabel(inc);
                const tip = incLbl ? `הוקמה ${incLbl} — אין עדיין היסטוריית ${years} שנים` : `אין עדיין היסטוריית ${years} שנים`;
                return `<div class="metric"><div class="metric-label">${label}</div><div class="metric-value young-fund" title="${esc(tip)}">קרן צעירה</div></div>`;
            }
            return metricBox(label, null, true);
        }
        // Normalize search text: remove special chars, collapse spaces
        function norm(str) { return str.replace(/[\u200f\u200e\u200b\u200c\u200d\ufeff]/g, '').toLowerCase().replace(/[&\-–—_.,'"\/\\()]/g, ' ').replace(/\s+/g, ' ').trim(); }
        function debounce(fn, ms) { let t; return function(...a) { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), ms); }; }

        // ===== FAVORITES =====
        const FAVS_KEY = 'fund_favorites';

        function getFavorites() {
            try { return JSON.parse(localStorage.getItem(FAVS_KEY)) || []; }
            catch { return []; }
        }

        function isFavorite(id) { return getFavorites().includes(id); }

        function toggleFavorite(id) {
            let favs = getFavorites();
            if (favs.includes(id)) favs = favs.filter(f => f !== id);
            else favs.unshift(id);
            localStorage.setItem(FAVS_KEY, JSON.stringify(favs));
            return favs.includes(id);
        }

        // Delegate click on fav buttons
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.fav-btn');
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            const raw = btn.dataset.id;
            const id = isNaN(raw) ? raw : Number(raw);
            const isNowFav = toggleFavorite(id);
            btn.classList.toggle('active', isNowFav);
            btn.title = isNowFav ? 'הסר ממועדפים' : 'הוסף למועדפים';
            updateFavCount();
        });

        function updateFavCount() {
            const count = getFavorites().length;
            const badge = document.getElementById('favCountBadge');
            if (badge) {
                badge.textContent = count;
                badge.classList.toggle('hidden', count === 0);
            }
        }

        function showFavorites() {
            if (!trackingData) return;
            const favIds = getFavorites();
            const favFunds = favIds.map(fid => trackingFunds.find(f => f.id === fid || f.tk === fid)).filter(Boolean);
            resultsCount.innerHTML = `<strong>${favFunds.length}</strong> קרנות במועדפים`;
            dataFreshness.innerHTML = '';
            if (favFunds.length === 0) {
                fundList.innerHTML = `<div class="empty-state"><div class="empty-icon">★</div><p>אין מועדפים עדיין — לחץ על הכוכב ליד שם הקרן</p></div>`;
                return;
            }
            fundList.innerHTML = favFunds.map((f, i) => {
                const trendCls = num(f.yy) >= 0 ? 'trend-up' : 'trend-down';
                const trendSvg = num(f.yy) >= 0
                    ? '<svg class="trend-svg-lg" viewBox="0 0 60 24"><polyline points="2,22 12,16 24,10 36,12 48,6 58,2" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/></svg>'
                    : '<svg class="trend-svg-lg" viewBox="0 0 60 24"><polyline points="2,2 12,6 24,14 36,12 48,18 58,22" fill="none" stroke="var(--danger)" stroke-width="2.5" stroke-linecap="round"/></svg>';
                const favUrl = f.src === 'yahoo' ? YAHOO_URL + f.tk : MAYA_URL + f.id;
                const favKey = f.src === 'yahoo' ? f.tk : f.id;
                return `<div class="fund-card" style="animation-delay:${Math.min(i*0.03,0.3)}s">
                    <div class="fund-card-top"><div><div class="fund-name"><a href="${favUrl}" target="_blank" rel="noopener" class="fund-link">${esc(f.n||'')} ↗</a><button class="fav-btn active" data-id="${favKey}" title="הסר ממועדפים">★</button></div><div class="fund-manager">${esc(f.mgr||'')}</div>${inceptionSubtitle(f.inc)}</div>
                    ${formatFeeBadge(f)}</div>
                    <div class="fund-metrics">${metricBox('תשואה מתחילת שנה',f.yy,true)}${metricBox('תשואה 12 חודשים',f.l12,true)}${metricBox(f.src === 'yahoo' ? 'גודל קרן (מ׳ $)' : 'גודל קרן (מ׳ ₪)',f.av,false,true)}${metricBox('סטיית תקן',f.sd,false)}
                    <div class="metric"><div class="metric-label">מגמה</div><div class="metric-value ${trendCls}">${trendSvg}</div></div></div>
                    <div class="fund-tags">${f.tk?`<span class="fund-tag" style="font-weight:700">${esc(f.tk)}</span>`:''}<span class="fund-tag">${esc(f.idx||'')}</span></div></div>`;
            }).join('');
        }

        // ===== SEARCH HISTORY =====
        const HISTORY_KEY = 'fund_search_history';
        const MAX_HISTORY = 15;
        const historyList = document.getElementById('historyList');
        const historyClear = document.getElementById('historyClear');

        function getHistory() {
            try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
            catch { return []; }
        }

        function saveToHistory(term) {
            if (!term || term.length < 2) return;
            let history = getHistory();
            history = history.filter(h => h !== term);
            history.unshift(term);
            if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
            renderHistory();
        }

        function renderHistory() {
            const history = getHistory();
            if (history.length === 0) {
                historyList.innerHTML = '<div class="history-empty">אין חיפושים עדיין</div>';
                return;
            }
            historyList.innerHTML = history.map(term =>
                `<button class="history-item">${esc(term)}</button>`
            ).join('');
            historyList.querySelectorAll('.history-item').forEach(item => {
                item.addEventListener('click', () => {
                    searchInput.value = item.textContent;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    if (activeTab === 'index') {
                        const indices = buildIndexList();
                        const match = indices.find(idx => idx.searchStr.includes(item.textContent.toLowerCase()));
                        if (match) selectIndex(match.name);
                    }
                });
            });
        }

        historyClear.addEventListener('click', () => {
            localStorage.removeItem(HISTORY_KEY);
            renderHistory();
        });

        renderHistory();
        updateFavCount();

        // ===== EVENTS =====
        searchInput.addEventListener('input', debounce(() => {
            if (activeTab === 'index') {
                const q = searchInput.value.trim();
                // If user starts typing, clear selected index so it doesn't block
                if (q && selectedIdx) {
                    selectedIdx = null;
                    selectedIndexEl.classList.add('hidden');
                }
                showAutocomplete(q);
                if (q) applyTrackingFiltersAndSort();
                else if (!selectedIdx) renderTop5Dashboard();
            } else {
                applyFiltersAndSort();
            }
        }, 200));

        sortSelect.addEventListener('change', () => {
            if (activeTab === 'index') applyTrackingFiltersAndSort();
            else applyFiltersAndSort();
        });

        exchangeSelect.addEventListener('change', () => {
            if (activeTab === 'index') applyTrackingFiltersAndSort();
        });

        // Close autocomplete on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) autocompleteDropdown.classList.add('hidden');
        });

        // Keyboard navigation for autocomplete
        searchInput.addEventListener('keydown', (e) => {
            if (autocompleteDropdown.classList.contains('hidden')) return;
            const items = autocompleteDropdown.querySelectorAll('.autocomplete-item');
            const active = autocompleteDropdown.querySelector('.autocomplete-item.active');
            let idx = Array.from(items).indexOf(active);
            if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(idx + 1, items.length - 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(idx - 1, 0); }
            else if (e.key === 'Enter' && active) { e.preventDefault(); selectIndex(active.dataset.idx); return; }
            else if (e.key === 'Escape') { autocompleteDropdown.classList.add('hidden'); return; }
            else return;
            items.forEach(i => i.classList.remove('active'));
            if (items[idx]) items[idx].classList.add('active');
        });

    })();