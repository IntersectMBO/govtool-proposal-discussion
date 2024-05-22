// The "use client" directive indicates that this module is intended to run in the client environment,
// which is particularly relevant for Next.js applications that support server-side rendering (SSR).
'use client';
import { getDataFromSession } from '@/lib/helpers';
import { useEffect, useState } from 'react';
import { getLoggedInUserInfo } from '@/lib/api';

// Import createContext and useContext hooks from React to create and consume the context.
import { createContext, useContext } from 'react';

// Create a new Context object. This will be used to provide and consume the context.
const AppContext = createContext();

// Define a provider component. This component will wrap the part of your app where you want the context to be accessible.
export function AppContextProvider({ children }) {
	const [user, setUser] = useState();
	const [loading, setLoading] = useState(false); // State to manage loading status.

	const handleRefresh = async () => {
		try {
			setLoading(true);
			if (getDataFromSession('pdfUserJwt')) {
				const user = await getLoggedInUserInfo();
				if (user) {
					setUser({ user: user });
				}
			}
		} catch (error) {
			setLoading(false);
			console.error(error);
			throw new Error('Authentication failed');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		handleRefresh();
	}, []);

	// Render the provider component of your context, passing in the values or functions as the value prop.
	// Any child components will be able to access these values via the useAppContext hook.
	return (
		<AppContext.Provider
			value={{
				user,
				setUser,
				loading,
				setLoading, // Provide loading state and its setter to the context.
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

// Define a custom hook to provide a convenient way to access the context values.
// This hook abstracts away the useContext hook specifically for this context.
export function useAppContext() {
	const context = useContext(AppContext);

	// Perform a check to ensure that this hook is used within a component wrapped in AppContextProvider.
	// This helps prevent errors from occurring if the context is used outside of the provider.
	if (context === undefined) {
		throw new Error(
			'useAppContext must be used within a AppContextProvider'
		);
	}

	// Return the context value, making it accessible to components that call this hook.
	return context;
}
