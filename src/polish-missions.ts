import { missions, type EvidenceItem, type Mission } from './missions'

type PolishMissionCopy = {
  title: string
  act: string
  reveal: string
  objective: string
  mission: string
  mechanics: string
  evidence: readonly [Omit<EvidenceItem, 'id'>, Omit<EvidenceItem, 'id'>, Omit<EvidenceItem, 'id'>, Omit<EvidenceItem, 'id'>]
  sourceLabels: readonly string[]
}

const acts = {
  one: 'Akt I — Twój agent się zmienia',
  two: 'Akt II — Twój agent ożywa',
  three: 'Akt III — Twój agent staje się organizacją',
} as const

const copy: Record<string, PolishMissionCopy> = {
  'the-heist': {
    title: 'Skok',
    act: acts.one,
    reveal: 'Twoja ulubiona funkcja może działać w Pi bez zastępowania ani modyfikowania konfiguracji źródłowej.',
    objective: 'Uruchom w Pi jeden sprawdzony skill lub prompt Markdown z Claude Code albo Codexa, a następnie potwierdź, że źródło pozostało niezmienione.',
    mission: '',
    mechanics: '',
    evidence: [
      { label: 'Wybrana funkcja została poprawnie uruchomiona w Pi.', detail: 'Natywna funkcja została użyta w miejscu albo zatwierdzony zasób Markdown został załadowany z wybranego profilu.' },
      { label: 'Konfiguracja źródłowa pozostała niezmieniona bajt po bajcie.', detail: 'Lokalne porównanie skrótów przed i po wykonaniu zwróciło source_unchanged: true.' },
      { label: 'Nie skopiowano ani nie uruchomiono danych uwierzytelniających lub niesprawdzonej konfiguracji wykonywalnej.', detail: 'Zakazane kategorie pozostały nieotwarte, a zasoby wykonywalne — w kwarantannie.' },
      { label: 'Potrafię wskazać, co zostało aktywowane i co świadomie pozostawiono.', detail: 'Końcowe lokalne podsumowanie zawiera wyłącznie kategorie zasobów, nigdy prywatne ścieżki ani treści.' },
    ],
    sourceLabels: ['Szybki start Pi', 'Skille Pi', 'Szablony promptów Pi', 'Skille Claude Code', 'Skille Codex'],
  },
  'x-ray-vision': {
    title: 'Rentgen',
    act: acts.one,
    reveal: 'Pi otrzymuje semantyczną wiedzę o kodzie i może reagować na diagnostykę w tej samej pętli edycji.',
    objective: 'Prześledź symbol semantycznie, wprowadź nietrywialną zmianę i usuń każdą diagnostykę powstałą podczas misji.',
    mission: 'Skonfiguruj sprawdzone narzędzie semantyczne dla repozytorium treningowego, prześledź jeden symbol od definicji do odwołań, wprowadź zadaną zmianę i wykorzystaj świeżą diagnostykę do zamknięcia pętli.',
    mechanics: 'narzędzia natywne i rozszerzenia, ograniczanie wyników narzędzi, cykl życia serwera językowego oraz diagnostyka powiązana z edycjami',
    evidence: [
      { label: 'Narzędzie semantyczne odnalazło definicję symbolu.', detail: 'Wynik pochodzi z analizy językowej, a nie wyłącznie z wyszukiwania tekstowego.' },
      { label: 'Prześledzono co najmniej jedno semantyczne odwołanie.', detail: 'Dowód pokazuje zależność bez kopiowania niepowiązanego kodu.' },
      { label: 'Żądana nietrywialna zmiana jest obecna.', detail: 'Odpowiedni test deterministyczny lub zachowanie teraz przechodzi.' },
      { label: 'Nie pozostała żadna diagnostyka wprowadzona przez misję.', detail: 'Świeżą diagnostykę zebrano po ostatniej edycji.' },
    ],
    sourceLabels: ['Rozszerzenia Pi', 'Narzędzia własne Pi', 'Inspiracja: rozszerzenie LSP dla Pi'],
  },
  'eyes-and-hands': {
    title: 'Oczy i ręce',
    act: acts.one,
    reveal: 'Pi obsługuje prawdziwą aplikację, którą buduje, i zwraca dowody wizualne.',
    objective: 'Odtwórz i napraw błąd aplikacji treningowej za pomocą kontrolowanej obsługi przeglądarki i dowodów wizualnych.',
    mission: 'Sprawdź i uruchom jedną kontrolowaną funkcję przeglądarkową, odtwórz wskazany błąd bez kliknięć użytkownika, zapisz stan błędny, wprowadź poprawkę i powtórz ten sam przebieg w przeglądarce.',
    mechanics: 'ustrukturyzowane narzędzia przeglądarkowe, semantyczne referencje elementów, odzyskiwanie po utracie aktualnego stanu, obsługa artefaktów i anonimizacja',
    evidence: [
      { label: 'Pi wykonał wskazaną interakcję w przeglądarce.', detail: 'Użytkownik nie przeklikiwał przebiegu w imieniu agenta.' },
      { label: 'Stan błędny ma ograniczony artefakt dowodowy.', detail: 'Artefakt nie zawiera danych uwierzytelniających ani niepowiązanych danych osobowych.' },
      { label: 'Poprawka przechodzi powtórzoną interakcję.', detail: 'Po implementacji uruchomiono ponownie ten sam przebieg użytkownika.' },
      { label: 'Końcowy dowód wizualny pokazuje poprawne zachowanie.', detail: 'Zrzut ekranu lub równoważny dowód zapisano w przestrzeni treningowej.' },
    ],
    sourceLabels: ['Rozszerzenia Pi', 'TUI i artefakty Pi', 'Inspiracja: obsługa przeglądarki'],
  },
  'the-time-machine': {
    title: 'Wehikuł czasu',
    act: acts.one,
    reveal: 'Pi może badać konkurencyjne implementacje bez ryzykowania działającego stanu.',
    objective: 'Zbuduj dwa odizolowane warianty z jednego punktu wyjścia, zachowaj lepszy i potwierdź możliwość wycofania zmian.',
    mission: 'Utwórz dwa odizolowane worktree z tego samego stanu zadania treningowego, zaimplementuj po jednym ograniczonym wariancie, porównaj różnice i wyniki weryfikacji, zachowaj lepszy wariant i bezpiecznie usuń odrzuconą ścieżkę.',
    mechanics: 'rozgałęzianie sesji, worktree Git, checkpointy, artefakty porównawcze i granice wycofywania zmian',
    evidence: [
      { label: 'Dwa warianty mają wspólny punkt wyjścia i pozostają odizolowane.', detail: 'Żadne worktree nie zawiera zmian z drugiego wariantu.' },
      { label: 'Każdy wariant ma diff i wynik weryfikacji.', detail: 'Porównanie wykorzystuje te same jawne kryteria.' },
      { label: 'Wybór zachowanego wariantu ma uzasadnienie oparte na dowodach.', detail: 'Koszt odrzuconego rozwiązania pozostaje widoczny.' },
      { label: 'Wycofanie pozostawia czysty i odtwarzalny zwycięski wariant.', detail: 'Odrzucone worktree usunięto bez zmiany zachowanej pracy.' },
    ],
    sourceLabels: ['Sesje Pi', 'Dokumentacja Git worktree', 'SDK Pi'],
  },
  'total-recall': {
    title: 'Pamięć absolutna',
    act: acts.two,
    reveal: 'Nowa sesja Pi pamięta uzasadnienie decyzji zamiast otrzymywać cały zapis poprzedniej rozmowy.',
    objective: 'Odtwórz decyzję, odrzucony wariant i otwarty wątek z możliwej do sprawdzenia pamięci opartej na źródłach.',
    mission: 'Zapisz jedną decyzję, jeden odrzucony wariant i jeden otwarty wątek jako trwałe dowody projektowe, zamknij bieżącą sesję, rozpocznij nową i pobierz wyłącznie ograniczony kontekst potrzebny do kontynuacji.',
    mechanics: 'trwałość sesji, granice kompakcji, sprawdzalna pamięć, selektywne pobieranie i pochodzenie informacji',
    evidence: [
      { label: 'Nowa sesja odtwarza decyzję.', detail: 'Odtworzone stwierdzenie wskazuje na możliwy do sprawdzenia dowód projektowy.' },
      { label: 'Odrzucony wariant i jego uzasadnienie zostały zachowane.', detail: 'Nowa sesja odróżnia go od wybranego rozwiązania.' },
      { label: 'Otwarty wątek staje się następną akcją.', detail: 'Załadowano tylko ograniczony, istotny kontekst.' },
      { label: 'Pamięć można poprawić lub usunąć.', detail: 'Mechanizm nie wymaga pełnego zapisu rozmowy.' },
    ],
    sourceLabels: ['Sesje Pi', 'Kompakcja Pi', 'Inspiracja: pamięć obserwacyjna'],
  },
  hindsight: {
    title: 'Z perspektywy czasu',
    act: acts.two,
    reveal: 'Pi może przeanalizować swoją historię działania i zamienić powtarzające się tarcie w usprawnienie wielokrotnego użytku.',
    objective: 'Znajdź powtarzalny wzorzec błędu potwierdzony dowodami i zamień go w usuwalne usprawnienie harnessu.',
    mission: 'Przejrzyj ograniczone dowody z zakończonych sesji, znajdź jeden powtarzający się błąd lub ręczną korektę potwierdzoną co najmniej dwoma zdarzeniami, zapisz ograniczoną lekcję lub propozycję zmiany i zademonstruj ją w kolejnym zadaniu.',
    mechanics: 'zdarzenia sesji, refleksja, pewność i dowody, trwałe lekcje oraz selektywne wstrzykiwanie kontekstu',
    evidence: [
      { label: 'Co najmniej dwa zdarzenia potwierdzają jeden powtarzalny wzorzec.', detail: 'Każde zdarzenie wskazuje na lokalny, możliwy do sprawdzenia dowód.' },
      { label: 'Powstała lekcja lub propozycja wielokrotnego użytku.', detail: 'Artefakt określa, kiedy ma zastosowanie, a kiedy nie.' },
      { label: 'Kolejne zadanie może skorzystać z usprawnienia.', detail: 'Demonstracja jest ograniczona i obserwowalna.' },
      { label: 'Usprawnienie można wyłączyć lub usunąć.', detail: 'Porządkowanie nie narusza niepowiązanego stanu profilu.' },
    ],
    sourceLabels: ['API sesji Pi', 'Skille Pi', 'Inspiracja: Hindsight'],
  },
  'the-forge': {
    title: 'Kuźnia',
    act: acts.two,
    reveal: 'Pi buduje dla siebie brakującą funkcję i zaczyna jej używać bez zastępowania go innym produktem.',
    objective: 'Zaimplementuj, przeładuj, wypróbuj i czysto usuń jedną oryginalną funkcję w wybranym profilu Pi.',
    mission: 'Zdefiniuj jedną brakującą funkcję harnessu, sprawdź oficjalne interfejsy rozszerzeń, zbuduj najmniejsze własne rozszerzenie, narzędzie, komendę, hook lub komponent TUI, przeładuj Pi i przetestuj zachowanie poprawne oraz błędne.',
    mechanics: 'cykl życia rozszerzeń, zdarzenia, własne narzędzia lub komendy, integracja z interfejsem, stan, przeładowanie i usuwanie',
    evidence: [
      { label: 'Pi utworzył oryginalną i możliwą do sprawdzenia funkcję.', detail: 'Rezultat nie jest wyłącznie instalacją pakietu zewnętrznego.' },
      { label: 'Funkcja ładuje się bez błędów startowych.', detail: 'Zaobserwowano przeładowanie w wybranym profilu.' },
      { label: 'Pi używa funkcji w realistycznym zadaniu.', detail: 'Oczekiwany rezultat jest widoczny i ograniczony.' },
      { label: 'Pokazano zachowanie błędne i procedurę usuwania.', detail: 'Funkcję można usunąć bez wpływu na niepowiązany stan.' },
    ],
    sourceLabels: ['Rozszerzenia Pi', 'TUI Pi', 'Przykłady rozszerzeń Pi'],
  },
  'clone-protocol': {
    title: 'Protokół klonowania',
    act: acts.two,
    reveal: 'Jedna sesja Pi może delegować pracę specjaliście bez zalewania własnego kontekstu.',
    objective: 'Zleć ograniczone badanie odizolowanemu specjaliście i wykorzystaj wyłącznie jego wynik oparty na dowodach.',
    mission: 'Zdefiniuj specjalistę z wąską rolą, jawnym kontraktem wyniku i ograniczonym zestawem narzędzi; uruchom go w osobnej sesji, zapisz trwały wynik, a następnie przekaż sesji nadrzędnej wyłącznie ograniczone podsumowanie dowodów.',
    mechanics: 'sesje potomne, definicje ról, listy dozwolonych narzędzi, kontrakty wyników i izolacja kontekstu',
    evidence: [
      { label: 'Sesja nadrzędna i specjalista używają osobnych kontekstów.', detail: 'Specjalista nie dziedziczy pełnego zapisu sesji nadrzędnej.' },
      { label: 'Specjalista ma węższą rolę i zestaw narzędzi.', detail: 'Dozwolony zakres i warunki zatrzymania są jawne.' },
      { label: 'Specjalista zwraca trwały, ustrukturyzowany wynik.', detail: 'Dowody można sprawdzić niezależnie od jego transkrypcji.' },
      { label: 'Sesja nadrzędna otrzymuje tylko ograniczone przekazanie.', detail: 'Podsumowanie zawiera wystarczające dowody do sprawdzenia wniosku.' },
    ],
    sourceLabels: ['SDK Pi', 'Sesje agentów Pi', 'Inspiracja: subagenci'],
  },
  'council-of-minds': {
    title: 'Rada umysłów',
    act: acts.three,
    reveal: 'Niezależne modele mogą produktywnie się różnić, a ich propozycje można oceniać na podstawie dowodów zamiast marki lub pewności wypowiedzi.',
    objective: 'Zbierz ślepe rekomendacje niezależnych modeli i rozstrzygnij je według jawnych kryteriów dowodowych.',
    mission: 'Wyślij ten sam ograniczony problem decyzyjny do co najmniej dwóch odizolowanych agentów korzystających z różnych modeli lub dostawców, zachowaj ich pierwsze odpowiedzi bez wzajemnego wpływu i zleć osobnemu arbitrowi porównanie twierdzeń według wspólnych kryteriów.',
    mechanics: 'modele niezależne od dostawcy, odizolowane prompty, routing modeli, ustrukturyzowane oceny i świadomość skorelowanych błędów',
    evidence: [
      { label: 'Co najmniej dwaj agenci odpowiadają niezależnie.', detail: 'Żaden agent nie widzi odpowiedzi drugiego przed wysłaniem własnej.' },
      { label: 'Zapisano tożsamość modelu i dostawcy.', detail: 'Nie dołączono danych uwierzytelniających ani prywatnych metadanych żądania.' },
      { label: 'Arbiter stosuje wspólne, jawne kryteria.', detail: 'Twierdzenia są sprawdzane względem wskazanych dowodów.' },
      { label: 'Końcowa rekomendacja zachowuje widoczne różnice zdań.', detail: 'Wybrana opcja wyjaśnia, dlaczego wygrała.' },
    ],
    sourceLabels: ['Modele Pi', 'Własni dostawcy Pi', 'Inspiracja: współpracujący agenci'],
  },
  'the-crew': {
    title: 'Załoga',
    act: acts.three,
    reveal: 'Agenci-specjaliści współpracują nad jedną zmianą kodu, zachowując odpowiedzialność i unikając kolidujących edycji.',
    objective: 'Skoordynuj odizolowane role badawczą, implementacyjną i recenzencką w jedną zweryfikowaną zmianę kodu.',
    mission: 'Przydziel role badacza, wykonawcy i recenzenta do odizolowanych sesji; wyłączną odpowiedzialność za implementację powierz worktree wykonawcy; przekazuj ustalenia przez jawne artefakty i integruj dopiero po przejściu deterministycznych kontroli.',
    mechanics: 'równolegli agenci, komunikacja, worktree, rezerwacje plików, uprawnienia ról i bramki integracyjne',
    evidence: [
      { label: 'Badacz, wykonawca i recenzent używają odizolowanych sesji.', detail: 'Każda rola ma jawne uprawnienia i wyniki.' },
      { label: 'Odpowiedzialność za implementację zapobiega kolidującym edycjom.', detail: 'Tylko wykonawca zmienia zarezerwowane pliki implementacji.' },
      { label: 'Ustalenia z przeglądu wracają do wykonawcy.', detail: 'Recenzent zgłasza problemy zamiast po cichu je naprawiać.' },
      { label: 'Zintegrowany rezultat przechodzi deterministyczne kontrole.', detail: 'Artefakty ról i końcowa weryfikacja pozostają możliwe do sprawdzenia.' },
    ],
    sourceLabels: ['SDK Pi', 'Dokumentacja Git worktree', 'Inspiracja: subagenci'],
  },
  'escape-the-terminal': {
    title: 'Ucieczka z terminala',
    act: acts.three,
    reveal: 'Pi staje się trwałym pracownikiem inżynierskim uruchamianym spoza interaktywnego terminala.',
    objective: 'Uruchom jedną ograniczoną misję Pi z zewnątrz i zwróć trwały, widoczny rezultat do kanału inicjującego.',
    mission: 'Skonfiguruj jeden sprawdzony zewnętrzny trigger dla ograniczonego repozytorium treningowego, zapisz tożsamość i zakres wyzwalacza, uruchom Pi bez sterowania przez interaktywny terminal oraz zwróć status i trwały wynik albo jawny błąd.',
    mechanics: 'tryb headless lub RPC, wyzwalacze zdarzeń, trwałe procesy, kanały dostarczania, minimalne uprawnienia i sandboxing',
    evidence: [
      { label: 'Misja rozpoczyna się poza interaktywnym terminalem Pi.', detail: 'Zapisano tożsamość wyzwalacza i żądany zakres.' },
      { label: 'Wykonanie pozostaje w ograniczonym środowisku treningowym.', detail: 'Uprawnienia ograniczono do zadeklarowanej misji.' },
      { label: 'Kanał inicjujący otrzymuje status i trwały wynik.', detail: 'Nie zwrócono sekretu ani niepowiązanej treści repozytorium.' },
      { label: 'Timeout i błąd tworzą widoczny stan niepowodzenia.', detail: 'Proces nie kontynuuje pracy po cichu.' },
    ],
    sourceLabels: ['Tryb RPC Pi', 'SDK Pi', 'Inspiracja: GitHub Action'],
  },
  'the-gauntlet': {
    title: 'Próba ognia',
    act: acts.three,
    reveal: 'Wymaganie staje się scalonym pull requestem dopiero po niezależnych przeglądach i deterministycznej akceptacji.',
    objective: 'Uruchom autonomiczny proces implementacji, ślepego przeglądu, korekt, weryfikacji i scalania, który domyślnie zatrzymuje się przy błędzie.',
    mission: 'Użyj wyłącznie kontrolowanego repozytorium treningowego Akademii. Skoordynuj wykonawcę, Recenzenta A, ślepego Recenzenta B i Końcowego Weryfikatora w odizolowanych sesjach; egzekwuj limity korekt i wymagane bramki; zezwól na automatyczne scalenie dopiero po przejściu wszystkich ról i kontroli.',
    mechanics: 'autonomiczna orkiestracja, ślepy przegląd, pętle korekt, bramki maszynowe, QA w przeglądarce, polityka pull requestów, automatyczne scalanie i ślad audytowy',
    evidence: [
      { label: 'Istnieją pull request i odizolowane wyniki ról.', detail: 'Wykonawca i recenzenci mają różne uprawnienia; wykonawca nie może zatwierdzić własnej pracy.' },
      { label: 'Niezależne przeglądy i korekty są zakończone.', detail: 'Pierwszy werdykt Recenzenta B powstał bez dostępu do werdyktu Recenzenta A.' },
      { label: 'Bramki deterministyczne i przeglądarkowe przechodzą.', detail: 'Nie pozostało blokujące ustalenie, brak dowodu, timeout ani przekroczenie budżetu.' },
      { label: 'Polityka zatwierdziła i automatycznie scaliła pull request.', detail: 'Raport końcowy łączy wymaganie, wyniki ról, korekty, kontrole, pull request i commit scalający.' },
    ],
    sourceLabels: ['SDK Pi', 'Tryb RPC Pi', 'Inspiracja: orkiestracja floty'],
  },
}

