class MathJaxManager {
  constructor() {
    this.isLoaded = false;
    this.loadPromise = null;
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
        startup: {
          ready: () => {
            console.log('MathJax is loaded and ready');
            this.isLoaded = true;
            resolve();
          }
        }
      };

      // Load MathJax script
      const script = document.createElement('script');
      script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
      script.onload = () => {
        const mathJaxScript = document.createElement('script');
        mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        mathJaxScript.async = true;
        mathJaxScript.onerror = reject;
        document.head.appendChild(mathJaxScript);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  async renderMath(element) {
    if (!this.isLoaded) {
      await this.loadMathJax();
    }

    if (window.MathJax && window.MathJax.typesetPromise) {
      try {
        await window.MathJax.typesetPromise([element]);
      } catch (error) {
        console.error('MathJax rendering error:', error);
      }
    }
  }

  containsMath(text) {
    const inlineMathRegex = /\$[^$\n]+\$/g;
    const displayMathRegex = /\$\$[\s\S]*?\$\$/g;
    
    return inlineMathRegex.test(text) || displayMathRegex.test(text);
  }
}

const mathJaxManager = new MathJaxManager();
export default mathJaxManager;