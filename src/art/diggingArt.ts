const width = 32;
const height = 10;

function frame(art: string): string {
	return art
		.split("\n")
		.map((line) => line.padEnd(width))
		.join("\n");
}

const sniff = frame(String.raw`
     /\  /\          ?
    /  \/  \
    | o  o |
    |  w   |     .
    /      \_)  / \
    '------'   '---'
     /    \   . . .
___.'______'.___________
`);

const scoop = frame(String.raw`
     /\  /\
    /  \/  \    _
    | >  < |   /_\
    |  w   |  /
    /     o--/
    '------'     .
     /    \   . : .
___.'______'._\___/_____
`);

const toss = frame(String.raw`
     /\  /\        .  *
    /  \/  \   _  * .
    | >  < |  /_\  .
    |  w   | /       .
    /     o-/
    '------'
     /    \   .   .
___.'______'._\___/_____
`);

const peek = frame(String.raw`
     /\  /\          !
    /  \/  \
    | O  O |
    |  o   |
    /      \_)   +
    '------'   .---.
     /    \    | ? |
___.'______'._\___/_____
`);

const coins = frame(String.raw`                 +
     /\  /\    ($) ($)
    /  \/  \     ($)  +
    | ^  ^ |
    | \__/ |   .---.
    /o    o\_) | $ |
    '------'   '---'
    _/    \_   .   .
___'________'_\___/_____
`);

const item = frame(String.raw`                 +
     /\  /\    .----.
    /  \/  \   | () | +
    | ^  ^ |   '----'
    | \__/ |
    /o    o\_) .---.
    '------'   | ? |
    _/    \_   '---'
___'________'_\___/_____
`);

const chest = frame(String.raw`                  +
     /\  /\     .----.
    /  \/  \    | /\ | +
    | ^  ^ |    '----'
    | \__/ |   /$$$$/|
    /o    o\_) +---+ |
    '------'   | + |/
    _/    \_   '---'
___'________'_\___/_____
`);

export default {
	width,
	height,
	sniff,
	scoop,
	toss,
	peek,
	coins,
	item,
	chest,
	loop: [scoop, toss, scoop, toss],
	coinDiscovery: [sniff, scoop, toss, scoop, toss, peek, coins],
	itemDiscovery: [sniff, scoop, toss, scoop, toss, peek, item],
	chestDiscovery: [sniff, scoop, toss, scoop, toss, peek, chest],
};
