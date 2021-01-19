import { createStore } from 'vuex';

import authModule from './modules/auth/index.js';
import globersModule from './modules/globers/index.js';

const store = createStore({
  modules: {
    auth: authModule,
    globers: globersModule
  }
});

export default store;