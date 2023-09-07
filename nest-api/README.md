# Nest.js backend API

```
yarn install
yarn start
```

## Models

### User

```typescript
class User {
  _id: string;
  username: string; // callsign
  password: string;
  roles: string[];
  name: string;
  email: string;
  phone: string;
  auth: string;
  createdAt: Date;
  isDeleted: boolean;
}
```

### Event

```typescript
class Event {
  _id: string;
  callsign: string;
  description: string;
  fromDateTime: Date;
  toDateTime: Date;
  access: User[];
  createdAt: Date;
  isDeleted: boolean;
}
```

### Reservation

```typescript
class Reservation {
  _id: string;
  user: User;
  event: Event;
  fromDateTime: Date;
  toDateTime: Date;
  bands: string[];
  modes: string[];
  createdAt: Date;
  isDeleted: boolean;
}
```
