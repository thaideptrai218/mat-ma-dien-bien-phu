import {map} from './bao/content/world-data.js';

// Both the original artwork and the canonical scene consume the same geometry.
export const WORLD = {...map, objects: [...map.interactables, ...map.exits]};
export const OBJECTS = WORLD.objects;
export const EXIT = WORLD.exits[0];
