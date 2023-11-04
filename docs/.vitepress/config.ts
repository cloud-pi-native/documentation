import { defineConfig } from 'vitepress'
import sidebar from './sidebar.json' assert { type: 'json'}

export default defineConfig({
  base: '/',
  lang: 'fr-FR',
  title: 'Cloud π Native',
  description: 'Documentation de la plateforme Cloud Pi Native',
  cleanUrls: false,
  themeConfig: {
    logo: '/logo-marianne-gouvernement.png',
    nav: [
      { text: 'Home', link: '/' },
    ],
    outline: [2, 3],
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cloud-pi-native/documentation' }
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Rechercher...',
            buttonAriaLabel: 'Rechercher'
          },
          modal: {
            backButtonTitle: 'effacer la recherche',
            displayDetails: 'afficher les détails',
            noResultsText: 'Aucun résultat pour ',
            resetButtonTitle: 'annuler la recherche',
            footer: {
              selectText: 'aller à ce texte',
              navigateText: 'naviguer dans les résultats',
              closeText: 'fermer'
            }
          }
        },
      }
    },
  },
})
