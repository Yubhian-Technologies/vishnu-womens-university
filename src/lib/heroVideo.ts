// Campus hero video, hosted on Firebase Storage (was public/VWU CAMPUS-BVRM.mp4,
// ~64MB) so the large file no longer ships in the deploy or enters Vite's
// module graph. Shared by the Home hero (HeroSlider) and the Campus Visit
// page's virtual tour. Still a heavy download — re-encoding to a lower bitrate
// helps more than anything else — so defer/lazy-load the fetch at call sites.
export const HERO_VIDEO_SRC =
  'https://res.cloudinary.com/dgvuwuiqz/video/upload/f_auto,q_auto/v1789233937/VWU_CAMPUS_VIEW_3_lzoss5.mp4';

export const HERO_POSTER_SRC =
  'https://res.cloudinary.com/dgvuwuiqz/video/upload/f_auto,q_auto,so_0/v1789233937/VWU_CAMPUS_VIEW_3_lzoss5.jpg';
