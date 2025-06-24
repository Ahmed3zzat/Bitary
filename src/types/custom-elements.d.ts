// src/types/custom-elements.d.ts
declare namespace JSX {
    interface IntrinsicElements {
      'zapier-interfaces-chatbot-embed': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'is-popup'?: boolean | string;
        'chatbot-id': string;
        height?: string;
        width?: string;
      };
    }
  }
   