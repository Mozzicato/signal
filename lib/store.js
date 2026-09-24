const store = globalThis.signalStore || (globalThis.signalStore = { reports: [], seen: new Set() });
export default store;
