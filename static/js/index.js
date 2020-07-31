Handlebars.registerHelper('exists', function(variable, options) {
	if (typeof variable !== 'undefined') {
		return options.fn(this);
	}
});

/**
 * @param displayName
 * @param channel
 */
function login(displayName, channel) {
	document.querySelector('#app').classList.remove('d-none');
	document.querySelector('#displayNameModel').classList.add('d-none');

	localStorage.setItem('displayName', displayName);

	// Go to channels list
	if (channel === null) {
		if (location.pathname !== '/') {
			window.location.href = "/";
		}
		return;
	}

	localStorage.setItem('channel', channel);

	if (location.pathname !== `/channels/${channel}`) {
		window.location.href = `/channels/${channel}`;
	}
}

document.addEventListener('DOMContentLoaded', () => {

	let displayName = localStorage.getItem('displayName');
	let channel = localStorage.getItem('channel');

	if (displayName !== null) {
		login(displayName, channel);
	} else {
		document.querySelector('#displayNameForm').onsubmit = function (e) {
			e.preventDefault();

			let displayName = this.querySelector('#name').value;

			if (displayName.trim() === '') {
				this.querySelector('.invalid-name').classList.remove('d-none');
				return false;
			}

			login(displayName, null);

			// Prevent form submit
			return false;
		};
	}

	document.querySelectorAll('.channels-list-btn').forEach(function(button) {
		button.onclick = function() {
			localStorage.removeItem('channel');
			return true;
		};
	});
});