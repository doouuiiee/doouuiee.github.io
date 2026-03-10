// ============================================
// SECTION DATA - All School Sections with PINs
// ============================================

const sectionData = {
  'Grade 7': {
    sections: [
      { name: 'St. Anthony', pin: '0017', adviser: 'TBA', room: 'Room 101', defaultPassword: 'ANTH0701' },
      { name: 'St. Elizabeth', pin: '0027', adviser: 'TBA', room: 'Room 102', defaultPassword: 'ELIZ0702' },
      { name: 'St. Francis', pin: '0037', adviser: 'TBA', room: 'Room 103', defaultPassword: 'FRAN0703' },
      { name: 'St. Joseph', pin: '0047', adviser: 'TBA', room: 'Room 104', defaultPassword: 'JOSE0704' },
      { name: 'St. Michael', pin: '0057', adviser: 'TBA', room: 'Room 105', defaultPassword: 'MICH0705' },
      { name: 'St. Roque', pin: '0067', adviser: 'TBA', room: 'Room 106', defaultPassword: 'ROQU0706' },
      { name: 'St. Thomas', pin: '0077', adviser: 'TBA', room: 'Room 107', defaultPassword: 'THOM0707' }
    ]
  },
  'Grade 8': {
    sections: [
      { name: 'St. Andrew', pin: '0018', adviser: 'TBA', room: 'Room 201', defaultPassword: 'ANDR0801' },
      { name: 'St. Jude', pin: '0028', adviser: 'TBA', room: 'Room 202', defaultPassword: 'JUDE0802' },
      { name: 'St. Lorenzo', pin: '0038', adviser: 'TBA', room: 'Room 203', defaultPassword: 'LORE0803' },
      { name: 'St. Martin', pin: '0048', adviser: 'TBA', room: 'Room 204', defaultPassword: 'MART0804' },
      { name: 'St. Paul', pin: '0058', adviser: 'TBA', room: 'Room 205', defaultPassword: 'PAUL0805' },
      { name: 'St. Peter', pin: '0068', adviser: 'TBA', room: 'Room 206', defaultPassword: 'PETE0806' }
    ]
  },
  'Grade 9': {
    sections: [
      { name: 'St. Agnes', pin: '0019', adviser: 'TBA', room: 'Room 301', defaultPassword: 'AGNE0901' },
      { name: 'St. Anne', pin: '0029', adviser: 'TBA', room: 'Room 302', defaultPassword: 'ANNE0902' },
      { name: 'St. Bernadette', pin: '0039', adviser: 'TBA', room: 'Room 303', defaultPassword: 'BERN0903' },
      { name: 'St. Bridget', pin: '0049', adviser: 'TBA', room: 'Room 304', defaultPassword: 'BRID0904' },
      { name: 'St. Monica', pin: '0059', adviser: 'TBA', room: 'Room 305', defaultPassword: 'MONI0905' },
      { name: 'St. Therese', pin: '0069', adviser: 'TBA', room: 'Room 306', defaultPassword: 'THER0906' }
    ]
  },
  'Grade 10': {
    sections: [
      { name: 'St. Benedict', pin: '0101', adviser: 'TBA', room: 'Room 401', defaultPassword: 'BENE1001' },
      { name: 'St. John', pin: '0102', adviser: 'TBA', room: 'Room 402', defaultPassword: 'JOHN1002' },
      { name: 'St. Luke', pin: '0103', adviser: 'TBA', room: 'Room 403', defaultPassword: 'LUKE1003' },
      { name: 'St. Mark', pin: '0104', adviser: 'TBA', room: 'Room 404', defaultPassword: 'MARK1004' },
      { name: 'St. Matthew', pin: '0105', adviser: 'TBA', room: 'Room 405', defaultPassword: 'MATT1005' },
      { name: 'St. Phillip', pin: '0106', adviser: 'TBA', room: 'Room 406', defaultPassword: 'PHIL1006' }
    ]
  },
  'Grade 11': {
    strands: {
      'STEM': {
        name: 'Science Technology Engineering and Mathematics',
        sections: [
          { name: 'St. Gregory', pin: '0111', adviser: 'TBA', room: 'Room 501', defaultPassword: 'GREG1101' },
          { name: 'St. Ignatius', pin: '0112', adviser: 'TBA', room: 'Room 502', defaultPassword: 'IGNA1102' },
          { name: 'St. Pedro Calungsod', pin: '0113', adviser: 'TBA', room: 'Room 503', defaultPassword: 'PEDR1103' }
        ]
      },
      'HUMSS': {
        name: 'Humanities and Social Sciences',
        sections: [
          { name: 'St. James', pin: '0114', adviser: 'TBA', room: 'Room 504', defaultPassword: 'JAME1104' },
          { name: 'St. Timothy', pin: '0115', adviser: 'TBA', room: 'Room 505', defaultPassword: 'TIMO1105' }
        ]
      },
      'TVL': {
        name: 'Technical-Vocational-Livelihood',
        sections: [
          { name: 'St. Hannibal', pin: '0116', adviser: 'TBA', room: 'Room 506', defaultPassword: 'HANN1106' }
        ]
      },
      'ABM': {
        name: 'Accountancy and Business Management',
        sections: [
          { name: 'St. Pio', pin: '0117', adviser: 'TBA', room: 'Room 507', defaultPassword: 'PIO1107' }
        ]
      }
    }
  },
  'Grade 12': {
    strands: {
      'STEM': {
        name: 'Science Technology Engineering and Mathematics',
        sections: [
          { name: 'St. Margaret', pin: '0121', adviser: 'TBA', room: 'Room 601', defaultPassword: 'MARG1201' },
          { name: 'St. Martha', pin: '0122', adviser: 'TBA', room: 'Room 602', defaultPassword: 'MART1202' },
          { name: 'St. Rita of Casia', pin: '0123', adviser: 'TBA', room: 'Room 603', defaultPassword: 'RITA1203' }
        ]
      },
      'HUMSS': {
        name: 'Humanities and Social Sciences',
        sections: [
          { name: 'St. Philomena', pin: '0124', adviser: 'TBA', room: 'Room 604', defaultPassword: 'PHIL1204' },
          { name: 'St. Teresa de Avila', pin: '0125', adviser: 'TBA', room: 'Room 605', defaultPassword: 'TERE1205' }
        ]
      },
      'TVL': {
        name: 'Technical-Vocational-Livelihood',
        sections: [
          { name: 'St. Agatha', pin: '0126', adviser: 'TBA', room: 'Room 606', defaultPassword: 'AGAT1206' }
        ]
      },
      'ABM': {
        name: 'Accountancy and Business Management',
        sections: [
          { name: 'St. Gertrude', pin: '0127', adviser: 'TBA', room: 'Room 607', defaultPassword: 'GERT1207' }
        ]
      }
    }
  }
};

