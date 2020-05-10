const mux = (chair, table) => {
  const new_table = table.map((played_cards, i) =>
    table[(i + chair) % 4].map(card => card)
  );
  // played_cards.map(card => new Card(card))
  return new_table;
};

describe("shift chairs", () => {
  it("works", () => {
    let test_table = [["card 0"], ["card 1"], ["c2"], ["card 3"]];
    let res = mux(0, test_table);
    expect(res).toEqual(test_table);
    res = mux(1, test_table);
    expect(res).toEqual([["card 1"], ["c2"], ["card 3"], ["card 0"]]);
    res = mux(2, test_table);
    expect(res).toEqual([["c2"], ["card 3"], ["card 0"], ["card 1"]]);
  });
});
