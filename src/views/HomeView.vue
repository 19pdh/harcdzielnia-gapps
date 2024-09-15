<script setup>
import FilterView from '@/components/FilterView.vue'
import AddItem from '@/components/AddItem.vue'
</script>

<template>
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
    Wypełnij
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSelaJDsMnUEU4GJ2W-RYuMRtKizXkiReLtFx1wb4A3XVwYUrg/viewform"
      >ten formularz</a
    >, a twój mundur będzie widoczny dla wszystkich odwiedzających harcdzielnię. W wiadomości podaj
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
    Kontakt do mnie:
    <a href="mailto:patryk.niedzwiedzinski@zhr.pl">patryk.niedzwiedzinski@zhr.pl</a>
  </p>
  <FilterView />
</template>
