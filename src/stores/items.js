import { defineStore } from 'pinia'
import Papa from 'papaparse'

const API_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkRE0FgqHYM0XrQPXZJjV_wslDSh4zdXzPmWUh2myEe5ykF4KA5FsxTSw2pDouf23sdLPrMvJz1xGp/pub?output=csv'

function getImageLink(driveLink) {
  const regex = /[-\w]{25,}(?!.*[-\w]{25,})/
  const match = driveLink.match(regex)
  if (match.length == 1) {
    return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w1000`
  }
  throw new Error(`Could not extract ID from Google Drive link: ${driveLink}`)
}

export const useItemsStore = defineStore('items', {
  state: () => ({
    isLoading: false,
    items: []
  }),
  actions: {
    async getItems() {
      if (this.items.length > 0) return
      this.isLoading = true
      try {
        Papa.parse(API_URL, {
          download: true,
          header: true,
          complete: (results) => {
            this.items = results.data
              .map((row, idx) => ({
                id: idx + 1,
                name: row['Nazwa + rozmiar'],
                category: row['Co chcesz oddać?'],
                contact: row['Dane kontaktowe - jak odebrać?'],
                photo: getImageLink(row['Zdjęcie']),
                description: row['Opis'],
                taken: row['Odebrane'],
                timestamp: row['Sygnatura czasowa']
              }))
              .filter((item) => item.taken == '')
            this.isLoading = false
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  },
  persist: {
    storage: sessionStorage
  }
})
