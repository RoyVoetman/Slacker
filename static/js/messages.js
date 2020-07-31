document.addEventListener('DOMContentLoaded', () => {

	const message = Handlebars.compile(document.querySelector('#message').innerHTML);
	const channel = document.querySelector('#messages').dataset.channel;

	// Connect to websocket
	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	// When connected, configure buttons
	socket.on('connect', () => {

		document.querySelector('#submit-message').onsubmit = function(e) {
			e.preventDefault();

			const input = this.querySelector('input[type=text]');
			const file = this.querySelector('input[type=file]');

			const hasFile = file.files[0] !== undefined;

			if (hasFile) {
				if (input.value.trim() === '') {
					input.value = file.files[0].name;
				}

				let formData = new FormData();
				formData.append("attachment", file.files[0], file.files[0].name);

				let xhr = new XMLHttpRequest();
				xhr.open('post', '/file-upload', true);

				xhr.send(formData);
			}

			if (input.value.trim() === '') {
				return;
			}

			const date = new Date();
			const createdAt = date.toDateString() + " " + date.toTimeString().substring(0, 8);

			let data = {
				'message': input.value,
				'channel': channel,
				'created_at': createdAt,
        'displayName': localStorage.getItem('displayName')
			};

			if (hasFile) {
				data['attachment'] = file.files[0].name;
			}

			socket.emit('submit message', data);

			input.value = '';
			file.value = ''
		};

	});

	socket.on('whisper message', data => {
		if(data['channel'] !== channel)
			return;

		let templateData = {'displayName': data['displayName'], 'message': data['message'], 'createdAt': data['created_at']};

		if ('attachment' in data) {
			templateData['attachment'] = data['attachment'];
		}

		const content = message(templateData);

		document.querySelector('#messages').innerHTML += content;
	});
});
