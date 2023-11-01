import { CurrentEvents } from '@/components/current-events';
import { PrivateEvents } from '@/components/private-events';
import { ResetPasswordAlert } from '@/components/reset_password_alert';
import React from 'react';

export default function Home() {
  return (
    <div className="container flex flex-col gap-10 py-8">
      <ResetPasswordAlert />

      <CurrentEvents />

      <PrivateEvents />

      {/* <div className="flex flex-col gap-4">
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
      </div> */}
    </div>
  );
}

// interface TileProps {
//   title: string;
//   children: React.ReactNode;
//   image?: string;
// }

// function Tile({ title, children, image }: TileProps) {
//   return (
//     <div className="rounded-lg bg-gray-100 p-6 shadow-md dark:bg-white/5">
//       <div className="mb-2 text-xl font-medium">{title}</div>
//       <div>{children}</div>
//     </div>
//   );
// }
