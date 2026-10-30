/**
 * Demo Admission Form Data (For Testing & Verification Only)
 * Valid sample data matching all form validations, schema fields, and base64 formats.
 */

export const SAMPLE_PASSPORT_PHOTO_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABDSURBVHhe7cExAQAAAMKg9U9tDQ8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgFcDD5YAAWbEaU0AAAAASUVORK5CYII=';

export const SAMPLE_SIGNATURE_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAyCAYAAACqNX6+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABMSURBVHhe7cExAQAAAMKg9U9tDQ8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4NO20AAad5fMIAAAAASUVORK5CYII=';

export const SAMPLE_MARKSHEET_PDF_DATA_URL =
  'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDQgMCBSCj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggNzgKPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihIS0NMIFNraWxsIENlbnRyZSAtIERlbW8gMTB0aCBNYXJrc2hlZXQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjggMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAowMDAwMDAwMjIwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1Jvb3QgMSAwIFIKL1NpemUgNQo+PgpzdGFydHhyZWYKMzQ4CiUlRU9GCg==';

export const DEMO_COURSE = {
  slug: 'hs-cit',
  name: 'HS-CIT (Haryana State Certificate in Information Technology)',
  batch: 'Morning (09:00 AM - 11:00 AM)',
  duration: '3 Months (132 Hours)',
  fee: 4200,
};

export const DEMO_PERSONAL = {
  fullName: 'Aman Deep Sharma',
  dob: '2004-08-15',
  gender: 'Male',
  fatherName: 'Rajendra Sharma',
  motherName: 'Kavita Sharma',
  phone: '9812345678',
  email: 'amandeephkcl@example.com',
  alternatePhone: '9876543210',
  address: {
    house: 'House No. 248, Ward 12',
    locality: 'Near Begu Road, Preet Nagar',
    city: 'Sirsa',
    district: 'Sirsa',
    state: 'Haryana',
    pincode: '125055',
  },
};

export const DEMO_EDUCATION = {
  tenth: {
    board: 'HBSE (Board of School Education Haryana)',
    school: 'Govt Model Senior Secondary School, Sirsa',
    passingYear: '2020',
    rollNo: '1029481',
    marksObtained: '445',
    maxMarks: '500',
    percentage: '89.00',
    marksheet: {
      name: '10th_marksheet_sample.pdf',
      size: 24576,
      type: 'application/pdf',
      dataUrl: SAMPLE_MARKSHEET_PDF_DATA_URL,
    },
  },
  hasTwelfth: true,
  twelfth: {
    board: 'HBSE (Board of School Education Haryana)',
    stream: 'Science',
    school: 'Govt Model Sanskriti School, Sirsa',
    passingYear: '2022',
    rollNo: '1209384',
    marksObtained: '430',
    maxMarks: '500',
    percentage: '86.00',
    marksheet: {
      name: '12th_marksheet_sample.pdf',
      size: 24576,
      type: 'application/pdf',
      dataUrl: SAMPLE_MARKSHEET_PDF_DATA_URL,
    },
  },
  higherEducation: 'Pursuing B.Sc. Computer Science (2nd Year)',
};

export const DEMO_DOCUMENTS = {
  photo: {
    name: 'sample_passport_photo.png',
    size: 2048,
    type: 'image/png',
    dataUrl: SAMPLE_PASSPORT_PHOTO_DATA_URL,
  },
  signature: {
    name: 'sample_signature.png',
    size: 1024,
    type: 'image/png',
    dataUrl: SAMPLE_SIGNATURE_DATA_URL,
  },
  idProof: {
    name: 'sample_aadhaar_card.pdf',
    size: 24576,
    type: 'application/pdf',
    dataUrl: SAMPLE_MARKSHEET_PDF_DATA_URL,
  },
};
