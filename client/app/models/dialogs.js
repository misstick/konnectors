'use strict'

import Vue from 'vue'


export default window.initKonnectors.map((konnector) => {
  return {
    id: konnector.slug,

    // TODO: use Transfex such as:
    // t(`${konnector.slug}`)
    title: konnector.name,

    // TODO: generate backgrounds images
    // form mockups
    headerStyles: {
        'background-image': "url('/background/ameli.jpeg')",
        'height': '100px'
    },

    component: require(`../components/konnectors/${konnector.slug}.vue`),

    // TODO: define success if needed
    // routes: {
    //     success: { name: 'create-account-success' }
    // },

    hub: new Vue()
  }
})
