// utils.js
// This file is designed to house small, reusable utility functions that serve as building blocks for constructing more complex functionalities within the application.
// It includes a range of generic helpers for tasks like data manipulation, formatting, and validation.
// Additionally, this file may contain functions for testing purposes, providing a toolkit for verifying the correctness and efficiency of larger functions.
// By centralizing these utilities, we promote a modular and maintainable codebase, facilitating ease of development and testing.

export const formatIsoDate = (isoDate) => {
	if (!isoDate) return "";
	const date = new Date(isoDate);
	let dateString = new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "long",
		year: "numeric",
	})
		?.format(date)
		?.replace(",", "");
	let parts = dateString.split(" ");
	return parts[1] + " " + parts[0] + " " + parts[2];
};
