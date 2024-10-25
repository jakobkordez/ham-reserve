export function uppercaseInput(element: HTMLInputElement) {
	function onInput() {
		const selStart = element.selectionStart;
		const selEnd = element.selectionEnd;
		element.value = element.value.toUpperCase();
		element.setSelectionRange(selStart, selEnd);
	}
	element.addEventListener('input', onInput);
	return {
		destroy() {
			element.removeEventListener('input', onInput);
		}
	};
}

export function filteredInput(pattern: RegExp) {
	function filter(element: HTMLInputElement) {
		function onInput() {
			const val = element.value;
			const sel = element.selectionStart ?? 0;
			const newSel = val.slice(0, sel).replace(pattern, '').length;
			element.value = val.replace(pattern, '');
			element.setSelectionRange(newSel, newSel);
		}
		element.addEventListener('input', onInput);
		return {
			destroy() {
				element.removeEventListener('input', onInput);
			}
		};
	}

	return filter;
}

export function numberInput(element: HTMLInputElement) {
	return filteredInput(/[^0-9]/g)(element);
}

export function callsignInput(element: HTMLInputElement) {
	const a = uppercaseInput(element);
	const b = filteredInput(/[^A-Z0-9/]/g)(element);
	return {
		destroy() {
			a.destroy();
			b.destroy();
		}
	};
}

export function gridsquareInput(field: HTMLInputElement) {
	function handleInput() {
		const selStart = field.selectionStart;
		field.value = field.value.slice(0, 2).toUpperCase() + field.value.slice(2).toLowerCase();
		field.setSelectionRange(selStart, selStart);
	}
	field.addEventListener('input', handleInput);
	return {
		destroy() {
			field.removeEventListener('input', handleInput);
		}
	};
}
