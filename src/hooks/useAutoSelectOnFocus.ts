import { useRef, useEffect, type RefObject } from 'react';

export function useAutoSelectOnFocus<T extends HTMLInputElement | HTMLTextAreaElement>(): RefObject<T | null> {
	const ref = useRef<T | null>(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const handleFocus = () => {
			node.select();
		};

		node.addEventListener('focus', handleFocus);
		return () => {
			node.removeEventListener('focus', handleFocus);
		};
	}, []);

	return ref;
}
