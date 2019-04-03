// A helper function to format dates from the React Player library
export function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = padString(date.getUTCSeconds());
    if (hh) {
      return `${hh}:${padString(mm)}:${ss}`;
    }
    return `${mm}:${ss}`;
}
  
//A string that helps pad out the times with the proper amount of zeroes.
function padString(string) {
    return ('0' + string).slice(-2);
}