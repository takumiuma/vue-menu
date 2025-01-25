import { createAuth0 } from '@auth0/auth0-vue';

export default defineNuxtPlugin({
  setup() {
    const auth0 = createAuth0({
      domain: '<AUTH0_DOMAIN>',
      clientId: '<AUTH0_CLIENT_ID>',
      authorizationParams: {
        redirect_uri: '<MY_CALLBACK_URL>',
      },
    });
    return {
      provide: {
        auth0,
      },
    };
  },
});
