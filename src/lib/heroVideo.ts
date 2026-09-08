// Campus hero video, hosted on Firebase Storage (was public/VWU CAMPUS-BVRM.mp4,
// ~64MB) so the large file no longer ships in the deploy or enters Vite's
// module graph. Shared by the Home hero (HeroSlider) and the Campus Visit
// page's virtual tour. Still a heavy download — re-encoding to a lower bitrate
// helps more than anything else — so defer/lazy-load the fetch at call sites.
export const HERO_VIDEO_SRC =
  'https://firebasestorage.googleapis.com/v0/b/vishnu-womens-university.firebasestorage.app/o/VWU%20CAMPUS%20VIEW.mp4?alt=media&token=72282016-025d-4fd2-b51a-19c94a30e950';
