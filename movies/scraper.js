const cheerio = require('cheerio');

module.exports = {
    /**
     * Parse a catalog page (homepage or category) to return a list of movies/shows
     * @param {string} url - The URL of the catalog page
     * @returns {Array} List of extracted items
     */
    parseCatalog: async (url) => {
        const res = await fetch(url);
        const html = await res.text();
        const $ = cheerio.load(html);
        const results = [];
        
        $('.videos > .video').each((i, el) => {
            results.push({
                id: encodeURIComponent($(el).attr('href')),
                title: $(el).find('.vtitle').text().trim(),
                logo: $(el).attr('data-bg'),
                url: $(el).attr('href')
            });
        });
        
        return results;
    },

    /**
     * Extract stream links from the movie detail page
     * @param {string} movieUrl - The URL of the movie
     * @returns {Array} List of stream objects containing video URLs
     */
    extractStreams: async (movieUrl) => {
        const res = await fetch(movieUrl);
        const html = await res.text();
        const streams = [];
        
        // Example fallback to basic regex (like your old manifest):
        const match = html.match(/<source src="([^"]+)"/i);
        if (match && match[1]) {
            streams.push({
                title: "Stream",
                url: match[1]
            });
        }

        return streams;
    }
};
