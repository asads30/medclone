import authApi from '@/api/auth';
import { setItem } from '@/helpers/persistanceStorage';

const state = {
    isSubmitting: false,
    isLoading: false,
    currentUser: null,
    validationErrors: null,
    isLoggedIn: null,
};

export const mutationsTypes = {
    registerStart: '[auth] registerStart',
    registerSuccess: '[auth] registerSuccess',
    registerFailure: '[auth] registerFailure',

    loginStart: '[auth] loginStart',
    loginSuccess: '[auth] loginSuccess',
    loginFailure: '[auth] loginFailure',

    getCurrentUserStart: '[auth] getCurrentUserStart',
    getCurrentUserSuccess: '[auth] getCurrentUserSuccess',
    getCurrentUserFailure: '[auth] getCurrentUserFailure',

    updateCurrentUserStart: '[auth] updateCurrentUserStart',
    updateCurrentUserSuccess: '[auth] updateCurrentUserSuccess',
    updateCurrentUserFailure: '[auth] updateCurrentUserFailure',

    logout: '[auth] logout',
};

export const actionTypes = {
    register: '[auth] register',
    login: '[auth] login',
    getCurrentUser: '[auth] getCurrentUser',
    updateCurrentUser: '[auth] updateCurrentUser',
    logout: '[auth] logout',
};

export const getterTypes = {
    currentUser: '[auth] currentUser',
    isLoggedIn: '[auth] isLoggedIn',
    isAnonymus: '[auth] isAnonymus',
};

const getters = {
    [getterTypes.currentUser]: state => {
        return state.currentUser;
    },
    [getterTypes.isLoggedIn]: state => {
        return Boolean(state.isLoggedIn);
    },
    [getterTypes.isAnonymus]: state => {
        return state.isLoggedIn === false;
    },
};

const mutations = {
    [mutationsTypes.registerStart](state) {
        state.isSubmitting = true;
        state.validationErrors = null;
    },
    [mutationsTypes.registerSuccess](state, payload) {
        state.isSubmitting = false;
        state.currentUser = payload;
        state.isLoggedIn = true;
    },
    [mutationsTypes.registerFailure](state, payload) {
        state.isSubmitting = false;
        state.validationErrors = payload;
    },

    [mutationsTypes.loginStart](state) {
        state.isSubmitting = true;
        state.validationErrors = null;
    },
    [mutationsTypes.loginSuccess](state, payload) {
        state.isSubmitting = false;
        state.currentUser = payload;
        state.isLoggedIn = true;
    },
    [mutationsTypes.loginFailure](state, payload) {
        state.isSubmitting = false;
        state.validationErrors = payload;
    },

    [mutationsTypes.getCurrentUserStart](state) {
        state.isLoading = true;
    },
    [mutationsTypes.getCurrentUserSuccess](state, payload) {
        state.isLoading = false;
        state.currentUser = payload;
        state.isLoggedIn = true;
    },
    [mutationsTypes.getCurrentUserFailure](state) {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.currentUser = null;
    },

    [mutationsTypes.updateCurrentUser]() {},
    [mutationsTypes.updateCurrentUserSuccess](state, payload) {
        state.currentUser = payload;
    },
    [mutationsTypes.updateCurrentUserFailure]() {},

    [mutationsTypes.logout](state) {
        state.currentUser = null;
        state.isLoggedIn = false;
    },
};

const actions = {
    [actionTypes.register](context, credentials) {
        return new Promise(resolve => {
            context.commit(mutationsTypes.registerStart);
            authApi
                .register(credentials)
                .then(response => {
                    context.commit(
                        mutationsTypes.registerSuccess,
                        response.data.user,
                    );
                    setItem('accessToken', response.data.user.token);
                    resolve(response.data.user);
                })
                .catch(result => {
                    context.commit(
                        mutationsTypes.registerFailure,
                        result.response.data.errors,
                    );
                });
        });
    },
    [actionTypes.login](context, credentials) {
        return new Promise(resolve => {
            context.commit(mutationsTypes.loginStart);
            authApi
                .login(credentials)
                .then(response => {
                    context.commit(
                        mutationsTypes.loginSuccess,
                        response.data.user,
                    );
                    setItem('accessToken', response.data.user.token);
                    resolve(response.data.user);
                })
                .catch(result => {
                    context.commit(
                        mutationsTypes.loginFailure,
                        result.response.data.errors,
                    );
                });
        });
    },
    [actionTypes.getCurrentUser](context) {
        return new Promise(resolve => {
            context.commit(mutationsTypes.getCurrentUserStart);
            authApi
                .getCurrentUser()
                .then(response => {
                    context.commit(
                        mutationsTypes.getCurrentUserSuccess,
                        response.data.user,
                    );
                    resolve(response.data.user);
                })
                .catch(() => {
                    context.commit(mutationsTypes.getCurrentUserFailure);
                });
        });
    },
    [actionTypes.updateCurrentUser](context, { currentUserInput }) {
        return new Promise(resolve => {
            context.commit(mutationsTypes.updateCurrentUserStart);
            authApi
                .updateCurrentUser(currentUserInput)
                .then(user => {
                    context.commit(
                        mutationsTypes.updateCurrentUserSuccess,
                        user,
                    );
                    resolve(user);
                })
                .catch(result => {
                    context.commit(
                        mutationsTypes.updateCurrentUserFailure,
                        result.response.data.errors,
                    );
                });
        });
    },
    [actionTypes.logout](context) {
        return new Promise(resolve => {
            setItem('accessToken', '');
            context.commit(mutationsTypes.logout);
            resolve();
        });
    },
};

export default {
    state,
    mutations,
    actions,
    getters,
};