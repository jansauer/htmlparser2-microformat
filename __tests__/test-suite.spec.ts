import { extname, basename, join } from "path";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import {parse, } from "../src/index";

// for now only microformats version 2 is suppported 
const v2 = join(__dirname, '../test-suite/tests/microformats-v2');
const groups = readdirSync(v2, {withFileTypes: true})
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const options = {
  baseUrl: "http://microformats.org",
};

groups.forEach(group => {
  const directory = join(v2, group);
  const files = readdirSync(directory);

  describe(`${group}`, async () => {

    files.forEach(file => {
      if (extname(file) === '.json') {
  
        const name: string = basename(file);
        const htmlFragment: string = readFileSync(join(v2, group, file.replace('.json', '.html')), "utf8");
        const jsonSnapshot: string = JSON.parse(readFileSync(join(v2, group, file), "utf8"));
  
        test(`${name.replace('.json', '')}`, async () => {
          const result = await parse(htmlFragment, options.baseUrl);
          expect(result).toMatchObject(jsonSnapshot);
        });

      }
    });
  
  });

});
