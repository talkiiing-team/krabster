const daisyui = require('daisyui')
const typography = require('@tailwindcss/typography')

const plugin = require('tailwindcss/plugin')

const fadeEffectPlugin = plugin(({ matchUtilities, theme }) => {
  const getFadeProps = direction => value => ({
    'mask-image':
      'linear-gradient(' +
      `to ${direction},` +
      'black,' +
      `black calc(100% - ${value}),` +
      'transparent' +
      ')',
  })

  matchUtilities(
    {
      'fade-top': getFadeProps('top'),
      'fade-right': getFadeProps('right'),
      'fade-bottom': getFadeProps('bottom'),
      'fade-left': getFadeProps('left'),
    },
    {
      values: theme('inset'),
    },
  )
})

const textWrapBalancePlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    '.balance': {
      'text-wrap': 'balance',
    },
  })
})

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        headings: ['Jost', 'sans-serif'],
        default: ['Lato', 'sans-serif'],
        sans: ['Lato', 'sans-serif'],
      },
      container: {
        center: true,
      },
      inset: {
        '1px': '1px',
      },
      spacing: {
        '1px': '1px',
      },
      screens: {
        xs: '380px',
      },
    },
  },
  plugins: [fadeEffectPlugin, textWrapBalancePlugin, typography, daisyui],
  daisyui: {
    themes: [
      {
        forest: {
          ...require('daisyui/src/theming/themes')['[data-theme=forest]'],
          '.btn-opaque': {
            'background-color': 'rgba(255, 255, 255, .15)',
            color: '#fff',
            border: 'none',
          },
          '@media (hover: hover)': {
            '.btn-opaque:hover': {
              'background-color': 'rgba(255, 255, 255, .30)',
            },
          },
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    logs: false,
    rtl: false,
  },
}
