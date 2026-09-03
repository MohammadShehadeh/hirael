'use client';

import * as React from 'react';
import {
  Cat,
  Clock,
  Heart,
  Lightbulb,
  Pizza,
  Plane,
  Search,
  Smile,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Input } from '@/registry/hirael/bases/base/ui/input';
import { composeRefs } from '@/registry/hirael/bases/base/components/compose-refs';

export type EmojiCategory = 'smileys' | 'people' | 'animals' | 'food' | 'activities' | 'travel' | 'objects' | 'symbols';

export interface EmojiItem {
  emoji: string;
  name: string;
  keywords: string;
  category: EmojiCategory;
  /** Accepts a Fitzpatrick skin tone modifier. */
  skin?: boolean;
}

export type EmojiSkinTone = 0 | 1 | 2 | 3 | 4 | 5;

const SKIN_MODIFIERS = ['', '\u{1F3FB}', '\u{1F3FC}', '\u{1F3FD}', '\u{1F3FE}', '\u{1F3FF}'];

/** Apply a skin tone (0 = none) to an emoji that supports one. */
export const applySkinTone = (item: EmojiItem, tone: EmojiSkinTone): string => {
  if (!item.skin || tone === 0) return item.emoji;
  // The modifier follows the base character, before any ZWJ sequence, and
  // replaces a text/emoji variation selector.
  const [base, ...rest] = Array.from(item.emoji);
  let tail = rest.join('');
  if (tail.startsWith('️')) tail = tail.slice(1);
  return base + SKIN_MODIFIERS[tone] + tail;
};

type Row = [emoji: string, name: string, keywords: string, skin?: 1];

const group = (category: EmojiCategory, rows: Row[]): EmojiItem[] => {
  return rows.map(([emoji, name, keywords, skin]) => ({
    emoji,
    name,
    keywords,
    category,
    skin: skin === 1 ? true : undefined,
  }));
};

