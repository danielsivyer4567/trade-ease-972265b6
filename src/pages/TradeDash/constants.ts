
export const TRADE_TYPES = [
  "All Trades",
  "Building & Construction",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Plastering",
  "Roofing",
  "Landscaping",
  "Tiling",
  "Flooring",
  "HVAC (Heating, Ventilation, Air Conditioning)",
  "Fencing",
  "Concreting",
  "Bricklaying",
  "Cabinetmaking",
  "Glazing",
  "Waterproofing",
  "Pest Control",
  "Demolition",
  "Asbestos Removal",
  "Pool Installation",
  "Solar Panel Installation",
  "Kitchen Renovation",
  "Bathroom Renovation",
  "Handyman Services",
  "Joinery",
  "Metal Fabrication",
  "Stone Masonry",
  "Excavation",
  "Paving"
];

export const mockLeads = [
  {
    id: 1,
    title: "Kitchen Renovation",
    description: "Complete kitchen renovation including new cabinets, countertops, and appliances.",
    postcode: "2000",
    suburb: "Sydney CBD",
    size: 25,
    budget: "$15,000-$20,000",
    date: "2023-09-15",
    status: "available",
    customerName: "John Smith",
    contactTime: "Morning"
  },
  {
    id: 2,
    title: "Bathroom Remodel",
    description: "Full bathroom remodel with new shower, vanity, and tiling.",
    postcode: "2010",
    suburb: "Surry Hills",
    size: 10,
    budget: "$8,000-$12,000",
    date: "2023-09-14",
    status: "available",
    customerName: "Sarah Johnson",
    contactTime: "Evening"
  },
  {
    id: 3,
    title: "Deck Construction",
    description: "New outdoor deck construction with railing and stairs.",
    postcode: "2031",
    suburb: "Randwick",
    size: 30,
    budget: "$10,000-$15,000",
    date: "2023-09-13",
    status: "purchased",
    customerName: "Michael Brown",
    contactTime: "Afternoon"
  },
  {
    id: 4,
    title: "House Painting",
    description: "Interior painting for 3 bedroom house",
    postcode: "2095",
    suburb: "Manly",
    size: 120,
    budget: "$5,000-$7,500",
    date: "2023-09-12",
    status: "available",
    customerName: "Emma Wilson",
    contactTime: "Morning"
  },
  {
    id: 5,
    title: "Flooring Installation",
    description: "Hardwood floor installation throughout living areas",
    postcode: "2060",
    suburb: "North Sydney",
    size: 85,
    budget: "$7,500-$10,000",
    date: "2023-09-11",
    status: "purchased",
    customerName: "David Taylor",
    contactTime: "Afternoon"
  }
];

export const mockRankings = [
  { id: 1, tradeName: "Sydney Plumbing Pro", category: "Plumbing", area: "Sydney CBD", responseRate: 95, jobsCompleted: 142, rating: 4.9 },
  { id: 2, tradeName: "Elite Electricians", category: "Electrical", area: "North Sydney", responseRate: 92, jobsCompleted: 118, rating: 4.8 },
  { id: 3, tradeName: "Master Carpenters", category: "Carpentry", area: "Eastern Suburbs", responseRate: 89, jobsCompleted: 97, rating: 4.7 },
  { id: 4, tradeName: "Premium Painters", category: "Painting", area: "Inner West", responseRate: 91, jobsCompleted: 88, rating: 4.6 },
  { id: 5, tradeName: "Complete Roofing", category: "Roofing", area: "Northern Beaches", responseRate: 87, jobsCompleted: 73, rating: 4.5 },
  { id: 6, tradeName: "Green Gardens Landscaping", category: "Landscaping", area: "North Shore", responseRate: 85, jobsCompleted: 64, rating: 4.4 },
  { id: 7, tradeName: "Perfect Tilers", category: "Tiling", area: "Sutherland Shire", responseRate: 84, jobsCompleted: 51, rating: 4.3 },
];

export const userStats = {
  totalJobs: 87,
  fiveStarReviews: 72,
  overallRating: 4.8,
  ranking: 3,
  responseRate: 94,
  isTopTen: true,
  freeLeadsAvailable: 3
};
