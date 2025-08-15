class MathJaxManager {
  constructor() {
    this.isLoaded = false;
    this.loadPromise = null;
    this.maxRetries = 3;
    this.retryCount = 0;
  }

  async loadMathJax() {
    if (this.isLoaded) return Promise.resolve();
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise((resolve, reject) => {
      // Configure MathJax before loading
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true,
          processEnvironments: true
        },
        options: {
          skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
        },
        startup: {
          ready: () => {
            console.log('MathJax is loaded and ready');
            window.MathJax.startup.defaultReady();
            this.isLoaded = true;
            this.retryCount = 0;
            resolve();
          }
        }
      };

      const loadMathJaxScript = () => {
        // Try different CDNs as fallback
        const cdns = [
          'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
          'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js',
          'https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js'
        ];

        const tryLoadFromCDN = (index = 0) => {
          if (index >= cdns.length) {
            console.error('Failed to load MathJax from all CDNs');
            reject(new Error('Failed to load MathJax'));
            return;
          }

          const script = document.createElement('script');
          script.src = cdns[index];
          script.async = true;
          
          script.onload = () => {
            console.log(`MathJax loaded successfully from ${cdns[index]}`);
          };
          
          script.onerror = () => {
            console.warn(`Failed to load MathJax from ${cdns[index]}, trying next CDN...`);
            document.head.removeChild(script);
            tryLoadFromCDN(index + 1);
          };
          
          document.head.appendChild(script);
        };

        tryLoadFromCDN();
      };

      // Check if MathJax is already loaded
      if (window.MathJax && window.MathJax.version) {
        this.isLoaded = true;
        resolve();
        return;
      }

      // Start loading MathJax
      loadMathJaxScript();
    });

    return this.loadPromise;
  }

  async renderMath(element) {
    try {
      if (!this.isLoaded) {
        await this.loadMathJax();
      }

      if (window.MathJax && window.MathJax.typesetPromise) {
        await window.MathJax.typesetPromise([element]);
      } else if (window.MathJax && window.MathJax.Hub) {
        // Fallback for MathJax 2.x
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, element]);
      }
    } catch (error) {
      console.error('MathJax rendering error:', error);
      
      // Retry loading if it failed
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        this.isLoaded = false;
        this.loadPromise = null;
        console.log(`Retrying MathJax load (attempt ${this.retryCount}/${this.maxRetries})`);
        return this.renderMath(element);
      }
    }
  }

  containsMath(text) {
    if (!text) return false;
    
    const inlineMathRegex = /\$[^$\n]+\$/g;
    const displayMathRegex = /\$\$[\s\S]*?\$\$/g;
    const latexInlineRegex = /\\\\?\([^)]*\\\\?\)/g;
    const latexDisplayRegex = /\\\\?\[[^\]]*\\\\?\]/g;
    
    return inlineMathRegex.test(text) || 
           displayMathRegex.test(text) || 
           latexInlineRegex.test(text) || 
           latexDisplayRegex.test(text);
  }

  // Get math examples for the toolbar
  getMathExamples() {
    return {
      inline: {
        basic: 'x = y + z',
        fraction: '\\frac{a}{b}',
        superscript: 'x^2',
        subscript: 'a_i',
        greek: '\\alpha + \\beta = \\gamma',
        sqrt: '\\sqrt{x^2 + y^2}',
        integral: '\\int f(x)dx'
      },
      display: {
        quadratic: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        integral: '\\int_{a}^{b} f(x) \\,dx',
        summation: '\\sum_{i=1}^{n} x_i',
        matrix: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
        limit: '\\lim_{x \\to \\infty} \\frac{1}{x} = 0',
        derivative: '\\frac{d}{dx}[f(x)] = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}',
        series: '\\sum_{n=0}^{\\infty} \\frac{x^n}{n!} = e^x'
      }
    };
  }
}

const mathJaxManager = new MathJaxManager();
export default mathJaxManager;