import {DomElement} from "domhandler";
import {extractText} from "../helper";

export const getByValuePattern = (element: DomElement, dtLogic = false): string => {
  if (element.type != 'tag') return '';

  // if has value class
  if (element.attribs['class'] && element.attribs.class.split(' ').includes('value')) {

    if(['img', 'area'].includes(element.name) && 'alt' in element.attribs) {
      return element.attribs.alt;
    }
    if('data' == element.name && 'value' in element.attribs) {
      return element.attribs.value;
    }
    if('abbr' == element.name && 'title' in element.attribs) {
      return element.attribs.title;
    }

    if(dtLogic && ['del', 'ins', 'time'].includes(element.name) && 'datetime' in element.attribs) {
      return element.attribs.datetime;
    }

    return extractText(element);
  }

  let value: string = '';
  element.children.forEach(child => value += getByValuePattern(child, dtLogic));
  return value;
};
