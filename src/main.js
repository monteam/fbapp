import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import Breadcrumbs from './components/bread_crumbs'
import { store } from './store';
import VueFeather from 'vue-feather';

import PxCard  from './components/Pxcard.vue'
Vue.component(PxCard.name, PxCard)

// Import Theme scss
import './assets/scss/app.scss'
// import { initFacebookSdk } from './facebook';

Vue.use(VueFeather);
Vue.use(BootstrapVue)
Vue.component('Breadcrumbs', Breadcrumbs)
// Vue.mixin({
//   data: function () {
//     return {
//       access_token: '',
//       signedin: false
//     }
//   }
// })

const facebookAppId = '495623864930553';

function initFacebookSdk () {
    return new Promise(resolve => {
        // wait for facebook sdk to initialize before starting the vue app
        window.fbAsyncInit = function () {
            FB.init({
                appId: facebookAppId,
                cookie: true,
                xfbml: true,
                version: 'v10.0'
            });

            // auto authenticate with the api if already logged in with facebook
            FB.getLoginStatus(({ authResponse }) => {
                if (authResponse) {
                    // access_token = authResponse.accessToken
                    // signedin = true
                    FB.api('/me', {
                      fields: 'name, picture'
                    }, user => {
                      Vue.mixin({
                        data: () => {
                          return {
                            user,
                            access_token: authResponse.accessToken,
                            signedin: true
                          }
                        }
                      })
                      resolve()
                    })
                } else {
                  Vue.mixin({
                    data: () => {
                      return {
                        access_token: '',
                        signedin: false
                      }
                    }
                  })
                  resolve();
                }
            });
        };

        // load facebook sdk script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));    
    });
}

initFacebookSdk().then(() => {
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
});

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')