// Helper function to get section by name
function getSectionByName(sectionName) {
  for (const grade in sectionData) {
    const gradeData = sectionData[grade];
    
    if (gradeData.sections) {
      const section = gradeData.sections.find(s => s.name === sectionName);
      if (section) return { ...section, grade };
    } else if (gradeData.strands) {
      for (const strand in gradeData.strands) {
        const section = gradeData.strands[strand].sections.find(s => s.name === sectionName);
        if (section) return { ...section, grade, strand };
      }
    }
  }
  return null;
}

// Helper function to get all sections as flat array
function getAllSections() {
  const allSections = [];
  
  for (const grade in sectionData) {
    const gradeData = sectionData[grade];
    
    if (gradeData.sections) {
      gradeData.sections.forEach(section => {
        allSections.push({
          ...section,
          grade,
          fullName: `${grade} - ${section.name}`
        });
      });
    } else if (gradeData.strands) {
      for (const strand in gradeData.strands) {
        gradeData.strands[strand].sections.forEach(section => {
          allSections.push({
            ...section,
            grade,
            strand,
            fullName: `${grade} - ${section.name} (${strand})`
          });
        });
      }
    }
  }
  
  return allSections;
}

// Helper function to verify PIN
function verifySectionPIN(sectionName, pin) {
  const section = getSectionByName(sectionName);
  return section && section.pin === pin;
}

// Helper function to get default password for a section
function getDefaultPassword(gradeLevel, sectionName) {
  const grade = `Grade ${gradeLevel}`;
  const gradeData = sectionData[grade];
  
  if (!gradeData) return null;
  
  if (gradeData.sections) {
    const section = gradeData.sections.find(s => s.name === sectionName);
    return section?.defaultPassword || null;
  } else if (gradeData.strands) {
    for (const strand in gradeData.strands) {
      const section = gradeData.strands[strand].sections.find(s => s.name === sectionName);
      if (section) return section.defaultPassword || null;
    }
  }
  
  return null;
}
