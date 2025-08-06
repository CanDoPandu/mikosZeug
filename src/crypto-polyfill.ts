// Crypto polyfill for Node.js environments
// This must be imported before any other modules that might use crypto

export function setupCryptoPolyfill(): void {
  if (typeof globalThis.crypto === 'undefined') {
    try {
      const nodeCrypto = require('crypto');
      
      // Try to use webcrypto first (Node.js 16+)
      if (nodeCrypto.webcrypto) {
        globalThis.crypto = nodeCrypto.webcrypto;
        console.log('✅ Using Node.js webcrypto');
      } else {
        // Fallback: create a minimal crypto interface
        globalThis.crypto = {
          getRandomValues: (array: any) => {
            return nodeCrypto.randomFillSync(array);
          },
          randomUUID: () => {
            return nodeCrypto.randomUUID();
          },
        } as any;
        console.log('✅ Using Node.js crypto fallback');
      }
    } catch (error) {
      console.error('❌ Failed to setup crypto polyfill:', error);
      
      // Last resort: minimal implementation
      globalThis.crypto = {
        getRandomValues: (array: any) => {
          for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
          }
          return array;
        },
        randomUUID: () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        },
      } as any;
      console.log('✅ Using fallback crypto implementation');
    }
  } else {
    console.log('✅ Crypto already available');
  }
}