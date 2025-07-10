export class AbortControllerMap {
	private map: Map<string, AbortController>;

	constructor() {
		this.map = new Map();
	}

	public start(key: string) {
		if (this.map.has(key)) this.map.get(key)!.abort();
		const abortController = new AbortController();
		this.map.set(key, abortController);
		return abortController;
	}

	public finish(key: string, abortController: AbortController) {
		if (this.map.get(key) === abortController) this.map.delete(key);
	}
}

export async function awaitWithAbort<T>(promise: Promise<T>, abortController: AbortController): Promise<T> {
	return await Promise.race([
		promise,
		new Promise<T>((_, reject) =>
			abortController.signal.addEventListener("abort", () => reject(new Error("abort")), { once: true })
		)
	]);
}
