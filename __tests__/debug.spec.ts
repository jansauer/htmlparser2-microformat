import {parse} from "../src";
import {readFileSync} from "fs";
import {join} from "path";

const options = {
  baseUrl: "https://example.com",
};

test('debug', async () => {
  // insert test file here:
  const file: string = join(__dirname, '../tests/tests/microformats-v2/h-event/time');

  const htmlFragment: string = readFileSync(file + '.html', 'utf8');
  const jsonSnapshot: string = JSON.parse(readFileSync(file + '.json', 'utf8'));

  const result = await parse(htmlFragment, options.baseUrl);
  expect(result).toMatchObject(jsonSnapshot);
});