export const EMOJIS: readonly EmojiItem[] = [
  ...group('smileys', [
    ['😀', 'grinning face', 'smile happy'],
    ['😃', 'grinning face with big eyes', 'smile happy'],
    ['😄', 'grinning face with smiling eyes', 'smile happy'],
    ['😁', 'beaming face', 'grin'],
    ['😆', 'grinning squinting face', 'laugh'],
    ['😅', 'grinning face with sweat', 'laugh nervous'],
    ['🤣', 'rolling on the floor laughing', 'lol'],
    ['😂', 'face with tears of joy', 'laugh cry'],
    ['🙂', 'slightly smiling face', 'smile'],
    ['🙃', 'upside-down face', 'silly'],
    ['😉', 'winking face', 'wink'],
    ['😊', 'smiling face with smiling eyes', 'blush'],
    ['😇', 'smiling face with halo', 'angel'],
    ['🥰', 'smiling face with hearts', 'love'],
    ['😍', 'smiling face with heart-eyes', 'love'],
    ['🤩', 'star-struck', 'wow'],
    ['😘', 'face blowing a kiss', 'kiss'],
    ['😗', 'kissing face', 'kiss'],
    ['😋', 'face savoring food', 'yum'],
    ['😛', 'face with tongue', 'tongue'],
    ['😜', 'winking face with tongue', 'silly'],
    ['🤪', 'zany face', 'crazy'],
    ['😝', 'squinting face with tongue', 'silly'],
    ['🤑', 'money-mouth face', 'rich'],
    ['🤗', 'hugging face', 'hug'],
    ['🤭', 'face with hand over mouth', 'oops'],
    ['🤫', 'shushing face', 'quiet'],
    ['🤔', 'thinking face', 'hmm'],
    ['🤐', 'zipper-mouth face', 'secret'],
    ['🤨', 'face with raised eyebrow', 'suspicious'],
    ['😐', 'neutral face', 'meh'],
    ['😑', 'expressionless face', 'blank'],
    ['😶', 'face without mouth', 'silent'],
    ['😏', 'smirking face', 'smirk'],
    ['😒', 'unamused face', 'meh'],
    ['🙄', 'face with rolling eyes', 'eyeroll'],
    ['😬', 'grimacing face', 'awkward'],
    ['🤥', 'lying face', 'pinocchio'],
    ['😌', 'relieved face', 'calm'],
    ['😔', 'pensive face', 'sad'],
    ['😪', 'sleepy face', 'tired'],
    ['🤤', 'drooling face', 'drool'],
    ['😴', 'sleeping face', 'zzz'],
    ['😷', 'face with medical mask', 'sick'],
    ['🤒', 'face with thermometer', 'sick'],
    ['🤕', 'face with head-bandage', 'hurt'],
    ['🤢', 'nauseated face', 'sick'],
    ['🤮', 'face vomiting', 'sick'],
    ['🥵', 'hot face', 'heat'],
    ['🥶', 'cold face', 'freezing'],
    ['🥴', 'woozy face', 'dizzy'],
    ['😵', 'face with crossed-out eyes', 'dizzy'],
    ['🤯', 'exploding head', 'mind blown'],
    ['🤠', 'cowboy hat face', 'yeehaw'],
    ['🥳', 'partying face', 'party'],
    ['🥸', 'disguised face', 'incognito'],
    ['😎', 'smiling face with sunglasses', 'cool'],
    ['🤓', 'nerd face', 'geek'],
    ['🧐', 'face with monocle', 'fancy'],
    ['😕', 'confused face', 'confused'],
    ['😟', 'worried face', 'worried'],
    ['🙁', 'slightly frowning face', 'sad'],
    ['😮', 'face with open mouth', 'surprised'],
    ['😲', 'astonished face', 'shocked'],
    ['😳', 'flushed face', 'embarrassed'],
    ['🥺', 'pleading face', 'puppy eyes'],
    ['😢', 'crying face', 'sad tear'],
    ['😭', 'loudly crying face', 'sob'],
    ['😱', 'face screaming in fear', 'scream'],
    ['😤', 'face with steam from nose', 'angry'],
    ['😡', 'enraged face', 'angry'],
    ['🤬', 'face with symbols on mouth', 'swearing'],
    ['💀', 'skull', 'dead'],
    ['💩', 'pile of poo', 'poop'],
    ['🤡', 'clown face', 'clown'],
    ['👻', 'ghost', 'boo'],
    ['👽', 'alien', 'ufo'],
    ['🤖', 'robot', 'bot'],
    ['😺', 'grinning cat', 'cat'],
    ['😻', 'smiling cat with heart-eyes', 'cat love'],
  ]),
  ...group('people', [
    ['👋', 'waving hand', 'hello bye', 1],
    ['🤚', 'raised back of hand', 'stop', 1],
    ['✋', 'raised hand', 'high five', 1],
    ['🖖', 'vulcan salute', 'spock', 1],
    ['👌', 'ok hand', 'okay', 1],
    ['🤌', 'pinched fingers', 'italian', 1],
    ['✌️', 'victory hand', 'peace', 1],
    ['🤞', 'crossed fingers', 'luck', 1],
    ['🤟', 'love-you gesture', 'rock', 1],
    ['🤘', 'sign of the horns', 'rock', 1],
    ['🤙', 'call me hand', 'shaka', 1],
    ['👈', 'backhand index pointing left', 'point', 1],
    ['👉', 'backhand index pointing right', 'point', 1],
    ['👆', 'backhand index pointing up', 'point', 1],
    ['👇', 'backhand index pointing down', 'point', 1],
    ['☝️', 'index pointing up', 'one', 1],
    ['👍', 'thumbs up', 'yes like', 1],
    ['👎', 'thumbs down', 'no dislike', 1],
    ['✊', 'raised fist', 'power', 1],
    ['👊', 'oncoming fist', 'punch', 1],
    ['👏', 'clapping hands', 'applause', 1],
    ['🙌', 'raising hands', 'hooray', 1],
    ['🤝', 'handshake', 'deal'],
    ['🙏', 'folded hands', 'please thanks pray', 1],
    ['✍️', 'writing hand', 'write', 1],
    ['💅', 'nail polish', 'nails', 1],
    ['🤳', 'selfie', 'photo', 1],
    ['💪', 'flexed biceps', 'strong muscle', 1],
    ['👀', 'eyes', 'look'],
    ['👁️', 'eye', 'see'],
    ['🧠', 'brain', 'smart'],
    ['👂', 'ear', 'listen', 1],
    ['👃', 'nose', 'smell', 1],
    ['🦶', 'foot', 'kick', 1],
    ['👶', 'baby', 'infant', 1],
    ['🧒', 'child', 'kid', 1],
    ['👦', 'boy', 'kid', 1],
    ['👧', 'girl', 'kid', 1],
    ['🧑', 'person', 'adult', 1],
    ['👨', 'man', 'adult', 1],
    ['👩', 'woman', 'adult', 1],
    ['🧓', 'older person', 'elder', 1],
    ['👴', 'old man', 'grandpa', 1],
    ['👵', 'old woman', 'grandma', 1],
    ['👮', 'police officer', 'cop', 1],
    ['🕵️', 'detective', 'spy', 1],
    ['💂', 'guard', 'soldier', 1],
    ['👷', 'construction worker', 'builder', 1],
    ['🤴', 'prince', 'royal', 1],
    ['👸', 'princess', 'royal', 1],
    ['🧙', 'mage', 'wizard', 1],
    ['🧛', 'vampire', 'dracula', 1],
    ['🧟', 'zombie', 'undead'],
    ['🦸', 'superhero', 'hero', 1],
    ['🧑‍💻', 'technologist', 'developer coder', 1],
    ['🧑‍🎨', 'artist', 'painter', 1],
    ['🧑‍🚀', 'astronaut', 'space', 1],
    ['🧑‍🍳', 'cook', 'chef', 1],
    ['🧑‍🔬', 'scientist', 'lab', 1],
    ['🧑‍🏫', 'teacher', 'school', 1],
    ['🧑‍⚕️', 'health worker', 'doctor nurse', 1],
    ['🧑‍🌾', 'farmer', 'farm', 1],
    ['🚶', 'person walking', 'walk', 1],
    ['🏃', 'person running', 'run', 1],
    ['💃', 'woman dancing', 'dance', 1],
    ['🕺', 'man dancing', 'dance', 1],
    ['🧘', 'person in lotus position', 'yoga meditate', 1],
    ['👯', 'people with bunny ears', 'party'],
    ['👫', 'woman and man holding hands', 'couple', 1],
    ['💑', 'couple with heart', 'love', 1],
    ['👪', 'family', 'parents kids'],
  ]),
  ...group('animals', [
    ['🐶', 'dog face', 'puppy'],
    ['🐱', 'cat face', 'kitten'],
    ['🐭', 'mouse face', 'mouse'],
    ['🐹', 'hamster', 'pet'],
    ['🐰', 'rabbit face', 'bunny'],
    ['🦊', 'fox', 'fox'],
    ['🐻', 'bear', 'bear'],
    ['🐼', 'panda', 'panda'],
    ['🐨', 'koala', 'koala'],
    ['🐯', 'tiger face', 'tiger'],
    ['🦁', 'lion', 'lion'],
    ['🐮', 'cow face', 'cow'],
    ['🐷', 'pig face', 'pig'],
    ['🐸', 'frog', 'frog'],
    ['🐵', 'monkey face', 'monkey'],
    ['🙈', 'see-no-evil monkey', 'monkey'],
    ['🐔', 'chicken', 'hen'],
    ['🐧', 'penguin', 'penguin'],
    ['🐦', 'bird', 'bird'],
    ['🦆', 'duck', 'duck'],
    ['🦅', 'eagle', 'eagle'],
    ['🦉', 'owl', 'owl'],
    ['🐺', 'wolf', 'wolf'],
    ['🐴', 'horse face', 'horse'],
    ['🦄', 'unicorn', 'unicorn'],
    ['🐝', 'honeybee', 'bee'],
    ['🐛', 'bug', 'caterpillar'],
    ['🦋', 'butterfly', 'butterfly'],
    ['🐌', 'snail', 'snail'],
    ['🐞', 'lady beetle', 'ladybug'],
    ['🐢', 'turtle', 'tortoise'],
    ['🐍', 'snake', 'snake'],
    ['🦎', 'lizard', 'gecko'],
    ['🦖', 't-rex', 'dinosaur'],
    ['🐙', 'octopus', 'octopus'],
    ['🦑', 'squid', 'squid'],
    ['🦀', 'crab', 'crab'],
    ['🐠', 'tropical fish', 'fish'],
    ['🐬', 'dolphin', 'dolphin'],
    ['🐳', 'spouting whale', 'whale'],
    ['🦈', 'shark', 'shark'],
    ['🐊', 'crocodile', 'alligator'],
    ['🐘', 'elephant', 'elephant'],
    ['🦒', 'giraffe', 'giraffe'],
    ['🦓', 'zebra', 'zebra'],
    ['🐪', 'camel', 'desert'],
    ['🐐', 'goat', 'goat'],
    ['🐑', 'ewe', 'sheep'],
    ['🐿️', 'chipmunk', 'squirrel'],
    ['🦔', 'hedgehog', 'hedgehog'],
    ['🐾', 'paw prints', 'paws'],
    ['🌵', 'cactus', 'plant'],
    ['🌲', 'evergreen tree', 'tree'],
    ['🌴', 'palm tree', 'tree'],
    ['🌱', 'seedling', 'sprout'],
    ['🍀', 'four leaf clover', 'luck'],
    ['🌸', 'cherry blossom', 'flower'],
    ['🌹', 'rose', 'flower'],
    ['🌻', 'sunflower', 'flower'],
    ['🌷', 'tulip', 'flower'],
    ['🌙', 'crescent moon', 'night'],
    ['⭐', 'star', 'star'],
    ['🌈', 'rainbow', 'rainbow'],
    ['☀️', 'sun', 'sunny'],
    ['⛅', 'sun behind cloud', 'cloudy'],
    ['🌧️', 'cloud with rain', 'rain'],
    ['⚡', 'high voltage', 'lightning'],
    ['❄️', 'snowflake', 'snow'],
    ['🔥', 'fire', 'lit hot'],
    ['💧', 'droplet', 'water'],
    ['🌊', 'water wave', 'ocean'],
  ]),
  ...group('food', [
    ['🍎', 'red apple', 'fruit'],
    ['🍐', 'pear', 'fruit'],
    ['🍊', 'tangerine', 'orange'],
    ['🍋', 'lemon', 'citrus'],
    ['🍌', 'banana', 'fruit'],
    ['🍉', 'watermelon', 'fruit'],
    ['🍇', 'grapes', 'fruit'],
    ['🍓', 'strawberry', 'berry'],
    ['🫐', 'blueberries', 'berry'],
    ['🍒', 'cherries', 'fruit'],
    ['🍑', 'peach', 'fruit'],
    ['🥭', 'mango', 'fruit'],
    ['🍍', 'pineapple', 'fruit'],
    ['🥥', 'coconut', 'fruit'],
    ['🥝', 'kiwi fruit', 'fruit'],
    ['🍅', 'tomato', 'vegetable'],
    ['🥑', 'avocado', 'guac'],
    ['🌽', 'ear of corn', 'corn'],
    ['🥕', 'carrot', 'vegetable'],
    ['🥦', 'broccoli', 'vegetable'],
    ['🌶️', 'hot pepper', 'spicy'],
    ['🥔', 'potato', 'vegetable'],
    ['🍞', 'bread', 'loaf'],
    ['🥐', 'croissant', 'pastry'],
    ['🥯', 'bagel', 'bread'],
    ['🧀', 'cheese wedge', 'cheese'],
    ['🥚', 'egg', 'egg'],
    ['🍳', 'cooking', 'fried egg'],
    ['🥓', 'bacon', 'meat'],
    ['🍔', 'hamburger', 'burger'],
    ['🍟', 'french fries', 'fries'],
    ['🍕', 'pizza', 'slice'],
    ['🌭', 'hot dog', 'sausage'],
    ['🥪', 'sandwich', 'lunch'],
    ['🌮', 'taco', 'mexican'],
    ['🌯', 'burrito', 'wrap'],
    ['🧆', 'falafel', 'food'],
    ['🥗', 'green salad', 'healthy'],
    ['🍝', 'spaghetti', 'pasta'],
    ['🍜', 'steaming bowl', 'noodles ramen'],
    ['🍣', 'sushi', 'japanese'],
    ['🍱', 'bento box', 'lunch'],
    ['🍚', 'cooked rice', 'rice'],
    ['🍛', 'curry rice', 'curry'],
    ['🥘', 'shallow pan of food', 'paella'],
    ['🍲', 'pot of food', 'stew'],
    ['🧁', 'cupcake', 'dessert'],
    ['🎂', 'birthday cake', 'celebrate'],
    ['🍰', 'shortcake', 'cake'],
    ['🍩', 'doughnut', 'donut'],
    ['🍪', 'cookie', 'biscuit'],
    ['🍫', 'chocolate bar', 'candy'],
    ['🍬', 'candy', 'sweet'],
    ['🍦', 'soft ice cream', 'dessert'],
    ['🍯', 'honey pot', 'honey'],
    ['☕', 'hot beverage', 'coffee tea'],
    ['🍵', 'teacup without handle', 'tea'],
    ['🧃', 'beverage box', 'juice'],
    ['🥤', 'cup with straw', 'soda'],
    ['🧋', 'bubble tea', 'boba'],
    ['🍺', 'beer mug', 'beer'],
    ['🍷', 'wine glass', 'wine'],
    ['🥂', 'clinking glasses', 'cheers'],
    ['🍾', 'bottle with popping cork', 'champagne'],
    ['🧊', 'ice', 'cube'],
    ['🥄', 'spoon', 'utensil'],
    ['🍴', 'fork and knife', 'eat'],
  ]),
  ...group('activities', [
    ['⚽', 'soccer ball', 'football'],
    ['🏀', 'basketball', 'hoops'],
    ['🏈', 'american football', 'football'],
    ['⚾', 'baseball', 'ball'],
    ['🎾', 'tennis', 'racket'],
    ['🏐', 'volleyball', 'ball'],
    ['🏉', 'rugby football', 'rugby'],
    ['🎱', 'pool 8 ball', 'billiards'],
    ['🏓', 'ping pong', 'table tennis'],
    ['🏸', 'badminton', 'shuttlecock'],
    ['🥊', 'boxing glove', 'boxing'],
    ['🥋', 'martial arts uniform', 'karate'],
    ['⛳', 'flag in hole', 'golf'],
    ['🏹', 'bow and arrow', 'archery'],
    ['🎣', 'fishing pole', 'fishing'],
    ['🏊', 'person swimming', 'swim', 1],
    ['🚴', 'person biking', 'cycling', 1],
    ['🏋️', 'person lifting weights', 'gym', 1],
    ['🤸', 'person cartwheeling', 'gymnastics', 1],
    ['🧗', 'person climbing', 'climb', 1],
    ['⛷️', 'skier', 'ski'],
    ['🏂', 'snowboarder', 'snowboard', 1],
    ['🏄', 'person surfing', 'surf', 1],
    ['🏆', 'trophy', 'winner'],
    ['🥇', '1st place medal', 'gold'],
    ['🥈', '2nd place medal', 'silver'],
    ['🥉', '3rd place medal', 'bronze'],
    ['🏅', 'sports medal', 'medal'],
    ['🎖️', 'military medal', 'honor'],
    ['🎯', 'bullseye', 'target'],
    ['🎮', 'video game', 'controller gaming'],
    ['🕹️', 'joystick', 'arcade'],
    ['🎲', 'game die', 'dice'],
    ['🧩', 'puzzle piece', 'jigsaw'],
    ['♟️', 'chess pawn', 'chess'],
    ['🎰', 'slot machine', 'casino'],
    ['🎳', 'bowling', 'strike'],
    ['🎨', 'artist palette', 'paint'],
    ['🎭', 'performing arts', 'theater'],
    ['🎬', 'clapper board', 'movie'],
    ['🎤', 'microphone', 'sing karaoke'],
    ['🎧', 'headphone', 'music'],
    ['🎼', 'musical score', 'music'],
    ['🎹', 'musical keyboard', 'piano'],
    ['🥁', 'drum', 'drums'],
    ['🎷', 'saxophone', 'jazz'],
    ['🎺', 'trumpet', 'brass'],
    ['🎸', 'guitar', 'rock'],
    ['🎻', 'violin', 'strings'],
    ['🎪', 'circus tent', 'circus'],
    ['🎟️', 'admission tickets', 'ticket'],
    ['🎉', 'party popper', 'celebrate tada'],
    ['🎊', 'confetti ball', 'celebrate'],
    ['🎈', 'balloon', 'party'],
    ['🎁', 'wrapped gift', 'present'],
    ['🎀', 'ribbon', 'bow'],
    ['🎃', 'jack-o-lantern', 'halloween'],
    ['🎄', 'christmas tree', 'xmas'],
    ['🎆', 'fireworks', 'celebrate'],
  ]),
  ...group('travel', [
    ['🚗', 'automobile', 'car'],
    ['🚕', 'taxi', 'cab'],
    ['🚙', 'sport utility vehicle', 'suv'],
    ['🚌', 'bus', 'bus'],
    ['🚎', 'trolleybus', 'bus'],
    ['🏎️', 'racing car', 'f1'],
    ['🚓', 'police car', 'cop'],
    ['🚑', 'ambulance', 'emergency'],
    ['🚒', 'fire engine', 'firetruck'],
    ['🚚', 'delivery truck', 'truck'],
    ['🚜', 'tractor', 'farm'],
    ['🛵', 'motor scooter', 'vespa'],
    ['🏍️', 'motorcycle', 'bike'],
    ['🚲', 'bicycle', 'bike'],
    ['🛴', 'kick scooter', 'scooter'],
    ['🚏', 'bus stop', 'stop'],
    ['🚦', 'vertical traffic light', 'traffic'],
    ['🚧', 'construction', 'barrier'],
    ['⛽', 'fuel pump', 'gas'],
    ['🚂', 'locomotive', 'train'],
    ['🚆', 'train', 'rail'],
    ['🚇', 'metro', 'subway'],
    ['🚊', 'tram', 'streetcar'],
    ['🚀', 'rocket', 'launch ship'],
    ['🛸', 'flying saucer', 'ufo'],
    ['✈️', 'airplane', 'flight'],
    ['🛫', 'airplane departure', 'takeoff'],
    ['🛬', 'airplane arrival', 'landing'],
    ['🚁', 'helicopter', 'chopper'],
    ['⛵', 'sailboat', 'boat'],
    ['🚤', 'speedboat', 'boat'],
    ['🛳️', 'passenger ship', 'cruise'],
    ['⚓', 'anchor', 'harbor'],
    ['🗺️', 'world map', 'map'],
    ['🧭', 'compass', 'navigate'],
    ['🏔️', 'snow-capped mountain', 'mountain'],
    ['🌋', 'volcano', 'eruption'],
    ['🏕️', 'camping', 'tent'],
    ['🏖️', 'beach with umbrella', 'beach'],
    ['🏜️', 'desert', 'sand'],
    ['🏝️', 'desert island', 'island'],
    ['🏞️', 'national park', 'nature'],
    ['🏟️', 'stadium', 'arena'],
    ['🏛️', 'classical building', 'museum'],
    ['🏗️', 'building construction', 'crane'],
    ['🏠', 'house', 'home'],
    ['🏡', 'house with garden', 'home'],
    ['🏢', 'office building', 'work'],
    ['🏥', 'hospital', 'medical'],
    ['🏦', 'bank', 'money'],
    ['🏨', 'hotel', 'stay'],
    ['🏫', 'school', 'education'],
    ['🏬', 'department store', 'shopping'],
    ['🏭', 'factory', 'industry'],
    ['🏰', 'castle', 'palace'],
    ['🗼', 'tokyo tower', 'tower'],
    ['🗽', 'statue of liberty', 'new york'],
    ['🕌', 'mosque', 'islam'],
    ['⛪', 'church', 'christian'],
    ['🕍', 'synagogue', 'jewish'],
    ['🌁', 'foggy', 'bridge'],
    ['🌃', 'night with stars', 'city'],
    ['🌆', 'cityscape at dusk', 'sunset'],
    ['🌍', 'globe showing europe-africa', 'earth world'],
    ['🌎', 'globe showing americas', 'earth world'],
    ['🌏', 'globe showing asia-australia', 'earth world'],
  ]),
  ...group('objects', [
    ['⌚', 'watch', 'time'],
    ['📱', 'mobile phone', 'phone'],
    ['💻', 'laptop', 'computer'],
    ['⌨️', 'keyboard', 'type'],
    ['🖥️', 'desktop computer', 'monitor'],
    ['🖨️', 'printer', 'print'],
    ['🖱️', 'computer mouse', 'click'],
    ['💾', 'floppy disk', 'save'],
    ['💿', 'optical disk', 'cd'],
    ['📷', 'camera', 'photo'],
    ['📸', 'camera with flash', 'photo'],
    ['📹', 'video camera', 'record'],
    ['🎥', 'movie camera', 'film'],
    ['📺', 'television', 'tv'],
    ['📻', 'radio', 'broadcast'],
    ['🎙️', 'studio microphone', 'podcast'],
    ['⏰', 'alarm clock', 'wake'],
    ['⏳', 'hourglass not done', 'wait'],
    ['📡', 'satellite antenna', 'signal'],
    ['🔋', 'battery', 'power'],
    ['🔌', 'electric plug', 'power'],
    ['💡', 'light bulb', 'idea'],
    ['🔦', 'flashlight', 'torch'],
    ['🕯️', 'candle', 'light'],
    ['🧯', 'fire extinguisher', 'safety'],
    ['🛒', 'shopping cart', 'cart'],
    ['💰', 'money bag', 'cash'],
    ['💳', 'credit card', 'payment'],
    ['💎', 'gem stone', 'diamond'],
    ['⚖️', 'balance scale', 'justice'],
    ['🔧', 'wrench', 'tool fix'],
    ['🔨', 'hammer', 'tool'],
    ['⚙️', 'gear', 'settings'],
    ['🧲', 'magnet', 'attract'],
    ['🔬', 'microscope', 'science'],
    ['🔭', 'telescope', 'space'],
    ['💊', 'pill', 'medicine'],
    ['🩹', 'adhesive bandage', 'bandaid'],
    ['🧬', 'dna', 'genetics'],
    ['🧪', 'test tube', 'lab'],
    ['🚪', 'door', 'exit'],
    ['🛋️', 'couch and lamp', 'sofa'],
    ['🛏️', 'bed', 'sleep'],
    ['🚿', 'shower', 'bath'],
    ['🧹', 'broom', 'clean'],
    ['🧺', 'basket', 'laundry'],
    ['🧸', 'teddy bear', 'toy'],
    ['📦', 'package', 'box shipping'],
    ['📫', 'closed mailbox with raised flag', 'mail'],
    ['✉️', 'envelope', 'email letter'],
    ['📧', 'e-mail', 'email'],
    ['📝', 'memo', 'note write'],
    ['📁', 'file folder', 'folder'],
    ['📂', 'open file folder', 'folder'],
    ['📅', 'calendar', 'date'],
    ['📆', 'tear-off calendar', 'date'],
    ['📈', 'chart increasing', 'growth up'],
    ['📉', 'chart decreasing', 'down'],
    ['📊', 'bar chart', 'stats'],
    ['📋', 'clipboard', 'list'],
    ['📌', 'pushpin', 'pin'],
    ['📎', 'paperclip', 'attach'],
    ['✂️', 'scissors', 'cut'],
    ['🔒', 'locked', 'lock secure'],
    ['🔓', 'unlocked', 'open'],
    ['🔑', 'key', 'password'],
    ['🔍', 'magnifying glass tilted left', 'search'],
    ['📖', 'open book', 'read'],
    ['📚', 'books', 'library'],
    ['🔖', 'bookmark', 'save'],
    ['🏷️', 'label', 'tag'],
    ['✏️', 'pencil', 'write'],
    ['🖊️', 'pen', 'write'],
    ['🗑️', 'wastebasket', 'trash delete'],
  ]),
  ...group('symbols', [
    ['❤️', 'red heart', 'love'],
    ['🧡', 'orange heart', 'love'],
    ['💛', 'yellow heart', 'love'],
    ['💚', 'green heart', 'love'],
    ['💙', 'blue heart', 'love'],
    ['💜', 'purple heart', 'love'],
    ['🖤', 'black heart', 'love'],
    ['🤍', 'white heart', 'love'],
    ['🤎', 'brown heart', 'love'],
    ['💔', 'broken heart', 'heartbreak'],
    ['💕', 'two hearts', 'love'],
    ['💖', 'sparkling heart', 'love'],
    ['💗', 'growing heart', 'love'],
    ['💘', 'heart with arrow', 'cupid'],
    ['💯', 'hundred points', '100 perfect'],
    ['💢', 'anger symbol', 'angry'],
    ['💥', 'collision', 'boom'],
    ['💫', 'dizzy', 'stars'],
    ['💦', 'sweat droplets', 'splash'],
    ['💨', 'dashing away', 'fast'],
    ['💬', 'speech balloon', 'chat comment'],
    ['💭', 'thought balloon', 'thinking'],
    ['🗯️', 'right anger bubble', 'shout'],
    ['✨', 'sparkles', 'shiny new magic'],
    ['🌟', 'glowing star', 'shine'],
    ['✅', 'check mark button', 'done yes'],
    ['✔️', 'check mark', 'done yes'],
    ['❌', 'cross mark', 'no wrong'],
    ['❎', 'cross mark button', 'no'],
    ['❓', 'red question mark', 'question'],
    ['❗', 'red exclamation mark', 'important'],
    ['⚠️', 'warning', 'caution'],
    ['🚫', 'prohibited', 'no'],
    ['♻️', 'recycling symbol', 'recycle'],
    ['🔔', 'bell', 'notification'],
    ['🔕', 'bell with slash', 'mute'],
    ['🔴', 'red circle', 'record'],
    ['🟠', 'orange circle', 'circle'],
    ['🟡', 'yellow circle', 'circle'],
    ['🟢', 'green circle', 'online'],
    ['🔵', 'blue circle', 'circle'],
    ['🟣', 'purple circle', 'circle'],
    ['⚫', 'black circle', 'circle'],
    ['⚪', 'white circle', 'circle'],
    ['🟥', 'red square', 'square'],
    ['🟩', 'green square', 'square'],
    ['🟦', 'blue square', 'square'],
    ['🔶', 'large orange diamond', 'diamond'],
    ['🔷', 'large blue diamond', 'diamond'],
    ['▶️', 'play button', 'play'],
    ['⏸️', 'pause button', 'pause'],
    ['⏹️', 'stop button', 'stop'],
    ['⏩', 'fast-forward button', 'next'],
    ['⏪', 'fast reverse button', 'back'],
    ['🔀', 'shuffle tracks button', 'shuffle'],
    ['🔁', 'repeat button', 'loop'],
    ['➕', 'plus', 'add'],
    ['➖', 'minus', 'subtract'],
    ['➗', 'divide', 'division'],
    ['✖️', 'multiply', 'times'],
    ['♾️', 'infinity', 'forever'],
    ['🔗', 'link', 'url chain'],
    ['🏁', 'chequered flag', 'finish'],
    ['🚩', 'triangular flag', 'red flag'],
    ['🏳️', 'white flag', 'surrender'],
    ['🏴', 'black flag', 'flag'],
    ['🏳️‍🌈', 'rainbow flag', 'pride'],
    ['🆕', 'new button', 'new'],
    ['🆗', 'ok button', 'ok'],
    ['🆙', 'up button', 'up'],
    ['🆒', 'cool button', 'cool'],
    ['🆓', 'free button', 'free'],
    ['🔝', 'top arrow', 'top'],
    ['🔜', 'soon arrow', 'soon'],
    ['©️', 'copyright', 'legal'],
    ['™️', 'trade mark', 'legal'],
  ]),
];

