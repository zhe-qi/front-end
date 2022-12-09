import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['menu-item', ''],
    ['menu-ul', '']
  ],
  rules: [
    [
      'bg',
      {
        'background-image': 'url(\'@/assets/hero@75.b2469a49.jpg\')',
        'background-size': 'cover',
        'background-position': 'center',
        'position': 'fixed',
        'width': '100vw',
        'height': '100vh',
        'background-repeat': 'no-repeat'
      }
    ],
    [
      'rainbow-text',
      {
        'color': 'transparent',
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        'background-image':
          'linear-gradient(-225deg, #69EACB 0%, #EACCF8 48%, #6654F1 100%)'
      }
    ]
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono'
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'prose prose-sm m-auto text-left'.split(' ')
})
