import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchItems } from '../store/itemsSlice';
import ItemCard from '../components/ItemCard';
import CategoryList from '../components/CategoryList';
import AddItem from '../components/AddItem';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isLoading } = useSelector((state: RootState) => state.items);
  const { categories } = useSelector((state: RootState) => state.categories);

  const [selectedCategory, setSelectedCategory] = useState('Wszystko');

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchItems());
    }
  }, [dispatch, items.length]);

  // Create a map for quick category image lookup
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach(cat => {
      map[cat.name] = cat.link;
    });
    return map;
  }, [categories]);

  const filteredItems = items.filter((item) => {
    // Logic from FilterView.vue
    // If selectedCategory is 'Inne', we show items whose category is NOT in the custom categories list.
    // Wait, 'Inne' category logic in Vue was:
    // if (category.value == 'Inne') return !customCategories.value.includes(el.category)

    // Check if 'Inne' logic is needed.
    // 'Wszystko' includes everything.

    if (selectedCategory === 'Wszystko') {
       return true;
    }

    // Check if selected category is 'Inne'
    if (selectedCategory === 'Inne') {
       const customNames = categories
          .filter(c => c.name !== 'Wszystko' && c.name !== 'Inne')
          .map(c => c.name);

       return !customNames.includes(item.category);
    }

    return item.category === selectedCategory;
  });

  return (
    <div className="home">
      <AddItem />

      <h2>Co to harcdzielnia?</h2>
      <p>
        Jako drużynowy miałem przyjemność przyjmować wielu chłopaków do drużyny. Każdy nowy harcerz
        potrzebuje munduru, a z drugiej strony wielu druhów i ja sam przez lata wyrosłem z wielu
        mundurów. Za małe mundury lądowały na dnie szafy, a przecież wcale tak nie musi być.
      </p>
      <p>
        Harcdzielnia to przestrzeń wymiany – każdy może oddać mundur i dać mu szansę na drugie życie lub
        w spisie znaleźć coś dla siebie, za darmo odebrać i uratować przed kurzem i zapomnieniem.
      </p>

      <h2>Jak to działa?</h2>
      <h3>Mam mundur do oddania</h3>
      <p>
        Wypełnij{' '}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSelaJDsMnUEU4GJ2W-RYuMRtKizXkiReLtFx1wb4A3XVwYUrg/viewform"
          target="_blank" rel="noopener noreferrer"
        >
          ten formularz
        </a>
        , a twój mundur będzie widoczny dla wszystkich odwiedzających harcdzielnię. W wiadomości podaj
        proszę dane kontaktowe (mail/numer tel.), żebyśmy mogli umówić się na przekazanie munduru i
        zrobić miejsce w Twojej szafie.
      </p>

      <h3>Szukam używanego munduru</h3>
      <p>
        Poniżej znajduje się lista zebranych części umundurowania. Jeżeli znajdziesz poniżej coś dla
        siebie skontaktuj się przez dane kontaktowe (znajdziesz je na stronie munduru, po kliknięciu w
        "kafelek")
      </p>

      <h3>W razie pytań</h3>
      <p>
        Kontakt do mnie:{' '}
        <a href="mailto:patryk.niedzwiedzinski@zhr.pl">patryk.niedzwiedzinski@zhr.pl</a>
      </p>
      <p>
        (współ)Twórz harcdzielnię:{' '}
        <a href="https://github.com/19pdh/harcdzielnia-gapps" target="_blank" rel="noopener noreferrer">kod źródłowy</a>
      </p>

      <h2>Lista umundurowania</h2>

      <div className="filters" style={{ marginBottom: '1em' }}>
         {/* Only show search input if needed, Vue app didn't seem to have one in FilterView?
             Wait, I added a search input in my first draft but Vue code didn't have one in template.
             I will remove it to be faithful to the original, unless requested.
             Actually, the user said "Rewrite this app". Improving is allowed, but maybe stick to scope.
             I'll Comment it out or remove.
             I'll keep it but hidden or remove. I'll remove it to be safe.
          */}
        {/* <input ... /> */}
      </div>

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {isLoading ? (
        <div className="container"><span>Ładowanie...</span></div>
      ) : filteredItems.length === 0 ? (
        <div className="container"><span>Tutaj jeszcze nic nie ma...</span></div>
      ) : (
        <div className="container">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              categoryIcon={categoryMap[item.category]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
