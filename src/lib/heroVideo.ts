// Campus hero video, hosted on Firebase Storage (was public/VWU CAMPUS-BVRM.mp4,
// ~64MB) so the large file no longer ships in the deploy or enters Vite's
// module graph. Shared by the Home hero (HeroSlider) and the Campus Visit
// page's virtual tour. Still a heavy download — re-encoding to a lower bitrate
// helps more than anything else — so defer/lazy-load the fetch at call sites.
export const HERO_VIDEO_SRC =
  'https://res.cloudinary.com/dl88qtudz/video/upload/f_auto,q_auto/v1789800981/pv2ilnfhzz9fyfoagqxp.mp4';

export const HERO_POSTER_SRC =
  'https://res.cloudinary.com/dl88qtudz/video/upload/f_auto,q_auto,so_0/v1789800981/pv2ilnfhzz9fyfoagqxp.jpg';

// Homepage hero only (HeroSlider). The Campus Visit page's virtual tour
// keeps the campus video above. Poster = this video's first frame, so the
// still shown while it loads matches the video.
export const HOME_HERO_VIDEO_SRC =
  'https://res.cloudinary.com/dl88qtudz/video/upload/f_auto,q_auto/v1790577280/j4hifhdgf3yfqike6a0e.mp4';

export const HOME_HERO_POSTER_SRC =
  'https://res.cloudinary.com/dl88qtudz/video/upload/f_auto,q_auto,so_0/v1790577280/j4hifhdgf3yfqike6a0e.jpg';
