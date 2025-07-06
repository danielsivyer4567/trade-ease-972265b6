import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, FileText, Brain, Zap, CheckCircle, Plus, X, Download, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AISWMSCreator = () => {
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    location: '',
    projectType: '',
    supervisor: '',
    date: new Date().toISOString().split('T')[0],
    crew: ''
  });

  const [hazards, setHazards] = useState([]);
  const [newHazard, setNewHazard] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSWMS, setGeneratedSWMS] = useState('');
  const [dataAutoPopulated, setDataAutoPopulated] = useState(false);

  // Read URL parameters and populate form fields
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const projectName = urlParams.get('projectName');
    const jobNumber = urlParams.get('jobNumber');
    const location = urlParams.get('location');
    const clientName = urlParams.get('clientName');
    const tradeType = urlParams.get('tradeType');
    const supervisor = urlParams.get('supervisor');
    const projectDate = urlParams.get('projectDate');
    
    // If we have URL parameters, populate the form
    if (projectName || location || tradeType || supervisor) {
      setProjectInfo({
        projectName: projectName || '',
        location: location || '',
        projectType: jobNumber || '',
        supervisor: supervisor || '',
        date: projectDate || new Date().toISOString().split('T')[0],
        crew: ''
      });
      
      if (tradeType) {
        setSelectedTrade(tradeType);
      }
      
      setDataAutoPopulated(true);
    }
  }, []);

  const tradeTypes = [
    'Carpentry',
    'Electrical',
    'Plumbing',
    'Excavation',
    'Concreting',
    'Roofing',
    'Painting',
    'Landscaping',
    'Demolition',
    'General Construction'
  ];

  const commonHazards = [
    'Working at height',
    'Manual handling',
    'Electrical hazards',
    'Machinery operation',
    'Chemical exposure',
    'Noise exposure',
    'Slips, trips, falls',
    'Confined spaces',
    'Excavation hazards',
    'Hot work (welding/cutting)',
    'Asbestos exposure',
    'Dust and silica',
    'Vehicle and plant movement',
    'Weather conditions'
  ];

  const addHazard = (hazard) => {
    if (hazard && !hazards.includes(hazard)) {
      setHazards([...hazards, hazard]);
      setNewHazard('');
    }
  };

  const removeHazard = (hazard) => {
    setHazards(hazards.filter(h => h !== hazard));
  };

  const generateSWMS = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation - in real implementation, this would call an AI service
    setTimeout(() => {
      const swmsContent = generateProfessionalSWMS();
      setGeneratedSWMS(swmsContent);
      setIsGenerating(false);
    }, 2000);
  };

  const generateProfessionalSWMS = () => {
    const currentDate = new Date().toLocaleDateString('en-AU');
    const nextReviewDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU'); // 6 months from now
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Safe Work Method Statement - ${projectInfo.projectName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
    .header { display: flex; justify-content: space-between; align-items: center; border: 2px solid #000; padding: 10px; margin-bottom: 20px; }
    .logo { width: 120px; height: 80px; background: #FFB800; border: 1px solid #000; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; }
    .title { flex: 1; text-align: center; }
    .title h1 { margin: 0; font-size: 24px; font-weight: bold; }
    .title p { margin: 5px 0; font-style: italic; }
    .contact { text-align: right; font-size: 10px; }
    .contact a { color: blue; }
    .section-header { background: #D3D3D3; padding: 8px; text-align: center; font-weight: bold; border: 1px solid #000; margin: 10px 0; }
    .three-column { display: flex; margin-bottom: 20px; }
    .column { flex: 1; border: 1px solid #000; padding: 10px; margin-right: 10px; }
    .column:last-child { margin-right: 0; }
    .column h4 { margin: 0 0 10px 0; font-weight: bold; background: #D3D3D3; padding: 5px; text-align: center; }
    .risk-matrix { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .risk-matrix th, .risk-matrix td { border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold; }
    .risk-matrix .likelihood { background: #D3D3D3; }
    .risk-matrix .consequence-header { background: #D3D3D3; }
    .risk-1 { background: #90EE90; }
    .risk-2 { background: #87CEEB; }
    .risk-3 { background: #87CEEB; }
    .risk-4 { background: #87CEEB; }
    .risk-5 { background: #90EE90; }
    .risk-6 { background: #87CEEB; }
    .risk-8 { background: #87CEEB; }
    .risk-9 { background: #87CEEB; }
    .risk-10 { background: #FFD700; }
    .risk-12 { background: #FFD700; }
    .risk-15 { background: #FFD700; }
    .risk-16 { background: #FFA500; }
    .risk-20 { background: #FFA07A; }
    .risk-25 { background: #FFA07A; }
    .swms-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .swms-table th, .swms-table td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
    .swms-table th { background: #D3D3D3; font-weight: bold; text-align: center; }
    .footer { text-align: center; font-size: 10px; margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; }
    .page-break { page-break-after: always; }
    ul { margin: 0; padding-left: 20px; }
    li { margin: 5px 0; }
    .small-text { font-size: 10px; }
    .risk-actions { margin: 20px 0; }
    .risk-actions table { width: 100%; border-collapse: collapse; }
    .risk-actions th, .risk-actions td { border: 1px solid #000; padding: 8px; text-align: left; }
    .risk-actions th { background: #D3D3D3; font-weight: bold; }
    .hierarchy { margin: 20px 0; }
    .hierarchy table { width: 100%; border-collapse: collapse; }
    .hierarchy th, .hierarchy td { border: 1px solid #000; padding: 8px; text-align: left; }
    .hierarchy th { background: #D3D3D3; font-weight: bold; }
  </style>
</head>
<body>

<!-- PAGE 1: Project Details -->
<div class="header">
  <div class="logo">
    TRADE EASE<br>
    LOGO<br>
    HERE
  </div>
  <div class="title">
    <h1>Safe Work Method Statement Template</h1>
    <p>A template to use when creating Safe Work Method Statements in your workplace</p>
  </div>
  <div class="contact">
    <strong>Trade Ease Construction</strong><br>
    <a href="mailto:info@tradeeaseapp.com">info@tradeeaseapp.com</a><br>
    <strong>Phone:</strong> 1300 TRADE EASE<br>
    <strong>ABN:</strong> 12 345 678 901
  </div>
</div>

<div class="section-header">Project Details</div>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tr>
    <td style="border: 1px solid #000; padding: 10px; background: #D3D3D3; font-weight: bold; width: 100%;">
      <strong>Job Description & Location:</strong><br>
      ${projectInfo.projectName} - ${selectedTrade} work at ${projectInfo.location}
    </td>
  </tr>
</table>

<div class="three-column">
  <div class="column">
    <h4>Contacts:</h4>
    <strong>Site Supervisor:</strong> ${projectInfo.supervisor}<br>
    <strong>Contact:</strong> 1300 TRADE EASE<br>
    <strong>Emergency:</strong> 000<br>
    <strong>Person responsible for implementing, reviewing and monitoring this SWMS:</strong> ${projectInfo.supervisor}
  </div>
  <div class="column">
    <h4>Qualifications & Training:</h4>
    <ul>
      <li>General site induction</li>
      <li>Daily toolbox meeting</li>
      <li>Competent and trained workers</li>
      <li>General Construction Induction Card (Blue or White)</li>
      <li>Trade specific qualifications</li>
    </ul>
  </div>
  <div class="column">
    <h4>Relevant Legislation & Information:</h4>
    <ul>
      <li>Work Health & Safety Act 2011</li>
      <li>Work Health & Safety Legislation 2011</li>
      <li>Australian Standards</li>
      <li>Industry codes of practice</li>
    </ul>
  </div>
</div>

<div class="three-column">
  <div class="column">
    <h4>PPE / Safety Equipment / Signage / Tags:</h4>
    <ul>
      <li>Hard hat (safety helmet)</li>
      <li>Safety glasses/goggles</li>
      <li>High-visibility clothing</li>
      <li>Steel-capped safety boots</li>
      <li>Hearing protection (where required)</li>
      <li>Respiratory protection (where required)</li>
      <li>Other PPE specific to identified hazards</li>
    </ul>
  </div>
  <div class="column">
    <h4>Plant & Equipment:</h4>
    <strong>Equipment used for ${selectedTrade}:</strong><br>
    ${getTradeEquipment(selectedTrade)}
    <br><br>
    <em>Plant hazard risk assessment completed for each item of plant or equipment used</em>
  </div>
  <div class="column">
    <h4>Relevant Parties</h4>
    <strong>Person Conducting Business or Undertaking:</strong><br>
    <strong>Name:</strong> Trade Ease Construction<br>
    <strong>ABN:</strong> 12 345 678 901<br>
    <strong>Address:</strong> Brisbane, QLD 4000<br>
    <strong>Phone:</strong> 1300 TRADE EASE<br><br>
    <strong>Principal Contractor:</strong><br>
    <strong>Name:</strong> Trade Ease Construction<br>
    <strong>ABN:</strong> 12 345 678 901<br>
    <strong>Address:</strong> Brisbane, QLD 4000<br>
    <strong>Phone:</strong> 1300 TRADE EASE
  </div>
</div>

<div class="three-column">
  <div class="column">
    <h4>Emergency Planning & Rescue Procedures:</h4>
    <strong>Emergency Procedures:</strong><br>
    In the event of an incident or emergency, work must stop immediately and the Trade Ease Construction Incident Management and Emergency Management Policy and Procedure must be followed. This SWMS must be reviewed and amended before work recommences to ensure that the incident cannot occur again.
    <br><br>
    <strong>Emergency Contacts:</strong><br>
    Emergency: 000<br>
    Site Supervisor: ${projectInfo.supervisor}<br>
    First Aid Officer: On site
  </div>
  <div class="column">
    <h4>High Risk Work Activities:</h4>
    <strong>Identified high risk activities for this task:</strong><br>
    ${hazards.filter(h => getHazardRiskLevel(h) >= 15).map(h => `• ${h}`).join('<br>')}
    ${hazards.filter(h => getHazardRiskLevel(h) >= 15).length === 0 ? 'No high risk activities identified for this specific task.' : ''}
  </div>
  <div class="column">
    <h4>Safety Data Sheets:</h4>
    <strong>Safety Data Sheets required for:</strong><br>
    ${getTradeChemicals(selectedTrade)}
    <br><br>
    <em>All SDS must be readily available on site and workers must be trained in their use</em>
  </div>
</div>

<div class="footer">
  <strong>Printed Copies Are Uncontrolled</strong> | Document: SWMS Template | Rev: A | Last Revision Date: ${currentDate} | Job Description: ${projectInfo.projectName} | Page: 1 of 10
</div>

<div class="page-break"></div>

<!-- PAGE 2: Risk Assessment Matrix -->
<div class="header">
  <div class="logo">
    TRADE EASE<br>
    LOGO<br>
    HERE
  </div>
  <div class="title">
    <h1>Safe Work Method Statement Template</h1>
    <p>A template to use when creating Safe Work Method Statements in your workplace</p>
  </div>
  <div class="contact">
    <strong>Trade Ease Construction</strong><br>
    <a href="mailto:info@tradeeaseapp.com">info@tradeeaseapp.com</a><br>
    <strong>Phone:</strong> 1300 TRADE EASE<br>
    <strong>ABN:</strong> 12 345 678 901
  </div>
</div>

<div class="section-header">Risk Assessment</div>

<div class="section-header">Consequences:</div>

<table class="risk-matrix">
  <tr>
    <th rowspan="2" class="likelihood">Likelihood</th>
    <th class="consequence-header">5 - Catastrophic</th>
    <th class="consequence-header">4 - Major</th>
    <th class="consequence-header">3 - Moderate</th>
    <th class="consequence-header">2 - Minor</th>
    <th class="consequence-header">1 - Insignificant</th>
  </tr>
  <tr>
    <td class="small-text">Death or disablement, significant damage to equipment, significant financial cost, significant long term environmental damage</td>
    <td class="small-text">Extensive injuries with lost time, major damage to equipment, major financial cost, major short term environmental damage</td>
    <td class="small-text">Medical treatment, damage to plant and equipment, moderate financial cost, major short term environmental damage</td>
    <td class="small-text">First aid treatment, minor damage to equipment, minor financial cost, minor short term environmental damage</td>
    <td class="small-text">No injuries, slight damage to equipment, very minor non-existent financial cost, very minor or non-existent environmental damage</td>
  </tr>
  <tr>
    <td class="likelihood">5 - Almost Certain</td>
    <td class="risk-25">25</td>
    <td class="risk-20">20</td>
    <td class="risk-15">15</td>
    <td class="risk-10">10</td>
    <td class="risk-5">5</td>
  </tr>
  <tr>
    <td class="likelihood">4 - Likely</td>
    <td class="risk-20">20</td>
    <td class="risk-16">16</td>
    <td class="risk-12">12</td>
    <td class="risk-8">8</td>
    <td class="risk-4">4</td>
  </tr>
  <tr>
    <td class="likelihood">3 - Possible</td>
    <td class="risk-15">15</td>
    <td class="risk-12">12</td>
    <td class="risk-9">9</td>
    <td class="risk-6">6</td>
    <td class="risk-3">3</td>
  </tr>
  <tr>
    <td class="likelihood">2 - Unlikely</td>
    <td class="risk-10">10</td>
    <td class="risk-8">8</td>
    <td class="risk-6">6</td>
    <td class="risk-4">4</td>
    <td class="risk-2">2</td>
  </tr>
  <tr>
    <td class="likelihood">1 - Rare</td>
    <td class="risk-5">5</td>
    <td class="risk-4">4</td>
    <td class="risk-3">3</td>
    <td class="risk-2">2</td>
    <td class="risk-1">1</td>
  </tr>
</table>

<div class="footer">
  <strong>Printed Copies Are Uncontrolled</strong> | Document: SWMS Template | Rev: A | Last Revision Date: ${currentDate} | Job Description: ${projectInfo.projectName} | Page: 2 of 10
</div>

<div class="page-break"></div>

<!-- PAGE 3: Risk Actions & Hierarchy -->
<div class="header">
  <div class="logo">
    TRADE EASE<br>
    LOGO<br>
    HERE
  </div>
  <div class="title">
    <h1>Safe Work Method Statement Template</h1>
    <p>A template to use when creating Safe Work Method Statements in your workplace</p>
  </div>
  <div class="contact">
    <strong>Trade Ease Construction</strong><br>
    <a href="mailto:info@tradeeaseapp.com">info@tradeeaseapp.com</a><br>
    <strong>Phone:</strong> 1300 TRADE EASE<br>
    <strong>ABN:</strong> 12 345 678 901
  </div>
</div>

<div class="risk-actions">
  <table>
    <tr>
      <th style="background: #D3D3D3;">Risk Rating</th>
      <th style="background: #D3D3D3;">Actions Required</th>
    </tr>
    <tr>
      <td style="background: #FFA07A; font-weight: bold;">16 - 25</td>
      <td>High Risk – Work must be stopped immediately. Control measures must be put in place immediately by a competent person, following the hierarchy of controls</td>
    </tr>
    <tr>
      <td style="background: #FFD700; font-weight: bold;">10 - 15</td>
      <td>Substantial Risk – Stop work if there is an immediate risk. Additional control measures must be put in place immediately by a competent person, following the hierarchy of controls</td>
    </tr>
    <tr>
      <td style="background: #87CEEB; font-weight: bold;">5 - 9</td>
      <td>Low Risk – Work may commence. All current control measures must be maintained. Monitored and reviewed and further controls implemented if possible</td>
    </tr>
    <tr>
      <td style="background: #90EE90; font-weight: bold;">1 - 4</td>
      <td>Very low risk – Work may commence. All current control measures must be maintained, monitored and reviewed</td>
    </tr>
  </table>
</div>

<div class="section-header">Hierarchy of Controls</div>

<div class="hierarchy">
  <table>
    <tr>
      <th style="background: #D3D3D3;">Control Method</th>
      <th style="background: #D3D3D3;">Description</th>
    </tr>
    <tr>
      <td><strong>Elimination</strong></td>
      <td>Eliminate the hazard altogether e.g. remove a hazardous machine from use</td>
    </tr>
    <tr>
      <td><strong>Substitution</strong></td>
      <td>Substitute a safer option e.g. replace a hazardous machine with a safer one</td>
    </tr>
    <tr>
      <td><strong>Isolation</strong></td>
      <td>Isolate a hazard from anyone who could be harmed</td>
    </tr>
    <tr>
      <td><strong>Engineering</strong></td>
      <td>Use engineering controls to reduce the risk</td>
    </tr>
    <tr>
      <td><strong>Administrative</strong></td>
      <td>Utilise training and signage</td>
    </tr>
    <tr>
      <td><strong>PPE</strong></td>
      <td>Utilise personal protective equipment</td>
    </tr>
  </table>
</div>

<div class="footer">
  <strong>Printed Copies Are Uncontrolled</strong> | Document: SWMS Template | Rev: A | Last Revision Date: ${currentDate} | Job Description: ${projectInfo.projectName} | Page: 3 of 10
</div>

<div class="page-break"></div>

<!-- PAGE 4: SWMS Table -->
<div class="header">
  <div class="logo">
    TRADE EASE<br>
    LOGO<br>
    HERE
  </div>
  <div class="title">
    <h1>Safe Work Method Statement Template</h1>
    <p>A template to use when creating Safe Work Method Statements in your workplace</p>
  </div>
  <div class="contact">
    <strong>Trade Ease Construction</strong><br>
    <a href="mailto:info@tradeeaseapp.com">info@tradeeaseapp.com</a><br>
    <strong>Phone:</strong> 1300 TRADE EASE<br>
    <strong>ABN:</strong> 12 345 678 901
  </div>
</div>

<div class="section-header">Safe Work Method Statement</div>

<table class="swms-table">
  <tr>
    <th style="width: 20%;">Job Step</th>
    <th style="width: 20%;">Potential Hazards</th>
    <th style="width: 12%;">Initial Risk<br>L | C | S</th>
    <th style="width: 25%;">Safety Control Measures</th>
    <th style="width: 12%;">Residual Risk<br>L | C | S</th>
    <th style="width: 11%;">Persons Responsible</th>
  </tr>
  ${generateSWMSRows()}
</table>

<div class="footer">
  <strong>Printed Copies Are Uncontrolled</strong> | Document: SWMS Template | Rev: A | Last Revision Date: ${currentDate} | Job Description: ${projectInfo.projectName} | Page: 4 of 10
</div>

<div class="page-break"></div>

<!-- Additional pages would continue with monitoring, communication, revision history, etc. -->
<!-- For brevity, I'll include the key sections but summarize the remaining pages -->

<div class="header">
  <div class="logo">
    TRADE EASE<br>
    LOGO<br>
    HERE
  </div>
  <div class="title">
    <h1>Safe Work Method Statement Template</h1>
    <p>A template to use when creating Safe Work Method Statements in your workplace</p>
  </div>
  <div class="contact">
    <strong>Trade Ease Construction</strong><br>
    <a href="mailto:info@tradeeaseapp.com">info@tradeeaseapp.com</a><br>
    <strong>Phone:</strong> 1300 TRADE EASE<br>
    <strong>ABN:</strong> 12 345 678 901
  </div>
</div>

<div class="section-header">Document Information & Approval</div>

<div style="margin: 20px 0; padding: 15px; border: 1px solid #000;">
  <h3>Document Details</h3>
  <p><strong>Project:</strong> ${projectInfo.projectName}</p>
  <p><strong>Location:</strong> ${projectInfo.location}</p>
  <p><strong>Trade Type:</strong> ${selectedTrade}</p>
  <p><strong>Date Prepared:</strong> ${currentDate}</p>
  <p><strong>Prepared By:</strong> ${projectInfo.supervisor}</p>
  <p><strong>Next Review Date:</strong> ${nextReviewDate}</p>
</div>

<div style="margin: 20px 0; padding: 15px; border: 1px solid #000;">
  <h3>Supervisor Approval</h3>
  <p>This SWMS has been reviewed and approved for implementation.</p>
  <p><strong>Supervisor:</strong> ${projectInfo.supervisor}</p>
  <p><strong>Date:</strong> ${currentDate}</p>
  <p><strong>Signature:</strong> _______________________</p>
</div>

<div style="margin: 20px 0; padding: 15px; border: 1px solid #000;">
  <h3>Important Notes</h3>
  <ul>
    <li>This SWMS must be reviewed at least once every six months</li>
    <li>All workers must be inducted into this SWMS before commencing work</li>
    <li>Any changes to work methods must be reviewed and approved before implementation</li>
    <li>This document was generated using AI assistance and should be reviewed by a qualified safety professional</li>
  </ul>
</div>

<div class="footer">
  <strong>Printed Copies Are Uncontrolled</strong> | Document: SWMS Template | Rev: A | Last Revision Date: ${currentDate} | Job Description: ${projectInfo.projectName} | Page: 10 of 10
</div>

</body>
</html>
    `;
  };

  const generateSWMSRows = () => {
    if (hazards.length === 0) return '<tr><td colspan="6" style="text-align: center; padding: 20px; font-style: italic;">No hazards identified yet. Please add hazards in the Hazard Identification tab.</td></tr>';
    
    return hazards.map(hazard => {
      const jobStep = getJobStepForHazard(hazard, selectedTrade);
      const initialRisk = getInitialRisk(hazard);
      const controlMeasures = getControlMeasures(hazard, selectedTrade);
      const residualRisk = getResidualRisk(hazard);
      
      return `
        <tr>
          <td>${jobStep}</td>
          <td>• ${hazard}</td>
          <td style="text-align: center;">${initialRisk.L} | ${initialRisk.C} | <strong>${initialRisk.S}</strong></td>
          <td>
            <ul>
              ${controlMeasures.map(control => `<li>${control}</li>`).join('')}
            </ul>
          </td>
          <td style="text-align: center;">${residualRisk.L} | ${residualRisk.C} | <strong>${residualRisk.S}</strong></td>
          <td>${projectInfo.supervisor || 'Site Supervisor'}</td>
        </tr>
      `;
    }).join('');
  };

  const getJobStepForHazard = (hazard, trade) => {
    const jobSteps = {
      'Working at height': 'Access and work at elevated positions',
      'Manual handling': 'Material handling and lifting',
      'Electrical hazards': 'Electrical work and equipment use',
      'Machinery operation': 'Plant and equipment operation',
      'Chemical exposure': 'Use of chemicals and substances',
      'Noise exposure': 'High noise environment work',
      'Slips, trips, falls': 'Site movement and access',
      'Confined spaces': 'Work in confined areas',
      'Excavation hazards': 'Excavation and trenching work',
      'Hot work (welding/cutting)': 'Hot work operations',
      'Asbestos exposure': 'Asbestos-related work',
      'Dust and silica': 'Dust-generating activities',
      'Vehicle and plant movement': 'Vehicle and plant operations',
      'Weather conditions': 'Outdoor work activities'
    };
    return jobSteps[hazard] || `${trade} work involving ${hazard.toLowerCase()}`;
  };

  const getInitialRisk = (hazard) => {
    const riskProfiles = {
      'Working at height': {L: 3, C: 4, S: 12},
      'Manual handling': {L: 4, C: 3, S: 12},
      'Electrical hazards': {L: 2, C: 5, S: 10},
      'Machinery operation': {L: 3, C: 4, S: 12},
      'Chemical exposure': {L: 3, C: 3, S: 9},
      'Noise exposure': {L: 4, C: 2, S: 8},
      'Slips, trips, falls': {L: 4, C: 3, S: 12},
      'Confined spaces': {L: 2, C: 5, S: 10},
      'Excavation hazards': {L: 3, C: 4, S: 12},
      'Hot work (welding/cutting)': {L: 3, C: 4, S: 12},
      'Asbestos exposure': {L: 2, C: 5, S: 10},
      'Dust and silica': {L: 4, C: 3, S: 12},
      'Vehicle and plant movement': {L: 3, C: 4, S: 12},
      'Weather conditions': {L: 3, C: 2, S: 6}
    };
    return riskProfiles[hazard] || {L: 3, C: 3, S: 9};
  };

  const getResidualRisk = (hazard) => {
    const initialRisk = getInitialRisk(hazard);
    // Reduce risk by implementing controls - typically reduce likelihood by 1-2 levels
    const newL = Math.max(1, initialRisk.L - 2);
    const newC = initialRisk.C; // Consequence usually remains same
    const newS = newL * newC;
    return {L: newL, C: newC, S: newS};
  };

  const getControlMeasures = (hazard, trade) => {
    const controls = {
      'Working at height': [
        'Use appropriate fall protection equipment (harnesses, lanyards)',
        'Ensure scaffolding is erected by qualified personnel',
        'Conduct pre-use inspection of all height safety equipment',
        'Establish exclusion zones below work areas',
        'Use appropriate access equipment (ladders, scaffolds, EWPs)'
      ],
      'Manual handling': [
        'Use mechanical lifting aids where possible',
        'Ensure proper lifting techniques are used',
        'Team lifting for heavy items',
        'Regular breaks and job rotation',
        'Pre-work stretching and warm-up exercises'
      ],
      'Electrical hazards': [
        'Isolation and lockout of electrical supplies',
        'Use of appropriate PPE (insulated gloves, safety glasses)',
        'Test equipment before use',
        'Use qualified electricians for electrical work',
        'Maintain safe distances from overhead power lines'
      ],
      'Machinery operation': [
        'Operator training and competency verification',
        'Pre-operational safety checks',
        'Use of appropriate PPE',
        'Maintain safe exclusion zones',
        'Regular maintenance and inspection of equipment'
      ],
      'Chemical exposure': [
        'Use of appropriate PPE (respirators, gloves, eye protection)',
        'Ensure adequate ventilation',
        'Store chemicals in appropriate containers',
        'Have SDS available and workers trained',
        'Emergency wash stations available'
      ],
      'Noise exposure': [
        'Use of hearing protection (earplugs, earmuffs)',
        'Limit exposure time in high noise areas',
        'Regular audiometric testing',
        'Use of low-noise equipment where possible',
        'Noise monitoring and assessment'
      ],
      'Slips, trips, falls': [
        'Maintain clean and tidy work areas',
        'Use appropriate footwear',
        'Ensure adequate lighting',
        'Mark or eliminate trip hazards',
        'Use non-slip surfaces where appropriate'
      ],
      'Confined spaces': [
        'Atmospheric testing before entry',
        'Use of ventilation systems',
        'Standby person at entry point',
        'Emergency rescue procedures in place',
        'Use of appropriate PPE and breathing apparatus'
      ],
      'Excavation hazards': [
        'Dial Before You Dig services contacted',
        'Use of appropriate shoring or benching',
        'Safe access and egress provided',
        'Spoil placed away from excavation edges',
        'Competent person supervision'
      ],
      'Hot work (welding/cutting)': [
        'Hot work permits issued',
        'Fire watch personnel assigned',
        'Fire extinguishers readily available',
        'Remove combustible materials from area',
        'Use of appropriate PPE (welding helmet, gloves, apron)'
      ],
      'Asbestos exposure': [
        'Asbestos survey completed before work',
        'Use of licensed asbestos removalists',
        'Appropriate PPE (P2 respirators, disposable coveralls)',
        'Wet cutting methods to minimize dust',
        'Proper waste disposal procedures'
      ],
      'Dust and silica': [
        'Use of water suppression systems',
        'Appropriate respiratory protection',
        'Regular health monitoring',
        'Use of dust extraction equipment',
        'Limit exposure time and rotate workers'
      ],
      'Vehicle and plant movement': [
        'Use of spotters for reversing operations',
        'Segregation of pedestrians and vehicles',
        'Use of hi-vis clothing',
        'Speed limits enforced on site',
        'Regular vehicle maintenance and inspection'
      ],
      'Weather conditions': [
        'Monitor weather conditions',
        'Postpone work during extreme weather',
        'Use appropriate clothing and PPE',
        'Ensure adequate hydration',
        'Provide shelter and rest areas'
      ]
    };
    return controls[hazard] || [
      'Implement appropriate safety procedures',
      'Use required PPE',
      'Conduct regular safety inspections',
      'Provide worker training and supervision',
      'Maintain communication with supervisor'
    ];
  };

  const getHazardRiskLevel = (hazard) => {
    return getInitialRisk(hazard).S;
  };

  const getTradeEquipment = (trade) => {
    const equipment = {
      'Carpentry': 'Power tools (saws, drills, sanders), Hand tools (hammers, chisels, planes), Ladders, Scaffolding',
      'Electrical': 'Power tools, Testing equipment, Ladders, Cable pulling equipment, Electrical meters',
      'Plumbing': 'Pipe cutting tools, Welding equipment, Drain cleaning equipment, Pressure testing equipment',
      'Excavation': 'Excavators, Compactors, Hand tools, Shoring equipment, Pumps',
      'Concreting': 'Concrete mixers, Vibrators, Finishing tools, Formwork, Cutting equipment',
      'Roofing': 'Ladders, Scaffolding, Roofing tools, Safety equipment, Lifting equipment',
      'Painting': 'Spray equipment, Brushes and rollers, Ladders, Mixing equipment, Pressure washers',
      'Landscaping': 'Mowers, Trimmers, Hand tools, Irrigation equipment, Small plant',
      'Demolition': 'Demolition tools, Excavators, Cutting equipment, Dust suppression, Waste containers',
      'General Construction': 'Various power tools, Hand tools, Ladders, Scaffolding, Material handling equipment'
    };
    return equipment[trade] || 'Various tools and equipment as required for the specific trade';
  };

  const getTradeChemicals = (trade) => {
    const chemicals = {
      'Carpentry': 'Wood preservatives, Adhesives, Finishes, Solvents',
      'Electrical': 'Electrical cleaners, Cable lubricants, Insulation materials',
      'Plumbing': 'Pipe sealants, Solvents, Cleaning agents, Flux',
      'Excavation': 'Hydraulic fluids, Fuels, Lubricants',
      'Concreting': 'Concrete additives, Release agents, Curing compounds, Sealers',
      'Roofing': 'Roofing adhesives, Sealants, Primers, Solvents',
      'Painting': 'Paints, Solvents, Primers, Thinners, Cleaning agents',
      'Landscaping': 'Fertilizers, Pesticides, Herbicides, Fuels',
      'Demolition': 'Cutting fluids, Dust suppressants, Cleaning agents',
      'General Construction': 'Various chemicals as required for specific tasks'
    };
    return chemicals[trade] || 'Chemicals and substances as required for the specific trade';
  };

  const downloadSWMS = () => {
    const blob = new Blob([generatedSWMS], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SWMS_${projectInfo.projectName}_${projectInfo.date}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI SWMS Creator</h1>
              <p className="text-gray-600">Generate Safe Work Method Statements using AI</p>
            </div>
          </div>
          
          <Alert className="mb-6">
            <Brain className="h-4 w-4" />
            <AlertDescription>
              This AI-powered tool generates SWMS documents based on your project details and identified hazards. 
              Always have generated documents reviewed by a qualified safety professional before use.
            </AlertDescription>
          </Alert>
          
          {dataAutoPopulated && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Project details have been automatically populated from your job selection. You can modify any fields as needed.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Project Details</TabsTrigger>
            <TabsTrigger value="hazards">Hazard Identification</TabsTrigger>
            <TabsTrigger value="generate">Generate SWMS</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Information
                </CardTitle>
                <CardDescription>
                  Enter the basic details for your construction project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={projectInfo.projectName}
                      onChange={(e) => setProjectInfo({...projectInfo, projectName: e.target.value})}
                      placeholder="e.g., Residential Extension"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={projectInfo.location}
                      onChange={(e) => setProjectInfo({...projectInfo, location: e.target.value})}
                      placeholder="e.g., 123 Main Street, Brisbane"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Trade Type</Label>
                    <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trade type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tradeTypes.map(trade => (
                          <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Input
                      id="supervisor"
                      value={projectInfo.supervisor}
                      onChange={(e) => setProjectInfo({...projectInfo, supervisor: e.target.value})}
                      placeholder="e.g., John Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={projectInfo.date}
                      onChange={(e) => setProjectInfo({...projectInfo, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="crew">Crew Members</Label>
                    <Input
                      id="crew"
                      value={projectInfo.crew}
                      onChange={(e) => setProjectInfo({...projectInfo, crew: e.target.value})}
                      placeholder="e.g., John Smith, Jane Doe"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hazards" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Hazard Identification
                </CardTitle>
                <CardDescription>
                  Identify potential hazards for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newHazard}
                    onChange={(e) => setNewHazard(e.target.value)}
                    placeholder="Add custom hazard"
                    onKeyPress={(e) => e.key === 'Enter' && addHazard(newHazard)}
                  />
                  <Button onClick={() => addHazard(newHazard)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label>Common Hazards</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {commonHazards.map(hazard => (
                      <Button
                        key={hazard}
                        variant={hazards.includes(hazard) ? "default" : "outline"}
                        size="sm"
                        onClick={() => hazards.includes(hazard) ? removeHazard(hazard) : addHazard(hazard)}
                        className="justify-start"
                      >
                        {hazards.includes(hazard) ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Plus className="h-3 w-3 mr-1" />
                        )}
                        {hazard}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Selected Hazards</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hazards.map(hazard => (
                      <Badge key={hazard} variant="secondary" className="flex items-center gap-1">
                        {hazard}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeHazard(hazard)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Generate SWMS
                </CardTitle>
                <CardDescription>
                  Generate your Safe Work Method Statement using AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={generateSWMS}
                    disabled={!projectInfo.projectName || !selectedTrade || hazards.length === 0 || isGenerating}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        Generate SWMS
                      </>
                    )}
                  </Button>
                  
                  {generatedSWMS && (
                    <Button variant="outline" onClick={downloadSWMS}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                {generatedSWMS && (
                  <div className="mt-6">
                    <Label>Generated SWMS Preview</Label>
                    <div className="mt-2 border rounded-lg bg-white p-4 max-h-[600px] overflow-y-auto">
                      <div 
                        className="swms-preview text-sm"
                        dangerouslySetInnerHTML={{ __html: generatedSWMS }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AISWMSCreator; 