export const specializationOptions = [
  'Cardiology',
  'Dermatology',
  'Emergency Medicine',
  'Endocrinology',
  'ENT',
  'General Medicine',
  'Gynecology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Urology',
];

export const specializationDepartmentMap = {
  Cardiology: 'Cardiac Sciences',
  Dermatology: 'Dermatology Unit',
  'Emergency Medicine': 'Emergency & Trauma',
  Endocrinology: 'Wellness & Prevention',
  ENT: 'General Medicine',
  'General Medicine': 'General Medicine',
  Gynecology: 'Mother & Child Care',
  Neurology: 'Neuro Care',
  Oncology: 'Oncology Center',
  Orthopedics: 'Bone & Joint Center',
  Pediatrics: 'Pediatric Care',
  Psychiatry: 'Wellness & Prevention',
  Pulmonology: 'Respiratory Care',
  Radiology: 'Critical Care',
  Urology: 'General Medicine',
};

export const departmentOptions = [...new Set(Object.values(specializationDepartmentMap))];
