/**
 * TEMPORARY source references for a personal parody. These photographs are
 * Breaking Bad stills, not photographs of Pradnya, and reuse rights are
 * unverified. Do not bundle or redistribute the copyrighted image files.
 *
 * Source is pinned to an immutable repository commit so it cannot silently
 * switch to different photographs. The secondary URL mirrors the same source
 * through another provider; it is not an additional license or owned asset.
 */
const revision = "508d0aea07fb3dee18f8dda23ee93e6b5e3a2a3f";
const source = "matiasroj0/save-walter-white";
const imagesPath = `https://raw.githubusercontent.com/${source}/${revision}/images`;
const fallbackPath = `https://cdn.jsdelivr.net/gh/${source}@${revision}/images`;

export const reference = {
  website: "https://www.savewalterwhite.com/",
  imageSourceRepository: `https://github.com/${source}/tree/${revision}/images`,
  imageSourceRevision: revision,
  photo: (number: number) => `${imagesPath}/walter_${number}.jpg`,
  fallbackPhoto: (number: number) => `${fallbackPath}/walter_${number}.jpg`,
  tile: `${imagesPath}/tile.png`,
  bowLeft: `${imagesPath}/bow_left.png`,
  bowRight: `${imagesPath}/bow_right.png`,
} as const;
