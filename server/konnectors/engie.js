'use strict';

const baseKonnector = require('../lib/base_konnector');

const Bill = require('../models/bill');
/* The goal of this connector is to fetch bills from the
service captaintrain.com */

module.exports = baseKonnector.createNew({
  name: 'Engie',
  slug: 'Engie',
  vendorLink: 'www.engie.fr',

  category: 'energy',
  color: {
    hex: '#00AAFF',
    css: '#00AAFF',
  },

  fields: {
    login: 'email',
    password: 'password',
    folderPath: 'folder',
  },

  models: [Bill]

});