const genericLaunchBay = {
  summary: 'Kontynuuj w profilu Pi wybranym dla ścieżki Akademii i użyj jednorazowej przestrzeni treningowej dla tej misji.',
  commands: [
    { label: 'Standardowy profil Pi', note: 'Użyj zwykłego profilu tylko wtedy, gdy został wybrany dla Twojej ścieżki Akademii.' },
    { label: 'Odizolowany profil Akademii', note: 'Użyj tego samego odizolowanego profilu co w Misji 01, jeśli chronisz istniejącą konfigurację Pi.' },
  ],
  credentialBoundary: 'Uwierzytelniaj dostawców wyłącznie przez Pi. Nigdy nie wklejaj danych uwierzytelniających do promptu misji, strony internetowej, repozytorium, zrzutu ekranu, raportu ani wiadomości agenta.',
} as const

const heistSteps = [
  { title: 'Uruchom Pi', instruction: 'Użyj profilu domyślnego dla nowej konfiguracji albo opcjonalnego profilu Akademii, jeśli korzystasz już z Pi.' },
  { title: 'Wklej prompt misji', instruction: 'Pozwól Pi zinwentaryzować udokumentowane źródła bez czytania ich treści, a następnie sprawdź tabelę klasyfikacji.' },
  { title: 'Wybierz i sprawdź jedną funkcję', instruction: 'Wybierz jeden samodzielny zasób Markdown albo ograniczony, natywny pakiet zawierający wyłącznie Markdown. Zasoby natywne pozostają na miejscu; zasoby adaptowane wymagają dodatkowej zgody przed skopiowaniem.' },
  { title: 'Uruchom i zbierz dowody', instruction: 'Wywołaj sprawdzoną funkcję i potwierdź, że lokalny raport pokazuje niezmienione źródło oraz brak dostępu do zakazanych danych.' },
] as const

