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
};
