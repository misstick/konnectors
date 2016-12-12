// Generated by CoffeeScript 1.11.1
var CH, structuredToFlat,
  slice = [].slice;

module.exports = CH = {};

CH.nToFN = function(n) {
  var familly, given, middle, parts, prefix, suffix;
  n = n || [];
  familly = n[0], given = n[1], middle = n[2], prefix = n[3], suffix = n[4];
  parts = [prefix, given, middle, familly, suffix];
  parts = parts.filter(function(part) {
    return (part != null) && part !== '';
  });
  return parts.join(' ');
};

CH.fnToN = function(fn) {
  fn = fn || '';
  return ['', fn, '', '', ''];
};

CH.fnToNLastnameNFirstname = function(fn) {
  var familly, given, j, middle, parts, ref;
  fn = fn || '';
  ref = fn.split(' '), given = ref[0], middle = 3 <= ref.length ? slice.call(ref, 1, j = ref.length - 1) : (j = 1, []), familly = ref[j++];
  parts = [familly, given, middle.join(' '), '', ''];
  return parts;
};

structuredToFlat = function(t) {
  t = t.filter(function(part) {
    return (part != null) && part !== '';
  });
  return t.join(', ');
};

CH.adrArrayToString = function(value) {
  var countryPart, flat, streetPart;
  value = value || [];
  streetPart = structuredToFlat(value.slice(0, 3));
  countryPart = structuredToFlat(value.slice(3, 7));
  flat = streetPart;
  if (countryPart !== '') {
    flat += '\n' + countryPart;
  }
  return flat;
};

CH.adrCompleteStreet = function(value) {
  value = value || [];
  return structuredToFlat(value.slice(0, 3));
};

CH.adrStringToArray = function(s) {
  s = s || '';
  return ['', '', s, '', '', '', ''];
};

CH.imgUrl2DataUrl = function(uri, callback) {
  var img;
  img = new Image();
  img.onload = function() {
    var IMAGE_DIMENSION, canvas, ctx, dataUrl, ratio, ratiodim;
    IMAGE_DIMENSION = 600;
    ratiodim = img.width > img.height ? 'height' : 'width';
    ratio = IMAGE_DIMENSION / img[ratiodim];
    canvas = document.createElement('canvas');
    canvas.height = canvas.width = IMAGE_DIMENSION;
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, ratio * img.width, ratio * img.height);
    dataUrl = canvas.toDataURL('image/jpeg');
    return callback(null, dataUrl);
  };
  return img.src = uri;
};

CH.getAccount = function(contact, accountType, accountName) {
  var account;
  if (contact.accounts == null) {
    return null;
  }
  account = contact.accounts.filter(function(account) {
    return account.type === accountType && account.name === accountName;
  });
  if (account.length > 0) {
    return account[0];
  } else {
    return null;
  }
};

CH.setAccount = function(contact, account) {
  var current, k, results, v;
  current = CH.getAccount(contact, account.type, account.name);
  if (current != null) {
    results = [];
    for (k in account) {
      v = account[k];
      results.push(current[k] = v);
    }
    return results;
  } else {
    contact.accounts = contact.accounts || [];
    return contact.accounts.push(account);
  }
};

CH.deleteAccount = function(contact, account) {
  var current, i, j, len, ref;
  ref = contact.accounts;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    current = ref[i];
    if (current.type === account.type && current.name === account.name) {
      contacts.accounts.splice(i, 1);
      return true;
    }
  }
  return false;
};

CH.hasAccount = function(contact, accountType, accountName) {
  return CH.getAccount(contact, accountType, accountName) != null;
};

CH.intrinsicRev = function(contact) {
  var asStr, fieldName, fieldNames, j, len, stringDps;
  fieldNames = ['fn', 'n', 'org', 'title', 'bday', 'nickname', 'note'];
  asStr = '';
  for (j = 0, len = fieldNames.length; j < len; j++) {
    fieldName = fieldNames[j];
    if (fieldName in contact && (contact[fieldName] != null) && contact[fieldName] !== '') {
      asStr += fieldName;
      asStr += ': ';
      asStr += contact[fieldName];
      asStr += ', ';
    }
  }
  stringDps = contact.datapoints.map(function(datapoint) {
    var ref, s;
    s = "name:" + datapoint.name + ", type:" + datapoint.type + ", value: ";
    if (datapoint.name === 'adr') {
      return s += CH.adrArrayToString(datapoint.value);
    } else if (datapoint.name === 'tel') {
      return s += (ref = datapoint.value) != null ? ref.replace(/[^\d+]/g, '') : void 0;
    } else {
      return s += datapoint.value;
    }
  });
  if (contact.url != null) {
    stringDps.push("name:url, type:other, value: " + contact.url);
  }
  stringDps.sort();
  asStr += "datapoints: " + stringDps.join(', ');
  return asStr;
};
