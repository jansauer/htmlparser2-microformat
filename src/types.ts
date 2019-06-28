

export interface Microformat {
  type: string[];
  properties: {};

  value: string;
}


export interface Rel {
  rels: string[];
  text: string;
}




















// export class ParsedMicroformatResultSet implements Microformats {
//   items: Microformat[] = [];
//   rels = {};
//   "rel-urls" = {};
//
//   baseUrl: string = '';
//
//   resolveUrl = (url: string | Image): string | Image => {
//     if (url['value']) {
//       url['value'] = resolve(this.baseUrl, url['value']);
//       return url;
//     }
//     return resolve(this.baseUrl, url as string);
//   };
//
//   pushRel(url: string, rels: string[], text: string) {
//     if (this.rels && url in this.rels) {
//       this.rels[url].rels.push(...rels);
//     } else {
//       this.rels[url] = new Rel(rels, text);
//     }
//   }
// }


// export class ParsedMicroformat implements Microformat {
//
//   /**
//    * Reference back to the
//    */
//   result: ParsedMicroformatResultSet;
//
//   type: string[];
//   properties: {} = {};
//   children: ParsedMicroformat[] = [];
//
//   value: string;
//
//
//   constructor(result: ParsedMicroformatResultSet, type: string[]) {
//     this.result = result;
//     this.type = type;
//   }
//
//   pushProperty(name: string, value: string | { value: any; alt: any; } | { value: any; html: any; } | ParsedMicroformat) {
//     if (name in this.properties) {
//       this.properties[name].push(value);
//     } else {
//       this.properties[name] = [ value ];
//     }
//   }
// }
//
//
//
// export interface Image {
//   value: string;
//   alt: string;
// }
//
//
// export interface Markup {
//   value: string;
//   html: string;
// }
//
// export class ParsedMarkup implements Markup {
//   value: string;
//   html: string;
//
//   constructor(element: HTMLElement, baseUrl: string) {
//     this.sanitizeSubTree(element, baseUrl);
//
//     this.value = parse(element.outerHTML).text.trim();
//     this.html = element.innerHTML.trim();
//   }
//
//   sanitizeSubTree(element: HTMLElement, baseUrl: string) {
//     element.childNodes.forEach(child => {
//       if (child.nodeType === 1) {
//         const childElement: HTMLElement = child as HTMLElement;
//
//         // remove tags that don't end up in the DOM
//         if (childElement.tagName == 'template') {
//           element.removeChild(childElement);
//         }
//
//         if (childElement.tagName == 'a' && 'href' in childElement.attributes) {
//           childElement.attributes['href'] = resolve(baseUrl, childElement.attributes['href']);
//         }
//
//         if (childElement.tagName == 'img' && 'src' in childElement.attributes) {
//           childElement.attributes['src'] = resolve(baseUrl, childElement.attributes['src']);
//         }
//
//         if(childElement.childNodes.length > 0) {
//           this.sanitizeSubTree(childElement, baseUrl);
//         }
//       }
//     });
//   }
// }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// export class Rel {
//   rels: string[];
//   text: string;
//
//   constructor(rels: string[], text: string) {
//     this.rels = rels;
//     this.text = text;
//   }
// }
