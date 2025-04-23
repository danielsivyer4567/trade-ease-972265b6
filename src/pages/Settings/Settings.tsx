import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SettingsLayout from './SettingsLayout';
import SettingsPageTemplate from './SettingsPageTemplate';

// Import all settings pages
import Staff from './Staff';
import TradeRates from './TradeRates';
import JobSettings from './JobSettings';
import Notifications from './Notifications';
import AIAssistantSettings from './AIAssistantSettings';
import BillsPurchaseOrders from './BillsPurchaseOrders';
import Contractors from './Contractors';
import Integrations from './Integrations';
import Database from './Database';
import AIFeatures from './AIFeatures';
import TermsOfService from './TermsOfService';

const Settings: React.FC = () => {
  return (
    <Routes>
      <Route element={<SettingsLayout />}>
        <Route index element={<Navigate to="staff" replace />} />
        <Route path="staff" element={<SettingsPageTemplate title="Staff Settings" description="Manage your staff members and their roles"><Staff /></SettingsPageTemplate>} />
        <Route path="trade-rates" element={<SettingsPageTemplate title="Trade Rates" description="Configure your trade rates and pricing"><TradeRates /></SettingsPageTemplate>} />
        <Route path="job-settings" element={<SettingsPageTemplate title="Job Settings" description="Customize your job workflow and settings"><JobSettings /></SettingsPageTemplate>} />
        <Route path="notifications" element={<SettingsPageTemplate title="Notification Settings" description="Configure your notification preferences"><Notifications /></SettingsPageTemplate>} />
        <Route path="ai-assistant" element={<SettingsPageTemplate title="AI Assistant Settings" description="Customize your AI assistant behavior"><AIAssistantSettings /></SettingsPageTemplate>} />
        <Route path="bills-purchase-orders" element={<SettingsPageTemplate title="Bills & Purchase Orders" description="Manage your billing and purchase order settings"><BillsPurchaseOrders /></SettingsPageTemplate>} />
        <Route path="contractors" element={<SettingsPageTemplate title="Contractors" description="Manage your contractor relationships"><Contractors /></SettingsPageTemplate>} />
        <Route path="integrations" element={<SettingsPageTemplate title="Integrations" description="Connect with third-party services"><Integrations /></SettingsPageTemplate>} />
        <Route path="database" element={<SettingsPageTemplate title="Database" description="Manage your database settings and backups"><Database /></SettingsPageTemplate>} />
        <Route path="ai-features" element={<SettingsPageTemplate title="AI Features" description="Configure AI-powered features"><AIFeatures /></SettingsPageTemplate>} />
        <Route path="terms-of-service" element={<SettingsPageTemplate title="Terms of Service" description="Manage your terms of service"><TermsOfService /></SettingsPageTemplate>} />
      </Route>
    </Routes>
  );
};

export default Settings; 