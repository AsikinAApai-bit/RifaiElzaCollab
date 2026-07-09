function buildItems(seg) {
  // Try to generate 50 items perfectly
  // seg = 10
  const xCols = Array.from({ length: seg }, (_, i) => (i - seg / 2) * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });
  console.log(coords.length, xCols);
}
buildItems(10);
