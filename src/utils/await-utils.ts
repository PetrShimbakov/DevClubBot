export async function awaitWithAbort<T>(promise: Promise<T>, abortController: AbortController): Promise<T> {
	return await Promise.race([
		promise,
		new Promise<T>((_, reject) =>
			abortController.signal.addEventListener("abort", () => reject(new Error("abort")), { once: true })
		)
	]);
}
