import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function PrivateTag() {
  return (
    <div className="badge badge-lg select-none gap-2">
      <FontAwesomeIcon icon={faLock} className="text-sm" />
      Private
    </div>
  );
}
