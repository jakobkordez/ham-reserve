import Link from 'next/link';
import { EventsList } from './events-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

export default function AdminEvents() {
  return (
    <div>
      <div className="mb-4 flex items-center">
        <h2 className="flex-1 text-2xl font-medium">Vsi dogodki</h2>

        <Link href="/admin/events/create">
          <FontAwesomeIcon icon={faAdd} className="text-2xl" />
        </Link>
      </div>

      <EventsList />
    </div>
  );
}
