
import type { JobTemplate } from "@/types/job";

export const parseTextTemplate = (text: string): JobTemplate => {
  const lines = text.split('\n').map(line => line.trim());
  const getDurationValue = (durationStr: string | undefined): number => {
    if (!durationStr) return 0;
    const match = durationStr.match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

  const getPriceValue = (priceStr: string | undefined): number => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
    return match ? Number(match[0]) : 0;
  };

  return {
    id: crypto.randomUUID(),
    title: lines.find(line => line.toLowerCase().includes('title:'))?.split(':')[1]?.trim() || "Untitled Template",
    description: '',
    type: lines.find(line => line.toLowerCase().includes('type:'))?.split(':')[1]?.trim() || "",
    estimatedDuration: getDurationValue(lines.find(line => line.toLowerCase().includes('duration:'))),
    price: getPriceValue(lines.find(line => line.toLowerCase().includes('price:'))),
    materials: lines.find(line => line.toLowerCase().includes('materials:'))?.split(':')[1]?.split(',').map(item => item.trim()) || [],
    category: (lines.find(line => line.toLowerCase().includes('category:'))?.split(':')[1]?.trim() || "Plumbing")
  };
};

export const parseCSVTemplate = (csvContent: string): JobTemplate => {
  const rows = csvContent.split('\n').map(row => row.split(',').map(cell => cell.trim()));
  const headers = rows[0].map(header => header.toLowerCase());
  const data = rows[1];

  const getColumnValue = (columnName: string) => {
    const index = headers.findIndex(h => h.includes(columnName));
    return index !== -1 ? data[index] : '';
  };

  const getDurationValue = (value: string): number => {
    const numValue = Number(value.replace(/[^\d.-]/g, ''));
    return isNaN(numValue) ? 0 : numValue;
  };

  const getPriceValue = (value: string): number => {
    const numValue = Number(value.replace(/[^\d.-]/g, ''));
    return isNaN(numValue) ? 0 : numValue;
  };

  return {
    id: crypto.randomUUID(),
    title: getColumnValue('title') || "Untitled Template",
    description: getColumnValue('description') || "",
    type: getColumnValue('type') || "",
    estimatedDuration: getDurationValue(getColumnValue('duration')),
    price: getPriceValue(getColumnValue('price')),
    materials: getColumnValue('materials')?.split(';') || [],
    category: getColumnValue('category') || "Plumbing"
  };
};
