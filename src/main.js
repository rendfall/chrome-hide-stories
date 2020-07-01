const STORIES_SELECTOR_QUERIES = [
    '[id="fb_stories_card_root"]', // Classic theme (before ?.2019)
    '[aria-label="Stories"]', // Light/Dark Mode theme (after ?.2019)
    '[data-pagelet="Stories"]', // Light/Dark Mode theme (after 07.2020)
];
const ERROR_NOT_FOUND_MSG = 'Timeout: No Stories has been found';
const DEFAULT_OPTIONS = {
    timeout: 0.25 * 1000,
    limit:  20 * 1000,
};

function removeAll($selectors) {
    $selectors
        .forEach(($selector) => $selector.remove());
}

function parseOptions(options = {}) {
    return Object.assign({}, DEFAULT_OPTIONS, options);
}

function getAllSelectors(selectorsQuery, options = {}) {
    return new Promise((resolve, reject) => {
        const { timeout, limit } = parseOptions(options);
        const query = selectorsQuery.join(',');
        let ts = 0;

        let taskId = setInterval(() => {
            const $selectors = document.querySelectorAll(query);

            if ($selectors.length > 0) {
                clearInterval(taskId);
                resolve($selectors);
            }

            if (ts >= limit) {
                clearInterval(taskId);
                reject(new Error(ERROR_NOT_FOUND_MSG));
            }

            ts += timeout;
        }, timeout);
    });
}

getAllSelectors(STORIES_SELECTOR_QUERIES)
    .then(($selectors) => removeAll($selectors))
    .catch((err) => {
        console.warn(err);
    });
