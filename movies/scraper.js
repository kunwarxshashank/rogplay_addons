const cheerio = require('cheerio');

module.exports = {
    /**
     * Parse a catalog page (homepage or category) to return a list of movies/shows
     * @param {string} url - The URL of the catalog page
     * @returns {Promise<Array>} List of extracted items
     */
    parseCatalog: function(url) {
        return fetch(url)
            .then(function(res) { return res.text(); })
            .then(function(html) {
                const $ = cheerio.load(html);
                const results = [];

                $('.videos > .video').each(function(i, el) {
                    results.push({
                        id: encodeURIComponent($(el).attr('href')),
                        title: $(el).find('.vtitle').text().trim(),
                        logo: $(el).attr('data-bg'),
                        url: $(el).attr('href')
                    });
                });

                return results;
            });
    },

    /**
     * Extract stream links from the movie detail page
     * @param {string} movieUrl - The URL of the movie
     * @returns {Promise<Array>} List of stream objects containing video URLs
     */
    extractStreams: function(movieUrl) {
        return fetch(movieUrl)
            .then(function(res) { return res.text(); })
            .then(function(html) {
                const streams = [];

                // Example fallback to basic regex:
                const match = html.match(/<source src="([^"]+)"/i);
                if (match && match[1]) {
                    streams.push({
                        title: "Stream",
                        url: match[1]
                    });
                }

                return streams;
            });
    }
};

