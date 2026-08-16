import type { ReactNode } from "react";

export type TValueItem = {
  title: string;
  description: string;
  icon: ReactNode;
};

export type TStep = {
  number: string;
  title: string;
  description: string;
};

export const VALUE_ITEMS: TValueItem[] = [
  {
    title: "Wide Selection",
    description: "Find a vehicle that fits your journey.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12.5 5 7a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 5.5" />
        <path d="M3 12.5h18v4a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V16h-11v.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
        <circle cx="7" cy="16.5" r="1.3" />
        <circle cx="17" cy="16.5" r="1.3" />
      </svg>
    ),
  },
  {
    title: "Transparent Pricing",
    description: "Clear hourly rental pricing.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12 12.6 4.6a2 2 0 0 0-1.4-.6H5a1 1 0 0 0-1 1v6.2c0 .5.2 1 .6 1.4L12 20a2 2 0 0 0 2.8 0l5.2-5.2a2 2 0 0 0 0-2.8Z" />
        <circle cx="8.5" cy="8.5" r="1.3" />
      </svg>
    ),
  },
  {
    title: "Secure Booking",
    description: "A reliable reservation and payment experience.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.4 7 8.5 4.1-1.1 7-4.3 7-8.5V6z" />
        <path d="m9.3 12.2 1.8 1.8 3.6-3.6" />
      </svg>
    ),
  },
  {
    title: "Easy Management",
    description: "Manage your reservations from your account.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 9.5h16M8 3v3M16 3v3" />
        <path d="m8.5 14 2 2 4-4" />
      </svg>
    ),
  },
];

export const STEPS: TStep[] = [
  { number: "01", title: "Choose Your Car", description: "Browse available vehicles and select the right one." },
  { number: "02", title: "Book Your Ride", description: "Choose your pickup and drop-off schedule." },
  { number: "03", title: "Get Approved", description: "Your reservation is reviewed and approved." },
  { number: "04", title: "Hit the Road", description: "Complete payment, pick up your car, and enjoy your journey." },
];

export const BENEFITS: string[] = [
  "Easy car discovery with search and filters",
  "Simple, straightforward reservations",
  "Secure payments through Stripe",
  "Clear, real-time booking status",
  "Convenient account and reservation management",
];
