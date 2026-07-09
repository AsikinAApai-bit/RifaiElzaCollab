const seg = 10;
const pool = [
  {src: 'a'}, {src: 'b'}, {src: 'c'}, {src: 'd'}, {src: 'e'}
];
const uniquePool = pool;
const grid = Array.from({ length: seg }, () => Array(5).fill(null));
for (let c = 0; c < seg; c++) {
  for (let r = 0; r < 5; r++) {
    const left = c > 0 ? grid[c - 1][r]?.src : null;
    const top = r > 0 ? grid[c][r - 1]?.src : null;
    const right = (c === seg - 1) ? grid[0][r]?.src : null;
    let available = uniquePool.filter(u => u.src !== left && u.src !== top && u.src !== right);
    if (available.length === 0) available = uniquePool;
    const pseudoRandom = Math.abs(Math.sin(c * 12.9898 + r * 78.233)) * 43758.5453;
    const pickIndex = Math.floor((pseudoRandom - Math.floor(pseudoRandom)) * available.length);
    grid[c][r] = available[pickIndex];
  }
}
console.log(grid.map(row => row.map(x => x.src).join(',')));
