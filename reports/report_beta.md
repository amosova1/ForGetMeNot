# Info o projekte:
- Meno a priezvisko: Antónia Amosová
- Názov projektu: ForGetMeNot
- Link na repozitár: https://github.com/amosova1/ForGetMeNot        
- Link na verejnú inštanciu projektu: https://forgetmenot-gyrb.onrender.com/

# Info o reportovanej verzii:
- Tag: beta  

# Info k testovaniu:
- na testovanie adminu: username: admin, heslo: adminadmin
- pri uložení noveého itemu znovu reloadni stránku pre znovunačítanie dát z db

# Postup, ako rozbehať vývojové prostredie
- npm install
- npx sequelize-cli db:migrate
- npx sequelize-cli db:seed:all

na session treba vytvoriť tabuľku cez query

CREATE TABLE IF NOT EXISTS public.session
(
sid character varying COLLATE pg_catalog."default" NOT NULL,
sess json NOT NULL,
expire timestamp(6) without time zone NOT NULL,
CONSTRAINT session_pkey PRIMARY KEY (sid)
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire"
ON public.session USING btree
(expire ASC NULLS LAST);

prípadne npx connect-pg-simple --table session

- npm run dev


# Stav implementácie:
implementovaná funckionality:
- načítavanie verejných itemov z db
- filtrovanie podľa kníh, filmov / seriálov, všetky
- filtrovanie podľa sekcií (sekcia je odkiaľ pochádza item napr. Kindle, Netflix, ...)
- filtrovanie podľa tagov
- prihlásenie / registrácia
- zobrazenie súkromných itemov po prihlásení
- pridávanie nových itemov - je potrebné názov, autor, rok
- update / vymazanie existujúcich itemov
- pre admin - samostatné rozhranie, prihlasovacie údaje: admin, adminadmin
- admin vie editovať a zmazávať sekcie, tagy, itemy, užívateľov 

rozpracované:
- zadávanie nových sekcií, tagov pri vytváraní nového / update itemu - aktuálne možnosť vybrať len z existujúcich

neimplementované:
- vkladanie obrázku k itemu
- admin vie pridať nových úžívateľov, sekcie, tagy, knihy / filmy a seriály
- reload stránky po odhlásení, uložení nového itemu, update itemu

# Časový plán:
- nasledujúci týždeň - vkladanie viac tagov, vytváranie nových sekcií a tagov cez užívateľa, možnosť pridávať pre admina, reload, pridávanie obrázkov

# Problémy:
- Deployment backendu - pre použitie sequelize


