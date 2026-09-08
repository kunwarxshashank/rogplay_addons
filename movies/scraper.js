// scraper.js
const cheerio = require('cheerio');

async function getCatalogs(url) {
    const html = await (await fetch(url)).text();
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
}

async function getStreams(movieUrl) {
    const html = await (await fetch(movieUrl)).text();
    const streams = [];
    
    // Custom logic to bypass embedders or extract sources
    const match = html.match(/<source src="([^"]+)"/i);
    if (match && match[1]) {
        streams.push({
            title: "Direct Stream",
            url: match[1]
        });
    }

    return streams;
}

// Export functions for the sandbox
module.exports = {
    getCatalogs,
    getStreams
};
