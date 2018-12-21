export type KeySharps = -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default interface IKeySignature {
  sharps: KeySharps;
  mode: "major" | "minor";
};