export const EMOJI_CATEGORIES: readonly {
  id: EmojiCategory;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: 'smileys', label: 'Smileys', icon: Smile },
  { id: 'people', label: 'People', icon: Users },
  { id: 'animals', label: 'Animals & nature', icon: Cat },
  { id: 'food', label: 'Food & drink', icon: Pizza },
  { id: 'activities', label: 'Activities', icon: Trophy },
  { id: 'travel', label: 'Travel & places', icon: Plane },
  { id: 'objects', label: 'Objects', icon: Lightbulb },
  { id: 'symbols', label: 'Symbols', icon: Heart },
];

type EmojiPickerCategoryId = EmojiCategory | 'recent';

interface EmojiPickerContextValue {
  id: string;
  emojis: readonly EmojiItem[];
  query: string;
  setQuery: (next: string) => void;
  category: EmojiPickerCategoryId;
  setCategory: (next: EmojiPickerCategoryId) => void;
  visible: readonly EmojiItem[];
  recent: readonly EmojiItem[];
  hasRecent: boolean;
  skinTone: EmojiSkinTone;
  setSkinTone: (next: EmojiSkinTone) => void;
  setHovered: (next: EmojiItem | null) => void;
  setActiveIndex: (next: number) => void;
  columns: number;
  select: (item: EmojiItem) => void;
  display: (item: EmojiItem) => string;
  registerList: (el: HTMLDivElement | null) => void;
  focusItem: (index: number) => void;
}

