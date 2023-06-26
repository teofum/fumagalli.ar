import fetch from 'node-fetch';
import fs from 'node:fs/promises';

const SUDOKU_REGEX = /iGridUnsolved= new Array\(((\d,){80}\d)\)/;
const NUMBER_TO_SCRAPE = 2000;
const OUTPUT_FILE = 'out.json';

async function fetchSite(url: string) {
  const res = await fetch(url);

  return await res.text();
}

async function scrape() {
  const results: { name: string; data: number[] }[] = [];

  for (let i = 0; i < NUMBER_TO_SCRAPE; i++) {
    const date = new Date(); // Today
    date.setDate(date.getDate() - i); // i days back
    const dateStr = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;

    let n = 2 - i;
    while (n < 1) n += 5;

    const url = `https://sudoku.com.au/${n}E${dateStr}-sudoku.aspx`;

    const test = await fetchSite(url);
    const match = test.match(SUDOKU_REGEX);

    if (match) {
      const data = match[1].split(',').map(Number);
      results.push({ name: dateStr, data });
      console.log(
        'Scraped sudoku from',
        url,
        '(',
        (((i + 1) / NUMBER_TO_SCRAPE) * 100).toFixed(2),
        '% done)',
      );
    } else console.log('Oops! Found nothing in', url);
  }

  const data = JSON.stringify(results);

  try {
    await fs.writeFile(OUTPUT_FILE, data);
    console.log(
      'All done! Saved',
      results.length,
      'stolen sudokus to',
      OUTPUT_FILE,
    );
  } catch (err) {
    console.log('Shit!', err);
  }
}

scrape();
