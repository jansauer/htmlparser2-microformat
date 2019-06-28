import {Microformat} from "./types";
import {DomElement} from "domhandler";
import {extractImage, resolveUrl, extractText} from "./helper";
import {findMicroformatTypes} from "./ResultSet";
import {getByValuePattern} from "./util/value";

/**
 * TODO
 */
export interface Microformat {

  type: string[];

  properties: {};

  value: string;
}

/**
 * TODO
 */
export class ParsedMicroformat implements Microformat {

  type: string[];

  properties: {} = {};

  children: ParsedMicroformat[] = [];

  value: string;

  private baseUrl: string;

  constructor(type: string[], element: DomElement, baseUrl: string) {
    this.type = type;
    this.baseUrl = baseUrl;


    // start searching all children for properties
    element.children.forEach((child: DomElement) => this.searchForProperties(child));

    /*
     * parsing for implied properties
     */

    if (!('name' in this.properties)) {
      this.searchForImpliedNameProperty(element);
    }

    if (!('photo' in this.properties)) {
      this.searchForImpliedPhotoProperty(element);
    }

    if (!('url' in this.properties)) {
      this.searchForImpliedUrlProperty(element);
    }
  }

  /**
   *
   * @param element
   */
  searchForProperties(element: DomElement) {
    if (element.type == 'tag') {

      // ignore tags that don't end up in the DOM
      if (element.name == 'template') {
        return;
      }

      const properties = findPropertyMatches(element);
      const types = findMicroformatTypes(element);

      if (properties.length > 0) {
        // process all found properties
        properties.forEach((match: any) => {
          const propertyName: string = match.groups.name;

          if (types.length > 0) {
            const microformat = new ParsedMicroformat(types, element, this.baseUrl);

            console.log('HITT');
            console.log(match.groups.type);


            if (match.groups.type === 'p') microformat.value = microformat.properties['name'][0];
            this.pushProperty(propertyName, microformat);

          } else {
            // search for property value
            const searchMethodeName: string = `searchFor${match.groups.type.toUpperCase()}Value`;
            this[searchMethodeName](match.groups.name, element);
          }
        });
      } else if (types.length > 0) {
        const microformat = new ParsedMicroformat(types, element, this.baseUrl);
        this.children.push(microformat);
      }

      // proceed with recursively searching the html subtree for properties
      if (types.length == 0) {
        element.children.forEach(child => this.searchForProperties(child));
      }
    }
  }

  /**
   * Search for
   */
  searchForPValue(propertyName: string, element: DomElement) {
    let value: string = '';

      element.children.forEach(child => {
        if (child.type == 'tag') {

          // ignore tags that don't end up in the DOM
          if (child.name == 'template') {
            return;
          }

          if (!!child.attribs.class) {
            if (child.attribs.class.split(' ').includes('value')) {
              value += extractText(child).trim();
            } else if (child.attribs.class.split(' ').includes('value-title')) {
              // the value-title feature is under consideration for deprecation
              value += child.attribs['title'];
            }
          }
        }
      });
    if(value == '' && ['abbr', 'link'].includes(element.name) && 'title' in element.attribs) {
      value = element.attribs.title;
    } else if(['data', 'input'].includes(element.name) && 'value' in element.attribs) {
      value = element.attribs.value;
    } else if(['img', 'area'].includes(element.name) && 'alt' in element.attribs) {
      value = element.attribs.alt;
    } else if(value == '') {
      value = extractText(element).trim();
    }

    this.pushProperty(propertyName, value);
  }

  /**
   * Search for
   */
  searchForUValue(propertyName: string, element: DomElement) {
    let value: string | {value, alt} = null;

    if ('href' in element.attribs) {
      value = element.attribs.href;
    } else if ('img' == element.name && 'src' in element.attribs) {

      if ('alt' in element.attribs) {
        value = {
          value: element.attribs.src,
          alt: element.attribs.alt
        }
      } else {
        value = element.attribs.src;
      }

    } else if(['video'].includes(element.name) && 'poster' in element.attribs) {
      value = element.attribs.poster;
    } else if(['object'].includes(element.name) && 'data' in element.attribs) {
      value = element.attribs.data;
    } else {
      element.children.forEach(child => {
        // ignore tags that don't end up in the DOM
        if (child.name == 'template') {
          return;
        }

        if (child.attribs.class.split(' ').includes('value')) {
          value += extractText(child).trim();
        } else if (child.attribs.class.split(' ').includes('value-title')) {
          // the value-title feature is under consideration for deprecation
          value += child.attribs['title'];
        }
      });
    }

    if(value == null && ['abbr'].includes(element.name) && 'title' in element.attribs) {
      value = element.attribs.title;
    } else if(['data', 'input'].includes(element.name) && 'value' in element.attribs) {
      value = element.attribs.value;
    } else if(value == null) {
      value = extractText(element).trim();
    }

    value = resolveUrl(this.baseUrl, value);
    this.pushProperty(propertyName, value);
  }

  /**
   * Search for
   */
  searchForDTValue(propertyName: string, element: DomElement) {
    let value: string = null;

    value = getByValuePattern(element, true);
    console.log('# End');

    if(['time', 'ins', 'del'].includes(element.name) && 'datetime' in element.attribs) {
      value = element.attribs.datetime;
    } else if(['abbr'].includes(element.name) && 'title' in element.attribs) {
      value = element.attribs.title;
    } else if(!value && ['data', 'input'].includes(element.name) && 'value' in element.attribs) {
      value = element.attribs.value;
    } else {
      // value = parse(element.outerHTML).text // TODO: removing all leading/trailing whitespace and nested <script> & <style> elements.
    }

    if (value != null) {
      this.pushProperty(propertyName, value);
    }
  }

