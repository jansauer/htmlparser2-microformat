import {DomElement} from "domhandler";
import {resolve} from "url";

export const extractText = (element: DomElement): string => {
  if (element.type == 'text') {
    return element.data;
  }

  let text: string = '';

  if (['template', 'script', 'style'].includes(element.name)) {
    return text;
  }

  element.children.forEach(child => text += extractText(child));
  return text;
};

export const extractImage = (baseUrl: string, element: DomElement): {value: string, alt: string} | string => {
  const src: string = absolute(baseUrl, element.attribs.src);
  if ('alt' in element.attribs) {
    return {
      alt: element.attribs.alt,
      value: src
    };
  }
  return src;
};

export const absolute = (baseUrl: string, url: string): string => {

  // do nothing if already absolute
  if (/^[a-z][a-z\d+.-]*:/.test(url)) return url;

  return resolve(baseUrl, url as string);
};

export const resolveUrl = (baseUrl: string, url: string | { value: string, alt }): string | { value: string, alt } => {
  if (url['value']) {
    url['value'] = resolve(baseUrl, url['value'] as string);
    return url;
  }

  return resolve(baseUrl, url as string);
};
