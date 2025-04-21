import React, { useState, useEffect } from 'react';

interface Visit {
  title?: string;
  customers?: {
    name?: string;
  };
  maintenance_plans?: {
    name?: string;
  };
}

const filterVisits = (visits: Visit[], searchTerm: string) => {
  return visits.filter((visit) =>
    visit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.maintenance_plans?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };