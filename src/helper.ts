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

export const extractImage = (element: DomElement): {value: string, alt: string} | string => {
  if ('alt' in element.attribs) {
    return {
      alt: element.attribs.alt,
      value: element.attribs.src
    };
  }
  return element.attribs.src;
};

export const resolveUrl = (baseUrl: string, url: string | { value: string, alt }): string | { value: string, alt } => {
  if (url['value']) {
    url['value'] = resolve(baseUrl, url['value'] as string);
    return url;
  }

  return resolve(baseUrl, url as string);
};
