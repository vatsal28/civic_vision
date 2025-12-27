import { FilterOption } from "./types";

export const FILTERS: FilterOption[] = [
  {
    id: 'trash',
    label: 'Remove Trash & Garbage',
    description: 'Remove litter, plastic bags, and overflowing bins.',
    promptFragment: 'Completely remove all litter, plastic wrappers, paper, waste, and scattered debris from the ground, leaving a spotless surface.',
    isDefault: true
  },
  {
    id: 'paint',
    label: 'Fresh Paint & Repair',
    description: 'Repair peeling walls and apply fresh paint.',
    promptFragment: 'For all buildings and walls, especially those with peeling paint, discoloration, exposed plaster, or water damage, apply a smooth, fresh coat of paint in the original color. Repair any cracks or surface damage to make them look newly renovated and pristine.',
    isDefault: true
  },
  {
    id: 'people',
    label: 'Remove People',
    description: 'Remove all pedestrians and bystanders.',
    promptFragment: 'Remove all people and human figures from the image to show an unobstructed view of the place.',
    isDefault: true
  },
  {
    id: 'clean',
    label: 'Deep Clean',
    description: 'Remove deep stains, mold, and pollution.',
    promptFragment: 'Deep clean all surfaces. Aggressively remove weather stains, black mold, water marks, grime, and pollution residue from walls, roads, and corners. The surfaces should look professionally washed and spotless.',
    isDefault: true
  },
  {
    id: 'debris',
    label: 'Clear Debris',
    description: 'Remove stones, rubble, and loose construction material.',
    promptFragment: 'Remove any stray debris, loose stones, rubble, and broken materials from the ground.',
    isDefault: true
  },
  {
    id: 'greenery',
    label: 'Manicured Greenery',
    description: 'Add clean, plain grass to barren areas.',
    promptFragment: 'Transform patchy dirt, barren soil, or messy vegetation into a clean, manicured green lawn. The grass should be uniform, vibrant green, and well-kept, similar to a high-quality park or golf course.',
    isDefault: true
  },
  {
    id: 'metal',
    label: 'Restore Metalwork',
    description: 'Clean rust and dirt from railings and poles.',
    promptFragment: 'If there are metal structures like railings, poles, or gates, remove any rust, bird droppings, and dirt, making them look polished and new.',
    isDefault: true
  },
  {
    id: 'euro_infrastructure',
    label: 'European Infrastructure',
    description: 'Add bike lanes, clear markings, and organized layouts.',
    promptFragment: 'Redesign the street infrastructure to resemble a modern European city: include dedicated/protected bike lanes, clear road markings, and organized traffic layouts.',
    isDefault: false
  },
  {
    id: 'euro_aesthetics',
    label: 'European Aesthetics',
    description: 'Add cobblestones, pavers, and pedestrian-friendly elements.',
    promptFragment: 'Infuse European urban aesthetics: use cobblestone or pavers for pedestrian areas, widen sidewalks, and install European-style street furniture (lamps, bollards, benches).',
    isDefault: false
  }
];