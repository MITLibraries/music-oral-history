/* Last Updated: Wed Dec 04 18:31:37 -0500 2013 */
/*
 * 3Play Media Plugin, v3.0
 * 3Play Media: Cambridge, MA, USA
 * support@3playmedia.com
 * Â©2013 3Play Media, Inc.  The following software is the sole and exclusive property of 3Play Media, Inc. and may not to be reproduced, modified, distributed or otherwise used, without the written approval of 3Play Media, Inc.  We have granted approval to our paying customers while they are our customers to reproduce, modify and use (but not distribute) this software for their own internal use only.  This means that if you are not a paying customer of 3Play Media, Inc., you may not reproduce, modify, distribute or otherwise use the code.
 * Paying customers who are permitted and do use this software are hereby advised that this software is provided "as is" and any express or implied warranties, including but not limited to, an implied warranty of merchantability and fitness for a particular purpose are disclaimed.  In no event shall 3Play Media, Inc. be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including but not limited to, procurement or substitute goods or services, loss of use, data or profits, or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.
 */
function run_p3() {
	if (!p3_window_loaded && p3_window_wait || !p3_loader_complete) return !1;
	typeof window.p3_async_before_init != "undefined" && window.p3_async_before_init(), typeof window.p3_async_init != "undefined" && window.p3_async_init(), typeof p3_instances != "undefined" && typeof p3_api_key != "undefined" && P3.init(p3_instances, p3_api_key), typeof window.p3_async_after_init != "undefined" && window.p3_async_after_init()
}

function receiveOoyalaP3Event(a, b, c) {
	switch (b) {
		case "apiReady":
			p3_ooyala_initialized.push(a);
			break;
		case "playheadTimeChanged":
			var d = P3.find_instance_by_player_reference(a);
			d && (d.player.interface.playhead_time = parseInt(parseFloat(c.playheadTime) * 1e3));
			break;
		case "stateChanged":
			P3.Log.log("Ooyala state change: " + c.state);
			break;
		case "currentItemEmbedCodeChanged":
			break;
		case "embedCodeChanged":
			var e = c.embedCode,
				d = P3.find_instance_by_player_reference(e);
			d.player_reference = a, p3_ooyala_interfaces[a] = d.player.interface, P3.Log.info("Ooyala Current Embed Code Changed");
			break;
		case "totalTimeChanged":
			var d = P3.find_instance_by_player_reference(a);
			d && (d.player.interface.total_time = parseInt(parseFloat(c.totalTime) * 1e3))
	}
}

function html5_kaltura_play_handler() {
	P3.get(0).player.interface.player_state = "PLAYING"
}

function html5_kaltura_pause_handler() {
	P3.get(0).player.interface.player_state = "PAUSED"
}

function html5_kaltura_update_playhead(a) {
	P3.get(0).player.interface.player_state = "PLAYING", P3.get(0).player.interface.playhead_time = 1e3 * parseFloat(a)
}

function p3_listen(a, b, c) {
	P3.JQuery(P3.get(a)).bind(b, c)
}
var P3 = {
	instances: [],
	init: function(a, b) {
		if (!P3.is_compatible()) return !1;
		P3.Settings.api_key = P3.Settings.api_key || b;
		var c = P3.instances.length,
			d = !1;
		for (i in a) a[i].debugger_ui && (d = !0), P3.instances.push(new P3.create_instance(i, a[i], c)), c++;
		d && (P3.debugger_ui = new P3.DebuggerUI)
	},
	is_compatible: function() {
		return P3.browser_invalid() ? !1 : !0
	},
	browser_invalid: function() {
		switch (!0) {
			case P3.JQuery.browser.msie && parseFloat(P3.JQuery.browser.version) < 6:
				return !0
		}
		return !1
	},
	create_instance: function(a, b, c) {
		this.instance_index = c, this.settings = b, b.api_version == "simple" && b.project_id && (P3.Settings.api_host = P3.Settings.api_host.replace(/\.com.*$/, ".com") + "/p/projects/" + b.project_id, P3.Settings.static_host = P3.Settings.static_host.replace(/\.com.*$/, ".com") + "/p/projects/" + b.project_id), this.player_reference = a, this.player = new P3.Player(this, a, b), this.event = new P3.Event(this), this.settings.transcript && this.settings.transcript.target && (this.transcript = new P3.Transcript(this, b)), this.settings.playlist && this.settings.playlist.target && (this.playlist = new P3.Playlist(this, b)), this.settings.captions && (this.captions = new P3.Captions(this, b));
		if (this.settings.collection && this.settings.collection.target) {
			var d = this.instance_index;
			P3.Util.load_remote_script(P3.Settings.p3_host + "/javascripts/P3.Collection.js", function() {
				P3.get(d).collection = new P3.Collection(P3.get(d), P3.get(d).settings)
			})
		}
		if (this.settings.video_search && this.settings.video_search.target) {
			var d = this.instance_index;
			P3.Util.load_remote_script(P3.Settings.p3_host + "/javascripts/P3.VideoSearch.js", function() {
				P3.get(d).video_search = new P3.VideoSearch(P3.get(d), P3.get(d).settings)
			})
		}
		if (p3_extensions && p3_extensions.length > 0)
			for (var e = 0; e < p3_extensions.length; e++) {
				var f = p3_extensions[e].split("/").slice(-1)[0].replace(/\..*$/, "").replace(/\-/g, "_"),
					g = P3.Util.to_camel_case(f);
				this.settings[f] && (this[f] = new P3[g](this, b))
			}
	},
	clear_instance: function(a) {
		if (typeof a == "number") var b = P3.instances[a];
		else if (typeof a == "string") var b = P3.find_instance_by_player_reference(a);
		if (!b) return P3.Log.error("Could not find instance to clear: " + a), !1;
		b.player.stop_tracking(), b.transcript && b.transcript.die(), b.captions && b.captions.die(), b.transcript = b.captions = null, P3.instances.splice(a, 1), P3.index_instances()
	},
	index_instances: function() {
		for (var a = 0; a < P3.instances.length; a++) P3.instances[a].instance_index = a
	},
	find_instances_by_file_id: function(a) {
		var b = [];
		return P3.JQuery.each(P3.instances, function(c) {
			if (P3.instances[c].settings.file_id == a) return b.push(P3.instances[c]), !1
		}), b
	},
	find_instances_by_video_id: function(a) {
		var b = [];
		return P3.JQuery.each(P3.instances, function(c) {
			if (P3.instances[c].settings.platform_integration && P3.instances[c].settings.file_id == a) return b.push(P3.instances[c]), !1
		}), b
	},
	find_instance_by_player_reference: function(a) {
		var b = !1;
		return P3.JQuery.each(P3.instances, function(c) {
			if (P3.instances[c].player_reference == a) return b = P3.instances[c], !1
		}), b
	},
	get: function(a) {
		return typeof a == "number" ? this.instances[a] ? this.instances[a] : !1 : this.find_instance_by_player_reference(a)
	}
};
P3.About = {
	supported_players: {
		brightcove: "Brightcove",
		delve: "Delve / Limelight",
		flowplayer: "Flowplayer",
		jw: "JW Player",
		kaltura: "Kaltura",
		ooyala: "Ooyala",
		vimeo: "Vimeo",
		vimeo_iframe: "Vimeo IFRAME",
		wistia: "Wistia",
		wistia_iframe: "Wistia IFRAME",
		youtube: "YouTube",
		soundmanager2: "SoundManager 2",
		html5: "HTML5",
		video_js: "Video.js"
	},
	plugins: {
		transcript: {
			label: "Interactive Transcript",
			support_doc: "http://support.3playmedia.com/forums/20752837-Interactive-Transcript"
		},
		captions: {
			label: "Captions",
			support_doc: "http://support.3playmedia.com/forums/20884686-Captions-Plugin"
		}
	},
	hosted_extensions: {
		captions_style: {
			label: "Captions Style",
			support_doc: !1
		}
	}
};
var p3_window_loaded = !1,
	p3_loader_complete = !1;
