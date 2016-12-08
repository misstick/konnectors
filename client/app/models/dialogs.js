'use strict'

import Vue from 'vue'


const NOTIFICATIONS = {
  'account.add.success': 'Votre compte a été ajouté avec succés',
  'account.add.error.empty': 'Vous devez renseigner ces champs pour valider votre compte : ${values}.'
}

export default window.initKonnectors.map((konnector) => {

  const notifs = Object.assign({}, NOTIFICATIONS, konnector.notifications || {})

  return {
    id: konnector.slug,

    // TODO: generate backgrounds images
    // form mockups
    headerStyles: {
        //'background-image': `url('/img/${konnector.slug}.jpg')`,
        'background': konnector.color.css
    },

    component: require(`../components/konnectors/${konnector.slug}.vue`),

    // TODO: faire un model spécifique pour les vues
    // et pas récupérer tout le connector
    // ?!
    model: konnector,

    // Display redirections when Success or Errors.
    // ie. routes: { success: { name: 'create-account-success' } },
    routes: konnector.routes || null,

    // Display Notifications when Success or Errors.
    // ie.
    notifications: notifs,

    hub: new Vue()
  }
})
