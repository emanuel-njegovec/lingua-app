import { createWebHistory, createRouter } from 'vue-router';
import axios from 'axios';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';

const routes = [
    {
      path: '/',
      component: LoginView
    },
    {
      path: '/home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        axios.get('http://localhost:3000/auth/user-data', { withCredentials: true })
        .then(response => {
          console.log("Received data", response.data);
          next();
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          next('/')});
      },
      meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Check if user is authenticated
        axios.get('http://localhost:3000/auth/profile', { withCredentials: true })
          .then(response => {
            if (response.data.authenticated) {
              // User is authenticated, proceed to the route
              next();
            } else {
              // User is not authenticated, redirect to login page
              next('/');
            }
          })
          .catch(error => {
            // Handle error (e.g., network error)
            console.error('Error checking authentication status:', error);
            // Redirect to login page or display an error message
            next('/');
          });
      } else {
        // Route does not require authentication, proceed
        next();
      }
});

export default router;