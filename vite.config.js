import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        categories: resolve(__dirname, 'pages/categories.html'),
        product: resolve(__dirname, 'pages/product.html'),
        products: resolve(__dirname, 'pages/products.html'),
        subcategories: resolve(__dirname, 'pages/subcategories.html'),
        events: resolve(__dirname, 'pages/events.html')
      }
    }
  }
});
