'use strict'

import Vue from 'vue'


const NOTIFICATIONS = {
  'account.add.success': 'Votre compte a été ajouté avec succés',
  'account.add.error.empty': 'Vous devez renseigner ces champs pour valider votre compte : ${values}.'
}

export default window.initKonnectors.map(function(konnector) {

  const notifs = Object.assign({}, NOTIFICATIONS, konnector.notifications || {})

  return {
    id: konnector.slug,

    headerStyles: {
        'background': konnector.color.css
    },

    component: require('../components/konnector.vue'),

    // TODO: faire un model spécifique pour les vues
    // et pas récupérer tout le connector
    // ?!
    model: konnector,

    // Display redirections when Success or Errors.
    // ie. routes: { success: { name: 'create-account-success' } },
    routes: konnector.routes || null,

    // Display Notifications when Success or Errors.
    // see Konnector.notifications for more details
    notifications: notifs,

    hub: new Vue()
  }
})
