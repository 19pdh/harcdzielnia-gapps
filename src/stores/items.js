import { defineStore } from 'pinia'
import Papa from 'papaparse';

const API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQkRE0FgqHYM0XrQPXZJjV_wslDSh4zdXzPmWUh2myEe5ykF4KA5FsxTSw2pDouf23sdLPrMvJz1xGp/pub?output=csv"

export const useItemsStore = defineStore('items', {
    state: () => ({
        isLoading: false,
        items: []
    }),
    actions: {
        async getItems() {
            try {
                this.isLoading = true;
                Papa.parse(API_URL, {
                  download: true,
                  header: true,
                  complete: (results) => {
                    this.items = results.data
                      .map(row => ({
                        name: row["Nazwa + rozmiar"],
                        category: row["Co chcesz oddać?"],
                        contact: row["Kontakt - jak odebrać?"],
                        photo: row["Zdjęcie"],
                        description: row["Opis"],
                        taken: row["Odebrane"],
                        timestamp: row["Sygnatura czasowa"]
                      }))
                      .filter(item => item.taken == "")
                    this.isLoading = false
                  }
                });
              } catch(e) {
                console.error(e)
              }
        }
    }
})