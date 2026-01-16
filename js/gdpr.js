(function () {
	console.log("gdpr runing");
	var KEY = "gdpr_consent-dghub"; // value: 'accepted' or 'rejected'
	var banner = document.getElementById("gdpr-banner");
	var acceptBtn = document.getElementById("gdpr-accept");
	var rejectBtn = document.getElementById("gdpr-reject");

	console.log("banner", banner);
	console.log("acceptBtn", acceptBtn);
	console.log("rejectBtn", rejectBtn);

	function showBanner() {
		console.log("show banner", banner);
		if (banner) {
			banner.style.display = "block";
		}
	}
	function hideBanner() {
		console.log("hide banner", banner);
		if (banner) {
			banner.style.display = "none";
		}
	}

	function setConsent(val) {
		try {
			localStorage.setItem(KEY, val);
		} catch (e) {}
		if (val === "accepted") {
			runNonEssential(); // run scripts that need consent
		}
		hideBanner();
	}

	function getConsent() {
		try {
			return localStorage.getItem(KEY);
		} catch (e) {
			return null;
		}
	}

	// Put any non-essential code here (analytics, trackers, etc.)
	function runNonEssential() {
		// Example: load Google Analytics or other scripts dynamically
		// var s = document.createElement('script');
		// s.src = 'https://example.com/analytics.js';
		// document.head.appendChild(s);
	}

	// Initialization
	var current = getConsent();
	console.log("current", current);
	if (current === "accepted") {
		runNonEssential();
	}
	if (current === null) {
		showBanner();
	} else {
		hideBanner();
	}

	acceptBtn?.addEventListener("click", function () {
		setConsent("accepted");
	});
	rejectBtn?.addEventListener("click", function () {
		setConsent("rejected");
	});

	// Optional: expose function to change consent via a settings link
	window.gdpr = {
		getConsent: getConsent,
		accept: function () {
			setConsent("accepted");
		},
		reject: function () {
			setConsent("rejected");
		},
	};
})();
