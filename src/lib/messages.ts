export const MOTIVATIONAL_MESSAGES = [
  "This craving will pass. You are stronger than it.",
  "Every craving you resist makes the next one easier.",
  "Your body is already healing. Keep going.",
  "You chose freedom. This moment does not define you.",
  "Breathe through it. In a few minutes, you will be glad you waited.",
  "Cravings peak and fade. You only need to ride this wave.",
  "Think of how proud you will feel in an hour.",
  "You have already proven you can do hard things.",
  "Your future self is cheering for you right now.",
  "One craving at a time. You have got this.",
];

export function getRandomMessage(): string {
  const index = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
  return MOTIVATIONAL_MESSAGES[index];
}
