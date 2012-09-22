/* ***** BEGIN LICENSE BLOCK *****
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/
 * 
 * The Original Code is PersonasShuffler Mozilla Extension.
 * 
 * The Initial Developer of the Original Code is
 * Copyright (C)2012 Diego Casorran <dcasorran@gmail.com>
 * All Rights Reserved.
 * 
 * ***** END LICENSE BLOCK ***** */

function startup(aData, aReason) {
	let {classes: Cc, interfaces: Ci} = Components,t,ps = Cc["@mozilla.org/preferences-service;1"]
		.getService(Ci.nsIPrefService).getBranch('lightweightThemes.');
	try {
		t = ps.getComplexValue('usedThemes',Ci.nsISupportsString).data;
	} catch(e) {}
	if(!t || t.length < 7)
		return;
	t = JSON.parse(t);
	if(t.length < 4)
		t.push(t.shift());
	else {
		let l = t[0].id;
		do {
			t.sort(function() 0.51 - Math.random());
		} while(t[0].id == l);
	}
	let nut = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
	ps.setComplexValue('usedThemes', Ci.nsISupportsString,(nut.data=JSON.stringify(t),nut));
	ps.setBoolPref('persisted.footerURL',false);
	ps.setBoolPref('persisted.headerURL',false);
	ps.setBoolPref('isThemeSelected',true);
	let obs = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
	obs.notifyObservers(null, "lightweight-theme-list-changed", null);
	obs.notifyObservers(null, "lightweight-theme-styling-update",JSON.stringify(t[0]));
	
	if(aReason != APP_STARTUP) {
		
		let tmp = {};
		Components.utils.import('resource://gre/modules/AddonManager.jsm', tmp);
		tmp.AddonManager.getAddonByID(t[0].id+'@personas.mozilla.org',function(addon){
			addon.userDisabled = true;
			addon.userDisabled = false;
		});
	}
}

function shutdown(aData, aReason) {
	if(aReason == ADDON_DISABLE) {
		
		let {classes: Cc, interfaces: Ci} = Components,
			ps = Cc["@mozilla.org/preferences-service;1"]
				.getService(Ci.nsIPrefService).getBranch('lightweightThemes.');
		
		ps.setBoolPref('persisted.footerURL',true);
		ps.setBoolPref('persisted.headerURL',true);
	}
}

function install(aData, aReason) {}
function uninstall(aData, aReason) {}