p3_window_wait = typeof p3_window_wait == "undefined" ? !0 : p3_window_wait, p3_jquery_ui = typeof p3_jquery_ui == "undefined" ? !0 : p3_jquery_ui, p3_external_stylesheet = typeof p3_external_stylesheet == "undefined" ? !1 : p3_external_stylesheet, p3_hosted_extensions = typeof p3_hosted_extensions == "undefined" ? [] : p3_hosted_extensions, p3_extensions = typeof p3_extensions == "undefined" ? [] : p3_extensions,
function(a, b, c, d) {
	var e, f = !1,
		g = this,
		h = {}, i = [];
	this.all_loaded = function() {
		for (var a = 0; a < i.length; a++)
			if (!(status = h[i[a]]) && status != "loaded" && status != "complete") return !1;
		return !0
	}, this.run_script = function() {
		if (f) return !0;
		P3.JQuery = a.jQuery, d(P3.JQuery.noConflict(!0), f = !0)
	}, this.load_script = function(a) {
		i.push(a)
	}, this.run = function(a) {
		if (i[a]) {
			var c = i[a],
				d = a,
				e = /\.css$/i.test(c.replace(/\?.*/, "")),
				h = b.createElement(e ? "link" : "script");
			h.type = e ? "text/css" : "text/javascript", e ? (h.rel = "stylesheet", h.href = c) : h.src = c, h.onload = h.onreadystatechange = function() {
				if (typeof h.readyState != "undefined" && h.readyState != "complete" && h.readyState != "loaded") return !1;
				i.length - 1 == d && f == 0 ? g.run_script() : g.run(d + 1)
			};
			var j = b.getElementsByTagName("head")[0];
			j = j || b.body, j.appendChild(h)
		} else g.run_script()
	};
	var j = "p3.3playmedia.com",
		k = [];
	k.push(j + "/javascripts/vendor/jquery-1.6.2.min.js"), p3_jquery_ui && k.push(j + "/javascripts/vendor/jquery-ui-1.8.16.custom.min.js"), k.push(j + "/javascripts/vendor/ejs_production.js");
	try {
		if (p3_extensions && p3_extensions.length > 0)
			for (var l = 0; l < p3_extensions.length; l++) k.push(p3_extensions[l].replace(/^https*\:\/\//, ""))
	} catch (m) {}
	var n = "/stylesheets/p3.css",
		o = [j + n];
	p3_external_stylesheet && o.push(p3_external_stylesheet);
	var p = [];
	for (l in P3.About.hosted_extensions) p.push(l);
	if (p3_hosted_extensions && p3_hosted_extensions.length > 0)
		for (var l = 0; l < p3_hosted_extensions.length; l++)
			if (p.indexOf(p3_hosted_extensions[l]) >= 0) {
				var q = j + "/javascripts/extensions/" + p3_hosted_extensions[l] + "/" + p3_hosted_extensions[l] + ".js",
					r = j + "/javascripts/extensions/" + p3_hosted_extensions[l] + "/" + p3_hosted_extensions[l] + ".css";
				k.push(q), o.push(r), p3_extensions.push(p3_hosted_extensions[l])
			} else console && console.log && console.log("Warning: P3 Hosted Extension '" + p3_hosted_extensions[l] + "' was not found.");
	for (var l = 0; l < k.length; l++) load_script(b.location.protocol + "//" + k[l]);
	for (var l = 0; l < o.length; l++) load_script(b.location.protocol + "//" + o[l]);
	this.run(0)
}(window, document, "1.6.2", function(a) {
	p3_loader_complete = !0, run_p3()
}), window.addEventListener ? window.addEventListener("load", function() {
	p3_window_loaded = !0, p3_window_wait && run_p3()
}, !1) : window.attachEvent ? window.attachEvent("onload", function() {
	p3_window_loaded = !0, p3_window_wait && run_p3()
}) : p3_window_loaded = !0, P3.Settings = {
	host: null,
	is_ssl: /https/.test(document.location.protocol),
	api_host: document.location.protocol + "//api.3playmedia.com",
	api_key: null,
	api_version: 2,
	static_host: document.location.protocol + "//static.3playmedia.com",
	p3_host: document.location.protocol + "//p3.3playmedia.com",
	platform_integration: !1,
	debug: !1,
	debugger_ui: !1,
	domain: document.domain,
	major_version: "3",
	version: "3.3",
	player_tracking_interval: 250
}, P3.Util = {
	basename: function(a) {
		return a.split(/[\/\\]/).slice(-1)
	},
	ms_to_stamp: function(a) {
		var b = parseInt(a) / 1e3,
			c = parseInt(b / 60);
		return b %= 60, b = b < 10 ? "0" + b : b, (c + ":" + b).replace(/\.\d*$/, "")
	},
	stamp_to_ms: function(a) {
		a = a.replace(/\,/g, ".");
		var b = a.split(/\:/),
			c = parseFloat(b[b.length - 1]),
			d = parseInt(b[b.length - 2], 10),
			e = b.length > 2 ? parseInt(b[b.length - 3], 10) : 0;
		return 1e3 * (3600 * e + 60 * d + c)
	},
	player_type: function(a) {
		var b = P3.JQuery("#" + a);
		b.length < 1 && (b = P3.JQuery("[name=" + a + "]"));
		var c = P3.JQuery(b).attr("name"),
			d = P3.JQuery(b).attr("class"),
			e = P3.JQuery(b).attr("src"),
			a = P3.JQuery(b).attr("id"),
			f = P3.JQuery(b).get(0).tagName.toLowerCase();
		if (f == "iframe") switch (!0) {
			case /vimeo/i.test(d) || /vimeo/i.test(a) || /vimeo/i.test(e):
				return "vimeo_iframe";
			case /wistia/i.test(d) || /wistia/i.test(a):
				return "wistia_iframe"
		} else switch (!0) {
			case typeof b.get(0).addModelListener != "undefined" && b.get(0).sendEvent != "undefined":
				return "jw";
			case /(player\d*?\.swf|jw)/.test(e):
				return "jw";
			case /kaltura/i.test(e) || /kaltura/i.test(a) || /kalturai/.test(d):
				return "kaltura";
			case /brightcove/i.test(d) || /brightcove/i.test(a):
				return "brightcove";
			case /wistia/i.test(d) || /wistia/i.test(a):
				return "wistia";
			case /youtube/i.test(e):
				return "youtube"
		}
	},
	params: function(a) {
		var b = location.href.split("#");
		if (b.length < 2) return !1;
		var c = b.slice(-1)[0].split("&"),
			d = {};
		for (i = 0; i < c.length; i++) b = c[i].split(":"), d[b[0]] = b[1];
		return a ? d[a] || !1 : d
	},
	in_array: function(a, b) {
		var c = b.length;
		for (var d = 0; d < c; d++)
			if (b[d] == a) return !0;
		return !1
	},
	to_camel_case: function(a) {
		return a = a.replace(/^\s+|\s+$/, ""), a = a.replace(/[\-\_]([a-z])/g, function(a, b) {
			return b.toUpperCase()
		}), a.charAt(0).toUpperCase() + a.slice(1)
	},
	truncate: function(a, b, c, d) {
		return a.length > c - 3 ? a.slice(0, c) + ".." : a
	},
	tooltip: function(a, b, c) {
		if (P3.Util.is_ipad()) return !1;
		c = c || !1;
		var d = P3.JQuery("<div></div>");
		P3.JQuery(".p3-tooltip").fadeOut("fast", function() {
			P3.JQuery(this).remove()
		}), P3.JQuery(d).addClass("p3-tooltip"), c && P3.JQuery(d).addClass(c), P3.JQuery(d).css({
			position: "absolute",
			zIndex: 9999999999,
			top: Math.max(0, a.pageY + 10),
			left: a.pageX + 10
		}), P3.JQuery(d).html(b), P3.JQuery(document.body).append(d), P3.JQuery(a.target).mouseout(function(a) {
			setTimeout(function() {
				P3.JQuery(d).remove()
			}, 50)
		})
	},
	load_remote_script: function(a, b) {
		var c = document.createElement("script");
		c.src = a, c.type = "text/javascript";
		if (b) {
			c.onload = c.onreadystatechange = function() {
				if (typeof c.readyState != "undefined" && c.readyState != "complete" && c.readyState != "loaded") return !1;
				b()
			};
			var d = document.getElementsByTagName("script")[0];
			d.parentNode.insertBefore(c, d)
		} else P3.JQuery("script").get(0).parentNode.appendChild(c)
	},
	alert: function(a) {
		P3.Log.error(a)
	},
	print: function(a, b) {
		var c = "toolbar=yes,location=no,directories=yes,menubar=yes,";
		c += "scrollbars=yes,width=750, height=600, left=100, top=25";
		var d = window.open("", "", c);
		return d.document.open(), d.document.write("<html><head><title>Print Preview</title></head>"), d.document.write('<body style="padding:4px;">'), d.document.write("<p>"), d.document.write('<input type="button" onclick=javascript:window.print(); value="Print This Document"/>'), d.document.write("</p><hr/>"), d.document.write(a), d.document.write("<hr/>"), d.document.write("<p>"), d.document.write('<img src="http://p3.3playmedia.com/images/logo/interactive-transcript-logo-black.png"/>'), d.document.write("</p>"), d.document.write("</body></html>"), d.document.close(), b || d.print(), !1
	},
	selected_html: function() {
		try {
			var a;
			if (window.getSelection) {
				a = window.getSelection();
				if (a.getRangeAt) var b = a.getRangeAt(0);
				else {
					var b = document.createRange();
					b.setStart(a.anchorNode, a.anchorOffset), b.setEnd(a.focusNode, a.focusOffset)
				}
				var c = b.cloneContents(),
					d = c.childNodes;
				for (i = 0; i < d.length; i++) d[i].style && (d[i].style.backgroundColor = "#fff");
				var e = document.createElement("div");
				return e.appendChild(c), e.innerHTML
			}
			return document.selection ? (a = document.selection.createRange(), a.htmlText) : !1
		} catch (f) {
			return !1
		}
	},
	window_dimensions: function() {
		var a = 630,
			b = 460;
		return document.body && document.body.offsetWidth && (a = document.body.offsetWidth, b = document.body.offsetHeight), document.compatMode == "CSS1Compat" && document.documentElement && document.documentElement.offsetWidth && (a = document.documentElement.offsetWidth, b = document.documentElement.offsetHeight), window.innerWidth && window.innerHeight && (a = window.innerWidth, b = window.innerHeight), {
			width: a,
			height: b
		}
	},
	is_ios: function() {
		return navigator.userAgent.match(/iPad/i) != null || navigator.userAgent.match(/iPod/i) != null
	},
	is_ipad: function() {
		return navigator.userAgent.match(/iPad/i) != null
	},
	is_ie: function() {
		return P3.JQuery.browser.msie
	},
	is_ie6: function() {
		return P3.JQuery.browser.msie && parseInt(P3.JQuery.browser.version) < 7
	},
	is_crappy_ie: function() {
		return P3.JQuery.browser.msie && parseInt(P3.JQuery.browser.version) < 8
	},
	nice_searchbox: function(a) {
		var b = a.classname || "a",
			c = a.placeholder || "";
		return setTimeout(function() {
			P3.JQuery.browser.webkit && P3.JQuery("." + b).val("")
		}, 10), '<input type="text" class="p3-nice-search srch_fld ' + b + '" placeholder="' + c + '" autosave="bsn_srch" results="5" />'
	},
	shorten_url: function(a, b, c) {
		var d = "3playmedia",
			e = "R_586ba8f060b4fbccf2b5978d88f40fcc",
			f = "http://api.bit.ly/v3/shorten?login=" + d;
		f += "&apiKey=" + e, f += "&longUrl=" + encodeURIComponent(a), f += "&format=json&callback=?", P3.JQuery.getJSON(f, function(a) {
			var d = a.data.url;
			c && c(d, b)
		})
	},
	render_segment_map: function(a, b, c) {
		var d = 40,
			e = Math.min(a.total_num, d),
			f = Math.ceil(a.total_num / e),
			g = Math.ceil(a.total_num / f),
			h = b.video_id,
			j = b.file_id,
			k = P3.JQuery("<table></table>"),
			l = P3.JQuery("<tbody></tbody>"),
			m = P3.JQuery("<tr></tr>");
		P3.JQuery(l).append(m), P3.JQuery(k).append(l);
		var n = {};
		P3.JQuery.each(a, function(a, b) {
			n[b.number] = b.timestamp
		});
		for (i = 0; i < g; i++) {
			var o = P3.JQuery("<td></td>");
			P3.JQuery(o).attr("num", f * i + 1), P3.JQuery(o).attr("segs_per", f), P3.JQuery(o).attr("video_id", h), P3.JQuery(o).attr("file_id", j), P3.JQuery(o).html("<span>" + c + "</span>"), P3.JQuery(m).append(o)
		}
		return P3.JQuery(m).attr("video_id", h), P3.JQuery(m).attr("file_id", j), P3.JQuery.each(a.hits, function(b) {
			var c = Math.floor((a.hits[b].number - 1) / f);
			P3.JQuery(k).find("td:eq(" + c + ")").removeClass("*").addClass("hit")
		}), P3.JQuery(k).html()
	}
}, P3.Cookies = {
	set_cookie: function(a, b, c) {
		var d = new Date;
		d.setDate(d.getDate() + c);
		var e = escape(b) + (c == null ? "" : "; expires=" + d.toUTCString());
		document.cookie = a + "=" + e
	},
	get_cookie: function(a) {
		var b, c, d, e = document.cookie.split(";");
		for (b = 0; b < e.length; b++) {
			c = e[b].substr(0, e[b].indexOf("=")), d = e[b].substr(e[b].indexOf("=") + 1), c = c.replace(/^\s+|\s+$/g, "");
			if (c == a) return unescape(d)
		}
	}
}, P3.Log = {
	log: function(a) {
		P3.debugger_ui && P3.debugger_ui.logger(a);
		if (!P3.Settings.debug) return !1;
		typeof window.console != "undefined" && typeof window.console.log != "undefined" && console.log(a)
	},
	debug: function(a) {
		if (!P3.Settings.debug) return !1;
		typeof window.console != "undefined" && typeof window.console.debug != "undefined" && console.debug(a)
	},
	info: function(a) {
		if (!P3.Settings.debug) return !1;
		typeof window.console != "undefined" && typeof window.console.info != "undefined" && console.info(a)
	},
	warn: function(a) {
		if (!P3.Settings.debug) return !1;
		typeof window.console != "undefined" && typeof window.console.warn != "undefined" && console.warn(a)
	},
	error: function(a, b) {
		if (!P3.Settings.debug) return !1;
		typeof window.console != "undefined" && typeof window.console.error != "undefined" ? console.error(a) : b && b(a)
	},
	object: function(a) {
		if (!P3.Settings.debug) return !1;
		typeof window.console != "undefined" && typeof window.console.dir != "undefined" && console.dir(a)
	}
}, P3.Event = function(a) {
	var b = this;
	this.instance = a, this.trigger = function(a, c) {
		var a = a,
			c = c;
		setTimeout(function() {
			P3.JQuery(b.instance).trigger(a, c)
		}, 0), event_name = a.split("."), P3.Log.debug("Event Triggered: " + a), P3.debugger_ui && P3.debugger_ui.event_logger(a, c)
	}, this.Player = {
		Progress: function() {}
	}
}, P3.Player = function(a, b, c) {
	var d = this,
		e = P3.JQuery;
	this.instance = a, this.player_id = b, this.player = e("#" + b), this.interval = !1, this.last_m = -99, this.interface = !1, this.find_player_interval = setInterval(function() {
		if (/closest\_player/.test(b)) try {
			var a = e("object,embed").get(0);
			a || (a = e("iframe").get(0));
			if (!a) return !1;
			e(a).attr("id") || e(a).attr("id", "3play_auto_id"), b = e(a).attr("id"), d.instance.player_reference = b, d.player_id = b, d.player = e("#" + b), d.instance.settings.player_type == "auto" && (d.instance.settings.player_type = P3.Util.player_type(b))
		} catch (f) {
			return !1
		}
		d.instance.settings.player_type == "auto" && (d.instance.settings.player_type = P3.Util.player_type(b));
		if (c.html5_container_id && e("#" + c.html5_container_id).find("video,audio").length > 0) {
			d.player = e("#" + c.html5_container_id).find("video,audio:first"), d.player_id = e(d.player).attr("id");
			if (!d.player_id) {
				var g = "tpm_" + parseInt(1e8 * Math.random());
				e(d.player).attr("id", g), d.player_id = g
			}
			d.instance.settings.player_type = "html5", d.instance.player_reference = d.player_id
		}
		P3.Log.debug("Finding player with ID " + b + "..."), d.interface && d.interface.position && clearInterval(d.find_player_interval);
		if (!e("#" + b)) return !1;
		var h = d.instance.settings.player_type || P3.Util.player_type(b);
		h = h.toLowerCase().replace(/^\s+|\s+$/, ""), d.player_type = h;
		try {
			d.interface = new P3.PlayerInterface[h](d.instance.player_reference, d.instance), d.instance.event.trigger("Player.Ready", {
				player_id: b,
				player_type: h
			})
		} catch (f) {
			P3.Log.error(f), d.interface = !1;
			var j = [];
			for (i in P3.PlayerInterface) j.push(i);
			if (P3.Util.in_array(h, j)) return !1;
			P3.Util.alert("Player Type " + h + " is not supported.\nSupported Players: " + j.join(", "))
		}
	}, 250), this.start_tracking = function() {
		d.interval = setInterval(function() {
			if (d.interface && d.interface.play_state && d.interface.play_state() == "PLAYING") {
				var a = d.interface.position(),
					b = d.instance.settings.platform_integration ? d.interface.video_id() : !1;
				d.instance.event.trigger("Player.Progress", {
					m: a,
					video_id: b
				}), d.last_m = a
			}
		}, P3.Settings.player_tracking_interval)
	}, this.stop_tracking = function() {
		clearInterval(d.interval)
	}, this.load_video = function(a) {
		if (!a.video_id) return !1;
		d.interface.play_file(a), m = a.m || 0, d.instance.settings.file_id = a.video_id, d.instance.event.trigger("Player.VideoLoad", {
			video_id: a.video_id,
			m: m
		})
	}, e(a).bind("Player.Ready", function(a, b) {
		!d.onload_seek_handled && P3.Util.params("p3s") && (!P3.Util.params("p3i") || P3.Util.params("p3i") == d.instance.instance_index) && (d.ready_to = setInterval(function() {
			if (!d.interface || !d.interface.play) return !1;
			d.interface.play(), clearInterval(d.ready_to)
		}, 10))
	}), e(a).bind("Player.Progress", function(a, b) {
		if (!d.onload_seek_handled && P3.Util.params("p3s") && (!P3.Util.params("p3i") || P3.Util.params("p3i") == d.instance.instance_index)) {
			var c = parseInt(P3.Util.params("p3s"), 10);
			d.onload_seek_handled = !0, d.interface.play(), d.play_video_id = P3.Util.params("p3v") || !1, d.seek_to_m = c, d.pause_at_m = P3.Util.params("p3e") || !1
		} else if (d.play_video_id) d.play_video_id != d.interface.video_id() && d.interface.play_file({
			video_id: d.play_video_id
		}), d.play_video_id = !1;
		else if (d.seek_to_m && d.interface.play_state() == "PLAYING") {
			if (d.instance.player.seek_to_video_id) {
				if (d.instance.player.seek_to_video_id != d.instance.player.interface.video_id()) return !1;
				d.instance.player.seek_to_video_id = !1
			}
			d.interface.seek(d.seek_to_m), d.seek_to_m = !1
		} else d.pause_at_m && d.pause_at_m < b.m - 1e3 && (d.interface.pause(), d.pause_at_m = !1)
	}), this.start_tracking()
}, P3.PlayerInterface = {
	brightcove: function(a, b) {
		if (brightcove && brightcove.api && brightcove.api.getExperience(a)) {
			var c = this;
			c.instance = b, this.bcExp = brightcove.api.getExperience(a), this.modVP = this.bcExp.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER), this.modExp = this.bcExp.getModule(brightcove.api.modules.APIModules.EXPERIENCE), this.modCon = this.bcExp.getModule(brightcove.api.modules.APIModules.CONTENT);
			if (!this.modVP.addEventListener) return !1;
			this.modVP.addEventListener(brightcove.api.events.MediaEvent.PROGRESS, function(a) {
				c.player_info.position = parseInt(1e3 * parseFloat(a.position), 10), c.player_info.videoid = a.media.id
			}), this.player_info = {
				position: 0,
				is_playing: !1
			}, this.play = function() {
				return this.modVP.play()
			}, this.pause = function() {
				return this.modVP.pause()
			}, this.play_state = function() {
				var a = !1;
				return this.modVP.getIsPlaying(function(a) {
					c.player_info.is_playing = a
				}), c.player_info.is_playing ? "PLAYING" : "PAUSED"
			}, this.position = function() {
				return this.player_info.position
			}, this.duration = function() {
				return this.modVP.getVideoDuration(function(a) {
					c.player_info.duration = 1e3 * a
				}), c.player_info.duration || !1
			}, this.video_id = function() {
				return this.modVP.getCurrentVideo(function(a) {
					c.player_info.videoid = a.id
				}), c.player_info.videoid || !1
			}, this.seek = function(a) {
				this.play_state() == "PAUSED" ? (this.play(), setTimeout(function() {
					c.modVP.seek(parseInt(a / 1e3, 10))
				}, 100)) : this.modVP.seek(parseInt(a / 1e3, 10))
			}, this.play_file = function(a) {
				a.video_id != this.video_id() ? (this.modVP.loadVideoByID(a.video_id), c.instance.player.seek_to_m = a.m || 0, c.instance.player.seek_to_video_id = a.video_id) : this.seek(a.m)
			}
		} else {
			if (!brightcove || !brightcove.getExperience(a)) return !1;
			var c = this;
			c.instance = b, this.bcExp = brightcove.getExperience(a), this.modVP = this.bcExp.getModule(APIModules.VIDEO_PLAYER), this.modExp = this.bcExp.getModule(APIModules.EXPERIENCE), this.modCon = this.bcExp.getModule(APIModules.CONTENT);
			if (!this.modVP.addEventListener) return !1;
			this.modVP.addEventListener(BCMediaEvent.PLAY, function(a) {}), this.modVP.addEventListener(BCMediaEvent.STOP, function(a) {}), this.modVP.addEventListener(BCMediaEvent.BEGIN, function(a) {}), this.modVP.addEventListener(BCMediaEvent.PROGRESS, function(a) {
				c.player_info.position = parseInt(1e3 * parseFloat(a.position), 10), c.player_info.videoid = a.media.id
			}), this.modExp.addEventListener(BCExperienceEvent.CONTENT_LOAD, function(a) {}), this.player_info = {
				position: 0
			}, this.play = function() {
				return this.modVP.play()
			}, this.pause = function() {
				return this.modVP.pause()
			}, this.play_state = function() {
				return this.modVP.isPlaying() ? "PLAYING" : "PAUSED"
			}, this.position = function() {
				return this.player_info.position
			}, this.duration = function() {
				return 1e3 * this.modVP.getVideoDuration()
			}, this.video_id = function() {
				return this.modVP.getCurrentVideo().id
			}, this.seek = function(a) {
				this.play_state() == "PAUSED" ? (this.play(), setTimeout(function() {
					c.modVP.seek(parseInt(a / 1e3, 10))
				}, 100)) : this.modVP.seek(parseInt(a / 1e3, 10))
			}, this.play_file = function(a) {
				a.video_id != this.video_id() ? (this.modVP.loadVideo(a.video_id), c.instance.player.seek_to_m = a.m || 0, c.instance.player.seek_to_video_id = a.video_id) : this.seek(a.m)
			}
		}
	},
	delve: function(a, b) {
		var c = this;
		c.instance = b;
		if (typeof DelvePlayer == "undefined") return !1;
		this.delve_id = a, DelvePlayer.registerPlayer(a), this.delve_player = function() {
			var a = DelvePlayer.getPlayers(c.delve_id)[0];
			return typeof a == "string" ? document.getElementById(a) : a
		}, this.play = function() {
			c.delve_player().doPlay()
		}, this.pause = function() {
			c.delve_player().doPause()
		}, this.play_state = function(a) {
			return c.delve_player().doGetCurrentPlayState().isPlaying ? "PLAYING" : "PAUSED"
		}, this.position = function() {
			return c.delve_player().doGetPlayheadPositionInMilliseconds()
		}, this.duration = function() {
			return c.delve_player().doGetCurrentMedia().durationInMilliseconds
		}, this.video_id = function() {
			return c.delve_player().doGetCurrentMedia().id
		}, this.seek = function(a) {
			c.delve_player().doSeekToSecond(a / 1e3)
		}, this.play_file = function(a) {
			a.video_id != this.video_id() ? (c.delve_player().doLoadMedia(a.video_id, !0), c.instance.player.seek_to_m = a.m || 0, c.instance.player.seek_to_video_id = a.video_id) : this.seek(a.m)
		}
	},
	flowplayer: function(a, b) {
		var c = this;
		c.instance = b;
		if (typeof flowplayer == "undefined") return !1;
		this.flow_player = a, this.play = function() {
			return flowplayer(this.flow_player).play()
		}, this.pause = function() {
			return flowplayer(this.flow_player).pause()
		}, this.play_state = function(a) {
			var b = flowplayer(this.flow_player).getState();
			switch (b) {
				case 3:
					return "PLAYING";
				default:
					return "PAUSED"
			}
		}, this.position = function() {
			return flowplayer(this.flow_player).getTime() * 1e3
		}, this.duration = function() {
			return 1e3 * parseFloat(flowplayer(this.flow_player).getClip().fullDuration())
		}, this.video_id = function() {
			return flowplayer(this.flow_player).getClip().url.replace(/^.+?\:/, "")
		}, this.seek = function(a) {
			var b = Math.max(0, a / 1e3 - 1);
			flowplayer(this.flow_player).seek(b)
		}
	},
	jw: function(a, b) {
		var c = this;
		c.instance = b;
		if (typeof jwplayer != "undefined" && jwplayer(a) && jwplayer(a).play) this.jw_player = jwplayer(a), this.play = function() {
			c.jw_player.play()
		}, this.pause = function() {
			c.jw_player.pause()
		}, this.play_state = function() {
			return c.jw_player.getState() == "PLAYING" ? "PLAYING" : "PAUSED"
		}, this.position = function() {
			return c.jw_player.getPosition() * 1e3
		}, this.duration = function() {
			return c.jw_player.getDuration() * 1e3
		}, this.video_id = function() {
			try {
				var a = c.jw_player.getPlaylistItem().sources[0].file.split("/").slice(-1)[0];
				return a
			} catch (b) {
				return ""
			}
		}, this.seek = function(a) {
			c.jw_player.seek(a / 1e3)
		};
		else {
			if (!window.document[a] || typeof window.document[a].addModelListener == "undefined") return !1;
			this.jw_player = window.document[a], p3_jw_interfaces[a] = new PlayerInterfaceExtension_JW(this), this.jw_player.addModelListener("STATE", 'p3_jw_interfaces["' + a + '"].play_handler'), this.jw_player.addModelListener("TIME", 'p3_jw_interfaces["' + a + '"].playhead_handler'), this.play = function() {
				c.jw_player.sendEvent("PLAY", "true")
			}, this.pause = function() {
				c.jw_player.sendEvent("PLAY", "false")
			}, this.play_state = function() {
				return this.player_state
			}, this.position = function() {
				return this.playhead_time
			}, this.duration = function() {
				return 1e3 * this.jw_player.getPlaylist()[c.jw_player.getConfig().item].duration
			}, this.video_id = function() {
				var a = this.jw_player.getPlaylist()[c.jw_player.getConfig().item].file;
				return a.split(/\//).slice(-1)[0].replace(/\-.*$/, "")
			}, this.seek = function(a) {
				var b = parseInt(a, 10) / 1e3;
				b = Math.max(0, b - 1), c.jw_player.sendEvent("SEEK", b)
			}
		}
	},
	kaltura: function(a, b) {
		var c = this;
		c.instance = b, this.kaltura_player = P3.JQuery("#" + a).get(0);
		if (!this.kaltura_player || !this.kaltura_player.addJsListener) return !1;
		this.player_state = !1, this.playhead_time = 0, this.player_id = a, p3_kaltura_interfaces[c.player_id] = new PlayerInterfaceExtension_Kaltura(c), c.kaltura_player.addJsListener("playerPlayed", 'p3_kaltura_interfaces["' + c.player_id + '"].play_handler'), c.kaltura_player.addJsListener("playerPaused", 'p3_kaltura_interfaces["' + c.player_id + '"].pause_handler'), c.kaltura_player.addJsListener("playerPlayEnd", 'p3_kaltura_interfaces["' + c.player_id + '"].pause_handler'), c.kaltura_player.addJsListener("playerUpdatePlayhead", 'p3_kaltura_interfaces["' + c.player_id + '"].playhead_handler'), this.play = function() {
			this.kaltura_player.sendNotification("doPlay")
		}, this.pause = function() {
			this.kaltura_player.sendNotification("doPause")
		}, this.play_state = function() {
			return this.player_state
		}, this.position = function() {
			return this.playhead_time
		}, this.duration = function() {
			return this.kaltura_player.evaluate("{mediaProxy.entry.msDuration}")
		}, this.video_id = function() {
			return this.kaltura_player.evaluate("{mediaProxy.entry.id}")
		}, this.seek = function(a) {
			this.kaltura_player.sendNotification("doSeek", parseFloat(parseInt(a) / 1e3))
		}, this.play_file = function(a) {
			if (a.video_id != this.video_id()) {
				var b = a.m || 0;
				this.kaltura_player.sendNotification("changeMedia", {
					entryId: a.video_id,
					seekFromStart: b.toString()
				}), this.timer = setInterval(function() {
					if (c.play_state() == "PLAYING" && c.video_id() == a.video_id) return clearInterval(c.timer), !0;
					c.play()
				}, 200)
			} else this.seek(a.m)
		}
	},
	ooyala: function(a, b) {
		var c = this;
		c.instance = b;
		if (window[a] && typeof window[a].play != "undefined") this.play = function() {
			window[a].play()
		}, this.pause = function() {
			window[a].pause()
		}, this.play_state = function() {
			return window[a].state == "playing" ? "PLAYING" : "PAUSED"
		}, this.position = function() {
			return parseInt(1e3 * (window[a].playheadTime || 0), 10)
		}, this.duration = function() {
			return parseInt(1e3 * window[a].getDuration(), 10)
		}, this.seek = function(b) {
			var b = parseInt(b, 10) / 1e3;
			window[a].setPlayheadTime(b)
		}, this.video_id = function() {
			return window[a].embedCode
		}, this.play_file = function(b) {
			b.video_id != c.video_id() ? (m = b.m || 0, window[a].setEmbedCode(b.video_id), c.instance.player.seek_to_m = m, c.instance.player.seek_to_video_id = b.video_id) : c.seek(b.m)
		};
		else if (P3.Util.is_ipad()) {
			this.ooyala_player = P3.JQuery(".OoyalaHtml5VideoPlayer").get(0);
			if (!this.ooyala_player) return !1;
			this.ooyala_player = function() {
				return P3.JQuery(".OoyalaHtml5VideoPlayer").get(0)
			}, this.ooyala_video_tag = function() {
				return P3.JQuery(this.ooyala_player()).find("video:first").get(0)
			}, this.play = function() {
				this.ooyala_player().playMovie()
			}, this.pause = function() {
				this.ooyala_player().pauseMovie()
			}, this.play_state = function() {
				return this.ooyala_video_tag().paused ? "PAUSED" : "PLAYING"
			}, this.position = function() {
				return parseInt(this.ooyala_video_tag().currentTime * 1e3, 10)
			}, this.duration = function() {
				return parseInt(this.ooyala_video_tag().duration * 1e3, 10)
			}, this.video_id = function() {
				return this.ooyala_player().getEmbedCode()
			}, this.seek = function(a) {
				var a = parseInt(a, 10) / 1e3;
				a = Math.max(0, a - 1), this.ooyala_video_tag().currentTime = a
			}, this.play_file = function(a) {
				a.video_id != c.video_id() ? (m = a.m || 0, this.ooyala_player().setQueryStringParameters({
					embedCode: a.video_id,
					autoplay: 1
				}), c.instance.player.seek_to_m = m, c.instance.player.seek_to_video_id = a.video_id) : this.seek(a.m)
			}
		} else {
			if (!p3_ooyala_interfaces[a]) return !1;
			this.ooyala_player = window.document[a], this.playhead_time = 0, this.total_time = 0, this.play = function() {
				this.ooyala_player.playMovie()
			}, this.pause = function() {
				this.ooyala_player.pauseMovie()
			}, this.play_state = function() {
				return this.ooyala_player.getState().toUpperCase()
			}, this.position = function() {
				return this.playhead_time
			}, this.duration = function() {
				return this.total_time
			}, this.video_id = function() {
				return this.ooyala_player.getCurrentItemEmbedCode()
			}, this.seek = function(a) {
				var b = Math.max(0, parseInt(a, 10) / 1e3 - 1);
				this.ooyala_player.setPlayheadTime(b)
			}, this.play_file = function(a) {
				a.video_id != c.video_id() ? (m = a.m || 0, this.ooyala_player.setQueryStringParameters({
					embedCode: a.video_id,
					autoplay: 1
				}), c.instance.player.seek_to_m = m, c.instance.player.seek_to_video_id = a.video_id) : this.seek(a.m)
			}
		}
	},
	video_js: function(a, b) {
		var c = this;
		c.instance = b, this.player_id = a;
		if (typeof _V_ == "undefined") return !1;
		this.play = function() {
			_V_(a).play()
		}, this.pause = function() {
			_V_(a).pause()
		}, this.play_state = function() {
			return _V_(a).paused() ? "PAUSED" : "PLAYING"
		}, this.position = function() {
			return 1e3 * _V_(a).currentTime()
		}, this.duration = function() {
			return 1e3 * _V_(a).duration()
		}, this.video_id = function() {
			return !1
		}, this.seek = function(b) {
			var d = parseInt(b, 10) / 1e3;
			_V_(a).currentTime(d), c.play()
		}, this.play_file = function(a) {
			return !1
		}
	},
	vimeo: function(a, b) {
		var c = this;
		c.instance = b, this.player_state = !1, this.playhead_time = 0, this.vimeo_player = document.getElementById(a);
		if (typeof this.vimeo_player == "undefined" || typeof this.vimeo_player.api_addEventListener == "undefined") return !1;
		p3_vimeo_interfaces[a] = new PlayerInterfaceExtension_Vimeo(this), this.vimeo_player.api_addEventListener("onPlay", 'p3_vimeo_interfaces["' + a + '"].play_handler'), this.vimeo_player.api_addEventListener("onPause", 'p3_vimeo_interfaces["' + a + '"].pause_handler'), this.vimeo_player.api_addEventListener("onLoading", 'p3_vimeo_interfaces["' + a + '"].pause_handler'), this.vimeo_player.api_addEventListener("onFinish", 'p3_vimeo_interfaces["' + a + '"].pause_handler'), this.vimeo_player.api_addEventListener("onProgress", 'p3_vimeo_interfaces["' + a + '"].playhead_handler'), this.play = function() {
			this.vimeo_player.api_play()
		}, this.pause = function() {
			this.vimeo_player.api_pause()
		}, this.play_state = function() {
			return this
				.player_state
		}, this.position = function() {
			return this.playhead_time
		}, this.duration = function() {
			return this.vimeo_player.api_getDuration()
		}, this.video_id = function() {
			try {
				var a = P3.JQuery(this.vimeo_player).find("param[name=flashVars]").val();
				return a.match(/clip\_id\=(\d+)\&*/)[1]
			} catch (b) {
				return null
			}
		}, this.seek = function(a) {
			var b = Math.max(0, a / 1e3 - 1);
			this.vimeo_player.api_seekTo(b)
		}
	},
	vimeo_iframe: function(a, b) {
		var c = this;
		c.instance = b, this.vimeo_player_id = a;
		if (typeof $f == "undefined") return !1;
		this.vimeo_player = $f(a);
		if (!this.vimeo_player) return !1;
		this.playhead_time = 0, this.player_state = "PAUSED", this.duration = !1, p3_vimeo_iframe_interfaces[a] = new PlayerInterfaceExtension_VimeoIframe(this), this.vimeo_player.addEvent("play", function(a) {
			p3_vimeo_iframe_interfaces[c.vimeo_player_id].play_handler(a)
		}), this.vimeo_player.addEvent("onPause", function(a) {
			p3_vimeo_iframe_interfaces[c.vimeo_player_id].pause_handler(a)
		}), this.vimeo_player.addEvent("onLoading", function(a) {
			p3_vimeo_iframe_interfaces[c.vimeo_player_id].pause_handler(a)
		}), this.vimeo_player.addEvent("onFinish", function(a) {
			p3_vimeo_iframe_interfaces[c.vimeo_player_id].pause_handler(a)
		}), this.vimeo_player.addEvent("playProgress", function(a, b) {
			p3_vimeo_iframe_interfaces[c.vimeo_player_id].playhead_handler(a, b)
		}), this.play = function() {
			c.vimeo_player.api("play")
		}, this.pause = function() {
			c.vimeo_player.api("pause")
		}, this.play_state = function() {
			return this.player_state
		}, this.position = function() {
			return this.playhead_time || 0
		}, this.duration = function() {
			if (c.duration) return duration;
			c.vimeo_player.get("getDuration", function(a, b) {
				c.duration = a
			})
		}, this.seek = function(a) {
			var b = Math.max(0, a / 1e3 - 1);
			c.vimeo_player.api("seekTo", b)
		}, this.video_id = function() {
			try {
				var a = c.vimeo_player.element.src.split("/").slice(-1)[0].replace(/\?.*/, "");
				return a
			} catch (b) {
				return !1
			}
		}
	},
	wistia: function(a, b) {
		var c = this;
		c.instance = b, this.wistia_player = window.document[a];
		if (typeof this.wistia_player == "undefined" || typeof this.wistia_player.videoPlay == "undefined") this.wistia_player = P3.JQuery("embed[name=" + a + "]");
		if (typeof this.wistia_player == "undefined" || typeof this.wistia_player.videoPlay == "undefined") this.wistia_player = P3.JQuery("#" + a).find("embed").get(0);
		if (typeof this.wistia_player == "undefined" || typeof this.wistia_player.videoPlay == "undefined") this.wistia_player = P3.JQuery("#" + a).find("object").get(0);
		this.play = function() {
			c.wistia_player.videoPlay()
		}, this.pause = function() {
			c.wistia_player.videoPause()
		}, this.play_state = function(a) {
			return c.wistia_player.getCurrentState() == 1 ? "PLAYING" : "PAUSED"
		}, this.position = function() {
			return c.wistia_player.getCurrentTime() * 1e3
		}, this.duration = function() {
			return parseInt(c.wistia_player.getDuration()) * 1e3
		}, this.video_id = function() {
			return !1
		}, this.seek = function(a) {
			var b = (a - 2500) / 1e3;
			c.wistia_player.videoSeek(Math.max(0, b))
		}
	},
	wistia_iframe: function(a, b) {
		var c = this;
		c.instance = b, this.wistia_player = document.getElementById(a);
		if (typeof this.wistia_player == "undefined") return !1;
		if (typeof this.wistia_player.wistiaApi == "undefined") return !1;
		this.play = function() {
			c.wistia_player.wistiaApi.play()
		}, this.pause = function() {
			c.wistia_player.wistiaApi.pause()
		}, this.play_state = function() {
			return c.wistia_player.wistiaApi.state().toLowerCase() == "playing" ? "PLAYING" : "PAUSED"
		}, this.position = function() {
			return c.wistia_player.wistiaApi.time() * 1e3
		}, this.duration = function() {
			return c.wistia_player.wistiaApi.duration() * 1e3
		}, this.video_id = function() {
			return !1
		}, this.seek = function(a) {
			var b = a / 1e3;
			c.wistia_player.wistiaApi.time(b).play()
		}
	},
	youtube: function(a, b) {
		var c = this;
		c.instance = b, this.youtube_player = window.document[a], this.play = function() {
			this.youtube_player.playVideo()
		}, this.pause = function() {
			this.youtube_player.pauseVideo()
		}, this.play_state = function() {
			var a = this.youtube_player.getPlayerState();
			return parseInt(a) == 1 || parseInt(a) == 5 ? "PLAYING" : "PAUSED"
		}, this.position = function() {
			return parseInt(this.youtube_player.getCurrentTime() * 1e3 + .5)
		}, this.duration = function() {
			return this.youtube_player ? parseInt(this.youtube_player.getDuration() * 1e3 + .5) : !1
		}, this.video_id = function() {
			try {
				var a = this.youtube_player.getVideoUrl().replace(/^[^v]+v.(.{11}).*/, "$1");
				return a
			} catch (b) {
				return null
			}
		}, this.seek = function(a) {
			var a = parseInt(a, 10) / 1e3;
			this.youtube_player.seekTo(a)
		}, this.play_file = function(a) {
			var b = a.video_id,
				d = a.m || 0;
			d = parseInt(d, 10);
			if (!b) return !1;
			if (b != this.video_id()) try {
				this.youtube_player.loadVideoById(b), c.instance.player.seek_to_m = d, c.instance.player.seek_to_video_id = b
			} catch (e) {} else this.play(), this.seek(d)
		}
	},
	soundcloud: function(a, b) {
		var c = this;
		c.instance = b, c.player_id = a;
		if (SC && SC.Widget && SC.Widget(a)) c.player_position = 0, c.player_state = "PAUSED", c.player_video_id = !1, c.player_duration = !1, SC.Widget(c.player_id).bind("playProgress", function(a) {
			c.player_position = a.currentPosition, c.player_state = "PLAYING"
		}), SC.Widget(c.player_id).bind("pause", function(a) {
			c.player_state = "PAUSED"
		}), SC.Widget(c.player_id).bind("finish", function(a) {
			c.player_state = "PAUSED"
		}), this.play = function() {
			SC.Widget(c.player_id).play()
		}, this.pause = function() {
			SC.Widget(c.player_id).pause()
		}, this.play_state = function() {
			return c.player_state
		}, this.position = function() {
			return c.player_position
		}, this.duration = function() {
			return c.player_duration
		}, this.video_id = function() {
			return c.player_video_id
		}, this.seek = function(a) {
			SC.Widget(c.player_id).seekTo(a)
		}, this.load_meta = function() {
			SC.Widget(c.player_id).getCurrentSound(function(a) {
				c.player_duration = a.duration, c.player_video_id = a.id
			}), SC.Widget(c.player_id).get
		}, this.load_meta();
		else return !1
	},
	soundmanager2: function(a, b) {
		var c = this;
		c.instance = b;
		if (!(soundManager && soundManager.soundIDs.indexOf(a) >= 0)) return !1;
		var d = soundManager.getSoundById(a);
		this.play = function() {
			d.play()
		}, this.pause = function() {
			d.pause()
		}, this.play_state = function() {
			return d.playState == 1 && d.paused == 0 ? "PLAYING" : "PAUSED"
		}, this.position = function() {
			return d.position
		}, this.duration = function() {
			return d.duration
		}, this.video_id = function() {
			return d.url.split("/").slice(-1)[0]
		}, this.seek = function(a) {
			d.setPosition(a)
		}
	},
	sublime: function(a, b) {
		var c = this;
		c.instance = b;
		if (typeof sublime == "undefined" || typeof sublime.player == "undefined") return !1;
		if (typeof sublime.player(a) == "undefined") return !1;
		c.player_id = a, c.player_state = !1, sublime.player(c.player_id).on({
			start: function(a) {
				c.player_state = "PLAYING"
			},
			end: function(a) {
				c.player_state = "PAUSED"
			},
			timeUpdate: function(a, b) {
				c.player_state = "PLAYING"
			},
			stop: function(a) {
				c.player_state = "PAUSED"
			},
			pause: function(a) {
				c.player_state = "PAUSED"
			},
			play: function(a) {
				c.player_state = "PLAYING"
			}
		}), this.play = function() {
			sublime.player(c.player_id).play()
		}, this.pause = function() {
			sublime.player(c.player_id).pause()
		}, this.play_state = function() {
			return c.player_state
		}, this.position = function() {
			return sublime.player(c.player_id).playbackTime() * 1e3
		}, this.duration = function() {
			return parseInt(sublime.player(c.player_id).duration() * 1e3, 10)
		}, this.video_id = function() {
			return !1
		}, this.seek = function(a) {
			var b = a / 1e3;
			sublime.player(c.player_id).seekTo(b)
		}
	},
	html5: function(a, b) {
		var c = this;
		c.instance = b;
		var d = P3.JQuery("#" + a);
		if (d.length == 0) return !1;
		d.get(0).tagName.toLowerCase() != "video" && (d = P3.JQuery(d).find("video,audio")), this.html5_player = d.get(0), typeof this.html5_player != "undefined" && typeof this.html5_player.play != "undefined" && (this.play = function() {
			this.html5_player.play()
		}, this.pause = function() {
			this.html5_player.pause()
		}, this.play_state = function() {
			return this.html5_player.paused ? "PAUSED" : "PLAYING"
		}, this.position = function() {
			return parseInt(this.html5_player.currentTime * 1e3, 10)
		}, this.duration = function() {
			return parseInt(this.html5_player.duration * 1e3, 10)
		}, this.video_id = function() {
			return !1
		}, this.seek = function(a) {
			var a = parseInt(a, 10) / 1e3;
			a = Math.max(0, a - 1), this.html5_player.currentTime = a
		})
	}
};
var p3_ooyala_interfaces = {}, p3_kaltura_interfaces = {};
PlayerInterfaceExtension_Kaltura = function(a) {
	var b = this;
	this.player_interface = a, this.kaltura_player_id = a.kaltura_player.id, this.play_handler = function() {
		b.player_interface.player_state = "PLAYING"
	}, this.pause_handler = function() {
		b.player_interface.player_state = "PAUSED"
	}, this.playhead_handler = function(a) {
		b.player_interface.playhead_time = 1e3 * parseFloat(a)
	}
};
var p3_jw_interfaces = {};
PlayerInterfaceExtension_JW = function(a) {
	var b = this;
	this.player_interface = a, this.jw_player_id = a.jw_player.id, this.play_handler = function(a) {
		b.player_interface.player_state = a.newstate == "PLAYING" ? "PLAYING" : "PAUSED"
	}, this.playhead_handler = function(a) {
		b.player_interface.playhead_time = parseFloat(a.position) * 1e3
	}
};
var p3_vimeo_interfaces = {};
PlayerInterfaceExtension_Vimeo = function(a) {
	var b = this;
	this.player_interface = a, this.vimeo_player_id = a.vimeo_player.id, this.play_handler = function() {
		b.player_interface.player_state = "PLAYING"
	}, this.pause_handler = function() {
		b.player_interface.player_state = "PAUSED"
	}, this.playhead_handler = function(a, c) {
		b.player_interface.player_state = "PLAYING", b.player_interface.playhead_time = 1e3 * parseFloat(a)
	}
};
var p3_vimeo_iframe_interfaces = {};
PlayerInterfaceExtension_VimeoIframe = function(a) {
	var b = this;
	this.player_interface = a, this.vimeo_player_id = a.vimeo_player.id, this.play_handler = function(a) {
		b.player_interface.player_state = "PLAYING"
	}, this.pause_handler = function(a) {
		b.player_interface.player_state = "PAUSED"
	}, this.playhead_handler = function(a, c) {
		b.player_interface.player_state = "PLAYING", b.player_interface.playhead_time = 1e3 * parseFloat(a.seconds)
	}
}, P3.Transcript = function(instance, options) {
	var $ = P3.JQuery,
		parent = this;
	this.instance = instance, this.file = {}, this.cache_id = parseInt(1e6 * Math.random()), this.transcript_cache = {}, this.stemmer = !1, this.skin_dependencies = {
		hot_pink: "basic_color",
		blue_pro: "basic_color",
		cardinal_red: "basic_color",
		zesty_orange: "basic_color",
		darth_gecko: "gecko",
		sunburst: "basic_textured",
		wood: "basic_textured",
		metallic: "basic_textured",
		ice: "frost"
	}, this.settings = {
		skin: "frost",
		ie6_skin: "ice",
		width: "400px",
		height: "400px",
		file_id: !1,
		can_print: !1,
		can_download: !1,
		can_clip: !1,
		can_collapse: !1,
		collapse_label: "",
		expand_label: "",
		vertical_collapse: !1,
		scan_view: !1,
		scan_view_buffer: 50,
		collapse_onload: !1,
		hide_onerror: !1,
		track_alt: !1,
		progressive_tracking: !1,
		track_highlighted_words: !1,
		keyup_search: !1,
		transcript_search_offset: 3e3,
		transcript_versions: !1,
		transcript_url: !1,
		transcript_url_convention: !1,
		cross_domain_loader: !1,
		cross_domain_dynamic_callback: !1,
		search_transcript_stemming: !0,
		search_placeholder: "Search Video",
		transcript_offset: !1,
		transcript_start: !1,
		transcript_end: !1,
		locked: !0,
		global_unlock: !1,
		light_scroll: !1,
		template: "default",
		api_key: !1
	}, this.init = function() {
		$.each(options.transcript, function(a) {
			parent.settings[a] = options.transcript[a]
		});
		if (!parent.settings.target) return !1;
		parent.settings.file_id || (parent.settings.file_id = parent.instance.settings.file_id), parent.settings.api_key || (parent.settings.api_key = P3.Settings.api_key), P3.Util.is_ie6() && parent.settings.ie6_skin && (parent.settings.skin = parent.settings.ie6_skin);
		if (parent.settings.search_transcript_stemming) {
			var a = /https/i.test(document.location.protocol) ? "https://s3.amazonaws.com/origin-p3.3playmedia.com" : "http://p3.3playmedia.com";
			P3.Util.load_remote_script(a + "/javascripts/vendor/Snowball.min.js")
		}
		this.render(), this.listen()
	}, this.die = function() {
		$(this.transcript_container).find("span").die("click"), $(this.transcript_container).die("click"), $(this.container).find("a").die("click"), $(this.container).find(".print").die("click"), $(this.container).find(".download").die("click"), $(this.container).find(".scan-view").die("click"), $(this.container).find(".p3-timeline").die("click"), $(this.container).find(".pointer").die("click"), $(this.container).find(".pointer").die("mouseover"), $(this.container).find(".p3-transcript-button").die("click"), $(this.container).find(".p3-transcript-button").die("mouseover"), $(this.container).children().remove(), parent.instance.event.trigger("Transcript.Die")
	}, this.container = $("#" + options.transcript.target), this.transcript_container = {}, this.render = function() {
		var a = parent.templates[parent.settings.template] ? parent.settings.template : "default",
			b = (new EJS({
				text: parent.templates[a],
				type: "["
			})).render(parent.settings);
		$(this.container).html(b), parent.transcript_container = $(this.container).find(".p3-transcript-main"), parent.apply_skin(), P3.Util.is_ie() && (parent.settings.width = parseInt(parent.settings.width, 10) + 2 + "px", parent.settings.height = parseInt(parent.settings.height, 10) + 2 + "px"), $(this.container).find(".p3-transcript-container").css({
			width: parent.settings.width,
			height: parent.settings.height
		}), $(this.container).find("input[type=text]").each(function() {
			var a = $(this).val();
			$(this).attr("oval", a)
		}), this.resolve_transcript_height(), this.transcript_request(), parent.settings.can_collapse && parent.settings.collapse_label && $(parent.container).find(".p3-transcript-button.collapse").addClass("visible-label"), parent.settings.can_collapse && parent.settings.collapse_onload && parent.collapse(), parent.instance.event.trigger("Transcript.TemplateRendered")
	}, this.listen = function() {
		$(this.container).find("input[type=text]").live("click", function(a) {
			$(this).val() == $(this).attr("oval") && $(this).val("")
		}), $(this.container).find(".p3-transcript-search").live("keyup", function(a) {
			var b = a.keyCode || a.which;
			b == 27 && ($(this).val(""), parent.search_transcript("")), parent.settings.keyup_search && (parent.keyup_search_timeout && clearTimeout(parent.keyup_search_timeout), parent.keyup_search_timeout = setTimeout(function() {
				var a = $(parent.container).find(".p3-transcript-search").val();
				parent.search_transcript(a, "topbar_search")
			}, 333))
		}), $(this.container).find(".p3-transcript-bottom-search-submit").live("click", function(a) {
			var b = $(parent.container).find(".p3-transcript-bottom-search").val();
			parent.search_transcript(b, "bottombar_search")
		}), $(this.container).find(".p3-transcript-bottom-search").live("keyup", function(a) {
			var b = a.keyCode || a.which;
			if (b == 27) $(this).val(""), parent.search_transcript("");
			else if (b == 13) {
				var c = $(this).val();
				parent.search_transcript(c, "bottombar_search")
			}
			parent.settings.keyup_search && (parent.keyup_search_timeout && clearTimeout(parent.keyup_search_timeout), parent.keyup_search_timeout = setTimeout(function() {
				var a = $(parent.container).find(".p3-transcript-bottom-search").val();
				parent.search_transcript(a, "bottombar_search")
			}, 333))
		}), $(this.container).find(".p3-transcript-searchform").submit(function(a) {
			var b = $(this).find(".p3-transcript-search").val();
			return parent.search_transcript(b), !1
		}), $(this.container).find(".p3-transcript-search-reset").live("click", function(a) {
			$(parent.container).find(".p3-transcript-search,.p3-transcript-bottom-search").val(""), parent.search_transcript("")
		}), $(this.container).find(".p3-bottombar-reset-search").live("click", function(a) {
			parent.search_transcript(""), $(parent.container).find(".p3-transcript-bottom-search").val("")
		}), $(this.container).find(".print").live("click", function(a) {
			parent.print_transcript()
		}), $(this.container).find(".download").live("click", function(a) {
			location.href = parent.download_url()
		}), $(this.container).find(".scan-view").live("click", function(a) {
			var b = $(this).find("span").html();
			b == "Scan View" ? (parent.load_scan_view(), $(this).find("span").html("Loading")) : (parent.clear_scan_view(), $(this).find("span").html("Scan View"))
		}), $(this.container).find(".p3-timeline,.p3-bottombar-timeline").live("click", function(a) {
			var b = (a.offsetX || a.layerX) / $(this).outerWidth(),
				c = b * parent.file.duration;
			parent.instance.player.interface.seek(c)
		}), $(this.container).find(".pointer").live("click", function(a) {
			var b = parseInt($(this).attr("m"), 10) - parent.settings.transcript_search_offset;
			return parent.instance.player.interface.seek(b), !1
		}), $(this.container).find(".pointer").live("mouseover", function(e) {
			var next_word = $(parent.transcript_container).find("span[m=" + $(this).attr("m") + "]"),
				msg = [],
				counter = 0;
			while (next_word.length > 0 && counter < 7) msg.push($(next_word).html()), counter += 1, next_word = $(next_word).next();
			var re = eval("/(" + parent.saved_search_term + ")/gi");
			P3.Util.tooltip(e, msg.join(" ").replace(re, "<b>$1</b>"), parent.settings.skin)
		}), $(this.container).find(".p3-transcript-button").live("click", function(a) {
			$(this).hasClass("locked") ? ($(this).removeClass("locked"), $(this).addClass("unlocked"), $(this).find("span").html("Lock"), parent.settings.locked = !1, parent.settings.global_unlock = !0) : $(this).hasClass("unlocked") && ($(this).removeClass("unlocked"), $(this).addClass("locked"), $(this).find("span").html("Unlock"), parent.settings.locked = !0, parent.settings.global_unlock = !1)
		}), $(this.container).find(".p3-transcript-button").live("mouseover", function(a) {
			var b = !1,
				c = $(a.target);
			switch (!0) {
				case c.hasClass("print"):
					b = "Print Transcript";
					break;
				case c.hasClass("download"):
					b = "Download Transcript";
					break;
				case c.hasClass("locked"):
					b = "Disable Transcript Auto-Scrolling";
					break;
				case c.hasClass("unlocked"):
					b = "Enable Transcript Auto-Scrolling";
					break;
				case c.hasClass("collapse"):
					b = "Hide Interactive Transcript";
					break;
				case c.hasClass("expand"):
					b = "View Interactive Transcript";
					break;
				case c.hasClass("clip-inactive"):
					b = "Highlight Text to Share Clips";
					break;
				case c.hasClass("clip-active"):
					b = "Share Highlighted Clip"
			}
			b != 0 && P3.Util.tooltip(a, b)
		}), $(this.transcript_container).live("click", function(a) {
			var b = a.target;
			if (b.tagName.toLowerCase() != "span") return !1;
			var c = $(b).attr("m"),
				d = $(b).html();
			parent.instance.event.trigger("Transcript.WordClick", {
				m: c,
				word: d,
				current_m: parent.instance.player.interface.position()
			}), parent.instance.player.interface.seek(c)
		}), $(this.transcript_container).mouseover(function(a) {
			parent.settings.locked = !1
		}), $(this.transcript_container).mouseout(function(a) {
			parent.settings.locked = !0
		}), $(this.transcript_container).mousedown(function(a) {
			parent.settings.can_clip && $(parent.container).find(".clip-active").removeClass("clip-active").addClass("clip-inactive")
		}), $(this.transcript_container).mouseup(function(a) {
			parent.handle_selected_text()
		}), $(this.container).find(".collapse").live("click", function(a) {
			parent.collapse()
		}), $(this.container).find(".expand").live("click", function(a) {
			parent.expand()
		}), $(this.container).find(".p3-transcript-versions").change(function(a) {
			var b = $(this).val().replace(/^\s+|\s+$/, "");
			parent.settings.transcript_url = b, parent.transcript_request()
		}), $(this.container).find(".p3-close-social-sharing").live("click", function(a) {
			return $(parent.container).find(".p3-social-sharing").remove(), !1
		}), $(this.container).find(".clip-active").live("click", function(a) {
			parent.start_clip_share()
		}), $(this.container).find(".p3-tweet-clip").live("click", function(a) {
			parent.tweet_clip(parent.settings.current_clip_selection, a)
		}), $(this.container).find(".p3-facebook-clip").live("click", function(a) {
			parent.facebook_clip(parent.settings.current_clip_selection, a)
		}), $(this.container).find(".p3-get-shortened-link").live("click", function(a) {
			parent.get_shortened_link(parent.settings.current_clip_selection, a)
		})
	}, this.collapse = function() {
		var a = $(this.container).find(".collapse");
		a.addClass("expand"), a.removeClass("collapse"), parent.settings.expand_label && a.find("span").html(parent.settings.expand_label), $(parent.container).find(".p3-transcript-main, .p3-transcript-controller, .p3-transcript-mediabar").hide();
		var b = $(parent.container).find(".p3-transcript-container").height();
		$(parent.container).find(".p3-transcript-container").attr("cache-height", b), $(parent.container).find(".p3-transcript-container").css("height", "auto"), $(parent.container).find(".scan-view").hide(), parent.instance.event.trigger("Transcript.Collapse")
	}, this.expand = function() {
		var a = $(this.container).find(".expand");
		a.removeClass("expand"), a.addClass("collapse"), parent.settings.collapse_label && a.find("span").html(parent.settings.collapse_label), $(parent.container).find(".p3-transcript-main, .p3-transcript-controller, .p3-transcript-mediabar").show(), $(parent.container).find(".p3-transcript-container").css("height", $(this).attr("cache-height")), $(parent.container).find(".scan-view").show(), parent.instance.event.trigger("Transcript.Expand")
	}, this.apply_skin = function(a) {
		a = a || parent.settings.skin, a = parent.skin_dependencies[a] ? parent.skin_dependencies[a] + " " + a : a;
		if (a) {
			var b = $(this.container).find(".p3-transcript-container"),
				c = b.attr("class").split(/\s+/);
			$.each(c, function(a) {
				var d = c[a];
				d != "p3-transcript-container" && b.removeClass(d)
			}), b.addClass(a), setTimeout(function() {
				parent.resolve_transcript_height()
			}, 10), setTimeout(function() {
				parent.resolve_transcript_height()
			}, 50), setTimeout(function() {
				parent.resolve_transcript_height()
			}, 100), setTimeout(function() {
				parent.resolve_transcript_height()
			}, 250), setTimeout(function() {
				parent.resolve_transcript_height()
			}, 500), setTimeout(function() {
				parent.resolve_transcript_height()
			}, 1e3)
		}
		parent.settings.skin = a
	}, this.resolve_transcript_height = function() {
		var a = $(this.container).find(".p3-transcript-container").outerHeight();
		a -= $(this.container).find(".p3-transcript-mediabar").outerHeight(), a -= $(this.container).find(".p3-transcript-controller").outerHeight(), a -= $(this.container).find(".p3-transcript-bottombar").outerHeight(), a -= 2, $(this.transcript_container).css("height", a + "px")
	}, this.transcript_request = function() {
		return parent.instance.settings.platform_integration && this.settings.transcript_url_convention && (this.settings.transcript_url = this.settings.transcript_url_convention.replace("{file_id}", this.settings.file_id)), this.settings.transcript_url ? this.load_remote_transcript() : this.load_static_transcript()
	}, this.load_static_transcript = function() {
		P3.Util.load_remote_script(this.transcript_static_url())
	}, this.load_scan_view = function() {
		P3.Util.load_remote_script(this.keywords_url())
	}, this.timing_info = function(a) {
		var b = ["transcript_offset", "transcript_start", "transcript_end"],
			c = [];
		for (var d = 0; d < b.length; d++) parent.settings[b[d]] && /^\-*\d+$/.test(parent.settings[b[d]]) && c.push("&" + b[d].replace("transcript_", "") + "=" + parent.settings[b[d]]);
		return c.join("")
	}, this.transcript_static_url = function() {
		var a = {
			callback: "P3.instances[" + parent.instance.instance_index + "].transcript.parse_transcript_data"
		}, b = ["transcript_offset", "transcript_start", "transcript_end"];
		for (var c = 0; c < b.length; c++) parent.settings[b[c]] && /^\-*\d+$/.test(parent.settings[b[c]]) && (a[b[c].replace("transcript_", "")] = parent.settings[b[c]]);
		return this.api_request("files/{id}/transcript", "tpm", a)
	}, this.load_remote_transcript = function(url) {
		url = url || this.settings.transcript_url, parent.settings.cross_domain_loader ? (parent.settings.cross_domain_dynamic_callback && (url += /\?/.test(url) ? "&" : "?", url += "callback=P3.instances[" + parent.instance.instance_index + "].transcript.parse_transcript_data"), P3.Util.load_remote_script(url)) : $.getJSON(url, function(obj) {
			parent.parse_transcript_data(eval(obj))
		})
	}, this.api_request = function(a, b, c) {
		var d = P3.Settings.static_host;
		a && (d += "/" + a.replace("{id}", parent.settings.file_id)), d += "." + (b || "js"), arr = [], c.apikey = parent.settings.api_key, c.usevideoid = parent.instance.settings.platform_integration ? 1 : 0;
		for (i in c) arr.push(i + "=" + encodeURIComponent(c[i]));
		return d += "?" + arr.join("&"), d
	}, this.download_url = function() {
		return this.api_request("files/{id}/transcript", "txt", {
			dl: 1
		})
	}, this.keywords_url = function() {
		return this.api_request("files/{id}/keywords", "js", {
			callback: "P3.instances[" + parent.instance.instance_index + "].transcript.parse_scan_view_data"
		})
	}, this.parse_transcript_data = function(a) {
		try {
			if (a.errors || a.is_error) return parent.transcript_load_error(a);
			$(this.transcript_container).html(a.transcript), parent.settings.first_word = !1, this.file = a.file, this.transcript_cache = {};
			var b = $(this.transcript_container).find("p");
			$.each(b, function(a) {
				var c = $(b[a]).find("span:first"),
					d = parseInt($(c).attr("m"), 10);
				parent.transcript_cache[d] = [], $.each($(b[a]).find("span"), function(a) {
					var b = parseInt($(this).attr("m"), 10);
					parent.transcript_cache[d].push(b), $(this).attr("id", parent.paragraph_word_cache_key(d, b))
				})
			}), parent.settings.hide_onerror && $(parent.container).show(), parent.clear_searched_transcript(), parent.clear_scan_view(), parent.instance.event.trigger("Transcript.Ready")
		} catch (c) {
			parent.transcript_load_error(!1)
		}
	}, this.transcript_load_error = function(a) {
		parent.settings.hide_onerror && $(parent.container).hide(), $(parent.transcript_container).html("<p>There was an error loading the transcript.</p>"), a && (a.errors || a.is_error) && $(parent.transcript_container).append("<p>The requested transcript was not found.</p>"), parent.instance.event.trigger("Transcript.LoadError")
	}, this.parse_scan_view_data = function(obj) {
		var keywords = {}, re_arr = [];
		$.each(obj, function(a) {
			keywords[obj[a][0]] = obj[a][1], re_arr.push(obj[a][0])
		});
		var re = eval("/(" + re_arr.join("|") + ")/i"),
			trim_re = /^\s+|\s+$/;
		try {
			$(parent.transcript_container).find("span").each(function() {
				var h = $(this).html().replace(trim_re, "");
				if (h == "") return !1;
				var re_h = eval("/(" + h.replace(/^\s+|\s+$/, "").replace(/\s+/, "|").replace(/\//g, "") + ")/i");
				if (re.test(h)) {
					var pct = 100;
					$.each(keywords, function(a) {
						if (h == a) return pct = keywords[a] + parent.settings.scan_view_buffer, !1
					}), $(this).css("font-size", pct + "%"), $(this).addClass("p3-keyword")
				}
			})
		} catch (e) {}
		$(parent.container).find(".scan-view span").html("Normal View")
	}, this.clear_scan_view = function(a) {
		if (!parent.settings.scan_view) return !1;
		$(parent.transcript_container).find(".p3-keyword").css("font-size", ""), $(parent.transcript_container).find(".p3-keyword").removeClass("p3-keyword"), $(parent.container).find(".scan-view span").html("Scan View")
	}, this.paragraph_word_cache_key = function(a, b) {
		return parent.cache_id + "_" + a + "_" + b
	}, this.last_word = function() {
		var a = this.transcript_cache.length - 1,
			b = this.transcript_cache[a].length - 1;
		return this.paragraph_word_cache_key(a, b)
	}, this.track = function(a) {
		if (!parent.transcript_cache) return !1;
		$(this.container).find(".p3-timeline-progress").css({
			width: Math.min(100, 100 * (a / parent.file.duration)) + "%"
		});
		var b = !1,
			c = !1;
		$.each(parent.transcript_cache, function(b) {
			c || (c = b);
			if (b > a) return !1;
			c = b
		}), $.each(parent.transcript_cache[c], function(d) {
			if (parent.transcript_cache[c][d] >= a) {
				var e = parent.transcript_cache[c][d];
				return b = $("#" + parent.paragraph_word_cache_key(c, e)), parent.settings.track_alt && b.prev().length > 0 && (b = b.prev()), !1
			}
		});
		if (!b) {
			var d = parent.transcript_cache[c].slice(-1);
			b = $("#" + parent.paragraph_word_cache_key(c, d))
		}
		parent.track_to_word(b, c);
		if (this.settings.locked !== !0) return !1;
		if (this.settings.global_unlock === !0) return !1;
		parent.scroll_to_word(parent.current_word)
	}, this.track_to_word = function(a, b) {
		if (parent.current_word == a) return !1;
		if (parent.settings.progressive_tracking) {
			if (parent.current_paragraph != b) {
				$(parent.container).find(".tracked_paragraph").removeClass("tracked_paragraph"), $(parent.container).find(".current_paragraph").removeClass("current_paragraph");
				var c = $(a).parents("p:first").prevAll();
				$(c).addClass("tracked_paragraph"), $(a).parents("p:first").addClass("current_paragraph");
				var d = $(a).parents("p:first").nextAll();
				$(d).removeClass("tracked_paragraph")
			}
			$(a).nextAll().removeClass("tracked_word"), $(a).prevAll().addClass("tracked_word"), $(a).addClass("tracked_word")
		} else $(parent.current_word).removeClass("current_word"), $(a).addClass("current_word");
		parent.settings.track_highlighted_words && parent.instance.event.trigger("Transcript.HighlightedWord", {
			m: $(a).attr("m"),
			word: $(a).html()
		}), parent.current_paragraph = b, parent.current_word = a
	}, this.scroll_to_word = function(a) {
		if (!parent.settings.locked) return !1;
		parent.settings.first_word = parent.settings.first_word || this.transcript_container.find("span[m]:first");
		var b = this.transcript_container.scrollTop(),
			c = parseInt($(a).offset().top - $(parent.settings.first_word).offset().top, 10),
			d = parseInt(b, 10);
		if (parent.settings.light_scroll) {
			var e = $(parent.transcript_container).height();
			(c - b > .75 * e || c - b < 0) && this.transcript_container.scrollTop(c)
		} else c != d && this.transcript_container.scrollTop(c)
	}, this.clear_searched_transcript = function() {
		$(parent.container).find(".p3-transcript-search-reset").hide(), $(parent.transcript_container).find(".search_hit").removeClass("search_hit"), $(parent.container).find(".pointer").remove(), $(".p3-tooltip").remove(), $(parent.container).find(".p3-bottombar-timeline-container").hide(), $(parent.container).find(".p3-transcript-bottombar-logo").show()
	}, this.search_transcript = function(searchterm, callback) {
		parent.clear_searched_transcript(), callback = callback || "topbar_search";
		var sanitized_arr = searchterm.replace(/^\s+|\s+$/, "").split(/\s+/);
		parent.saved_search_term = sanitized_arr.join("|");
		if (sanitized_arr.join("") == "") return !1;
		parent.settings.search_transcript_stemming && typeof Snowball != "undefined" && (parent.stemmer = parent.stemmer || new Snowball("English"), $.each(sanitized_arr, function(a, b) {
			parent.stemmer.setCurrent(b), parent.stemmer.stem();
			var c = parent.stemmer.getCurrent();
			P3.Util.in_array(c, sanitized_arr) || sanitized_arr.push(c)
		})), $(parent.container).find(".p3-transcript-search-reset").show();
		var sanitized = sanitized_arr.join("|"),
			re = eval("/(" + sanitized + ")/i"),
			matches = [];
		$(parent.transcript_container).find("span").each(function() {
			re.test($(this).html()) && ($(this).addClass("search_hit"), matches.push(parseInt($(this).attr("m"), 10)))
		}), callback && parent[callback](matches), parent.instance.event.trigger("Transcript.Search", {
			searchterm: searchterm
		})
	}, this.topbar_search = function(a) {
		$(parent.container).find(".p3-timeline").css("position", "relative");
		var b = $(parent.container).find(".p3-timeline").outerHeight();
		$.each(a, function(b) {
			var c = a[b],
				d = parseInt(100 * (c / parent.file.duration)) + "%",
				e = $("<span></span>");
			$(e).attr("m", c), $(e).addClass("pointer"), $(e).html("&nbsp;"), $(e).css({
				position: "absolute",
				top: 0,
				bottom: 0,
				width: "2px",
				zIndex: 2e3,
				left: d
			}), $(parent.container).find(".p3-timeline").append(e)
		})
	}, this.bottombar_search = function(a) {
		var b = a.length >= 100 ? "99+" : a.length;
		$(parent.container).find(".p3-bottombar-timeline-hits").html(b + " results");
		var c = $(parent.container).find(".p3-bottombar-timeline-container");
		$(c).show(), $(parent.container).find(".p3-transcript-bottombar-logo").hide();
		var d = $(parent.container).find(".p3-bottombar-timeline");
		$(d).show(), $(c).css("width", "120px"), $(d).css("width", "120px"), $.each(a, function(b) {
			var c = a[b],
				e = parseInt(100 * (c / parent.file.duration)) + "%",
				f = $("<span></span>");
			$(f).attr("m", c), $(f).addClass("pointer"), $(f).html("&nbsp;"), $(f).css({
				position: "absolute",
				top: 4,
				bottom: 4,
				width: "2px",
				zIndex: 2e3,
				left: e
			}), $(d).append(f)
		}), a.length <= 50 ? $(c).animate({
			width: "245px"
		}, 200) : $(c).css({
			width: "245px"
		})
	}, this.print_transcript = function() {
		var a = $(parent.transcript_container).html();
		a = a.replace(/\<span[^\>]*?\>/, ""), P3.Util.print(a, !0)
	}, this.handle_selected_text = function() {
		var a = P3.Util.selected_html();
		if (!a) return !1;
		var b = $("<p></p>");
		b.append(a);
		var c = b.find("span:first"),
			d = b.find("span:last"),
			e = parseInt($(c).attr("m"), 10),
			f = parseInt($(d).attr("m"), 10),
			g = /^\s+|\s+$/,
			h = [];
		$(b).find("span").each(function() {
			var a = $(this).html().replace(g, "");
			h.push(a)
		}), h = h.join(" "), h.length > 100 ? shortened_text = (h.slice(0, 40) + " [...] " + h.slice(-40)).replace(/\s+/, " ") : shortened_text = h;
		if (!e) return !1;
		if (!f) return !1;
		if (e == f) return !1;
		if (!h) return !1;
		var i = {
			start_ms: e,
			end_ms: f,
			duration: f - e,
			raw_text: h,
			shortened_text: shortened_text
		};
		parent.instance.event.trigger("Transcript.Selection", i)
	}, this.get_shortened_link = function(a, b) {
		url = a.url || location.href, context = a.shortened_text || "", P3.Util.shorten_url(url, context, function(a, c) {
			$(b.target).html(a), $(b.target).css("text-transform", "none"), $(b.target).die("click"), $(b.target).click(function() {
				window.open(a)
			})
		})
	}, this.start_clip_share = function() {
		if ($(parent.container).find(".p3-social-sharing").length > 0) return $(parent.container).find(".p3-social-sharing").remove(), !1;
		var a = parent.settings.current_clip_selection,
			b = (new EJS({
				text: parent.social,
				type: "["
			})).render(a);
		$(parent.container).find(".p3-transcript-container").append(b);
		var c = $(parent.container).find(".p3-social-sharing"),
			d = $(parent.container).find(".clip-active"),
			e = $(d).offset().top + $(d).outerHeight(),
			f = $(d).offset().left - .5 * $(c).outerWidth();
		$(c).css({
			top: e,
			left: f
		})
	}, this.tweet_clip = function(a, b) {
		url = a.url || location.href, context = a.shortened_text || "", P3.Util.shorten_url(url, context, function(a, b) {
			b = b ? ' "' + b + '"' : "";
			var c = "Video Bookmark " + a + b + " #3playmedia",
				d = "http://twitter.com/?status=" + encodeURIComponent(c);
			window.open(d)
		})
	}, this.facebook_clip = function(a, b) {
		url = a.url || location.href, context = a.shortened_text || "", context = context ? ' "' + context + '"' : "";
		var c = "http://www.facebook.com/share.php?u=" + encodeURIComponent(location.href);
		c += "&t=" + encodeURIComponent("Video Bookmark"), window.open(c)
	}, $(instance).bind("Transcript.Selection", function(a, b) {
		if (parent.settings.can_clip) {
			$(parent.container).find(".clip-inactive").removeClass("clip-inactive").addClass("clip-active");
			var c = location.href.replace(/\#.+?$/, "");
			c += "#p3s:" + b.start_ms + "&p3e:" + b.end_ms, c += P3.instances.length > 1 ? "&p3i:" + parent.instance.instance_index : "", location.href = c, b.url = c, parent.settings.current_clip_selection = b
		}
	}), $(instance).bind("Player.Progress", function(a, b) {
		if (!(parent.instance.player && parent.instance.player.interface && parent.instance.player.interface.play)) return !1;
		if (b.video_id && b.video_id != parent.settings.file_id) return parent.settings.file_id = b.video_id, parent
			.instance.settings.file_id = b.video_id, parent.transcript_request(), !1;
		parent.track(b.m)
	}), $(instance).bind("Player.VideoLoad", function(a, b) {
		parent.instance.settings.file_id = b.video_id, parent.settings.file_id = b.video_id, parent.transcript_request()
	}), $(instance).bind("Transcript.Ready", function(a, b) {
		if (P3.Util.params("p3ts") && !parent.settings.onload_transcript_search_handled) {
			var c = unescape(P3.Util.params("p3ts"));
			$(parent.container).find(".p3-transcript-search").val(c), parent.search_transcript(c, "topbar_search"), parent.settings.onload_transcript_search_handled = !1
		}
	}), parent.instance.event.trigger("Transcript.TemplateRendered"), this.social = '<div start_ms="[%=start_ms%]" end_ms="[%=end_ms%]" url="[%=url%]" class="p3-social-sharing">    <table cellSpacing=0>      <thead>        <tr>          <th>Share @ [%=P3.Util.ms_to_stamp(start_ms)%]-[%=P3.Util.ms_to_stamp(end_ms)%]</th>          <th style="text-align:right;">            <a class="p3-close-social-sharing" href=javascript:void(0);>x</a>          </th>        </tr>      </thead>      <tbody>        <tr>          <td colspan="2" class="p3-clip-text">"[%= shortened_text %]"</td>        </tr>        <tr>          <td colspan=2><a class="p3-tweet-clip" href="javascript:void(0);">Share on Twitter</a></td>        </tr>        <tr>          <td colspan=2><a class="p3-facebook-clip" href="javascript:void(0);">Share on Facebook</a></td>        </tr>        <tr>          <td colspan=2><a class="p3-get-shortened-link" href="javascript:void(0);">Get Shortened Link</a></td>        </tr>      </tbody>    </table>  </div>', this.templates = {}, this.templates.transcript_only = '<div class="p3-container p3-transcript-container">    <div class="p3-transcript-main"><p>Loading Transcript...</p></div>  </div>', this.templates.bottom_search = '<div class="p3-container p3-transcript-container">    <div class="p3-transcript-main"><p>Loading Transcript...</p></div>    <div class="p3-transcript-bottombar">      <div class="p3-transcript-bottombar-logo">&nbsp;</div>      <div class="p3-transcript-bottombar-content">      <input type="text" placeholder="[%=search_placeholder%]" class="p3-transcript-bottom-search"/>      <button class="p3-transcript-bottom-search-submit"></button>      <div class="p3-bottombar-timeline-container">        <div class="p3-bottombar-timeline-hits">3 results</div>        <div class="p3-bottombar-timeline"></div>        <div class="p3-bottombar-reset-search">&nbsp;</div>    </div>  </div>', this.templates["default"] = '<div class="p3-container p3-transcript-container">    <div class="p3-transcript-mediabar">      <div class="p3-timeline">        <div class="p3-timeline-progress">&nbsp;</div>      </div>    </div>    <div class="p3-transcript-controller">      <form class="p3-transcript-searchform" action="javascript:void(0); return false;">        <div class="p3-transcript-search-inputs">          [%= P3.Util.nice_searchbox({classname:"p3-transcript-search",placeholder:search_placeholder}) %]          <button class="p3-transcript-search-submit"></button>          <div class="p3-transcript-search-reset">&nbsp;</div>        </div>        <div class="p3-transcript-buttons">        [% if (can_clip) { %]        <a class="p3-transcript-button clip-inactive" href=javascript:void(0);><span>Clip</span></a>        [% } %]        [% if (can_print) { %]        <a class="p3-transcript-button print" href=javascript:void(0);><span>Print</span></a>        [% } if (can_download) { %]        <a class="p3-transcript-button download" href=javascript:void(0);><span>Download</span></a>        [% } %]        [% if ((!global_unlock) && locked != "never") { %]        <a class="p3-transcript-button locked" href=javascript:void(0);><span>Unlock</span></a>        [% } %]        </div>      </form>    </div>    <div class="p3-transcript-main"><p>Loading Transcript...</p></div>    <div class="p3-transcript-bottombar">      <div class="p3-transcript-bottombar-logo">&nbsp;</div>      <div class="p3-transcript-bottombar-content">      [% if (can_collapse) { %]      <a href="javascript:void(0);" class="p3-transcript-button collapse"><span>[%=collapse_label%]</span></a>      [% } %]      [% if (scan_view) { %]        <a href="javascript:void(0);" class="scan-view"><span>Scan View</span></a>      [% } %]      [% if (transcript_versions) { %]        <select class="p3-transcript-versions">          [% for (i in transcript_versions) { %]            <option value="[%= transcript_versions[i] %]">[%= i %]</option>          [% } %]        </select>      [% } %]      </div>    </div>  </div>', this.init()
}, P3.Captions = function(instance, options) {
	var $ = P3.JQuery,
		parent = this;
	this.instance = instance, this.initialized = !1, this.cached_duration = !1, this.minimized_fade_out_timer = !1, this.settings = {
		api_key: !1,
		skin: !1,
		file_id: !1,
		srt_url: !1,
		srt_url_convention: !1,
		overlay: !1,
		overlay_draggable: !1,
		overlay_offset_x: !1,
		overlay_offset_y: !1,
		overlay_minimized_offset_x: !1,
		overlay_minimized_offset_y: !1,
		minimize_onload: !1,
		tracks: !1,
		cross_domain_loader: !0,
		cross_domain_dynamic_callback: !0,
		hide_onerror: !1,
		menubar: !0,
		menu_header: !1,
		searchbar: !0,
		toggler_enabled: !1,
		toggler_show_text: "<span>Show Closed Captions</span>",
		toggler_hide_text: "<span>Hide Closed Captions</span>",
		toggler_hide_onload: !1,
		captions_offset: !1,
		captions_start: !1,
		captions_end: !1,
		width: "280px",
		height: "40px",
		floater_position: "auto"
	}, this.frames = !1, this.init = function() {
		if (this.initialized) return !0;
		$.each(options.captions, function(a) {
			parent.settings[a] = options.captions[a]
		}), parent.settings.height = "40px", parent.settings.file_id || (parent.settings.file_id = parent.instance.settings.file_id), parent.settings.api_key || (parent.settings.api_key = P3.Settings.api_key), this.render(), this.listen(), this.initialized = !0
	}, this.die = function() {
		$(this.container).remove()
	}, this.duration = function() {
		return this.cached_duration ? this.cached_duration : (this.cached_duration = parent.instance.player.interface.duration(), this.cached_duration)
	}, this.container = !1, this.render = function() {
		if ($.browser.msie && parseFloat($.browser.version) < 8 || P3.Util.is_ipad()) this.settings.overlay = !1, this.settings.minimize_onload = !1, this.settings.width = $(parent.instance.player.player).outerWidth(), this.settings.fallback_skin !== !1 && (this.settings.skin = this.settings.fallback_skin);
		var a = (new EJS({
			text: parent.template,
			type: "["
		})).render(parent.settings),
			b = $(a);
		this.settings.overlay ? ($(document.body).append(b), parent.container = b, $(parent.instance.player.player).attr("wmode", "opaque"), $(b).addClass("overlay"), this.settings.overlay_draggable && $(b).draggable({
			handle: ":not(.p3-captions-maximizer,.p3-captions-maximizer-arrow,.p3-captions-maximizer-cc)",
			drag: function() {
				parent.cache_overlay_position(), parent.remove_floater()
			}
		}), $(b).hide(), setTimeout(function() {
			$(b).show(), parent.position_overlay(), parent.settings.minimize_onload && (parent.minimize(-1), parent.minimized_fade_out())
		}, 1)) : (parent.settings.target ? $("#" + parent.settings.target).html(b) : $(parent.instance.player.player).after(b), parent.container = b, $(b).css({
			position: "static",
			display: "block",
			clear: "both"
		})), this.settings.width && $(b).css("width", parseInt(this.settings.width, 10)), $(b).attr("owidth", $(b).width()), this.apply_skin(), this.initialize_captions(), this.adjust_components();
		if (!this.settings.minimize_onload || !this.settings.overlay) setTimeout(function() {
			parent.adjust_components()
		}, 10), setTimeout(function() {
			parent.adjust_components()
		}, 50), setTimeout(function() {
			parent.adjust_components()
		}, 100), setTimeout(function() {
			parent.adjust_components()
		}, 250), setTimeout(function() {
			parent.adjust_components()
		}, 500);
		if (this.settings.toggler_enabled) {
			var a = (new EJS({
				text: parent.toggler_template,
				type: "["
			})).render(parent.settings),
				c = $("<div class='p3-captions-toggler-container'></div>");
			$(c).html(a), this.settings.toggler_target ? $(this.settings.toggler_target).html(c) : $(b).after(c), $(c).find("a").attr("instance_index", parent.instance.instance_index)
		}
		this.settings.toggler_hide_onload && $(b).hide(), parent.instance.event.trigger("Captions.TemplateRendered")
	}, this.render_floater = function(a) {
		this.remove_floater();
		var b = (new EJS({
			text: a,
			type: "["
		})).render(parent.settings),
			c = $("<div class='p3-captions-floater'>" + b + "</div>");
		$(document.body).append(c), $(c).addClass(parent.settings.skin);
		var d = Math.max(0, $(parent.container).offset().top + .5 * ($(parent.container).outerHeight() - $(c).outerHeight())),
			e = $(parent.container).offset().left + $(parent.container).outerWidth();
		$(c).css({
			top: d,
			left: e
		});
		var f = P3.Util.window_dimensions().width;
		if (f < $(c).offset().left + $(c).outerWidth() || parent.settings.floater_position == "bottom") {
			var d = Math.max(0, $(parent.container).offset().top + $(parent.container).outerHeight()),
				e = $(parent.container).offset().left + $(parent.container).outerWidth() - $(c).outerWidth();
			$(c).addClass("no-pointer"), $(c).css({
				top: d,
				left: e
			})
		}
		if (parent.settings.floater_position == "top") {
			var d = Math.max(0, $(parent.container).offset().top - $(c).outerHeight()),
				e = $(parent.container).offset().left + $(parent.container).outerWidth() - $(c).outerWidth();
			$(c).addClass("no-pointer"), $(c).css({
				top: d,
				left: e
			})
		}
	}, this.remove_floater = function() {
		$(".p3-captions-widget").find(".active").removeClass("active"), $(".p3-captions-floater").remove()
	}, this.hide_components = function() {
		return !1;
		var a, b, c, d
	}, this.listen = function() {
		$(document).click(function(a) {
			var b = a.target;
			$(b).parents(".p3-captions-floater").length == 0 && !$(b).hasClass("p3-captions-floater") && $(b).parents(".p3-container").length == 0 && parent.remove_floater()
		}), $(parent.container).find(".p3-captions-minimizer").click(function() {
			parent.minimize()
		}), $(parent.container).find(".p3-captions-maximizer").click(function() {
			parent.maximize()
		}), $(".p3-captions-toggler-container a[instance_index=" + parent.instance.instance_index + "]").click(function(a) {
			var b = parseInt($(this).attr("instance_index"), 10);
			return $(this).attr("state") == "hidden" ? ($(this).attr("state", "visible"), $(this).html(parent.settings.toggler_hide_text), P3.get(b).captions.container.show(), P3.get(b).captions.adjust_components()) : ($(this).attr("state", "hidden"), $(this).html(parent.settings.toggler_show_text), P3.get(b).captions.container.hide()), !1
		}), $(this.container).find(".p3-captions-search").click(function(a) {
			return $(this).hasClass("active") ? parent.remove_floater() : ($(".p3-captions-widget").find(".active").removeClass("active"), parent.render_floater(parent.search_box), $(this).addClass("active"), P3.Util.is_ios() || $(".p3-captions-floater").find(".p3-captions-searchterm").focus(), $(".p3-captions-floater").find(".p3-captions-searchterm").unbind("keyup"), $(".p3-captions-floater").find(".p3-captions-searchterm").keyup(function(a) {
				clearTimeout(parent.settings.search_timeout);
				var b = this,
					c = $.browser.msie ? 500 : 250;
				parent.settings.search_timeout = setTimeout(function() {
					parent.search_captions($(b).val()), $(".p3-captions-searchresult").click(function(a) {
						parent.instance.player.interface.play_state() != "PLAYING" && parent.instance.player.interface.play(), parent.instance.player.interface.seek(parseInt($(this).attr("ms"), 10))
					}), $(".p3-captions-searchresult:first").addClass("first"), $(".p3-captions-searchresult:last").addClass("last")
				}, c)
			})), !1
		}), $(this.container).find(".p3-captions-menu").click(function(a) {
			return $(this).hasClass("active") ? parent.remove_floater() : ($(".p3-captions-widget").find(".active").removeClass("active"), parent.render_floater(parent.menu_box), $(this).addClass("active"), $(".p3-captions-floater").find(".p3-caption-track").each(function() {
				if (parent.settings.current_track && $(this).html() == parent.settings.current_track) return $(this).addClass("selected"), !1
			}), $(".p3-captions-floater").find(".p3-caption-track").click(function() {
				$(this).siblings().removeClass("selected"), $(this).addClass("selected"), parent.load_track($(this).html())
			}), $(".p3-captions-floater").find("li:first").addClass("first"), $(".p3-captions-floater").find("li:last").addClass("last")), !1
		}), parent.settings.overlay && ($(parent.instance.player.player).mouseover(function(a) {
			$(parent.container).hasClass("minimized") && parent.minimized_fade_in()
		}), $(parent.instance.player.player).parent().mouseover(function(a) {
			$(parent.container).hasClass("minimized") && parent.minimized_fade_in()
		}), $(parent.instance.player.player).mouseout(function(a) {
			$(parent.container).hasClass("minimized") && parent.minimized_fade_out()
		}), $(parent.instance.player.player).parent().mouseout(function(a) {
			$(parent.container).hasClass("minimized") && parent.minimized_fade_out()
		}))
	}, this.apply_skin = function(a) {
		a = a || parent.settings.skin;
		if (!a) return !1;
		a = /p3\-captions\-skin/.test(a) ? a : "p3-captions-skin-" + a;
		if (a) {
			var b = $(this.container),
				c = b.attr("class").split(/\s+/);
			$.each(c, function(a) {
				var d = c[a];
				/p3-captions-skin/i.test(d) && b.removeClass(d)
			}), b.addClass(a)
		}
	}, this.adjust_components = function() {
		$(this.container).css({
			width: parseInt(parent.settings.width, 10) + "px",
			height: parseInt(parent.settings.height, 10) + "px"
		}), $(this.container).find(".p3-captions-components").css({
			width: parseInt(parent.settings.width, 10) + "px",
			height: parseInt(parent.settings.height, 10) + "px"
		}), $(this.container).find(".p3-captions-components").children().css({
			height: parseInt(parent.settings.height, 10) + "px"
		});
		var a = $(this.container).find(".p3-captions-frame"),
			b = a.children(),
			c = $(this.container).width();
		$(a).siblings().each(function() {
			c -= $(this).outerWidth(), c -= parseFloat($(this).css("margin-left")), c -= parseFloat($(this).css("margin-right"))
		}), P3.Util.is_ie() && (c -= 2), $(a).css("width", c + "px"), $(b).css("width", c + "px");
		var d = Math.max(0, Math.min(6, ($(a).height() - $(b).height()) / 2));
		$(b).css("padding-top", d + "px"), $(b).css("padding-bottom", d + "px"), parent.position_overlay()
	}, this.initialize_captions = function() {
		parent.settings.tracks ? $.each(parent.settings.tracks, function(a) {
			return parent.load_track(a), !1
		}) : this.load_captions()
	}, this.load_captions = function() {
		return parent.instance.settings.platform_integration && this.settings.srt_url_convention && (this.settings.srt_url = this.settings.srt_url_convention.replace("{file_id}", this.settings.file_id)), this.settings.srt_url ? this.load_external_srt_url() : this.load_static_srt_captions()
	}, this.load_external_srt_url = function(a) {
		a = a || this.settings.srt_url, parent.settings.cross_domain_loader ? (parent.settings.cross_domain_dynamic_callback && (a += /\?/.test(a) ? "&" : "?", a += "callback=P3.instances[" + parent.instance.instance_index + "].captions.parse_captions_data"), P3.Util.load_remote_script(a)) : $.get(a, function(a) {
			parent.frames = parent.srt_lines_to_frames(a.split(/[\r\n]+/))
		})
	}, this.load_static_srt_captions = function() {
		var a = document.createElement("script");
		a.src = this.static_srt_url(), a.type = "text/javascript", $(parent.container).get(0).appendChild(a)
	}, this.timing_info = function() {
		var a = ["captions_offset", "captions_start", "captions_end"],
			b = [];
		for (var c = 0; c < a.length; c++) parent.settings[a[c]] && /^\-*\d+$/.test(parent.settings[a[c]]) && b.push("&" + a[c].replace("captions_", "") + "=" + parent.settings[a[c]]);
		return b.join("")
	}, this.static_srt_url = function() {
		var a = (/https/.test(location.protocol) ? P3.Settings.api_host : P3.Settings.static_host) + "/files/";
		return a += parent.instance.settings.file_id, a += "/captions.srt?apikey=" + this.settings.api_key, a += parent.timing_info(), a += parent.instance.settings.platform_integration ? "&usevideoid=1" : "", a += "&callback=P3.instances[" + parent.instance.instance_index + "].captions.parse_captions_data", a
	}, this.load_track = function(a) {
		if (!parent.settings.tracks[a]) return !1;
		var b = parent.settings.tracks[a];
		parent.settings.current_track = a, parent.settings.srt_url = b, parent.load_external_srt_url()
	}, this.parse_captions_data = function(a) {
		try {
			var b = a.output;
			parent.frames = parent.srt_lines_to_frames(b.split(/[\r\n]/));
			if (parent.instance.player.interface && parent.instance.player.interface.play_state && parent.instance.player.interface.play_state() != "PLAYING") {
				var c = parent.instance.player.interface.position() || 0;
				parent.track(c)
			}
		} catch (d) {
			return parent.captions_load_error()
		}
		parent.settings.hide_onerror && $(parent.container).show(), parent.instance.event.trigger("Captions.Ready")
	}, this.captions_load_error = function(a) {
		parent.settings.hide_onerror && $(parent.container).hide(), parent.render_line("ERROR: Could not<br/>load captions."), parent.instance.event.trigger("Captions.LoadError")
	}, this.srt_lines_to_frames = function(a) {
		var b = [],
			c = {}, d = 0,
			e = /\s*\-\-\>\s*/,
			f = /^\d+$/;
		return $.each(a, function(g) {
			var h = a[g].replace(/^\s+|\s+$/, "");
			switch (!0) {
				case e.test(h):
					c.lines && (b.push(c), c = {});
					var i = h.split(e);
					c.start_ms = P3.Util.stamp_to_ms(i[0]), c.end_ms = P3.Util.stamp_to_ms(i[1]), c.lines = [];
					break;
				case f.test(h) && parseInt(h) == d + 1:
					d += 1;
					break;
				case h == "":
					break;
				default:
					c.lines && c.lines.push(h)
			}
		}), c && c.start_ms && c.end_ms && b.push(c), b
	}, this.minimize = function(a) {
		parent.remove_floater(), a = a || 150;
		var b = parent.minimized_position();
		parent.cache_overlay_position();
		var c = {
			width: "34px",
			height: "20px",
			top: b.top,
			left: b.left
		};
		$(parent.container).addClass("minimized"), $(parent.container).children().hide(), a > 0 ? $(parent.container).animate(c, a, function() {
			$(parent.container).find(".p3-captions-maximizer").show(), $(parent.container).find(".p3-captions-maximizer").children().show()
		}) : ($(parent.container).css(c), $(parent.container).find(".p3-captions-maximizer").show(), $(parent.container).find(".p3-captions-maximizer").children().show())
	}, this.maximize = function(a) {
		a = a || 150;
		var b = parent.overlay_position();
		clearTimeout(parent.minimized_fade_out_timer), $(parent.container).removeClass("minimized"), $(parent.container).fadeIn(1), $(parent.container).find(".p3-captions-maximizer").hide(), $(parent.container).animate({
			width: parseInt(parent.settings.width, 10) + "px",
			height: parseInt(parent.settings.height, 10) + "px",
			top: b.top,
			left: b.left
		}, a, function() {
			$(parent.container).children().show(), $(parent.container).find(".p3-captions-maximizer").hide(), parent.adjust_components(), setTimeout(function() {
				parent.adjust_components()
			}, 10)
		})
	}, this.minimized_fade_out = function() {
		parent.minimized_fade_out_timer = setTimeout(function() {
			if (!parent.container.hasClass("minimized")) return !1;
			$(parent.container).fadeOut(500)
		}, 3e3)
	}, this.minimized_fade_in = function(a) {
		a = a || 500, clearTimeout(parent.minimized_fade_out_timer), $(parent.container).fadeIn(a)
	}, this.cache_overlay_position = function() {
		var a = $(parent.container).offset();
		$(parent.container).attr("cache_top", a.top), $(parent.container).attr("cache_left", a.left)
	}, this.position_overlay = function() {
		if (!parent.settings.overlay) return !1;
		var a = parent.overlay_position();
		$(parent.container).css({
			top: a.top,
			left: a.left
		})
	}, this.overlay_position = function() {
		if (typeof $(parent.container).attr("cache_top") != "undefined" && typeof $(parent.container).attr("cache_left") != "undefined") return {
			top: $(parent.container).attr("cache_top"),
			left: $(parent.container).attr("cache_left")
		};
		var a = parent.instance.player.player,
			b = parent.container,
			c = $(a).offset(),
			d = $(a).outerWidth(),
			e = $(a).outerHeight(),
			f = $(b).outerWidth(),
			g = $(b).outerHeight(),
			h = c.top + e - g;
		h += typeof parent.settings.overlay_offset_y == "number" ? parent.settings.overlay_offset_y : 0;
		var i = c.left;
		return i += typeof parent.settings.overlay_offset_x == "number" ? parent.settings.overlay_offset_x : (d - f) / 2, {
			top: h,
			left: i
		}
	}, this.minimized_position = function() {
		var a = parent.instance.player.player,
			b = $(a).offset(),
			c = $(a).outerWidth(),
			d = $(a).outerHeight(),
			e = b.top + d - 34;
		e += typeof parent.settings.overlay_minimized_offset_y == "number" ? parent.settings.overlay_minimized_offset_y : 0;
		var f = b.left + c - 40;
		return f += typeof parent.settings.overlay_minimized_offset_x == "number" ? parent.settings.overlay_minimized_offset_x : 0, {
			top: e,
			left: f
		}
	}, this.render_line = function(a) {
		var b = /\<br\/*\>/i;
		a.length > 32 && !b.test(a) && (a = parent.waterfall(a)), a = a.replace(/^\<br\/*>/, ""), a = b.test(a) ? a : a + "<br/>&nbsp;";
		if (a == $(parent.container).find(".p3-captions-frame-lines").html()) return !1;
		$(parent.container).find(".p3-captions-frame-lines").html(a)
	}, this.waterfall = function(a) {
		a = a.replace(/^\s+|\s+$/, "");
		var b = " ";
		/\s+/.test(a) ? arr = a.split(/\s+/) : (arr = a.split(""), b = "");
		var c = arr,
			d = [],
			e = Math.abs(c.join(" ").length - d.join(" ").length);
		d.push(c.pop());
		while (Math.abs(c.join(" ").length - d.join(" ").length) < e) e = Math.abs(c.join(" ").length - d.join(" ").length), d.unshift(c.pop());
		return c.join(b) + "<br/>" + d.join(b)
	}, this.track = function(a) {
		if (!parent.frames) return !1;
		var b = !1,
			c = !1;
		$.each(parent.frames, function(d) {
			if (a >= parent.frames[d].start_ms && a <= parent.frames[d].end_ms) return c = parent.frames[d], b = !0, !1
		}), b || (c = parent.frames[parent.frames.length - 1]);
		var d = c.lines.join("<br/>"),
			e = {
				text: d,
				frame_ms: c.start_ms,
				current_ms: a
			};
		parent.instance.event.trigger("Captions.FrameRendered", e), parent.render_line(d)
	}, this.search_captions = function(str) {
		$(".p3-captions-searchresults").html("<div class='p3-captions-searchresult-info'>No matches found</div>");
		var scrubbed = str.replace(/^\s+|\s+$/, "").replace(/\s+/, "|");
		if (!scrubbed) return !1;
		$(".p3-captions-searchresults").html("");
		var re = eval("/(" + scrubbed.replace(/^\s+|\s+$/).replace(/\s+/, "|") + ")/i"),
			re_g = eval("/(" + scrubbed.replace(/^\s+|\s+$/).replace(/\s+/, "|") + ")/ig"),
			matches = 0,
			last_ms = parent.frames[parent.frames.length - 1].start_ms;
		$.each(parent.frames, function(a) {
			var b = parent.frames[a].lines.join(" ");
			if (re.test(b)) {
				matches++, pct = 100 * (parent.frames[a].start_ms / last_ms) + "%", b = b.replace(re_g, "<b>$1</b>"), obj = {
					text: b,
					stamp: P3.Util.ms_to_stamp(parent.frames[a].start_ms),
					ms: parent.frames[a].start_ms,
					pct: pct
				};
				var c = (new EJS({
					text: parent.search_result,
					type: "["
				})).render(obj);
				$(".p3-captions-searchresults").append(c)
			}
		});
		if (matches == 0) {
			var result = "<div class='p3-captions-searchresult-info'>No matches found</div>";
			$(".p3-captions-searchresults").append(result)
		}
		$(".p3-captions-searchresults").find(".p3-captions-searchresult:first").addClass("first"), $(".p3-captions-searchresults").find(".p3-captions-searchresult:last").addClass("last")
	}, $(instance).bind("Player.Ready", function(a, b) {
		parent.init()
	}), $(instance).bind("Player.Progress", function(a, b) {
		if (b.video_id && b.video_id != parent.settings.file_id) return parent.instance.settings.file_id = b.video_id, parent.settings.file_id = b.video_id, parent.load_captions(), !1;
		parent.track(b.m)
	}), $(instance).bind("Player.VideoLoad", function(a, b) {
		parent.instance.settings.file_id = b.video_id, parent.settings.file_id = b.video_id, parent.load_captions()
	}), this.template = '<div class="p3-container p3-captions-widget">    [% if (overlay) { %]      <div class="p3-captions-maximizer">        <div class="p3-captions-maximizer-arrow"></div>        <div class="p3-captions-maximizer-cc">cc</div>      </div>    [% } %]    <div class="p3-captions-components">      [% if (overlay) { %]        <div class="p3-captions-minimizer"><span>x</span></div>      [% } %]      <div class="p3-captions-frame">        <div class="p3-captions-frame-lines">          &nbsp;<br/>          &nbsp;        </div>      </div>      [% if (searchbar == true) { %]        <div class="p3-captions-search"><span></span></div>      [% } %]      [% if (menubar && tracks && typeof tracks == "object") { %]        <div class="p3-captions-menu"><span></span></div>      [% } %]    </div>  </div>', this.toggler_template = '<a href=javascript:void(0); state="[%=toggler_hide_onload ? "hidden" : "visible" %]" class="p3-captions-toggler">[%=toggler_hide_onload ? toggler_show_text : toggler_hide_text %]</a>', this.cc_button = '<div class="p3-captions-cc-button-container">    <div class="p3-captions-maximizer"></div>    <div class="p3-captions-cc-button">CC</div>  </div>', this.search_box = '<div class="p3-captions-search-container">    <div class="p3-captions-searchbox">      [%= P3.Util.nice_searchbox({classname:"p3-captions-searchterm",placeholder:"Search Video"}) %]    </div>    <div class="p3-captions-searchresults">      <div class="p3-captions-searchresult-info">Type to search this video</div>    </div>  </div>', this.search_result = '<div class="p3-captions-searchresult" ms="[%= ms %]">    <div class="p3-captions-searchresult-header">      <div class="p3-captions-searchresult-stamp">        [%= stamp %]      </div>      <div class="p3-captions-searchresult-timeline"><div style="width:[%=pct%];" class="p3-captions-searchresult-time-in"></div></div>    </div>    <div class="p3-captions-searchresult-content">      [%= text %]    </div>  </div>', this.menu_box = '<div class="p3-captions-menubox">    [%= menu_header ? "<h3>" + menu_header + "</h3>" : "" %]    <ul>      [% for (i in tracks) { %]        <li class="p3-caption-track" url="[%=tracks[i]%]">[%=i%]</li>      [% } %]    </ul>  </div>'
}, P3.Playlist = function(instance, options) {
	var $ = P3.JQuery,
		parent = this;
	this.instance = instance, this.searchterm = "", this.settings = {
		target: !1,
		width: "400px",
		playlist_height: "400px",
		skin: "",
		suggested_search_terms: [],
		onload_function: "all_files",
		search_box_placeholder: "Search by phrase, name, keyword...",
		list_sort_by: "id:desc",
		search_sort_by: "id:desc",
		show_segments: !0,
		show_thumbnails: !0,
		show_all_results: !1,
		per_page: 10,
		project_id: !1,
		linked_account_id: !1,
		folder_id: !1,
		base_url: location.protocol + "//static.3playmedia.com/",
		api_key: !1
	}, this.container = $("#" + options.playlist.target), this.init = function() {
		$.each(options.playlist, function(a) {
			parent.settings[a] = options.playlist[a]
		});
		if (!parent.settings.target) return !1;
		parent.settings.api_key || (parent.settings.api_key = P3.Settings.api_key), parent.settings.per_page = Math.min(parent.settings.per_page, 1000), parent.settings.width = parseInt(parent.settings.width.toString().replace("px", ""), 10), parent.settings.width = Math.min(parent.settings.width, 800), parent.settings.playlist_height = parseInt(parent.settings.playlist_height.toString().replace("px", ""), 10), parent.settings.playlist_height = Math.max(parent.settings.playlist_height, 150), this.render(), this.apply_skin(), this.listen();
		if (parent.settings.onload_function) try {
			eval("parent." + parent.settings.onload_function + "()")
		} catch (e) {}
	}, this.render = function() {
		var a = (new EJS({
			text: parent.template,
			type: "["
		})).render(parent.settings);
		$(this.container).html(a), this.collection_container = $(this.container).find(".p3-playlist-container"), $(this.collection_container).css({
			width: parent.settings.width
		}), $(this.collection_container).find(".p3-playlist-results").css({
			height: parent.settings.playlist_height
		}), $(this.container).find("input[type=text]").each(function() {
			var a = $(this).val();
			$(this).attr("oval", a)
		}), parent.instance.event.trigger("Playlist.TemplateRendered")
	}, this.apply_skin = function(a) {
		a = a || parent.settings.skin;
		if (a) {
			var b = $(this.collection_container),
				c = b.attr("class").split(/\s+/);
			$.each(c, function(a) {
				var d = c[a];
				d != "p3-playlist-container" && b.removeClass(d)
			}), b.addClass(a), this.settings.skin = a
		}
		parseInt(parent.settings.width.toString().replace("px", ""), 10) <= 250 && $(this.collection_container).addClass("p3-playlist-narrow")
	}, this.listen = function() {
		$(this.container).find(".p3-playlist-suggested-results").live("mouseover", function(a) {
			$(this).hasClass("drop_up") ? msg = "Show Keywords" : msg = "Hide Keywords", P3.Util.tooltip(a, msg, parent.settings.skin)
		}), $(this.container).find(".p3-playlist-ul li a").live("click", function(a) {
			var b = $(this).parents("li:first");
			if ($(b).attr("video_id") == parent.instance.player.interface.video_id()) return !1;
			$(parent.container).find(".p3-playlist-currently-loading").removeClass("p3-playlist-currently-loading"), $(b).addClass("p3-playlist-currently-loading"), parent.instance.player.load_video({
				video_id: $(b).attr("video_id"),
				m: 0
			})
		}), $(this.container).find(".p3-playlist-suggested-search-terms a").live("click", function(a) {
			var b = $(this).html();
			$(parent.container).find(".p3-playlist-searchterm").val(b), parent.search(b)
		}), $(this.container).find(".p3-playlist-suggested-results").live("click", function(a) {
			$(".p3_floating_segment").remove();
			var b = $(parent.container).find(".p3-playlist-suggested-search-terms");
			if ($(parent.container).find(".p3-playlist-suggested-search-terms:visible").length == 1) {
				var c = b.outerHeight();
				b.attr("oheight", c), b.slideUp(200), $(this).addClass("drop_up"), $(parent.container).find(".p3-playlist-results").animate({
					height: "+=" + c
				}, 200)
			} else {
				var c = b.attr("oheight");
				$(this).removeClass("drop_up"), b.slideDown(200), $(parent.container).find(".p3-playlist-results").animate({
					height: "-=" + c
				}, 200)
			}
		}), $(this.container).find(".p3-playlist-searchterm").keyup(function(a) {
			(a.keyCode || a.which) == 27 && parent.clear_search()
		}), $(this.container).find(".p3-playlist-search-form").submit(function(a) {
			var b = $(parent.container).find(".p3-playlist-searchterm").val();
			return parent.search(b), !1
		}), $(this.container).find(".p3-playlist-search-reset").live("click", function(a) {
			parent.clear_search()
		}), $(this.container).find(".p3-playlist-prev-video").live("click", function(a) {
			var b = parent.settings.current_page - 1;
			if (b <= 0) return !1;
			parent.load_method == "search" ? parent.search(parent.searchterm, b) : parent.all_files(!1, b)
		}), $(this.container).find(".p3-playlist-next-video").live("click", function(a) {
			var b = parent.settings.current_page + 1;
			if (b > parent.settings.total_pages) return !1;
			parent.load_method == "search" ? parent.search(parent.searchterm, b) : parent.all_files(!1, b)
		});
		var a = ".p3-playlist-segmentmap td";
		a += parent.settings.show_all_results ? "" : ".hit", $(this.container).find(a).live("click", function(a) {
			parent.load_segment({
				num: $(this).attr("num"),
				segs_per: $(this).attr("segs_per"),
				video_id: $(this).attr("video_id"),
				evt: a
			})
		}), $(".p3-playlist-close-segment").live("click", function(a) {
			$(".p3_floating_segment").remove()
		}), $(".p3-playlist-play-from").live("click", function(a) {
			var b = $(this).attr("video_id"),
				c = parseInt($(this).attr("m"), 10);
			parent.instance.player.interface.video_id() == b ? (parent.instance.player.interface.play(), setTimeout(function() {
				parent.instance.player.interface.seek(c)
			}, 0)) : ($(".p3-playlist-ul li").removeClass("p3-playlist-currently-loading"), $(".p3-playlist-ul li[video_id=" + b + "]").addClass("p3-playlist-currently-loading"), parent.instance.player.load_video({
				video_id: b,
				m: c
			}))
		}), $(".p3_floating_segment .hit").live("click", function(a) {
			$(this).siblings().removeClass("active_hit"), $(this).addClass("active_hit");
			var b = $(this).attr("ind"),
				c = $(this).parents(".p3_floating_segment:first"),
				d = c.find("p.segment_content:visible:eq(" + b + ")").offset().top - c.find("p.segment_content:visible:eq(0)").offset().top;
			c.find(".floating_segment_content").scrollTop(d)
		}), $(this.container).find(".p3-playlist-results").scroll(function(a) {
			$(".p3_floating_segment").remove()
		})
	}, this.api_request = function(a, b, c) {
		c = c || "js";
		var d = parent.settings.base_url;
		d += "p/projects/" + parent.settings.project_id, a && (d += "/" + a), d += "." + c, arr = [];
		for (i in b) arr.push(i + "=" + encodeURIComponent(b[i]));
		d += "?" + arr.join("&"), parent.settings.folder_id && (d += "&batch_id=" + parent.settings.folder_id), P3.Util.load_remote_script(d)
	}, this.all_files = function(a, b) {
		this.load_method = "all_files";
		var c = "linked_accounts/" + parent.settings.linked_account_id + "/playlist",
			d = {
				page: b || 1,
				per_page: parent.settings.per_page || 10,
				sortby: parent.settings.list_sort_by.split(":")[0],
				desc: /\:desc$/.test(parent.settings.list_sort_by) ? "1" : "0",
				callback: "P3.instances[" + parent.instance.instance_index + "].playlist.parse_playlist_results"
			};
		parent.api_request(c, d)
	}, this.clear_search = function() {
		$(this.container).find(".p3-playlist-search-reset").hide(), $(this.container).find(".p3-playlist-searchterm").val(""), this.all_files()
	}, this.search = function(a, b) {
		var b = b || 1,
			c = parent.settings.per_page || 10;
		a = a || "", a = a.replace(/^\s+|\s+$/, "");
		if (!a) return this.load_method == "search" && parent.all_files(), !1;
		$(parent.container).find(".p3-playlist-search-reset").show(), this.searchterm = a, this.load_method = "search";
		var d = "linked_accounts/" + parent.settings.linked_account_id + "/segmentmap",
			e = {
				page: b || 1,
				query: a,
				per_page: parent.settings.per_page || 10,
				sortby: parent.settings.search_sort_by.split(":")[0],
				desc: /\:desc$/.test(parent.settings.search_sort_by) ? "1" : "0",
				callback: "P3.instances[" + parent.instance.instance_index + "].playlist.parse_playlist_results"
			};
		parent.api_request(d, e)
	}, this.load_segment = function(a) {
		parent.settings.segment_target_event = a.evt;
		var b = "files/" + a.video_id + "/segments/" + a.num,
			c = {
				usevideoid: 1,
				segs: a.segs_per,
				callback: "P3.instances[" + parent.instance.instance_index + "].playlist.parse_transcript_segment"
			};
		parent.api_request(b, c)
	}, this.parse_transcript_segment = function(obj) {
		$(".p3_floating_segment").remove();
		var file_id = obj.segments[0].file_id,
			tr = $(".p3-playlist-container").find("tr[file_id=" + file_id + "]"),
			video_id = $(tr).attr("video_id");
		obj.video_id = video_id, obj.file_id = file_id;
		var html = (new EJS({
			text: parent.segment,
			type: "["
		})).render(obj),
			targ = $(tr).parents("table:first"),
			offset = $(".p3-playlist-container").offset(),
			width = Math.min(Math.max(250, $(targ).outerWidth()), 450),
			height = $(targ).outerHeight(),
			div = $("<div></div>");
		$(div).addClass("p3_floating_segment"), $(div).addClass(parent.settings.skin), $(div).attr("instance_index", parent.instance.instance_index), $(div).html(html), $(document.body).append(div), ll = $(parent.settings.segment_target_event.target).offset().left, ll = ll - $(parent.settings.segment_target_event.target).parents("tbody:first").offset().left - 2, ll = Math.max(ll, 0), $(".p3-floating-segment-point").css("left", ll);
		if (parent.searchterm) {
			var hit_counter = 0;
			$(".p3_floating_segment").find(".segment_content").each(function() {
				var html = $(this).html(),
					re = eval("/(" + parent.searchterm.replace(/^\s+|\s+$/).replace(/\s+/, "|") + ")/ig");
				re.test(html) || parent.settings.show_all_results ? (html = html.replace(re, "<strong>$1</strong>"), $(this).html(html), $(".paragraph_hits ul").append("<li class='hit " + (hit_counter == 0 ? "active_hit" : "") + "' ind='" + hit_counter + "'>&nbsp;&nbsp;&nbsp;</li>"), hit_counter++) : $(this).hide()
			}), hit_counter <= 1 && $(".paragraph_hits").css("visibility", "hidden")
		}
		$(div).css({
			position: "absolute",
			zIndex: 1e15,
			top: $(tr).offset().top + 17 + "px",
			left: $(tr).offset().left + "px",
			width: width + "px",
			height: "110px"
		})
	}, this.parse_playlist_results = function(a) {
		$(".p3_floating_segment").remove(), a.instance_index = parent.instance_index, a.searchterm = parent.searchterm, a.settings = parent.settings, a.load_method = parent.load_method;
		if (a.summary.total_entries > 0) {
			var b = (new EJS({
				text: parent.files_list,
				type: "["
			})).render(a);
			$(this.container).find(".p3-playlist-results").fadeTo(150, .6, function() {
				$(this).html(b), $(this).fadeTo(150, 1)
			}), parent.settings.current_page = a.summary.current_page, parent.settings.total_pages = a.summary.total_pages, $(this.container).find(".p3-playlist-progress-summary")
		} else {
			var b = (new EJS({
				text: parent.empty_files_list,
				type: "["
			})).render(a);
			$(this.container).find(".p3-playlist-results").html(b), $(this.container).find(".p3-playlist-progress-summary").html("0 results")
		}
		parent.load_method == "search" ? parent.instance.event.trigger("Playlist.SearchResult", {
			searchterm: a.searchterm
		}) : parent.instance.event.trigger("Playlist.AllFiles")
	}, this.segment = '<div class="floating_segment_header">    <div class="paragraph_hits">      <ul></ul>    </div>    <span>      <a href="javascript:void(0);" class="p3-playlist-close-segment">&nbsp;</a>    </span>    </div>    <div class="floating_segment_content">    [% for (i=0;i<segments.length;i++) { %]      <p class="segment_content" attr=[%=i%]>        <span class="p3-playlist-play-from" m="[%=segments[i].timestamp%]" video_id="[%=video_id%]">[%=P3.Util.ms_to_stamp(segments[i].timestamp)%]</span>        <span>"... [%= segments[i].content %]..."</span>      </p>    [% } %]    </div>    <div class="p3-floating-segment-point"></div>', this.empty_files_list = '<p class="no-results">No results!</p>', this.files_list = '<ul class="p3-playlist-ul p3-playlist-ul-[%=load_method.replace("_","-")%]">    [% for (i=0;i<files.length;i++){ %]      <li video_id="[%=files[i].video_id%]">        <a href="javascript:void(0);">          <span class="p3-playlist-play-button">&nbsp;</span>          [% if (settings.show_thumbnails) {%]            <span class="p3-playlist-thumbnail">              <img src="[%=files[i].thumbnail_url%]" onerror="this.src=\'http://p3.3playmedia.com/images/espresso/thumbnail-error.png\'"/>            </span>          [%}%]          <span class="p3-playlist-video-info">            <p class="p3-playlist-video-title">[%=files[i].name%]</p>            <p class="p3-playlist-meta-field-one">[%=P3.Util.ms_to_stamp(files[i].duration)%]</p>          </span>        </a>        [% if (files[i].segmentmap && settings.show_segments) { %]          <div class="p3-playlist-segmentmap-container">            <table class="p3-playlist-segmentmap" cellSpacing="0">              [%= P3.Util.render_segment_map(files[i].segmentmap, {file_id:files[i].id,video_id:files[i].video_id}, "") %]            </table>          </div>          <div class="p3-playlist-search-results-summary">          </div>        [% } %]      </li>    [% } %]  </ul>', this.template = '<div class="p3-container p3-playlist-container">    <div class="p3-playlist-topbar">      <form class="p3-playlist-search-form" action="javascript:void(0);">        <button class="p3-playlist-submit-search"></button>        <input type="text" class="p3-playlist-searchterm" placeholder="[%=search_box_placeholder%]"/>        <div class="p3-playlist-search-reset">&nbsp;</div>      </form>      [% if (typeof suggested_search_terms == "object" && suggested_search_terms.length > 0) { %]        <div class="p3-playlist-suggested-search-terms">          Keywords:&nbsp;          [% for (i=0;i<suggested_search_terms.length;i++){%]            <a href="javascript:void(0);">[%=suggested_search_terms[i]%]</a>          [% } %]        </div>      [% } %]    </div>    <div class="p3-playlist-results"></div>   </div>', $(instance).bind("Player.Progress", function(a, b) {
		var c = $(parent.container).find("li[video_id=" + b.video_id + "]");
		if (c.hasClass("p3-playlist-currently-playing")) return !1;
		$(parent.container).find("li.p3-playlist-currently-playing").removeClass("p3-playlist-currently-playing"), c.removeClass("p3-playlist-currently-loading"), c.addClass("p3-playlist-currently-playing")
	}), this.init()
}