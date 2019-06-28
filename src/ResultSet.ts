import {Rel} from "./types";
import { DomElement } from "domhandler";
import {Microformat, ParsedMicroformat} from "./Microformat";
import {extractText} from "./helper";
import {ParsedRel} from "./Rel";

/**
 * TODO
 */
export interface ResultSet {

  /**
   * List of top level microformats found
   */
  items: Microformat[];

  rels: { [rel: string]: string };
  "rel-urls": { [url: string]: Rel };
}

/**
 * TODO
 */
export class ParsedResultSet implements ResultSet {
  items: Microformat[] = [];

  rels = {};

  "rel-urls": { [url: string]: ParsedRel } = {};

  private baseUrl: string;

  constructor(dom: DomElement[], baseUrl: string) {
    this.baseUrl = baseUrl;
    // const base = (root as HTMLElement).querySelector('base');
//   if (base !== null && 'href' in base.attributes) {
//     result.baseUrl = base.attributes['href'];
//   }

    dom.forEach(element => this.searchForMicroformat(element));
  }

  /**
   * Recursively search the dom elements for microformats.
   *
   * @param element
   */
  searchForMicroformat(element: DomElement) {
    if (element.type == 'tag') {

      // ignore tags that don't end up in the DOM
      if (element.name == 'template') {
        return;
      }

      // set baseurl
      // TODO: only if not done yet
      // TODO: can be relative
      if (element.name == 'base' && 'href' in element.attribs) {
        this.baseUrl = element.attribs.href;
      }

      if ('rel' in element.attribs && element.attribs['rel'] != '') {
        this.pushRel(new ParsedRel(element));
      }

      const types = findMicroformatTypes(element);
      // console.debug(`${element.name}\t Found types: ${types}`);

      if (types.length > 0) {
        // found microformat class name and start parsing it
        const microformat = new ParsedMicroformat(types, element, this.baseUrl);
        this.items.push(microformat);

      } else {
        // proceed with recursively searching the html subtree for initial microformats
        element.children.forEach(child => this.searchForMicroformat(child));
      }
    }
  }

  pushRel(subject: ParsedRel) {
    if (subject.href in this["rel-urls"]) {

    } else {
      this["rel-urls"][subject.href] = subject;
    }

    subject.rels.forEach((rel: string) => {
      if (rel in this.rels) {
        if(this.rels[rel].indexOf(subject.href) == -1) {
          this.rels[rel].push(subject.href);
        }
      } else {
        this.rels[rel] = [ subject.href ];
      }
    });

  }
}

/**
 * Regex for microformat types in a space separated list of class names
 *
 * Inclueds named matching groups but are not used since `matchAll` is not jet
 * implemented in node.js.
 */
export const microformatRegex = /^(?<type>h-([0-9a-z]+-)?([a-z]+-)*([a-z]+)+)$/;

/**
 * Find microformat types in the class names of a dom element
 *
 * @param element
 */
export const findMicroformatTypes = (element: DomElement): string[] => {
  if (element.attribs['class']) {
    return element.attribs['class']
      .split(' ')
      .filter(substring => microformatRegex.test(substring))
      .sort();
  }
  return [];


  // if (element.attribs['class']) {
  //   const matches = element.attribs['class']
  //     .match(microformatRegex);
  //
  //   // ¯\_(ツ)_/¯ matches may be null and no empty array
  //   if(matches != null) {
  //     return matches.sort();
  //   }
  // }
  // return [];
};
