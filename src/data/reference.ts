/**
 * Temporary image references from a community-hosted reconstruction of the
 * original Save Walter White website. These are Breaking Bad publicity/family
 * images, NOT photos of Pradnya. Replace before representing this as a real
 * personal/fundraising website; the author has not claimed reuse rights.
 */
const imageBase =
  "https://raw.githubusercontent.com/matiasroj0/save-walter-white/master/images";

export const reference = {
  website: "https://www.savewalterwhite.com/",
  imageSourceRepository: "https://github.com/matiasroj0/save-walter-white",
  photo: (number: number) => `${imageBase}/walter_${number}.jpg`,
  tile: `${imageBase}/tile.png`,
  bowLeft: `${imageBase}/bow_left.png`,
  bowRight: `${imageBase}/bow_right.png`,
} as const;
