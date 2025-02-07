// Global constants
export const Constant = {
  TokenKey: 'access_token',
  Uid: 'uid',
  ThemeKey: 'dark'
};
// File types
export const FileTypeMap = {
  bpm: 'image/bpm',
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  mp3: 'audio/mp3',
  mp4: 'video/mpeg4',
  aac: 'audio/x-mei-aac'
};
export const defaultMoveOptions = {
  draggable: true,
  resizable: false,
  scalable: true,
  dragArea: false, // Enable drag area control
  origin: false, // Whether origin point is visible
  snappable: true, // Enable guide lines
  stopPropagation: true, // Stop event propagation
  snapThreshold: 5,
  isDisplaySnapDigit: true, // Whether to display guide line distance
  snapGap: true, // Block guide lines
  snapElement: true, // Element-based guide lines
  snapCenter: true, // Center guide lines
  snapDigit: 10, // Snap distance
  snapVertical: true, // Vertical guide lines
  snapHorizontal: true, // Horizontal guide lines
  throttleDrag: 1,
  throttleResize: 1,
  throttleScale: 0.01,
  keepRatio: true, // Maintain aspect ratio
  renderDirections: ['nw', 'ne', 'se', 'sw'], // Handle anchor points
  rotatable: false, // Whether rotatable
  throttleRotate: 0.2,
  elementGuidelines: [],
  pinchable: false // Pinch toggle
};
