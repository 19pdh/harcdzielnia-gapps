import { createSlice, createAsyncThunk, createAction, type PayloadAction } from '@reduxjs/toolkit';
import Papa from 'papaparse';

// Define the shape of an Item
export interface Item {
  id: number;
  name: string;
  category: string;
  contact: string;
  photo: string;
  description: string;
  taken: string;
  timestamp: string;
}

interface ItemsState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  isLoading: false,
  error: null,
};

const API_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQkRE0FgqHYM0XrQPXZJjV_wslDSh4zdXzPmWUh2myEe5ykF4KA5FsxTSw2pDouf23sdLPrMvJz1xGp/pub?output=csv';

function getImageLink(driveLink: string): string {
  const regex = /[-\w]{25,}(?!.*[-\w]{25,})/;
  const match = driveLink.match(regex);
  if (match && match.length >= 1) {
    return `https://drive.google.com/thumbnail?id=${match[0]}&sz=w1000`;
  }
  // Fallback or error handling
  console.warn(`Could not extract ID from Google Drive link: ${driveLink}`);
  return '';
}

export const removeItem = createAction<number>('items/removeItem');

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  return new Promise<Item[]>((resolve, reject) => {
    Papa.parse(API_URL, {
      download: true,
      header: true,
      complete: (results) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const items = results.data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((row: any, idx: number) => ({
              id: idx + 1,
              name: row['Nazwa + rozmiar'],
              category: row['Co chcesz oddać?'],
              contact: row['Dane kontaktowe - jak odebrać?'],
              photo: row['Zdjęcie'] ? getImageLink(row['Zdjęcie']) : '',
              description: row['Opis'],
              taken: row['Odebrane'],
              timestamp: row['Sygnatura czasowa'],
            }))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((item: any) => item.taken === '' || item.taken === undefined);
          resolve(items);
        } catch (e) {
          reject(e);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
});

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeItem, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch items';
      });
  },
});

export default itemsSlice.reducer;
