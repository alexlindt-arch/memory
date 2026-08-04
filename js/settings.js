/**
 * Memory – Settings (Code vibes)
 * Portierte Logik der Claude-Design-Komponente "Memory Settings Code Vibes.dc.html".
 * Zustand: gewaehlter Spieler + gewaehlte Board-Groesse. Der Start-Button ist erst
 * aktiv (gelb, klickbar, Hover-Animation), wenn beides gesetzt ist.
 */

// Zielseiten der drei Board-Groessen. Die Board-Screens gehoeren nicht zu diesem
// Repo, deshalb bleibt der Link inert.
const BOARDS = ['#', '#', '#'];

const state = { player: null, size: null, startHover: false };

const el = {
  dotBlue: document.getElementById('dot-blue'),
  dotOrange: document.getElementById('dot-orange'),
  dot16: document.getElementById('dot-16'),
  dot24: document.getElementById('dot-24'),
  dot36: document.getElementById('dot-36'),
  startBtn: document.getElementById('start-btn'),
  startIcon: document.getElementById('start-icon'),
  startIconPath: document.getElementById('start-icon-path'),
  startLabel: document.getElementById('start-label')
};

function render() {
  const { player, size, startHover } = state;
  const ready = player !== null && size !== null;

  el.dotBlue.setAttribute('fill', player === 0 ? '#097FC5' : 'transparent');
  el.dotOrange.setAttribute('fill', player === 1 ? '#EA6900' : 'transparent');
  el.dot16.setAttribute('fill', size === 0 ? '#303131' : 'transparent');
  el.dot24.setAttribute('fill', size === 1 ? '#303131' : 'transparent');
  el.dot36.setAttribute('fill', size === 2 ? '#303131' : 'transparent');

  const fg = ready ? '#303131' : '#AFAFAF';
  el.startBtn.style.background = ready ? '#F0EA6E' : '#D9D9D9';
  el.startBtn.style.cursor = ready ? 'pointer' : 'not-allowed';
  el.startBtn.style.transform = 'scale(' + (ready && startHover ? '1.06' : '1') + ')';
  el.startBtn.setAttribute('href', ready ? encodeURI(BOARDS[size]) : '#');
  el.startIcon.style.transform = 'rotate(' + (ready && startHover ? '-10deg' : '0deg') + ')';
  el.startIconPath.setAttribute('fill', fg);
  el.startLabel.style.color = fg;
}

function setState(patch) {
  Object.assign(state, patch);
  render();
}

document.getElementById('pick-blue').addEventListener('click', () => setState({ player: 0 }));
document.getElementById('pick-orange').addEventListener('click', () => setState({ player: 1 }));
document.getElementById('pick-16').addEventListener('click', () => setState({ size: 0 }));
document.getElementById('pick-24').addEventListener('click', () => setState({ size: 1 }));
document.getElementById('pick-36').addEventListener('click', () => setState({ size: 2 }));

el.startBtn.addEventListener('mouseenter', () => setState({ startHover: true }));
el.startBtn.addEventListener('mouseleave', () => setState({ startHover: false }));

render();
