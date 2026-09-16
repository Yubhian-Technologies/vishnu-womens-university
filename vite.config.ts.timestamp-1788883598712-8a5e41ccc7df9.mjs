// vite.config.ts
import { defineConfig } from "file:///C:/Users/gurun/Documents/VTH/vishnu-womens-university/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/gurun/Documents/VTH/vishnu-womens-university/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\gurun\\Documents\\VTH\\vishnu-womens-university";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Firebase's app+firestore core and React/Router are large,
        // slow-changing dependencies shared by every public route — splitting
        // them into their own chunk lets browsers cache them independently of
        // app code, instead of re-downloading everything on each deploy.
        // firebase/auth and firebase/storage are deliberately NOT listed here:
        // only /admin (login + uploads, see firebaseAdmin.ts) touches them,
        // and they're loaded there via dynamic import() rather than a static
        // import specifically so Rollup treats them as a genuine on-demand
        // chunk. Adding them to manualChunks previously caused Rollup to
        // statically link that chunk into every page's bundle (since manual
        // chunk buckets are joined by static import edges) — the ~180kB SDK
        // was downloading on every public page load, including this one.
        manualChunks: {
          firebase: ["firebase/app", "firebase/firestore"],
          "react-vendor": ["react", "react-dom", "react-router-dom"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxndXJ1blxcXFxEb2N1bWVudHNcXFxcVlRIXFxcXHZpc2hudS13b21lbnMtdW5pdmVyc2l0eVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcZ3VydW5cXFxcRG9jdW1lbnRzXFxcXFZUSFxcXFx2aXNobnUtd29tZW5zLXVuaXZlcnNpdHlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2d1cnVuL0RvY3VtZW50cy9WVEgvdmlzaG51LXdvbWVucy11bml2ZXJzaXR5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgLy8gRmlyZWJhc2UncyBhcHArZmlyZXN0b3JlIGNvcmUgYW5kIFJlYWN0L1JvdXRlciBhcmUgbGFyZ2UsXG4gICAgICAgIC8vIHNsb3ctY2hhbmdpbmcgZGVwZW5kZW5jaWVzIHNoYXJlZCBieSBldmVyeSBwdWJsaWMgcm91dGUgXHUyMDE0IHNwbGl0dGluZ1xuICAgICAgICAvLyB0aGVtIGludG8gdGhlaXIgb3duIGNodW5rIGxldHMgYnJvd3NlcnMgY2FjaGUgdGhlbSBpbmRlcGVuZGVudGx5IG9mXG4gICAgICAgIC8vIGFwcCBjb2RlLCBpbnN0ZWFkIG9mIHJlLWRvd25sb2FkaW5nIGV2ZXJ5dGhpbmcgb24gZWFjaCBkZXBsb3kuXG4gICAgICAgIC8vIGZpcmViYXNlL2F1dGggYW5kIGZpcmViYXNlL3N0b3JhZ2UgYXJlIGRlbGliZXJhdGVseSBOT1QgbGlzdGVkIGhlcmU6XG4gICAgICAgIC8vIG9ubHkgL2FkbWluIChsb2dpbiArIHVwbG9hZHMsIHNlZSBmaXJlYmFzZUFkbWluLnRzKSB0b3VjaGVzIHRoZW0sXG4gICAgICAgIC8vIGFuZCB0aGV5J3JlIGxvYWRlZCB0aGVyZSB2aWEgZHluYW1pYyBpbXBvcnQoKSByYXRoZXIgdGhhbiBhIHN0YXRpY1xuICAgICAgICAvLyBpbXBvcnQgc3BlY2lmaWNhbGx5IHNvIFJvbGx1cCB0cmVhdHMgdGhlbSBhcyBhIGdlbnVpbmUgb24tZGVtYW5kXG4gICAgICAgIC8vIGNodW5rLiBBZGRpbmcgdGhlbSB0byBtYW51YWxDaHVua3MgcHJldmlvdXNseSBjYXVzZWQgUm9sbHVwIHRvXG4gICAgICAgIC8vIHN0YXRpY2FsbHkgbGluayB0aGF0IGNodW5rIGludG8gZXZlcnkgcGFnZSdzIGJ1bmRsZSAoc2luY2UgbWFudWFsXG4gICAgICAgIC8vIGNodW5rIGJ1Y2tldHMgYXJlIGpvaW5lZCBieSBzdGF0aWMgaW1wb3J0IGVkZ2VzKSBcdTIwMTQgdGhlIH4xODBrQiBTREtcbiAgICAgICAgLy8gd2FzIGRvd25sb2FkaW5nIG9uIGV2ZXJ5IHB1YmxpYyBwYWdlIGxvYWQsIGluY2x1ZGluZyB0aGlzIG9uZS5cbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgZmlyZWJhc2U6IFsnZmlyZWJhc2UvYXBwJywgJ2ZpcmViYXNlL2ZpcmVzdG9yZSddLFxuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VixTQUFTLG9CQUFvQjtBQUMxWCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ2pDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBYU4sY0FBYztBQUFBLFVBQ1osVUFBVSxDQUFDLGdCQUFnQixvQkFBb0I7QUFBQSxVQUMvQyxnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsUUFDM0Q7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
