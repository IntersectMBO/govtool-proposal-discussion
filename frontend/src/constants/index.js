// This file consolidates default values and constants used throughout the application,
// such as pagination settings (size and default page), default locale, and more.
// These constants ensure uniform behavior and settings across different parts of the app.
// Refer to this file to use or update default configurations for consistent application functionality.
import {
    IconAcademicCap,
    IconViewGrid
} from '@intersect.mbo/intersectmbo.org-icons-set';

// Define an array of available language locales for the application.
export const locales = ["en", "de"];

// Set the default language locale for the application.
export const defaultLocale = "en";

// Sidebar items
export const navItems = [
	{
		name: 'Dashboard',
		icon: <IconViewGrid width="24" height="24" />,
		path: '/',
		id: 'sidebar-dashboard',
	},
	{
		name: 'DRep Directory',
		icon: <IconAcademicCap width="24" height="24" />,
		path: '/drep-directory',
		id: 'sidebar-drep-directory',
	},
    {
		name: 'Proposed Governance Actions',
		icon: <IconAcademicCap width="24" height="24" />,
		path: '/proposed-governance-actions',
		id: 'sidebar-proposed-governance-actions',
	},
    {
		name: 'Guides',
		icon: <IconAcademicCap width="24" height="24" />,
		path: '/guides',
		id: 'sidebar-guides',
	},
    {
		name: 'FAQs',
		icon: <IconAcademicCap width="24" height="24" />,
		path: '/faq',
		id: 'sidebar-faq',
	},
];
