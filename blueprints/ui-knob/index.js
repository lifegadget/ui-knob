module.exports = {
  description: 'installs bower dependencies',

  normalizeEntityName: function() {
  		// this prevents an error when the entityName is
  		// not specified (since that doesn't actually matter
  		// to us
  	},

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'jquery-knob', target: '~1.2.13' }
    ]);
	}
};
