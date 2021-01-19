let timer;

export default {
  async login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login'
    });
  },
  async signup(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'signup'
    })
  },
  async auth(context, payload) {
    const key = 'AIzaSyCLQQ_H2V_HXLeCt6IfxfeztpZlZI2ASwM';
    const mode = payload.mode;
    let url = (mode === 'login') ? ( 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+key) : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+key;

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true
      })
    });

    const responseData = await response.json();

    if(!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to authenticate. Check your login data.'
      );

      throw error;
    }

    const expiresIn = +responseData.expiresIn * 1000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem('token', responseData.idToken);
    localStorage.setItem('userId', responseData.localId);
    localStorage.setItem('tokenExpiration', expirationDate);
    localStorage.setItem('email', payload.email);

    timer = setTimeout(function() {
      context.dispatch('autoLogout');
    }, expiresIn);

    context.commit('setUser', {
      token: responseData.idToken,
      userId: responseData.localId,
      email: payload.email
    })
  },
  tryLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const email = localStorage.getItem('email');

    const expiresIn = +tokenExpiration - new Date().getTime();

    if(expiresIn < 0) {
      return;
    }

    timer = setTimeout(function() {
      context.dispatch('autoLogout');
    }, expiresIn);

    if(token && userId) {
      context.commit('setUser', {
        token: token,
        userId: userId,
        email: email
      });
    }
  },
  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('email');

    clearTimeout(timer);

    context.commit('setUser', {
      token: null,
      userId: null,
      email: null
    })
  },
  autoLogout(context) {
    context.dispath('logout');
    context.commit('setAutoLogout');
  }
}