/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      spacing: {
        '5': '20px',
        '10': '40px',
        '20': '80px',
        '30': '120px',
        '40': '160px',
        '50': '200px',
        '60': '240px',
        '70': '280px',
        '80': '320px',
        '90': '360px',
        '100': '400px',
        '110': '440px',
        '120': '480px',
        '130': '520px',
        '140': '560px',
        '150': '600px',
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['forest']
  }
}
