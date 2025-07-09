export function getNextPage(current: number, total: number) {
	return current >= total ? 1 : current + 1;
}
export function getPrevPage(current: number, total: number) {
	return current <= 1 ? total : current - 1;
}
