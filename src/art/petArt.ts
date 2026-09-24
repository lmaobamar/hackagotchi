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

type CompactPetSprite = Record<keyof typeof sprout, string>;

export const compactPetArt = {
	sprout: {
		idle: String.raw`  _/\_
 (o o)
 /___/`,
		happy: String.raw`  _/\_ +
 (^ ^)
 /___/`,
		hungry: String.raw`  _/\_
 (. .)
 /_o_/`,
		sleeping: String.raw`  _/\_ z
 (- -)
 /___/`,
		sad: String.raw`  _/\_
 (; ;)
 /_n_/`,
	},
	byte: {
		idle: String.raw` /\ /\
|o o|
 \_w_/`,
		happy: String.raw` /\ /\ +
|^ ^|
 \___/`,
		hungry: String.raw` /\ /\
|. .|
 \_o_/`,
		sleeping: String.raw` /\ /\ z
|- -|
 \___/`,
		sad: String.raw` /\ /\
|; ;|
 \_n_/`,
	},
	pip: {
		idle: String.raw` __ __
|o o|
'o___o'`,
		happy: String.raw` __ __ +
|^ ^|
'o___o'`,
		hungry: String.raw` __ __
|. .|
'o_o_o'`,
		sleeping: String.raw` __ __ z
|- -|
'o___o'`,
		sad: String.raw` __ __
|; ;|
'o_n_o'`,
	},
	nib: {
		idle: String.raw` /\_/\
(o o)
 \_v_/`,
		happy: String.raw` /\_/\ +
(^ ^)
 \___/`,
		hungry: String.raw` /\_/\
(. .)
 \_o_/`,
		sleeping: String.raw` /\_/\ z
(- -)
 \_v_/`,
		sad: String.raw` /\_/\
(; ;)
 \_n_/`,
	},
} satisfies Record<"sprout" | "byte" | "pip" | "nib", CompactPetSprite>;

const petArt = { sprout, byte, pip, nib };

export type PetSpriteName = keyof typeof petArt;
export type PetSpriteMood = keyof typeof sprout;

export default petArt;
