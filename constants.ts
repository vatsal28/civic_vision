import { FilterCategory, FilterOption } from "./types";

// City Vision Filters - Urban renewal and civic improvements
export const CITY_FILTERS: FilterOption[] = [
  {
    id: 'trash',
    icon: '🗑️',
    label: 'Remove Trash',
    description: 'Clean up litter and garbage',
    promptFragment: 'Completely remove all litter, plastic wrappers, paper, waste, and scattered debris from the ground, leaving a spotless surface.',
    isDefault: true
  },
  {
    id: 'paint',
    icon: '🎨',
    label: 'Fresh Paint',
    description: 'Revitalize building facades',
    promptFragment: 'For all buildings and walls, especially those with peeling paint, discoloration, exposed plaster, or water damage, apply a smooth, fresh coat of paint in the original color. Repair any cracks or surface damage to make them look newly renovated and pristine.',
    isDefault: false
  },
  {
    id: 'debris',
    icon: '🏗️',
    label: 'Remove Debris',
    description: 'Clear rubble and ruins',
    promptFragment: 'Remove any stray debris, loose stones, rubble, and broken materials from the ground.',
    isDefault: false
  },
  {
    id: 'greenery',
    icon: '🌿',
    label: 'Manicured Greenery',
    description: 'Perfect lawns and trees',
    promptFragment: 'Transform patchy dirt, barren soil, or messy vegetation into a clean, manicured green lawn. The grass should be uniform, vibrant green, and well-kept, similar to a high-quality park or golf course.',
    isDefault: true
  },
  {
    id: 'euro_infrastructure',
    icon: '🚴',
    label: 'European Infrastructure',
    description: 'Bike lanes and walkability',
    promptFragment: 'Redesign the street infrastructure to resemble a modern European city: include dedicated/protected bike lanes, clear road markings, and organized traffic layouts.',
    isDefault: false
  },
  {
    id: 'euro_aesthetics',
    icon: '🏛️',
    label: 'European Aesthetics',
    description: 'Classic architecture style',
    promptFragment: 'Infuse European urban aesthetics: use cobblestone or pavers for pedestrian areas, widen sidewalks, and install European-style street furniture (lamps, bollards, benches).',
    isDefault: false
  },
  {
    id: 'people',
    icon: '👥',
    label: 'Remove People',
    description: 'Clear pedestrians from view',
    promptFragment: 'Remove all people and human figures from the image to show an unobstructed view of the place.',
    isDefault: false
  },
  {
    id: 'clean',
    icon: '✨',
    label: 'Deep Clean',
    description: 'Remove stains and pollution',
    promptFragment: 'Deep clean all surfaces. Aggressively remove weather stains, black mold, water marks, grime, and pollution residue from walls, roads, and corners. The surfaces should look professionally washed and spotless.',
    isDefault: false
  },
  {
    id: 'metal',
    icon: '🔩',
    label: 'Restore Metalwork',
    description: 'Polish railings and poles',
    promptFragment: 'If there are metal structures like railings, poles, or gates, remove any rust, bird droppings, and dirt, making them look polished and new.',
    isDefault: false
  },
  {
    id: 'wires',
    icon: '🔌',
    label: 'Remove Wires',
    description: 'Clear stray cables and wires',
    promptFragment: 'Remove all visible stray wires, hanging cables, tangled power lines, and loose electrical cords from the scene. This includes wires strung between buildings, dangling from poles, and lying on the ground. Leave a clean, uncluttered sky and facade.',
    isDefault: false
  },
  {
    id: 'flowers',
    icon: '🌸',
    label: 'Add Flowers & Plants',
    description: 'Beautify with colorful vegetation',
    promptFragment: 'Add colorful flowers, flowering plants, and decorative vegetation to viable areas such as window boxes, planters, garden beds, sidewalk edges, and building entrances. Include a mix of blooming flowers in vibrant colors to create a charming, welcoming atmosphere.',
    isDefault: false
  }
];

