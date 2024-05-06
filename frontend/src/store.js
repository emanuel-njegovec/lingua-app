import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        authenticated: false,
        userData: {},
    }),
    actions: {
        async fetchUserData() {
        try {
            /* const response = await fetch('http://localhost:3000/auth/user-data', {
            credentials: 'include',
            }); */
            const response = await axios.get('http://localhost:3000/auth/user-data', { withCredentials: true });
            if (response.ok) {
            const data = await response.json();
            this.userData = data;
            } else {
            console.error('Error fetching user data:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        },
        async checkAuthentication() {
        try {
            /* const response = await fetch('http://localhost:3000/auth/check-auth', {
            credentials: 'include',
            }); */
            const response = await axios.get('http://localhost:3000/auth/check-auth', { withCredentials: true });
            if (response.ok) {
            const data = await response.json();
            this.authenticated = data.authenticated;
            } else {
            console.error('Error checking authentication status:', response.statusText);
            }
        } catch (error) {
            console.error('Error checking authentication status:', error);
        }
        },
    },
});