// 1080 => ['18', '00'] => 18:00

export default function convertMinutes(minutesString: number) {
  const hours = Math.floor(minutesString / 60);
  const minutes = minutesString % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}