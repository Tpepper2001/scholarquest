import katex from 'katex';
import 'katex/dist/katex.min.css';

// Splits on \( ... \) delimiters (how the source question data marks math)
// and renders each math segment with KaTeX; plain segments pass through as-is.
export default function MathText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\\\(.*?\\\))/g);

  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\\\((.*)\\\)$/s);
        if (match) {
          try {
            const html = katex.renderToString(match[1], { throwOnError: false });
            return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return <span key={i}>{part}</span>;
          }
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
