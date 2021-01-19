export default {
  async registerGlober(context, data) {
    const userId = context.rootGetters.userId;
    const globerData = {
      email: data.email,
      firstName: data.first,
      lastName: data.last,
      city: data.city,
      team: data.team,
      rol: data.rol,
      skills: data.skill
    };

    const token = context.rootGetters.token;

    const response = await fetch(
      `https://team-factset-default-rtdb.firebaseio.com/globers/${userId}.json?auth=` + token,
      {
        method: 'PUT',
        body: JSON.stringify(globerData)
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || 'Failed to store in database. Check your data.'
      );

      throw error;
    }

    context.commit('registerGlober', {
      ...globerData,
      id: userId
    });
  },
  async loadGlobers(context) {
    const token = context.rootGetters.token;

    const response = await fetch(
      `https://team-factset-default-rtdb.firebaseio.com/globers.json?auth=` + token,
    );
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || 'Failde to fetch!');
      throw error;
    }

    const globers = [];
    let size = 0;

    globers.push(responseData);

    for (const key in responseData) {
      const glober = {
        id: key,
        email: responseData[key].email,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        city: responseData[key].city,
        team: responseData[key].team,
        rol: responseData[key].rol,
        skills: responseData[key].skills
      };
      if(key === context.rootGetters.userId) {
        context.commit('setFirstName', responseData[key].firstName);
        context.commit('setLastName', responseData[key].lastName);
        context.commit('setCity', responseData[key].city);
        context.commit('setTeam', responseData[key].team);
        context.commit('setRol', responseData[key].rol);
        context.commit('setSkills', responseData[key].skills);
      }
      size++;
      globers.push(glober);
    }

    if(globers.length > size) {
      globers.splice(0, 1);
    }

    context.commit('setGlobers', globers);
    context.commit('setFetchTimestamp');
  }
}