const EmojiPickerContext = React.createContext<EmojiPickerContextValue | null>(null);

const useEmojiPicker = () => {
  const ctx = React.useContext(EmojiPickerContext);
  if (!ctx) {
    throw new Error('EmojiPicker compound parts must be used inside <EmojiPicker>');
  }
  return ctx;
};

const EmojiPickerHoverContext = React.createContext<EmojiItem | null>(null);

// Its own context, not the main one: activeIndex changes on every arrow key. The
// list reads it and hands each item a boolean `active`, so the memoized items
// re-render only when their own flag flips.
const EmojiPickerActiveIndexContext = React.createContext(-1);

const readRecent = (key: string): string[] => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
};

const writeRecent = (key: string, list: string[]) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Storage may be unavailable (private mode, quota). Recents are a nicety.
  }
};

export interface EmojiPickerProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  onEmojiSelect?: (emoji: string, item: EmojiItem) => void;
  /** localStorage key for recently used emoji. Omit to disable recents. */
  recentKey?: string;
  maxRecent?: number;
  emojis?: readonly EmojiItem[];
  skinTone?: EmojiSkinTone;
  defaultSkinTone?: EmojiSkinTone;
  onSkinToneChange?: (tone: EmojiSkinTone) => void;
  columns?: number;
}

