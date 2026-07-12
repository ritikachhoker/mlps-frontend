export interface Student {
  name: string;
  class: string;
  section: string;
}

export interface Appointment {

  _id?: string;

  name: string;

  visitorType: 'PARENT' | 'VENDOR';

  mobile: string;

  email: string;

  student?: Student;

  organizationName?: string;

  purpose: string;

  bookingId?: string;

  appointmentDate: string;

  slot: string;

  remarks?: string;

  cancellationReason?: string;

  cancelledAt?: string | null;

  status:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'CANCELLED';

  createdAt?: string;

  updatedAt?: string;
}