/**
 * Collection of utility methods.
 * Used throughout the application.
 */
export default class Utils {
        /** Returns a random integer in the range [min, max]. */
	static randInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

        /** Shuffles an array (Fisher–Yates algorithm). */
	static shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Utils.randInt(0, i);
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
}