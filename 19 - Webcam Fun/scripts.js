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

	return setInterval(() => ctx.drawImage(video, 0, 0, width, height), 16);
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

getVideo();
video.addEventListener("canplay", paintToCanvas);