const EmojiPicker = ({
  onEmojiSelect,
  recentKey,
  maxRecent = 16,
  emojis = EMOJIS,
  skinTone: skinToneProp,
  defaultSkinTone = 0,
  onSkinToneChange,
  columns = 8,
  className,
  children,
  ...props
}: EmojiPickerProps) => {
  const id = React.useId();
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [query, setQueryState] = React.useState('');
  const [category, setCategoryState] = React.useState<EmojiPickerCategoryId>('smileys');
  const [hovered, setHovered] = React.useState<EmojiItem | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [recentCodes, setRecentCodes] = React.useState<string[]>(() => (recentKey ? readRecent(recentKey) : []));
  const [internalTone, setInternalTone] = React.useState(defaultSkinTone);
  const skinTone = skinToneProp ?? internalTone;

  const registerList = React.useCallback((el: HTMLDivElement | null) => {
    listRef.current = el;
  }, []);

  const focusItem = React.useCallback((index: number) => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.focus();
  }, []);

  const setSkinTone = React.useCallback(
    (next: EmojiSkinTone) => {
      if (skinToneProp === undefined) setInternalTone(next);
      onSkinToneChange?.(next);
    },
    [skinToneProp, onSkinToneChange],
  );

  const setQuery = React.useCallback((next: string) => {
    setQueryState(next);
    setActiveIndex(0);
  }, []);

  const setCategory = React.useCallback((next: EmojiPickerCategoryId) => {
    setCategoryState(next);
    setQueryState('');
    setActiveIndex(0);
  }, []);

  const byEmoji = React.useMemo(() => {
    const map = new Map<string, EmojiItem>();
    for (const item of emojis) map.set(item.emoji, item);
    return map;
  }, [emojis]);

  const recent = React.useMemo(
    () => recentCodes.map((code) => byEmoji.get(code)).filter((item): item is EmojiItem => Boolean(item)),
    [recentCodes, byEmoji],
  );

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      return emojis.filter((item) => item.name.includes(q) || item.keywords.includes(q) || item.emoji === q);
    }
    if (category === 'recent') return recent;
    return emojis.filter((item) => item.category === category);
  }, [emojis, query, category, recent]);

  const display = React.useCallback((item: EmojiItem) => applySkinTone(item, skinTone), [skinTone]);

  const select = React.useCallback(
    (item: EmojiItem) => {
      onEmojiSelect?.(applySkinTone(item, skinTone), item);
      if (!recentKey) return;
      setRecentCodes((prev) => {
        const next = [item.emoji, ...prev.filter((c) => c !== item.emoji)].slice(0, maxRecent);
        writeRecent(recentKey, next);
        return next;
      });
    },
    [onEmojiSelect, skinTone, recentKey, maxRecent],
  );

  const ctx = React.useMemo<EmojiPickerContextValue>(
    () => ({
      id,
      emojis,
      query,
      setQuery,
      category,
      setCategory,
      visible,
      recent,
      hasRecent: Boolean(recentKey),
      skinTone,
      setSkinTone,
      setHovered,
      setActiveIndex,
      columns,
      select,
      display,
      registerList,
      focusItem,
    }),
    [
      id,
      emojis,
      query,
      setQuery,
      category,
      setCategory,
      visible,
      recent,
      recentKey,
      skinTone,
      setSkinTone,
      columns,
      select,
      display,
      registerList,
      focusItem,
    ],
  );

  return (
    <EmojiPickerContext.Provider value={ctx}>
      <EmojiPickerHoverContext.Provider value={hovered}>
        <EmojiPickerActiveIndexContext.Provider value={activeIndex}>
          <div
            data-slot="emoji-picker"
            className={cn(
              'flex w-80 max-w-full flex-col gap-2 rounded-md border border-border bg-popover p-2 text-popover-foreground',
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </EmojiPickerActiveIndexContext.Provider>
      </EmojiPickerHoverContext.Provider>
    </EmojiPickerContext.Provider>
  );
};

type EmojiPickerSearchProps = Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'type'>;

const EmojiPickerSearch = ({
  placeholder = 'Search emoji',
  className,
  onKeyDown,
  ...props
}: EmojiPickerSearchProps) => {
  const ctx = useEmojiPicker();
  const activeIndex = React.useContext(EmojiPickerActiveIndexContext);
  return (
    <div data-slot="emoji-picker-search" className="relative">
      <Search
        aria-hidden
        className="pointer-events-none absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={ctx.query}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-controls={`${ctx.id}-grid`}
        autoComplete="off"
        data-slot="emoji-picker-search-input"
        className={cn('h-8 ps-8 text-sm', className)}
        onChange={(e) => ctx.setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            ctx.focusItem(activeIndex);
          } else if (e.key === 'Enter' && ctx.visible[0]) {
            e.preventDefault();
            ctx.select(ctx.visible[0]);
          }
          onKeyDown?.(e);
        }}
        {...props}
      />
    </div>
  );
};

interface EmojiPickerCategoriesProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  labels?: Partial<Record<EmojiPickerCategoryId, string>>;
}

const EmojiPickerCategories = ({ labels, className, ...props }: EmojiPickerCategoriesProps) => {
  const ctx = useEmojiPicker();
  const tabs: { id: EmojiPickerCategoryId; label: string; icon: LucideIcon }[] = [
    ...(ctx.hasRecent ? [{ id: 'recent' as const, label: 'Recent', icon: Clock }] : []),
    ...EMOJI_CATEGORIES,
  ];
  const searching = ctx.query.trim().length > 0;

  return (
    <div
      role="group"
      aria-label="Emoji categories"
      data-slot="emoji-picker-categories"
      className={cn('flex items-center gap-0.5', className)}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
        const forward = (e.key === 'ArrowRight') !== rtl;
        const idx = tabs.findIndex((t) => t.id === ctx.category);
        const next = (idx + (forward ? 1 : -1) + tabs.length) % tabs.length;
        ctx.setCategory(tabs[next].id);
        e.currentTarget.querySelector<HTMLElement>(`[data-category="${tabs[next].id}"]`)?.focus();
        e.preventDefault();
      }}
      {...props}
    >
      {tabs.map((tab) => {
        const active = !searching && ctx.category === tab.id;
        const Icon = tab.icon;
        const label = labels?.[tab.id] ?? tab.label;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            tabIndex={active ? 0 : -1}
            data-slot="emoji-picker-category"
            data-category={tab.id}
            data-active={active || undefined}
            onClick={() => ctx.setCategory(tab.id)}
            className={cn(
              'inline-flex size-7 flex-1 items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none',
              'hover:bg-accent hover:text-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring',
              active && 'bg-accent text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
};

interface EmojiPickerListProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  children?: React.ReactNode;
}

const EmojiPickerList = ({ className, children, ref, ...props }: EmojiPickerListProps) => {
  const ctx = useEmojiPicker();
  const { visible, columns, registerList } = ctx;
  const activeIndex = React.useContext(EmojiPickerActiveIndexContext);

  const focusIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(visible.length - 1, index));
    ctx.setActiveIndex(clamped);
    ctx.focusItem(clamped);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (visible.length === 0) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    switch (e.key) {
      case 'ArrowRight':
        focusIndex(activeIndex + (rtl ? -1 : 1));
        break;
      case 'ArrowLeft':
        focusIndex(activeIndex + (rtl ? 1 : -1));
        break;
      case 'ArrowDown':
        focusIndex(activeIndex + columns);
        break;
      case 'ArrowUp':
        focusIndex(activeIndex - columns);
        break;
      case 'Home':
        focusIndex(0);
        break;
      case 'End':
        focusIndex(visible.length - 1);
        break;
      case 'PageDown':
        focusIndex(activeIndex + columns * 4);
        break;
      case 'PageUp':
        focusIndex(activeIndex - columns * 4);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  const listRef = React.useMemo(() => composeRefs(registerList, ref), [registerList, ref]);

  return (
    <div
      ref={listRef}
      id={`${ctx.id}-grid`}
      role="group"
      aria-label="Emoji"
      data-slot="emoji-picker-list"
      onKeyDown={handleKeyDown}
      onMouseLeave={() => ctx.setHovered(null)}
      className={cn('h-56 overflow-y-auto overscroll-contain', className)}
      {...props}
    >
      {children ?? (
        <>
          <div
            className="grid gap-0.5"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {visible.map((item, index) => (
              <EmojiPickerItem key={item.emoji} item={item} index={index} active={index === activeIndex} />
            ))}
          </div>
          <EmojiPickerEmpty />
        </>
      )}
    </div>
  );
};

interface EmojiPickerItemProps extends Omit<React.ComponentProps<'button'>, 'children' | 'type'> {
  item: EmojiItem;
  index: number;
  /** Roving-tabindex target. `EmojiPickerList` passes it; custom lists should too. */
  active?: boolean;
}

const EmojiPickerItem = React.memo(function EmojiPickerItem({
  item,
  index,
  active = false,
  className,
  onClick,
  onFocus,
  onMouseEnter,
  ...props
}: EmojiPickerItemProps) {
  const ctx = useEmojiPicker();
  return (
    <button
      type="button"
      aria-label={item.name}
      title={item.name}
      tabIndex={active ? 0 : -1}
      data-slot="emoji-picker-item"
      data-index={index}
      data-active={active || undefined}
      onClick={(e) => {
        ctx.select(item);
        onClick?.(e);
      }}
      onFocus={(e) => {
        ctx.setActiveIndex(index);
        ctx.setHovered(item);
        onFocus?.(e);
      }}
      onMouseEnter={(e) => {
        ctx.setHovered(item);
        onMouseEnter?.(e);
      }}
      className={cn(
        'flex aspect-square items-center justify-center rounded-sm text-xl leading-none transition-transform outline-none',
        'hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
        'active:scale-90 motion-reduce:transition-none motion-reduce:active:scale-100',
        className,
      )}
      {...props}
    >
      {ctx.display(item)}
    </button>
  );
});

type EmojiPickerEmptyProps = React.ComponentProps<'p'>;

const EmojiPickerEmpty = ({ className, children = 'No emoji found.', ...props }: EmojiPickerEmptyProps) => {
  const ctx = useEmojiPicker();
  if (ctx.visible.length > 0) return null;
  return (
    <p
      data-slot="emoji-picker-empty"
      className={cn(
        'flex h-full items-center justify-center px-4 text-center text-xs text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};

interface EmojiPickerFooterProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  placeholder?: string;
  children?: React.ReactNode;
}

const EmojiPickerFooter = ({
  placeholder = 'Pick an emoji',
  className,
  children,
  ...props
}: EmojiPickerFooterProps) => {
  const ctx = useEmojiPicker();
  const item = React.useContext(EmojiPickerHoverContext);
  return (
    <div
      data-slot="emoji-picker-footer"
      className={cn('flex h-9 items-center gap-2 border-t border-border pt-2 text-xs', className)}
      {...props}
    >
      <span aria-hidden className="flex size-7 shrink-0 items-center justify-center text-xl leading-none">
        {item ? ctx.display(item) : null}
      </span>
      <span
        aria-live="polite"
        className={cn('min-w-0 flex-1 truncate', item ? 'text-foreground capitalize' : 'text-muted-foreground')}
      >
        {item ? item.name : placeholder}
      </span>
      {children}
    </div>
  );
};

const SKIN_TONES: { tone: EmojiSkinTone; label: string }[] = [
  { tone: 0, label: 'Default' },
  { tone: 1, label: 'Light' },
  { tone: 2, label: 'Medium-light' },
  { tone: 3, label: 'Medium' },
  { tone: 4, label: 'Medium-dark' },
  { tone: 5, label: 'Dark' },
];

interface EmojiPickerSkinToneProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  labels?: Partial<Record<EmojiSkinTone, string>>;
}

const EmojiPickerSkinTone = ({ labels, className, ...props }: EmojiPickerSkinToneProps) => {
  const ctx = useEmojiPicker();
  const sample: EmojiItem = {
    emoji: '\u{1F44B}',
    name: 'waving hand',
    keywords: '',
    category: 'people',
    skin: true,
  };
  return (
    <div
      role="radiogroup"
      aria-label="Skin tone"
      data-slot="emoji-picker-skin-tone"
      className={cn('flex items-center gap-0.5', className)}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
        const forward = (e.key === 'ArrowRight') !== rtl;
        const next = ((ctx.skinTone + (forward ? 1 : 5)) % 6) as EmojiSkinTone;
        ctx.setSkinTone(next);
        e.currentTarget.querySelector<HTMLElement>(`[data-tone="${next}"]`)?.focus();
        e.preventDefault();
      }}
      {...props}
    >
      {SKIN_TONES.map(({ tone, label }) => {
        const active = ctx.skinTone === tone;
        const text = labels?.[tone] ?? label;
        return (
          <button
            key={tone}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={text}
            title={text}
            tabIndex={active ? 0 : -1}
            data-slot="emoji-picker-skin-tone-option"
            data-tone={tone}
            data-active={active || undefined}
            onClick={() => ctx.setSkinTone(tone)}
            className={cn(
              'flex size-7 items-center justify-center rounded-sm text-base leading-none transition-colors outline-none',
              'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
              active && 'bg-accent ring-1 ring-border',
            )}
          >
            {applySkinTone(sample, tone)}
          </button>
        );
      })}
    </div>
  );
};

export {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerCategories,
  EmojiPickerList,
  EmojiPickerItem,
  EmojiPickerEmpty,
  EmojiPickerFooter,
  EmojiPickerSkinTone,
};
