const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

const ctx = canvas.getContext("2d");

async function getVideo() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
		video.srcObject = stream;
		video.play();
	} catch (err) {
		console.error("Ooops! An error occurred");
	}
}

function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;

	canvas.width = width;
	canvas.height = height;

	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);

		// add filters

		let pixels = ctx.getImageData(0, 0, width, height); // get pixels

		// mess with the pixels

		// pixels = redEffect(pixels);
		// pixels = rgbSplit(pixels);
		// ctx.globalAlpha = 0.1;
		pixels = greenScreen(pixels);

		ctx.putImageData(pixels, 0, 0); // put the pixels back
	}, 16);
}

function takePhoto() {
	// play sound
	snap.currentTime = 0;
	snap.play();

	// get download link
	const imageData = canvas.toDataURL("image/jpeg");
	const link = document.createElement("a");

	link.href = imageData;
	link.download = "photo";
	link.innerHTML = `<img src='${imageData}' alt="Photo" />`;

	strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = pixels.data[i + 0] + 70;
		pixels.data[i + 1] = pixels.data[i + 1] - 30;
		pixels.data[i + 2] = pixels.data[i + 2] * 0.5;
	}
	return pixels;
}

function rgbSplit(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i - 150] = pixels.data[i + 0];
		pixels.data[i + 50] = pixels.data[i + 1];
		pixels.data[i - 500] = pixels.data[i + 2];
	}
	return pixels;
}

function greenScreen(pixels) {
	levels = {};
	document.querySelectorAll(".rgb input").forEach(input => (levels[input.name] = input.value));

	for (let i = 0; i < pixels.data.length; i++) {
		const red = pixels.data[i + 0];
		const green = pixels.data[i + 1];
		const blue = pixels.data[i + 2];

		if (
			red >= levels["rmin"] &&
			red <= levels["rmax"] &&
			green >= levels["gmin"] &&
			green <= levels["gmax"] &&
			blue >= levels["bmin"] &&
			blue <= levels["bmax"]
		) {
			pixels.data[i + 3] = 0;
		}
	}

	return pixels;
}

getVideo();
video.addEventListener("canplay", paintToCanvas);
