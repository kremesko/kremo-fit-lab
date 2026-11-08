# Kremo Fit Lab

Interaktívny HTML prototyp na porovnávanie telesných proporcií jazdca s geometriou bicyklov **YT IZZO 2021**, **Canyon Neuron 6 (produkt 4004)** a **Orbea Laufey H30**.

## Spustenie

Otvor `izzo-fit-prototyp.html` v prehliadači. Inštalácia ani backend nie sú potrebné. Alternatívne otvor `src/index.html` spolu s vedľajšími súbormi `app.js` a `style.css`.

Telesné rozmery, nastavenie posedu, veľkosť rámu a geometriu možno upravovať. Schéma zobrazuje jazdca, kontaktné body, šliapanie, orientačné ťažisko, sklon bicykla a zjednodušené stlačenie odpruženia. Obsahuje tiež kalibráciu fotografie a ilustračnú simuláciu skoku.

Profil sa neukladá automaticky. Použi **Exportovať profil** a neskôr **Načítať profil**. Už uložené profily a fotografie z používateľovho prehliadača nie sú súčasťou tohto repozitára.

## Súbory

- `src/` — pôvodné HTML, JavaScript a CSS.
- `izzo-fit-prototyp.html` — samostatná HTML verzia aplikácie.
- `scripts/bundle.py` — zostavenie samostatnej verzie.
- `tests/` — pôvodné kontroly geometrie, postoja, fotografie, šliapania, sagu a skoku; cesty upravené na túto štruktúru.
- `docs/reference/` — pôvodné obrazové podklady súvisiace s bicyklom a schémou.

Po úprave zdrojov zostav samostatnú verziu z koreňa repozitára:

```sh
python scripts/bundle.py
```

Kontroly používajú Node.js a jeho vstavané moduly, napríklad:

```sh
node --check src/app.js
node tests/check-laufey.cjs
node tests/check-sag.cjs
node tests/check-jump.cjs
```

## Pôvod a hranice modelu

Obnovené z lokálneho prototypu vytvoreného 6. októbra 2026. Geometria a jej zdroje sú uvedené aj v aplikácii. Referenčné obrázky sú zachované ako podklady; ich pôvodné práva zostávajú príslušným vlastníkom.

Ide o experimentálny geometrický model. Výstupy nepredstavujú overené skóre ideálneho posedu. Pohyb zadnej osi, model jazdca a skok sú zjednodušené. CSS načítava voliteľné písma z Google Fonts; pri nedostupnej sieti prehliadač použije náhradné písmo.
