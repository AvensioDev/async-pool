import {
  createAppleSplashScreens,
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023'
  },
  preset: {
    ...minimal2023Preset,
    appleSplashScreens: createAppleSplashScreens({
      padding: 0.4,
      resizeOptions: {
        fit: 'contain',
        background: '#0ea5e9'
      },
      darkResizeOptions: {
        fit: 'contain',
        background: '#083957'
      },
      linkMediaOptions: {
        log: true,
        xhtml: true,
        addMediaScreen: true,
      }
    }, ['iPad Air 9.7"'])
  },
  images: 'docs/public/avensio-logo-mark.svg',
  root: 'docs'
})
