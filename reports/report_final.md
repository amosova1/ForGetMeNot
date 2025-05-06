# Info o projekte:
- Meno a priezvisko: Antónia Amosová
- Názov projektu: ForGetMeNot
- Link na repozitár:  https://github.com/amosova1/ForGetMeNot
- Link na verejnú inštanciu projektu: https://forgetmenot-gyrb.onrender.com/

# Info o reportovanej verzii:
- Tag: final 

# Info k testovaniu:
- bežný používateľ: username - abc, heslo - abc
- admin: username - admin, heslo - adminadmin

# Postup, ako rozbehať vývojové prostredie
- naklonovať z git
- npm install
- npm run dev - pre backend a pre frontend samostatne
- npx sequelize-cli db:migrate
- npx sequelize-cli db:seed:all
- na session treba vytvoriť tabuľku cez query

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


# Stav implementácie:
<!-- V bodoch spísať, ktoré funcionality sú už implementované, rozpracované, neimplementované vôbec -->
- Implementované:
- pridávanie / update / delete itemov
- filtrovanie podľa tagov, sekcií, či je film / kniha / všetky
- user vie vytvárať nové tagy, sekcie pri vytváraní / update item
- user vie pridávať viac tagov k jednému itemu
- itemy vedia byť verejné alebo privátne
- admin vie upravovať hodnoty tagov, itemov, userov, ...
- admin vie mazať tagy, itemy, userov, ...

- Rozpracované: 
- pridávanie img k itemu

- Neimplementované:
- admin vie vytvárať tagy, sections, items, userov na admin stránke

# Retrospektíva:
- asi menej funkcionalít na začiatok a viac do budúcna



