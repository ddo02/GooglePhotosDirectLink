
function save_options() {
	
	var img_width = document.getElementById('width').value;
	
	// if is a number...
	
	chrome.storage.sync.set(
		{img_width: img_width}, 
		function() {
			// Update status to let user know options were saved.
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function() {
				status.textContent = '';
				}, 750);
		});
}

function restore_options() {
	
	chrome.storage.sync.get(
		{img_width: 1000}, 
		function(items) {
			document.getElementById('width').value = items.img_width;
		});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);