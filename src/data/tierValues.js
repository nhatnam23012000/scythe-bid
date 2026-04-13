// Community-sourced tier adjusted bid values.
// Keyed by mat ID, then faction ID. Value is the dollar amount.
// Fenris and Vesna have no community data — display "—" in the UI.
export const TIER_VALUES = {
  industrial:   { polania: 17, saxony: 15, crimea: 22, nordic: 15, rusviet: 31, albion: 4,  togawa: 5  },
  engineering:  { polania: 8,  saxony: 5,  crimea: 16, nordic: 7,  rusviet: 22, albion: 3,  togawa: 5  },
  patriotic:    { polania: 12, saxony: 10, crimea: 31, nordic: 16, rusviet: 21, albion: 8,  togawa: 11 },
  mechanical:   { polania: 11, saxony: 9,  crimea: 23, nordic: 10, rusviet: 26, albion: 1,  togawa: 0  },
  agricultural: { polania: 9,  saxony: 8,  crimea: 12, nordic: 6,  rusviet: 17, albion: 3,  togawa: 7  },
  militant:     { polania: 25, saxony: 18, crimea: 34, nordic: 10, rusviet: 30, albion: 13, togawa: 7  },
  innovative:   { polania: 24, saxony: 23, crimea: 29, nordic: 17, rusviet: 35, albion: 12, togawa: 13 },
};
