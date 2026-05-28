import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
	BottomSheet,
	BottomSheetContent,
	BottomSheetHandle,
	BottomSheetTitle,
} from './bottom-sheet';

function renderSheet(props?: {
	dismissThresholdPx?: number;
	enableDrag?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const onOpenChange = props?.onOpenChange ?? vi.fn();
	render(
		<BottomSheet open onOpenChange={onOpenChange}>
			<BottomSheetContent
				dismissThresholdPx={props?.dismissThresholdPx}
				enableDrag={props?.enableDrag}
			>
				<BottomSheetHandle />
				<BottomSheetTitle>Mobile actions</BottomSheetTitle>
				<button type="button">Inner action</button>
			</BottomSheetContent>
		</BottomSheet>
	);
	return { onOpenChange };
}

describe('BottomSheet (#314)', () => {
	it('renders with a drag handle and a default close button', () => {
		renderSheet();
		expect(screen.getByTestId('bottom-sheet-handle')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Close panel' })).toBeInTheDocument();
		// The Title is announced.
		expect(screen.getByText('Mobile actions')).toBeInTheDocument();
	});

	it('close button dismisses the sheet via Radix onOpenChange', () => {
		const { onOpenChange } = renderSheet();
		screen.getByRole('button', { name: 'Close panel' }).click();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('drag past the threshold dismisses the sheet', () => {
		const { onOpenChange } = renderSheet({ dismissThresholdPx: 50 });
		const handle = screen.getByTestId('bottom-sheet-handle');

		fireEvent.pointerDown(handle, { pointerId: 1, clientY: 100, button: 0 });
		fireEvent.pointerMove(handle, { pointerId: 1, clientY: 220 });
		fireEvent.pointerUp(handle, { pointerId: 1, clientY: 220 });

		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('short drag below the threshold does NOT dismiss', () => {
		const { onOpenChange } = renderSheet({ dismissThresholdPx: 150 });
		const handle = screen.getByTestId('bottom-sheet-handle');

		fireEvent.pointerDown(handle, { pointerId: 1, clientY: 100, button: 0 });
		fireEvent.pointerMove(handle, { pointerId: 1, clientY: 130 }); // 30px
		fireEvent.pointerUp(handle, { pointerId: 1, clientY: 130 });

		expect(onOpenChange).not.toHaveBeenCalledWith(false);
	});

	it('upward drag is clamped and never dismisses', () => {
		const { onOpenChange } = renderSheet({ dismissThresholdPx: 30 });
		const handle = screen.getByTestId('bottom-sheet-handle');

		fireEvent.pointerDown(handle, { pointerId: 1, clientY: 200, button: 0 });
		fireEvent.pointerMove(handle, { pointerId: 1, clientY: 80 }); // -120
		fireEvent.pointerUp(handle, { pointerId: 1, clientY: 80 });

		expect(onOpenChange).not.toHaveBeenCalledWith(false);
	});

	it('enableDrag=false leaves the close button as the only dismissal path', () => {
		const { onOpenChange } = renderSheet({
			enableDrag: false,
			dismissThresholdPx: 30,
		});
		const handle = screen.getByTestId('bottom-sheet-handle');
		fireEvent.pointerDown(handle, { pointerId: 1, clientY: 100, button: 0 });
		fireEvent.pointerMove(handle, { pointerId: 1, clientY: 400 });
		fireEvent.pointerUp(handle, { pointerId: 1, clientY: 400 });
		expect(onOpenChange).not.toHaveBeenCalledWith(false);

		// Close button still works.
		screen.getByRole('button', { name: 'Close panel' }).click();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});
