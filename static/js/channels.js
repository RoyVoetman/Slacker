document.addEventListener('DOMContentLoaded', () => {

	document.querySelectorAll('.channel-link').forEach(function(button) {
		button.onclick = function() {
			localStorage.setItem('channel', this.dataset.channel);
			return true;
		};
	});

});