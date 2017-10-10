function copyTextToClipboard(text) {
	
	var textArea = document.createElement("textarea");
	
	textArea.id = "faketext"
	
	// Place in top-left corner of screen regardless of scroll position.
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;
	
	// Ensure it has a small width and height. Setting to 1px / 1em
	// doesn't work as this gives a negative w/h on some browsers.
	textArea.style.width = '2em';
	textArea.style.height = '2em';
	
	// We don't need padding, reducing the size if it does flash render.
	textArea.style.padding = 0;
	
	// Clean up any borders.
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';
	
	// Avoid flash of white box if rendered for any reason.
	textArea.style.background = 'transparent';
	
	textArea.value = text;
	
	document.body.appendChild(textArea);
	
	textArea.select();
	
	try {
		var successful = document.execCommand('copy');
		console.log('Copy: ', successful);
	} catch (err) {
		console.log('Error exec command copy.');
	}
	
	document.body.removeChild(textArea);
}

function showToast(text) {
	
	if (!$("#toast").length) {
		var toast = document.createElement("div");
		toast.id = "toast";
		toast.className = "toast";
		toast.style = "display:none";
		
		var label = document.createElement("Label");
		label.innerHTML = text;
		
		toast.appendChild(label);
		
		document.body.appendChild(toast);
	}
	
	$('.toast').fadeIn(400).delay(2000).fadeOut(400);
}

var last_url = "";

$("body").on('click', 'div.O84Olb', function() {
	
	// TODO: change this hardcoded div listener.
	
	// get the image URL
	//var img_url = $("div.LaaOff").attr("data-tiu");
	var img_url = $(this).attr("data-tiu");
	
	// to prevent multi "Image URL copied to clipboard!" when zooming the image
	if(last_url != img_url) {
		last_url = img_url;
		chrome.storage.sync.get(
			{img_width: 1000}, 
			function(items) {
				
				var width = items.img_width;
				
				// force width with 1000px and add an extension
				img_url = img_url + "=w" + width + "-no-tmp.jpg"
				
				// put the new URL in clipboard
				copyTextToClipboard(img_url);
				
				// show a "toast" stile message
				showToast("Image URL copied to clipboard!");
			});
	}
});

$("body").on('click', 'img', function() {
    
	// URL sample
	// https://lh3.googleusercontent.com/botz...ekBIg=w715-h402-no
	
	// get the image URL
	var img_url = $(this).attr("src");
	
	// split it... by "=", to the URL without marameters (first part)
	img_url = img_url.split("=")[0];
	
	// add new parameters
	//
	// from: https://sites.google.com/site/picasaresources/Home/Picasa-FAQ/google-photos-1/how-to/how-to-get-a-direct-link-to-an-image
	// - Some sites want to explicitly have an image extension at the end of the URL, you can try adding either -tmp.jpg or ?.jpg at the end
	// - "s400": this gets the image with width or height (whichever is larger in the original image) resampled to 400 pixels. The other dimension will be 400 as well in case of a square images, otherwise it will be proportionally smaller. 
	// - "w400": this gets the image resampled so the width is always 400 pixels.
	// - "h400": this gets the image resampled so the height is always 400 pixels.
	// - "w800-h400": this gets the image resampled in such a way so the width will be maximum 800 pixels and the height will be maximum 400 pixels. So one of the dimensions will be the exact size specified, the other dimension will be the size specified or smaller.
	// - "...-c", eg: "w800-h400-c": this gets the image so it is exactly this size. The source image is first resampled so the image is fitting for the limiting dimension, then the other dimension is cropped so the image is the exact size asked. When cropping, it is just the centre of the picture that is kept.
	// - "...-p", eg: "w800-h400-p": this gets the image so it is exactly this size. The source image is first resampled so the image is fitting for the limiting dimension, then the other dimension is cropped so the image is the exact size asked. When cropping, some algorythm searches the most interesting part of the image, so the result of the cropping doesn't always keep the center of the picture.
	// - "s0", "w0", "h0", "w0-h0": this will get the image in it's original size, without any resampling nor cropping.
	// - "...-no", eg: "w800-h400-no": this gives a slightly bigger image as a result (for the image I looked into), haven't found out yet what the exact impact is.
	
	chrome.storage.sync.get(
		{img_width: 1000}, 
		function(items) {
			
			var width = items.img_width;
			
			// force width with 1000px and add an extension
			img_url = img_url + "=w" + width + "-no-tmp.jpg"
			
			// put the new URL in clipboard
			copyTextToClipboard(img_url);
			
			// show a "toast" stile message
			showToast("Image URL copied to clipboard!");
		});
});
