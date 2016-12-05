'use strict'

import Vue from 'vue'


export default window.initKonnectors.map((konnector) => {
  return {
    id: konnector.slug,

    // TODO: generate backgrounds images
    // form mockups
    headerStyles: {
        //'background-image': `url('/img/${konnector.slug}.jpg')`,
        'background': konnector.color.css
    },

    component: require(`../components/konnectors/${konnector.slug}.vue`),

    // TODO: define success if needed
    // routes: {
    //     success: { name: 'create-account-success' }
    // },

    hub: new Vue()
  }
})