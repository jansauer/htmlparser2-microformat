/**
 * TODO
 */
import {DomElement} from "domhandler";
import {extractText} from "./helper";

export interface Rel {

  rels: string[];

  hreflang: string;
  media: string;
  title: string;
  type: string;
  text: string;
}

/**
 * TODO
 */
export class ParsedRel implements Rel {

  href: string;

  rels: string[];

  hreflang: string;
  media: string;
  title: string;
  type: string;
  text: string;

  constructor(element: DomElement) {
    this.href = this.getNonEmptyAttribute(element, 'href');

    this.rels = element.attribs['rel'].split(' ');

    this.hreflang = this.getNonEmptyAttribute(element, 'hreflang');
    this.media = this.getNonEmptyAttribute(element, 'media');
    this.title = this.getNonEmptyAttribute(element, 'title');
    this.type = this.getNonEmptyAttribute(element, 'type');

    this.text = extractText(element);
  }

  getNonEmptyAttribute(element: DomElement, name: string) {
    if (element.attribs[name] && element.attribs[name] != '') {
      return element.attribs[name];
    }
  }
}