  /**
   * Search for
   */
  searchForEValue(propertyName: string, element: DomElement) {
    this.pushProperty(propertyName, {
      value: extractText(element).trim(),
      html: extractHtml(element)
    });
  }

  /**
   * Search for implied 'name' property
   */
  searchForImpliedNameProperty(element: DomElement) {
    let value: string = null;

    if (['img', 'area'].includes(element.name) && 'alt' in element.attribs) {
      value = element.attribs.alt;
    } else if (['abbr'].includes(element.name) && 'title' in element.attribs) {
      value = element.attribs.title;
    }

    if (value == null) {
      value = getOnlyTagValue(element, 'img', 'alt');
    }
    if (value == null) {
      value = getOnlyTagValue(element, 'area', 'alt');
    }
    if (value == null) {
      value = getOnlyTagValue(element, 'abbr', 'title');
    }

    if (value == null) {
      value = getOnlyChildAndOnlyTagValue(element, 'img', 'alt');
    }
    if (value == null) {
      value = getOnlyChildAndOnlyTagValue(element, 'area', 'alt');
    }
    if (value == null) {
      value = getOnlyChildAndOnlyTagValue(element, 'abbr', 'title');
    }

    if (value == null) {
      value = extractText(element).trim();
    }

    this.pushProperty('name', value);
  }

  /**
   * Search for implied 'photo' property
   */
  searchForImpliedPhotoProperty(element: DomElement) {
    let value: string | { value, alt } = null;

    if ('img' === element.name && 'src' in element.attribs) {
      value = extractImage(element);
    } else if ('object' === element.name && 'data' in element.attribs) {
      value = element.attribs.data;
    }

    if (value == null) {
      value = getOnlyTagValue(element, 'img', 'src');
    }
    if (value == null) {
      value = getOnlyTagValue(element, 'object', 'data');
    }

    if (value == null) {
      value = getOnlyChildAndOnlyTagValue(element, 'img', 'src');
    }
    if (value == null) {
      value = getOnlyChildAndOnlyTagValue(element, 'object', 'data');
    }

    if (value != null) {
      value = resolveUrl(this.baseUrl, value);
      this.pushProperty('photo', value);
    }
  }

  /**
   * Search for implied 'url' property
   */
  searchForImpliedUrlProperty(element: DomElement) {
    let value: string | { value: string, alt } = null;

    if (['a', 'area'].includes(element.name) && 'href' in element.attribs) {
      value = element.attribs.href;
    }

    if (value == null) {
      value = getOnlyTagValue(element, 'a', 'href');
    }
    if (value == null) {
      value = getOnlyTagValue(element, 'area', 'href');
    }

    if (value == null) {
      value = getOnlyChildAndOnlyTagValue(element, 'a', 'href');
    }
    if (value == null) {
      value = getOnlyChildAndOnlyTagValue(element, 'area', 'href');
    }

    if (value != null) {
      value = resolveUrl(this.baseUrl, value);
      this.pushProperty('url', value);
    }
  }

  pushProperty(name: string, value: string | { value, alt } | { value, html } | ParsedMicroformat) {
    if (name in this.properties) {
      this.properties[name].push(value);
    } else {
      this.properties[name] = [ value ];
    }
  }
}

/**
 * Regex for a single microformat property
 */
const propertiesRegex = /^(?<type>p|u|dt|e)-(?<name>([0-9a-z]+-)?([a-z]+-)*([a-z]+)+)$/;

/**
 * Find microformat properties in the class names of a dom element
 *
 * @param element
 */
export const findPropertyMatches = (element: DomElement): RegExpMatchArray[] => {
  if (element.attribs['class']) {
    return element.attribs['class']
      .split(' ')
      .map(substring => substring.match(propertiesRegex))
      .filter(x => x);
  }
  return [];
};

export const extractHtml = (element: DomElement, includeTags = false): string => {
  if (element.type == 'text') {
    return element.data;
  }

  let text: string = '';

  if (includeTags) {

    // open start tag
    text = '<' + element.name;

    // add attributes
    for (let key in element.attribs) {
      text += ` ${key}="${element.attribs[key]}"`
    }

    text += '>';

  }

  element.children.forEach(child => text += extractHtml(child, true));

  if (includeTags) {
    text += '</' + element.name + '>';
  } else {
    text = text.trim();
  }

  return text;
};

export const getOnlyTagElement = (element: DomElement, tagName: string, attributeName: string): DomElement => {
  let result: DomElement = null;

  element.children.forEach(child => {
    if (child.name == tagName && attributeName in child.attribs) {

      if (result == null) {
        result = child;
      } else {
        result = null;
        return;
      }

    }
  });
  return result;
};

export const getOnlyTagValue = (element: DomElement, tagName: string, attributeName: string): string => {
  let match: DomElement = getOnlyTagElement(element, tagName, attributeName);

  if (match != null) {
    return match.attribs[attributeName];
  }
  return null;
};

export const getOnlyChildAndOnlyTagElement = (element: DomElement, tagName: string, attributeName: string) => {
  if (element.children.length == 1 && element.children[0].type == 'tag') {
    return getOnlyTagElement(element.children[0], tagName, attributeName);
  }
  return null;
};

export const getOnlyChildAndOnlyTagValue = (element: DomElement, tagName: string, attributeName: string): string => {
  let match: DomElement = getOnlyChildAndOnlyTagElement(element, tagName, attributeName);

  if (match != null) {
    return match.attribs[attributeName];
  }
  return null;
};
