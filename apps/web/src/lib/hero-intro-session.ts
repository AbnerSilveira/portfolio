/** sessionStorage: intro do hero já exibida nesta aba. */
export const HERO_INTRO_SESSION_KEY = "portfolio-hero-intro-done";

export function clearHeroIntroSession(): void {
  try {
    sessionStorage.removeItem(HERO_INTRO_SESSION_KEY);
  } catch {
    /* ignore */
  }
}
