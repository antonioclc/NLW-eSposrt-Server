// 18:00 => ['18', '00'] => 1080

export default function convertHour(hourString: string) {
  const [hour, minutes] = hourString.split(':').map(Number);
  return hour * 60 + minutes;
}