const streakReviver = String.raw`    /\
   /  \
  ( /\ )
   \__/
  [____]`;

const happinessBottle = String.raw`   [==]
   /  \
  |^  ^|
  | \/ |
  '----'`;

const energyDrink = String.raw`   .--.
   | /|
   |< |
   | /|
   '--'`;

const snackPack = String.raw`  .----.
  |~~~~|
  | () |
  |____|
  '----'`;

const goldenSemicolon = String.raw`   /\
  /; \
  \  /
   \/
  [__]`;

const debugSpray = String.raw`   __=>
  [__]
  |x |
  |  |
  '--'`;

const commitCharm = String.raw`   .--.
  /    \
  \ /\ /
   <>>
    \/`;

const rubberDuck = String.raw`   __
  (o )>
 /   \_
(______)
 ~~~~~~`;

const nightOwlPotion = String.raw`   [==]
   /  \
  |o^o |
  |/ \ |
  '----'`;

const coffee = String.raw`   ) (
  .----.
  |    |]
  '----'
  ------`;

const byItemId: Record<string, string> = {
	streak_reviver: streakReviver,
	happiness_bottle: happinessBottle,
	energy_drink: energyDrink,
	snack_pack: snackPack,
	golden_semicolon: goldenSemicolon,
	debug_spray: debugSpray,
	commit_charm: commitCharm,
	rubber_duck: rubberDuck,
	night_owl_potion: nightOwlPotion,
	"cup_o'_coffee": coffee,
};

const compactByItemId: Record<string, string> = {
	streak_reviver: " /\\\n[__]",
	happiness_bottle: "[==]\n|^^|",
	energy_drink: ".--.\n|< |",
	snack_pack: ".--.\n|()|",
	golden_semicolon: " /;\\\n[__]",
	debug_spray: "__=>\n[__]",
	commit_charm: ".--.\n<>>",
	rubber_duck: " __\n(o)>",
	night_owl_potion: "[==]\n|o^|",
	"cup_o'_coffee": ") (\n|_|",
};

const minimalByItemId: Record<string, string> = {
	streak_reviver: "♢",
	happiness_bottle: "!",
	energy_drink: "▯",
	snack_pack: "▣",
	golden_semicolon: ";",
	debug_spray: "➜",
	commit_charm: "◇",
	rubber_duck: "◒",
	night_owl_potion: "☾",
	"cup_o'_coffee": "☕",
};

export default {
	streakReviver,
	happinessBottle,
	energyDrink,
	snackPack,
	goldenSemicolon,
	debugSpray,
	commitCharm,
	rubberDuck,
	nightOwlPotion,
	coffee,
	byItemId,
	compactByItemId,
	minimalByItemId,
};
