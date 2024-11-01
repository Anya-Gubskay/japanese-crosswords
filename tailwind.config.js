module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      keyframes: {
        zoomIn: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.5)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
      },
      animation: {
        zoomIn: 'zoomIn 1s ease-in-out forwards',
      },

      colors: {
        'custom-teal': 'rgb(96 165 250)',
        'soft-pink': 'rgb(245 174 166)',
        'custom-grey': '#d3d3d3',
        'custom-blue': '#f0f8ff',
        'success': '#48bb78',
        'error': '#f56565',
      },
    },
  },
  plugins: [],
};
