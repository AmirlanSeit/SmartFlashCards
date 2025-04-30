/**
 * Format mathematical expressions with KaTeX
 * This is a simple function to render math formulas using KaTeX
 */
export function formatMath(text: string): string {
  // Replace simple math expressions with KaTeX formatted HTML
  // For more complex use cases, we would integrate KaTeX fully
  
  // Handle common mathematical notations
  let formattedText = text
    // Square roots
    .replace(/√(\d+)/g, '<span class="katex"><span class="katex-sqrt">√</span>$1</span>')
    // Fractions like 1/2
    .replace(/(\d+)\/(\d+)/g, '<span class="katex"><span class="katex-frac"><span class="katex-num">$1</span><span class="katex-den">$2</span></span></span>')
    // Powers/exponents
    .replace(/(\w+)\^(\d+)/g, '<span class="katex">$1<sup>$2</sup></span>')
    // Greek letters
    .replace(/\\sigma/g, 'σ')
    .replace(/\\mu/g, 'μ')
    // Plus/minus symbol
    .replace(/±/g, '±')
    // Handle subscripts
    .replace(/(\w+)_(\w+)/g, '<span class="katex">$1<sub>$2</sub></span>')
    // Handle special functions
    .replace(/sin\(/g, '<span class="katex">sin(</span>')
    .replace(/cos\(/g, '<span class="katex">cos(</span>')
    .replace(/tan\(/g, '<span class="katex">tan(</span>');

  return formattedText;
}
