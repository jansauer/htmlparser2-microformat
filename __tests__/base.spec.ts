import { parse } from "../src/index";

const options = {
  baseUrl: "https://example.com",
};

test("empty imput", async () => {
  const htmlFragment = "";
  const result = await parse(htmlFragment, options.baseUrl);

  expect(result).toMatchObject({
    items: [],
    rels: {},
    "rel-urls": {}
  });
});

test("only text input", async () => {
  const htmlFragment = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consequat nisl quis lacus pretium pellentesque ut vehicula dui.";
  const result = await parse(htmlFragment, options.baseUrl);

  expect(result).toMatchObject({
    items: [],
    rels: {},
    "rel-urls": {}
  });
});
