import React from 'react';

const znaki = [
  {
    znak: 'S50YOTA',
    od: '1. 12. 2023',
    do: '31. 12. 2023',
  },
];

export default function Home() {
  return (
    <div className="container flex flex-col gap-10 py-8">
      <div>
        <h2 className="mb-4 text-2xl">Trenutni znaki</h2>

        <div className="grid grid-cols-4">
          {znaki.map((znak, i) => (
            <div
              key={i}
              className="rounded-lg bg-[#f5f5f5] px-6 py-4 shadow-md dark:bg-white/5"
            >
              <div className="mb-2 font-mono text-2xl font-medium">
                {znak.znak}
              </div>
              <div className="text-sm">
                <div>Od: {znak.od}</div>
                <div>Do: {znak.do}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Kako do rezervacije?</h2>
        <Tile title="1. Ustvari račun">
          <p>Registriraj se s klicnim znakom</p>
        </Tile>
        <Tile title="2. Zaprosi za dovoljenje">
          <p>
            Administratorji morajo odobriti tvojo prošnjo za uporabo klicnega
            znaka preden lahko začneš z rezervacijo terminov.
          </p>
        </Tile>
        <Tile title="3. Rezerviraj termin">
          <p>
            Izberi željen klicni znak, termin in frekvenčna območja na katerih
            bi deloval.
          </p>
        </Tile>
        <Tile title="4. Oddaj radioamaterski dnevnik">
          <p>
            Po delu moraš čim prej na sistem objaviti radioamaterski dnevnik v
            ADI formatu. Dnevnik mora vsebovati podatke o klicnem znaku, datumu,
            času (v UTC), frekvenci (ali samo frekvenčnem pasu), načinu dela.
          </p>
        </Tile>
      </div>
    </div>
  );
}

interface TileProps {
  title: string;
  children: React.ReactNode;
  image?: string;
}

function Tile({ title, children, image }: TileProps) {
  return (
    <div className="rounded-lg bg-[#f5f5f5] p-6 shadow-md dark:bg-white/5">
      <div className="mb-2 text-xl font-medium">{title}</div>
      <div>{children}</div>
    </div>
  );
}
