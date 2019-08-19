export default function countHashtags(text) {
  const maximum = 6;
  for (let i = 0; i <= maximum; i++) {
    if (text[i] !== '#') {
      return i;
    }
  }
  return maximum;
}