export const polishMissions: readonly Mission[] = missions.map((mission) => {
  const translated = copy[mission.slug]
  if (!translated || !mission.launchBay || !mission.steps || !mission.evidence || !mission.sources) {
    throw new Error(`Missing Polish mission contract for ${mission.slug}`)
  }

  const launchBay = mission.slug === 'the-heist'
    ? {
        ...mission.launchBay,
        summary: 'Zainstaluj Pi, uwierzytelnij dostawcę modelu bezpośrednio w Pi i wybierz profil, który będziesz rozwijać w Akademii.',
        commands: mission.launchBay.commands.map((command, index) => ({
          ...command,
          label: ['Zainstaluj Pi', 'Nowa konfiguracja Pi', 'Opcjonalny profil Akademii'][index],
          note: [
            'Oficjalna instalacja z npm z wyłączonymi skryptami cyklu życia zależności.',
            'Użyj zwykłego profilu, jeśli nie masz istniejącej konfiguracji Pi do ochrony.',
            'Wybierz tę opcję, jeśli istniejąca konfiguracja Pi ma pozostać poza ścieżką kursu.',
          ][index],
        })),
        credentialBoundary: 'Uwierzytelnij dostawcę modelu bezpośrednio w Pi. Nigdy nie wklejaj danych uwierzytelniających do strony Akademii ani promptu misji.',
      }
    : {
        ...mission.launchBay,
        summary: genericLaunchBay.summary,
        commands: mission.launchBay.commands.map((command, index) => ({ ...command, ...genericLaunchBay.commands[index] })),
        credentialBoundary: genericLaunchBay.credentialBoundary,
      }

  const steps = mission.slug === 'the-heist'
    ? heistSteps.map((step) => ({ ...step }))
    : [
        { title: 'Przygotuj granice', instruction: 'Otwórz wybrany profil Pi i jednorazową przestrzeń treningową. Przed aktywacją sprawdź każdy nowy pakiet, rozszerzenie, trigger i uprawnienie.' },
        { title: 'Wykonaj misję', instruction: translated.mission },
        { title: 'Sprawdź mechanizm', instruction: `Wyjaśnij dodany mechanizm oraz jego ograniczenia: ${translated.mechanics}.` },
        { title: 'Zweryfikuj i zachowaj', instruction: 'Zbierz wyłącznie cztery lokalne stwierdzenia dowodowe widoczne poniżej. Zachowaj funkcję tylko wtedy, gdy wszystkie wymagane kontrole przechodzą, a usunięcie pozostaje możliwe.' },
      ]

  return {
    ...mission,
    title: translated.title,
    act: translated.act,
    reveal: translated.reveal,
    objective: translated.objective,
    launchBay,
    steps,
    evidence: mission.evidence.map((item, index) => ({ ...item, ...translated.evidence[index] })),
    sources: mission.sources.map((source, index) => ({ ...source, label: translated.sourceLabels[index] ?? source.label })),
  }
})
