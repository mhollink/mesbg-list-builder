import type { WebStorage } from "redux-persist";

export const storage: WebStorage = {
    getItem(key) {
        return Promise.resolve(window.localStorage.getItem(key));
    },

    setItem(key, value) {
        window.localStorage.setItem(key, value);
        return Promise.resolve();
    },

    removeItem(key) {
        window.localStorage.removeItem(key);
        return Promise.resolve();
    },
};