const Parser = require('rss-parser');

module.exports = async function() {
  const parser = new Parser();
  
  try {
    const feed = await parser.parseURL('https://www.instapaper.com/starred/rss/1589271/UcsfqOfBhmG8DllCxud7mardXtA');
    
    // Transform RSS items to a simpler format
    return feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.contentSnippet || item.content,
      guid: item.guid
    }));
  } catch (error) {
    console.error('Error fetching Instapaper feed:', error);
    return []; // Return empty array if fetch fails
  }
};
