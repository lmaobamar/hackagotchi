const sprout = {
	idle: String.raw`     _/\_
      ||
   .------.
  /  o  o  \
  |   u    |
   '------'
   _/    \_`,
	happy: String.raw`     _/\_  +
  +   ||
   .------.
  /  ^  ^  \
  |  \__/  |
   '------'
   _/    \_`,
	hungry: String.raw`     _/\_
      ||
   .------.
  /  .  .  \
  |   o    |
   '------'
   _/    \_`,
	sleeping: String.raw`     _/\_
      ||   z
   .------.
  /  -  -  \
  |   .    |
   '------'
   _/    \_`,
	sad: String.raw`     _/\_
      ||
   .------.
  /  ;  ;  \
  |   n    |
   '------'
   _/    \_`,
};

const byte = {
	idle: String.raw`   /\  /\
  /  \/  \
  | o  o |
  |  w   |
  /      \_)
  '------'
  _/    \_`,
	happy: String.raw`   /\  /\  +
  /  \/  \
  | ^  ^ |
  | \__/ |
  /      \_)
  '------'
  _/    \_`,
	hungry: String.raw`   /\  /\
  /  \/  \
  | .  . |
  |  o   |
  /      \_)
  '------'
  _/    \_`,
	sleeping: String.raw`   /\  /\
  /  \/  \ z
  | -  - |
  |  .   |
  /      \_)
  '------'
  _/    \_`,
	sad: String.raw`   /\  /\
  /  \/  \
  | ;  ; |
  |  n   |
  /      \_)
  '------'
  _/    \_`,
};

const pip = {
	idle: String.raw`    __  __
   / / / /
   | | | |
  .------.
  | o  o |
  |  x   |
  'o----o'`,
	happy: String.raw`    __  __ +
   / / / /
   | | | |
  .------.
  | ^  ^ |
  | \__/ |
  'o----o'`,
	hungry: String.raw`    __  __
   / / / /
   | | | |
  .------.
  | .  . |
  |  o   |
  'o----o'`,
	sleeping: String.raw`    __  __
   / / / / z
   | | | |
  .------.
  | -  - |
  |  x   |
  'o----o'`,
	sad: String.raw`    __  __
   / / / /
   | | | |
  .------.
  | ;  ; |
  |  n   |
  'o----o'`,
};

const nib = {
	idle: String.raw`    /\_/\
   / o o \
  /   v   \
  | >   < |
   \_____/
    /   \
   '     '`,
	happy: String.raw`    /\_/\  +
   / ^ ^ \
  / \___/ \
  | >   < |
   \_____/
   _/   \_
  '       '`,
	hungry: String.raw`    /\_/\
   / . . \
  /   o   \
  | >   < |
   \_____/
    /   \
   '     '`,
	sleeping: String.raw`    /\_/\
   / - - \ z
  /   v   \
  | >   < |
   \_____/
   _/   \_
  '       '`,
	sad: String.raw`    /\_/\
   / ; ; \
  /   n   \
  | >   < |
   \_____/
    /   \
   '     '`,
};

const petArt = { sprout, byte, pip, nib };

export type PetSpriteName = keyof typeof petArt;
export type PetSpriteMood = keyof typeof sprout;

export default petArt;
