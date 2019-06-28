import {DomElement, DomHandler, Parser} from 'htmlparser2';
import {ParsedResultSet, ResultSet} from "./ResultSet";

export const parse = async (htmlFragment: string, baseUrl: string): Promise<ResultSet> => {
  return new Promise<ResultSet>((resolve) => {

    var handler = new DomHandler((error, dom: DomElement[]) => {
      let result = new ParsedResultSet(dom, baseUrl);
      resolve(result);
    }, {});

    new Parser(handler, {}).end(htmlFragment);
  });
};
