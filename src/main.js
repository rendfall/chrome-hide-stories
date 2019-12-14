const STORY_SELECTOR_QUERY = '[aria-label="Stories"]';
const ERROR_NOT_FOUND_MSG = 'Timeout: No Stories has been found';
const DEFAULT_INTERVAL_MS = 0.25 * 1000;
const DEFAULT_INTERVAL_LIMIT_MS = 5 * 1000;

function searchSelector(selectorQuery, options = {}) {
    return new Promise((resolve, reject) => {
        const timeout = options.timeout || DEFAULT_INTERVAL_MS;
        const limit = options.limit || DEFAULT_INTERVAL_LIMIT_MS;
        let ts = 0;

        let taskId = setInterval(() => {
            const $selector = document.querySelector(selectorQuery);

            if ($selector !== null) {
                clearInterval(taskId);
                resolve($selector);
            }

            if (ts >= limit) {
                clearInterval(taskId);
                reject(new Error(ERROR_NOT_FOUND_MSG));
            }

            ts += timeout;
        }, timeout);
    });
}

searchSelector(STORY_SELECTOR_QUERY)
    .then(($selector) => {
        $selector.remove();
    })
    .catch((err) => {
        console.warn(err);
    });
