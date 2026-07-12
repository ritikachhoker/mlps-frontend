import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
export const routes: Routes = [

  // Public Routes
  {
    path: '',
    loadComponent: () =>
      import('./features/public/home/home')
        .then(m => m.Home)
  },

  {
    path: 'visitor-type',
    loadComponent: () =>
      import('./features/public/visitor-type/visitor-type')
        .then(m => m.VisitorType)
  },

  {
    path: 'existing-parent',
    loadComponent: () =>
      import('./features/public/existing-parent/existing-parent')
        .then(m => m.ExistingParent)
  },

  {
    path: 'new-parent',
    loadComponent: () =>
      import('./features/public/existing-parent/existing-parent')
        .then(m => m.ExistingParent)
  },

  {
    path: 'vendor',
    loadComponent: () =>
      import('./features/public/vendor/vendor')
        .then(m => m.Vendor)
  },

  {
    path: 'business-visitor',
    loadComponent: () =>
      import('./features/public/business-visitor/business-visitor')
        .then(m => m.BusinessVisitor)
  },

  {
    path: 'success',
    loadComponent: () =>
      import('./features/public/success/success')
        .then(m => m.Success)
  },

  // Admin Routes
  // Admin Login (Public)
{
  path: 'admin/login',
  loadComponent: () =>
    import('./features/admin/login/login')
      .then(m => m.Login)
},

// Protected Admin Area
{
  path: 'admin',
  component: AdminLayout,
  canActivate: [authGuard],
  children: [

    {
      path: 'dashboard',
      loadComponent: () =>
        import('./features/admin/dashboard/dashboard')
          .then(m => m.Dashboard)
    },
    // {
    //   path: 'appointment/:id',
    //   loadComponent: () =>
    //     import('./features/admin/appointment-details/appointment-details')
    //       .then(m => m.AppointmentDetails)
    // },

    {
      path: 'appointments',
      loadComponent: () =>
        import('./features/admin/appointments/appointments')
          .then(m => m.Appointments)
    },

    {
      path: 'time-slots',
      loadComponent: () =>
        import('./features/admin/time-slots/time-slots')
          .then(m => m.TimeSlots)
    }

  ]
},

 

  {
    path: '**',
    redirectTo: ''
  }

];