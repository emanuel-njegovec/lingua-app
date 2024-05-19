import { createWebHistory, createRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from './store';
import { API_URL } from './config';

import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import QuizView from './views/QuizView.vue';
import QuestionView from './views/QuestionView.vue';

const routes = [
    {
      path: '/',
      component: LoginView
    },
    {
      path: '/home',
      component: HomeView,
      beforeEnter: async (to, from, next) => {
        try {
          const userStore = useUserStore();
          const { data: [userData] } = await axios.get(API_URL + '/auth/profile', { withCredentials: true });
          const { username, user_id: userID } = userData;
          userStore.username = username;
          userStore.userID = userID;
          next();
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      },
      meta: { requiresAuth: true }
    },
    {
      path: '/quiz/:quiz_id',
      component: QuizView,
      name: 'quiz',
      meta: { requiresAuth: true },
    },
    {
      path: '/quiz/:quiz_id/question/:question_id',
      component: QuestionView,
      name: 'question',
      meta: { requiresAuth: true },
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Check if user is authenticated
        axios.get(API_URL + '/auth/check-auth', { withCredentials: true })
          .then(response => {
            if (response.data.authenticated) {
              // User is authenticated, proceed to the route
              userStore.authenticated = true;
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