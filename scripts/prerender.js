const { chromium } = require('playwright');

(async () => {
    // URL of your sitemap file
    const sitemapUrl = 'https://example.com/sitemap.xml';

    // Create a browser instance
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Fetch the sitemap
    const response = await page.goto(sitemapUrl);
    const xml = await response.text();

    // Parse the sitemap XML
    const urls = xml.match(/<loc>(.*?)<\/loc>/g).map(url => url.replace(/<\/loc>/, '').replace(/<loc>/, '').trim());

    // Pre-render each URL and save the results to HTML files
    for (const url of urls) {
        await page.goto(url);
        const metaTags = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('meta')).map(meta => {
                return {
                    name: meta.getAttribute('name'),
                    content: meta.getAttribute('content'),
                    property: meta.getAttribute('property')
                };
            });
        });

        const html = await page.content();

        // Create a file name based on the URL
        const fileName = url.replace('https://', '').replace('http://', '').replace(/\//g, '-') + '.html';

        // Save the HTML content and meta tags to a file
        console.log(`Saving ${fileName}...`);
        const fs = require('fs');
        fs.writeFileSync(`./prerendered/${fileName}`, `<meta charset="utf-8">\n` + metaTags.map(tag => `<meta ${tag.name ? `name='${tag.name}'` : `property='${tag.property}'` } content='${tag.content}' />`).join('\n') + `\n` + html);
    }

    await browser.close();
})();
