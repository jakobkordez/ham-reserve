import { ResetPasswordAlert } from '@/components/reset_password_alert';
import { UserComponent } from './user-component';

export default function ProfilePage() {
  return (
    <div className="container flex flex-col gap-8 py-10">
      <ResetPasswordAlert />

      <UserComponent />
    </div>
  );
}
