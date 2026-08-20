export async function fireConfetti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#FBB208", "#F8AC02", "#F9B404", "#FDFBF7"]; // brand gold

  const shoot = (angle: number, origin: { x: number; y: number }) =>
    confetti({ particleCount: 60, spread: 55, startVelocity: 55, angle, origin, colors });

  shoot(60, { x: 0, y: 0.7 });
  shoot(120, { x: 1, y: 0.7 });
  setTimeout(() => {
    shoot(60, { x: 0, y: 0.7 });
    shoot(120, { x: 1, y: 0.7 });
  }, 220);
}