// Home Vision Filters - Interior design and room decor transformations
export const HOME_FILTERS: FilterOption[] = [
  // Style Presets
  {
    id: 'modern',
    icon: '✨',
    label: 'Modern',
    description: 'Clean contemporary design',
    promptFragment: 'Transform this room into a modern contemporary interior with clean lines, neutral colors with bold accents, sleek furniture, and minimalist decor that feels current and sophisticated.',
    isDefault: true,
    category: 'style'
  },
  {
    id: 'scandinavian',
    icon: '🌲',
    label: 'Scandinavian',
    description: 'Cozy minimalism with natural materials',
    promptFragment: 'Transform this room into a Scandinavian-style interior with clean lines, light wood tones, white/light gray walls, simple functional furniture, cozy textiles like wool throws, and natural materials. Add hygge elements for warmth.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'minimalist',
    icon: '◻️',
    label: 'Minimalist',
    description: 'Sleek and clutter-free',
    promptFragment: 'Transform this into a minimalist interior with a "less is more" approach. Remove visual clutter, use a monochromatic or very limited color palette, sleek furniture with clean geometry, and open empty spaces that feel calm and serene.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'bohemian',
    icon: '🎨',
    label: 'Bohemian',
    description: 'Eclectic and colorful',
    promptFragment: 'Transform this room into a bohemian-style space with layered textiles, rich colors and patterns, macramé, plants, vintage and globally-sourced decor, floor cushions, and an eclectic mix of furniture that feels collected and personal.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'industrial',
    icon: '🏭',
    label: 'Industrial',
    description: 'Urban loft vibes',
    promptFragment: 'Transform this into an industrial-style interior with exposed brick walls, metal light fixtures and furniture accents, concrete or distressed wood floors, Edison bulbs, leather furniture, and a neutral palette with black metal frames.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'midcentury',
    icon: '🪑',
    label: 'Mid-Century Modern',
    description: 'Retro 1950s-60s design',
    promptFragment: 'Transform this room into a mid-century modern interior with iconic furniture pieces featuring organic curves, tapered legs, warm wood tones (walnut, teak), bold accent colors, statement lighting, and a clean yet warm aesthetic.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'japanese',
    icon: '🎋',
    label: 'Japanese Zen',
    description: 'Serene and balanced',
    promptFragment: 'Transform this into a Japanese-inspired Zen interior with natural materials, a muted earth-tone palette, low furniture, shoji screens or paper elements, indoor plants, clean lines, and an emphasis on tranquility and balance.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'coastal',
    icon: '🌊',
    label: 'Coastal',
    description: 'Beach-inspired design',
    promptFragment: 'Transform this into a coastal-style interior with a white and blue color palette, natural textures like rattan and jute, light-washed wood, nautical accents, airy fabrics, and a relaxed beach house atmosphere.',
    isDefault: false,
    category: 'style'
  },

  // Colors & Paint
  {
    id: 'warm_neutrals',
    icon: '🟤',
    label: 'Warm Neutrals',
    description: 'Beige, cream, and taupe tones',
    promptFragment: 'Repaint the walls and update the color scheme to warm neutrals - think creamy whites, soft beiges, warm taupes, and gentle warm grays. Ensure furniture and decor complement this cozy, inviting palette.',
    isDefault: false,
    category: 'colors'
  },
  {
    id: 'cool_tones',
    icon: '🔵',
    label: 'Cool Tones',
    description: 'Soft blues and sage greens',
    promptFragment: 'Update the color palette to cool, calming tones - soft blues, cool grays, sage greens, and crisp whites. Create a serene, refreshing atmosphere throughout the space.',
    isDefault: false,
    category: 'colors'
  },
  {
    id: 'bold_accent',
    icon: '🎯',
    label: 'Bold Accent Wall',
    description: 'Dramatic statement wall',
    promptFragment: 'Add a bold, dramatic accent wall in a deep color like navy blue, forest green, terracotta, or charcoal. Keep other walls neutral to let the accent wall be the focal point.',
    isDefault: false,
    category: 'colors'
  },
  {
    id: 'earthy_palette',
    icon: '🍂',
    label: 'Earthy Palette',
    description: 'Terracotta and natural browns',
    promptFragment: 'Transform the color scheme to an earthy, natural palette featuring terracotta, olive green, rust orange, ochre, and warm browns. Create a grounded, organic feel.',
    isDefault: false,
    category: 'colors'
  },

  // Furniture & Decor
  {
    id: 'modern_furniture',
    icon: '🛋️',
    label: 'Modern Furniture',
    description: 'Contemporary stylish pieces',
    promptFragment: 'Replace existing furniture with modern, contemporary pieces featuring clean lines, quality materials, and stylish design. Update sofas, chairs, tables, and storage to current trends while maintaining functionality.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'indoor_plants',
    icon: '🌿',
    label: 'Add Indoor Plants',
    description: 'Bring life with greenery',
    promptFragment: 'Add an appropriate variety of indoor plants - large floor plants, hanging plants, shelf plants, and small potted plants. Include options like fiddle leaf fig, monstera, pothos, snake plant, and fresh flowers to bring life and color.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'warm_lighting',
    icon: '💡',
    label: 'Warm Lighting',
    description: 'Cozy ambient illumination',
    promptFragment: 'Upgrade the lighting with warm, ambient illumination. Add stylish pendant lights, table lamps, floor lamps, and accent lighting to create a cozy, inviting atmosphere with warm color temperature.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'cozy_textiles',
    icon: '🧶',
    label: 'Cozy Textiles',
    description: 'Pillows, blankets, and rugs',
    promptFragment: 'Layer in cozy textiles throughout the room - add plush throw pillows, soft blankets, area rugs, and curtains. Create warmth and comfort through fabric textures and patterns.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'declutter',
    icon: '📦',
    label: 'Declutter',
    description: 'Remove excess items',
    promptFragment: 'Remove visual clutter, excess furniture, and unnecessary items. Organize what remains neatly, clear surfaces, and create a clean, spacious feel. Keep only essential and decorative pieces.',
    isDefault: false,
    category: 'furniture'
  },
  {
    id: 'wall_art',
    icon: '🖼️',
    label: 'Wall Art & Decor',
    description: 'Add artwork and mirrors',
    promptFragment: 'Add tasteful wall art, framed prints, mirrors, and decorative wall elements. Create a gallery wall or statement pieces that complement the room style and add personality.',
    isDefault: false,
    category: 'furniture'
  },

  // Architectural Changes
  {
    id: 'natural_light',
    icon: '☀️',
    label: 'Natural Light',
    description: 'Brighter, airy atmosphere',
    promptFragment: 'Enhance natural light in the space - add larger windows, skylights, or glass doors. Use sheer curtains and remove heavy drapes to let light flood in. Create a bright, airy atmosphere.',
    isDefault: false,
    category: 'architectural'
  },
  {
    id: 'upgrade_flooring',
    icon: '🪵',
    label: 'Upgrade Flooring',
    description: 'Hardwood or modern tiles',
    promptFragment: 'Replace the flooring with premium materials - warm hardwood, elegant tile, or modern luxury vinyl. Choose a finish that complements the overall design style and adds value to the space.',
    isDefault: false,
    category: 'architectural'
  },
  {
    id: 'open_concept',
    icon: '🚪',
    label: 'Open Floor Concept',
    description: 'Remove visual barriers',
    promptFragment: 'Transform the space into a more open concept layout by visually removing or minimizing walls between living areas. Create a flowing, connected space while maintaining defined zones for different activities.',
    isDefault: false,
    category: 'architectural'
  }
];

// Helper to get filter category labels
export const FILTER_CATEGORY_LABELS: Record<FilterCategory, string> = {
  style: 'Style Presets',
  colors: 'Colors & Paint',
  furniture: 'Furniture & Decor',
  architectural: 'Architectural'
};

// Category icons
export const FILTER_CATEGORY_ICONS: Record<FilterCategory, string> = {
  style: '✨',
  colors: '🎨',
  furniture: '🛋️',
  architectural: '🏗️'
};

// Legacy export for backward compatibility
export const FILTERS = CITY_FILTERS;
