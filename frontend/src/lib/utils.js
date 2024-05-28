// utils.js
// This file is designed to house small, reusable utility functions that serve as building blocks for constructing more complex functionalities within the application.
// It includes a range of generic helpers for tasks like data manipulation, formatting, and validation.
// Additionally, this file may contain functions for testing purposes, providing a toolkit for verifying the correctness and efficiency of larger functions.
// By centralizing these utilities, we promote a modular and maintainable codebase, facilitating ease of development and testing.

import { format } from 'date-fns';

export const formatIsoDate = (isoDate) => {
	if (!isoDate) return '';

	return format(new Date(isoDate), 'd MMMM yyyy');
};

export const formatIsoTime = (isoDate) => {
	if (!isoDate) return '';

	return format(new Date(isoDate), 'hh:mm aa');
};

export const formatPollDateDisplay = (dateString) => {
	if (!dateString) return '';

	return `${format(new Date(dateString), 'dd/MM/yyyy - p')} UTC`;
};
