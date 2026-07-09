const uniquePool = ['A', 'B', 'C', 'D', 'E'];
const seg = 10;
const grid = Array.from({ length: seg }, () => Array(5).fill(null));

for (let c = 0; c < seg; c++) {
  for (let r = 0; r < 5; r++) {
    const left1 = c > 0 ? grid[c - 1][r] : grid[seg - 1][r];
    const left2 = c > 1 ? grid[c - 2][r] : (c === 1 ? grid[seg - 1][r] : grid[seg - 2][r]);
    const top1 = r > 0 ? grid[c][r - 1] : null;
    const top2 = r > 1 ? grid[c][r - 2] : null;

    let available = uniquePool.filter(u => u !== left1 && u !== left2 && u !== top1 && u !== top2);
    if (available.length === 0) available = uniquePool.filter(u => u !== left1 && u !== top1);
    if (available.length === 0) available = uniquePool;

    const pseudoRandom = Math.abs(Math.sin(c * 12.9898 + r * 78.233)) * 43758.5453;
    const pickIndex = Math.floor((pseudoRandom - Math.floor(pseudoRandom)) * available.length);
    
    grid[c][r] = available[pickIndex];
  }
}
console.log(grid.map(row => row.join(',')));
