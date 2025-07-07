import { jsPDF } from 'jspdf';

export interface ToolboxTalkData {
  date?: string;
  time?: string;
  location?: string;
  supervisor?: string;
  topic?: string;
  attendees?: string[];
  hazards?: string[];
  controls?: string[];
  additionalNotes?: string;
}

export const generateToolboxTalkPDF = (data: ToolboxTalkData = {}): jsPDF => {
  const pdf = new jsPDF();
  
  // Set up colors
  const primaryColor = '#2563eb'; // Blue
  const textColor = '#374151'; // Dark gray
  const lightGray = '#f3f4f6';
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(primaryColor);
  pdf.text('TOOLBOX TALK TEMPLATE', 20, 25);
  
  // Subtitle
  pdf.setFontSize(12);
  pdf.setTextColor(textColor);
  pdf.text('Safety Meeting Documentation', 20, 35);
  
  // Add a line
  pdf.setDrawColor(primaryColor);
  pdf.line(20, 40, 190, 40);
  
  let yPosition = 55;
  
  // Meeting Details Section
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('MEETING DETAILS', 20, yPosition);
  yPosition += 15;
  
  // Create form fields
  const fields = [
    { label: 'Date:', value: data.date || '________________________' },
    { label: 'Time:', value: data.time || '________________________' },
    { label: 'Location:', value: data.location || '________________________' },
    { label: 'Supervisor/Leader:', value: data.supervisor || '________________________' },
    { label: 'Topic:', value: data.topic || '________________________' },
  ];
  
  pdf.setFontSize(10);
  pdf.setTextColor(textColor);
  
  fields.forEach(field => {
    pdf.text(field.label, 20, yPosition);
    pdf.text(field.value, 60, yPosition);
    yPosition += 12;
  });
  
  yPosition += 10;
  
  // Attendees Section
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('ATTENDEES', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(10);
  pdf.setTextColor(textColor);
  pdf.text('Name', 20, yPosition);
  pdf.text('Signature', 80, yPosition);
  pdf.text('Company', 140, yPosition);
  yPosition += 8;
  
  // Add attendee lines
  for (let i = 0; i < 8; i++) {
    pdf.line(20, yPosition, 75, yPosition); // Name line
    pdf.line(80, yPosition, 135, yPosition); // Signature line
    pdf.line(140, yPosition, 190, yPosition); // Company line
    yPosition += 15;
  }
  
  // Add new page for hazards and controls
  pdf.addPage();
  yPosition = 25;
  
  // Hazards Section
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('IDENTIFIED HAZARDS', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(10);
  pdf.setTextColor(textColor);
  const hazardItems = [
    'Falls from height',
    'Electrical hazards',
    'Moving machinery',
    'Chemical exposure',
    'Manual handling',
    'Slips, trips, and falls',
    'Confined spaces',
    'Other: _______________'
  ];
  
  hazardItems.forEach(hazard => {
    pdf.text('☐ ' + hazard, 20, yPosition);
    yPosition += 12;
  });
  
  yPosition += 10;
  
  // Control Measures Section
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('CONTROL MEASURES', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(10);
  pdf.setTextColor(textColor);
  pdf.text('List the specific control measures to be implemented:', 20, yPosition);
  yPosition += 15;
  
  // Add lines for control measures
  for (let i = 0; i < 6; i++) {
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += 15;
  }
  
  yPosition += 10;
  
  // Additional Notes Section
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('ADDITIONAL NOTES', 20, yPosition);
  yPosition += 15;
  
  pdf.setFontSize(10);
  pdf.setTextColor(textColor);
  pdf.text('Any additional safety concerns or observations:', 20, yPosition);
  yPosition += 15;
  
  // Add lines for notes
  for (let i = 0; i < 4; i++) {
    pdf.line(20, yPosition, 190, yPosition);
    yPosition += 15;
  }
  
  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor('#9ca3af');
  pdf.text('This toolbox talk template should be completed before commencing work.', 20, 280);
  pdf.text('Keep completed forms on file for record keeping purposes.', 20, 288);
  
  return pdf;
};

export const downloadToolboxTalkPDF = (filename: string = 'toolbox-talk-template.pdf'): void => {
  const pdf = generateToolboxTalkPDF();
  pdf.save(filename);
};

export const previewToolboxTalkPDF = (): void => {
  const pdf = generateToolboxTalkPDF();
  const pdfBlob = pdf.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  window.open(url, '_blank');
}; 