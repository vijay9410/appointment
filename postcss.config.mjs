const config = {
  plugins: {
    "@tailwindcss/postcss": {
      // ✅ disable modern color spaces (lab/oklab) for html2canvas compatibility
      experimental: {
        disableModernColorSpaces: true,
      },
    },
  },
};

export default config;
