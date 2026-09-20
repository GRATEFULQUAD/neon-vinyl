// Builds a playable playlist + optional album art directly from a folder the
// user picks on their own device via the native Android/Chrome folder picker
// (webkitdirectory). Nothing is uploaded anywhere — object URLs point straight
// at the local files in memory for the life of the tab.

export interface LocalTrack {
  id: string;
  title: string;
  file: File;
  url: string; // object URL
}

export interface LocalLibrary {
  folderName: string;
  tracks: LocalTrack[];
  albumArtUrl: string | null;
}

const AUDIO_EXT = /\.(mp3|wav|ogg|oga|m4a|aac|flac|webm|opus)$/i;
const IMAGE_EXT = /\.(jpg|jpeg|png|webp|gif|bmp)$/i;

function isAudioFile(file: File): boolean {
  if (file.type.startsWith("audio/")) return true;
  return AUDIO_EXT.test(file.name);
}

function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return IMAGE_EXT.test(file.name);
}

function titleFromFilename(name: string): string {
  const base = name.replace(/\.[^./]+$/, "");
  return base.replace(/[_-]+/g, " ").trim() || name;
}

// Revoke every object URL a previously built library was holding, so folder
// switches don't leak memory across a long session.
export function releaseLibrary(library: LocalLibrary | null) {
  if (!library) return;
  library.tracks.forEach((t) => URL.revokeObjectURL(t.url));
  if (library.albumArtUrl) URL.revokeObjectURL(library.albumArtUrl);
}

export function buildLibraryFromFiles(fileList: FileList): LocalLibrary {
  const files = Array.from(fileList);

  const audioFiles = files
    .filter(isAudioFile)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const imageFiles = files
    .filter(isImageFile)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  const tracks: LocalTrack[] = audioFiles.map((file, i) => ({
    id: `${i}-${file.name}`,
    title: titleFromFilename(file.name),
    file,
    url: URL.createObjectURL(file),
  }));

  const albumArtUrl = imageFiles.length > 0 ? URL.createObjectURL(imageFiles[0]) : null;

  // webkitRelativePath looks like "MyAlbum/01 Song.mp3" — pull the top folder name.
  const firstPath = files[0]?.webkitRelativePath || "";
  const folderName = firstPath.split("/")[0] || "Local Folder";

  return { folderName, tracks, albumArtUrl };
}

// Fixed neon accent rotation used for playlist rows / controls when we have
// no per-file color metadata (arbitrary user files).
export const NEON_PALETTE = [
  "0,255,240",
  "255,0,230",
  "150,90,255",
  "90,235,110",
  "255,140,0",
  "255,45,150",
];

export function accentFor(index: number): string {
  return NEON_PALETTE[index % NEON_PALETTE.length];
}
