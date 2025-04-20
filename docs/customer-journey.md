# Customer Journey Workflow

The Trade Ease platform implements a comprehensive customer journey workflow that connects all aspects of customer interactions from initial site audits through to final invoices. This document explains how data flows through the different modules of the application.

## Overview

The customer journey consists of the following main components:

1. **Customer Profile** - The central hub for all customer information
2. **Site Audits** - On-site inspections with photo documentation
3. **Quotes** - Pricing proposals based on site audits
4. **Jobs** - Work execution tracking
5. **Invoices** - Billing and payment tracking

## Data Flow

The workflow follows this general pattern:

```
Customer Profile <---> Site Audits --> Quotes --> Jobs --> Invoices
                  |                     ^        ^        ^
                  |                     |        |        |
                  +---------------------+--------+--------+
                  (All components link back to the customer profile)
```

## Key Features

### Customer Profile

- Central repository for all customer information
- Access to complete history of interactions
- Displays customer journey in a chronological workflow
- Links to all related records (audits, quotes, jobs, invoices)

### Site Audits

- Photos captured during site audits are automatically linked to customer profiles
- Audit data can be directly converted to quotes
- All audit information is accessible from the customer profile

### Quotes

- Can be generated directly from site audit data
- Linked to the source site audit
- Automatically associated with the customer profile
- Can be converted to jobs when approved

### Jobs

- Created from approved quotes
- Maintain links to source quotes and customer profiles
- Track job execution status
- Can generate invoices upon completion

### Invoices

- Generated from completed jobs
- Maintain links to source jobs, quotes, and customer profile
- Track payment status

## Technical Implementation

The workflow is implemented using:

1. **Database Relationships** - Foreign key constraints ensure data integrity across the journey
2. **Service Layer** - The `CustomerService` provides methods for data access and operations
3. **UI Components** - The `CustomerJourney` component visualizes the entire workflow
4. **Data Transfer** - Photos and information are automatically transferred between components

## Customer Journey Component

The `CustomerJourney` component provides a visual representation of the entire customer workflow, allowing:

- Viewing all site audits, quotes, jobs, and invoices in one place
- Quick creation of quotes from audits
- Easy conversion of quotes to jobs
- Generation of invoices from completed jobs
- Access to all customer data throughout the entire process

## Database Schema

The database schema includes the following tables:

- `customers` - Customer profiles
- `site_audits` - Audit information
- `audit_photos` - Photos from site audits
- `customer_photos` - Photos linked to customer profiles
- `quotes` - Quote information linked to customers and audits
- `jobs` - Job information linked to quotes and customers
- `invoices` - Invoice information linked to jobs, quotes, and customers

Foreign key relationships maintain the integrity of the data flow and ensure all records are properly connected. 