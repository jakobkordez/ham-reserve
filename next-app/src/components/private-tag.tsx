import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function PrivateTag() {
  return (
    <div className="dark:text-light inline-flex select-none items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700">
      <FontAwesomeIcon icon={faLock} />
      <span>Private</span>
    </div>
  );
}
