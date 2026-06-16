// Real survey data for Seetharampuram Thanda
// Source: UBA Smart Village Survey, 98 households, 318 residents
// Conducted by KL Education Foundation (KLEF) students

const villageData = {
  overview: {
    name: "Seetharampuram Thanda",
    tagline: "A Digital Village Initiative",
    totalHouseholds: 98,
    totalPopulation: 318,
    averageFamilySize: 4.41,
    mandal: "Mylukuru",
    district: "Nellore",
    state: "Andhra Pradesh",
    surveySource: "UBA Smart Village Survey",
    totalSurveyFiles: 98,
    surveyDays: { day1: 41, day2: 57 }
  },

  demographics: {
    genderDistribution: { Male: 168, Female: 150 },
    genderRatio: "893 females per 1000 males",
    ageGroups: {
      "0-5 (Infants)": 21,
      "6-14 (School Age)": 38,
      "15-18 (Adolescents)": 28,
      "19-25 (Young Adults)": 42,
      "26-60 (Working Age)": 154,
      "60+ (Seniors)": 22
    },
    averageAge: 31.7,
    medianAge: 30.0,
    dependencyRatio: "41.3%",
    childPopulation: 59,
    seniorPopulation: 22,
    workingAgePopulation: 196,
    casteDistribution: { ST: 269, OC: 42, SC: 5, BC: 2 },
    stPercentage: 84.6
  },

  education: {
    levels: {
      "Illiterate": 163,
      "8th Pass": 25,
      "10th Pass": 28,
      "12th Pass": 33,
      "Graduate": 40,
      "Currently Studying": 29
    },
    adultLiteracyRate: 44.1,
    adultIlliteracyCount: 127,
    schoolEnrollmentRate: 77.3,
    schoolAgePopulation: 66,
    enrolledCount: 51,
    genderGap: {
      maleIlliterate: 70,
      femaleIlliterate: 93,
      maleGraduates: 29,
      femaleGraduates: 11,
      note: "Female illiteracy higher (93 vs 70)"
    },
    dropoutRisk: {
      count: 9,
      individuals: [
        { name: "Deepika", age: 16, gender: "Female", education: "10th Pass" },
        { name: "L.Nandini", age: 16, gender: "Female", education: "10th Pass" },
        { name: "Lavuri Srinivas", age: 17, gender: "Male", education: "Illiterate" },
        { name: "L.Suresh", age: 17, gender: "Male", education: "10th Pass" },
        { name: "B.Sruthi", age: 18, gender: "Female", education: "8th Pass" },
        { name: "Sony", age: 18, gender: "Female", education: "Illiterate" },
        { name: "Amagotu Ram Charan", age: 18, gender: "Male", education: "12th Pass" },
        { name: "B.Charan", age: 17, gender: "Male", education: "8th Pass" },
        { name: "Lavuri Divya", age: 18, gender: "Female", education: "10th Pass" }
      ]
    }
  },

  occupation: {
    distribution: {
      "Farmer": 84,
      "Student": 57,
      "Homemaker": 39,
      "Daily Wage Worker": 22,
      "Unknown": 58,
      "IT / Private Employee": 4,
      "Others": 8
    },
    maleOccupations: {
      "Farmer": 58, "Student": 36, "Daily Wage Worker": 9,
      "IT / Software": 3, "Others": 5
    },
    femaleOccupations: {
      "Homemaker": 39, "Farmer": 26, "Student": 21,
      "Daily Wage Worker": 13, "Others": 2
    },
    migrationCount: 17,
    migrationPercentage: 17.3
  },

  economics: {
    averageIncome: 64265,
    medianIncome: 50000,
    householdsWithData: 68,
    householdsMissingIncome: 30,
    giniCoefficient: 0.393,
    incomeBuckets: {
      "Below ₹25,000": 9,
      "₹25,000–50,000": 13,
      "₹50,000–1 Lakh": 37,
      "₹1–2 Lakh": 7,
      "Above ₹2 Lakh": 2
    },
    povertyStatus: {
      BPL: 58, APL: 40
    },
    bplPercentage: 59.2,
    economicCategories: {
      "Low Income": 94, "Middle Income": 2, "High Income": 2
    }
  },

  governmentSchemes: {
    beneficiaries: {
      "PM-KISAN": 32,
      "Pension Scheme": 22,
      "MNREGA": 14,
      "Ration Card": 10,
      "Rythu Bharosa": 8,
      "Amma Vodi": 4,
      "PM Awas Yojana": 3,
      "Thalli ki Vandanam": 2,
      "Widow Pension": 1
    },
    totalMentions: 96,
    coverageGaps: {
      farmersWithoutPMKisan: 15,
      totalFarmerHouseholds: 47,
      seniorsWithoutPension: 20,
      totalSeniors: 22
    }
  },

  housing: {
    ownership: {
      "Own House": 89, "Government Allocated": 6, "Rented": 3
    },
    types: {
      "Pucca (Concrete)": 84, "Semi-Pucca": 7, "Kutcha (Mud/Thatch)": 4, "Other": 3
    },
    electricity: { connected: 96, percentage: 98.0, avgHours: 23.0 },
    solarPanels: { households: 0, percentage: 0.0 },
    toilet: { "Private": 81, "Open": 15, "Other": 2 },
    openDefecationRisk: 17.3,
    drinkingWater: {
      "Tap Water": 40, "Mineral Water (Buying)": 35,
      "Not Available": 16, "Tanker Water": 6, "Water Purifier": 1
    },
    waterSources: {
      "Government Pipe Water": 79, "Hand Pump": 17, "Open Well": 2
    },
    drainage: {
      "Available": 40, "Not Available": 34, "Open Drainage": 13,
      "Problem": 11
    },
    drainageGapPercentage: 59.2,
    cookingFuel: { LPG: 94, Wood: 3, "Bio-Gas": 1 },
    lpgPercentage: 95.9,
    mobileNetwork: { Airtel: 64, Jio: 14, VI: 9, BSNL: 4, Other: 7 }
  },

  vehicles: {
    petrol2Wheelers: 73, electric2Wheelers: 4, cycles: 16,
    petrolCars: 1, dieselCars: 1, other: 7,
    ownershipPercentage: 78.6, evAdoptionRate: 5.2
  },

  appliances: {
    counts: { TV: 70, Fridge: 55, Cooler: 4, "Washing Machine": 4, AC: 2, Fan: 1, Radio: 1 },
    percentages: { TV: 71.4, Fridge: 56.1, Cooler: 4.1, "Washing Machine": 4.1, AC: 2.0 },
    householdsWithout: 20
  },

  agriculture: {
    avgLandHolding: 4.32,
    householdsWithLand: 59,
    landOwnership: {
      "Agricultural Land": 64, "No Land": 33, "Unirrigated Land": 1
    },
    crops: {
      all: { Cotton: 41, Chilli: 17, "Other Crop": 16, Maize: 15, Paddy: 8, Turmeric: 3, "Palm Oil": 3 },
      food: { Maize: 15, Paddy: 7, "Other": 1 },
      cash: { Cotton: 41, Chilli: 17 },
      foodCropHouseholds: 23,
      cashCropHouseholds: 58,
      foodToCashRatio: 0.4
    },
    irrigation: {
      "None": 47, "Bore Well": 32, "Canal": 9, "Other": 9, "Tank": 1
    },
    inputs: {
      "Chemical Fertilizers": 57, "Chemical Pesticides": 42,
      "Chemical Weedicides": 26, "Organic Fertilizers": 14
    },
    livestock: {
      Goat: 92, Buffalo: 73, Sheep: 40, Cow: 7, Dog: 4, Hen: 3, Ox: 1
    },
    livestockHouseholds: 37,
    livestockPercentage: 37.8,
    dependencyPercentage: 48.0
  },

  financialInclusion: {
    bankAccounts: {
      "Government Account": 143, "No Bank Account": 103, "Private Account": 72
    },
    noBankAccountPercentage: 32.4,
    mnregaJobCard: { members: 51, percentage: 16.0 }
  },

  health: {
    socialCategories: { ST: 269, OC: 42, SC: 5, BC: 2 },
    healthProblems: {
      "Orthopedic/Joint": 14, "Diabetes": 9, "Blood Pressure": 8,
      "Kidney Problem": 6, "Headache": 6, "Heart Problem": 5,
      "Back Pain": 5, "General Health": 3, "Body Pain": 2,
      "Others": 13
    },
    membersWithIssues: 57,
    underTreatment: 68,
    underTreatmentPercentage: 21.4
  },

  problems: {
    priorityRanking: [
      "Water", "Drainage", "Transport", "Roads",
      "Education", "Housing", "Health", "Agriculture"
    ],
    categoryCounts: {
      "Water": 28, "Drainage": 23, "Transport": 21,
      "Roads": 8, "Education": 7, "Housing": 6,
      "Health": 4, "Agriculture": 3, "Employment": 3,
      "Other": 2, "Communication": 1, "Electricity": 1
    },
    topProblems: [
      { issue: "No proper drainage facilities", count: 4 },
      { issue: "No public transport available", count: 3 },
      { issue: "Lack of drainage facilities", count: 3 },
      { issue: "Inadequate water supply", count: 3 },
      { issue: "No bus service available", count: 3 },
      { issue: "Poor drainage system", count: 3 },
      { issue: "No access to clean water", count: 3 },
      { issue: "Lack of bus service in the village", count: 3 }
    ],
    householdFlags: {
      drainage: 34, health: 32, education: 17, water: 16
    }
  },

  vulnerability: {
    segmentation: {
      "High Risk (60-100)": 33,
      "Vulnerable (35-59)": 44,
      "Stable (15-34)": 13,
      "Prosperous (0-14)": 8
    }
  },

  swotAnalysis: {
    scores: {
      education: 44, infrastructure: 90, agriculture: 100,
      health: 79, waterAccess: 84, financialInclusion: 68, overall: 78
    },
    strengths: [
      "98% electricity coverage",
      "91% home ownership rate",
      "86% pucca houses",
      "Strong agricultural base: 48% farming households",
      "High LPG adoption: 96% clean cooking fuel",
      "Diverse livestock base across 37.8% households"
    ],
    weaknesses: [
      "Adult illiteracy at 55.9% — far above national average",
      "0% solar panel adoption across entire village",
      "Drainage unavailable in 59% of households",
      "32.4% of individuals have no bank account",
      "31% of households have no income data — survey gap",
      "Only 16.0% MNREGA job card coverage among members"
    ],
    opportunities: [
      "Solar panel subsidy schemes (PM-KUSUM) — zero adoption means high potential",
      "PM-KISAN coverage gap: 15 farming households not receiving benefits",
      "Financial inclusion: 103 individuals can be onboarded under Jan Dhan",
      "School dropout intervention: 9 youth aged 15-18 identified as at-risk",
      "Drip irrigation adoption for cotton/chilli — high water-saving potential",
      "Livestock insurance and veterinary support for goat/buffalo herds"
    ],
    threats: [
      "High income inequality (Gini: 0.393)",
      "Water crisis: 28 households report water as primary problem",
      "22 senior citizens — 20 without pension coverage",
      "Cotton monoculture risk with weather/market volatility",
      "21.4% of population under medical treatment",
      "Youth migration risk — poor local employment options"
    ],
    executiveSummary: "Seetharampuram Thanda (Mylukuru Mandal) has 98 surveyed households and 318 residents. The village shows strong infrastructure basics (electricity, pucca housing, LPG) but faces critical gaps in water access, drainage, and financial inclusion. Adult illiteracy at 55.9% requires urgent educational interventions. The 59.2% BPL household rate combined with a Gini coefficient of 0.393 indicates severe income inequality."
  },

  surveyCredits: {
    organization: "KL Education Foundation (KLEF)",
    program: "Unnat Bharat Abhiyan (UBA) — Smart Village Survey",
    ratingSystem: "SVR Smart Village Green Village Rating System",
    modules: [
      { name: "Health & Hygiene", code: "HH", maxPoints: 27, credits: 10 },
      { name: "Village Infrastructure", code: "VI", maxPoints: 30, credits: 9 },
      { name: "Water Conservation", code: "WC", maxPoints: 9, credits: 3 },
      { name: "Energy Availability & Efficiency", code: "EA", maxPoints: 16, credits: 4 },
      { name: "Materials & Resources", code: "MR", maxPoints: 5, credits: 3 },
      { name: "Social & Community Actions", code: "SC", maxPoints: 8, credits: 3 },
      { name: "Green Innovation", code: "GI", maxPoints: 5, credits: 1 }
    ],
    totalPoints: 100,
    surveyors: [
      { name: "Team: Praneetha & Vikas", surveys: 14 },
      { name: "V. Aravind", surveys: 12 },
      { name: "CH Bala Murali Sriram", surveys: 10 },
      { name: "Team: Kishore & Seetha Ram", surveys: 10 },
      { name: "Moksha", surveys: 5 },
      { name: "Team: Chandu & Suhitha", surveys: 5 },
      { name: "Mahesh", surveys: 4 },
      { name: "Abhiram", surveys: 4 },
      { name: "Shreyamsi", surveys: 4 },
      { name: "Hardik Gupta", surveys: 4 },
      { name: "Team: Thanmayee & Vinay", surveys: 3 },
      { name: "Team: Thanmayee & Moksha", surveys: 3 },
      { name: "M.Naveen Kumar", surveys: 3 },
      { name: "CBM Koushik", surveys: 2 },
      { name: "T.Reshma Laxmi", surveys: 2 },
      { name: "Thanmayee", surveys: 1 }
    ],
    totalSurveyors: 30,
    dataQuality: {
      householdsMissingIncome: 30,
      membersMissingAge: 13,
      note: "52 raw surveyor name variations normalized to ~15 unique surveyors"
    }
  }
};

export default villageData;
