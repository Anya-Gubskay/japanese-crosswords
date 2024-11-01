export function setVideoAutoplay() {
  const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video');
  videos.forEach((video) => {
    video.muted = true;
    video.autoplay = true;
    video.loop = true;
    video.play().catch(error => {
      console.error("Автоматическое воспроизведение не удалось:", error);
    });
  });
}
