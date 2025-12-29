import { FilterCategory, FilterOption } from "./types";

// City Vision Filters - Urban renewal and civic improvements
export const CITY_FILTERS: FilterOption[] = [
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

// Home Vision Filters - Interior design and room decor transformations
export const HOME_FILTERS: FilterOption[] = [
  // Style Presets
  {
    id: 'scandinavian',
    label: 'Scandinavian',
    description: 'Clean lines, natural materials, and cozy minimalism.',
    promptFragment: 'Transform this room into a Scandinavian-style interior with clean lines, light wood tones, white/light gray walls, simple functional furniture, cozy textiles like wool throws, and natural materials. Add hygge elements for warmth.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'minimalist',
    label: 'Minimalist',
    description: 'Sleek, clutter-free spaces with essential pieces only.',
    promptFragment: 'Transform this into a minimalist interior with a "less is more" approach. Remove visual clutter, use a monochromatic or very limited color palette, sleek furniture with clean geometry, and open empty spaces that feel calm and serene.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'bohemian',
    label: 'Bohemian',
    description: 'Eclectic, colorful, and globally-inspired decor.',
    promptFragment: 'Transform this room into a bohemian-style space with layered textiles, rich colors and patterns, macramé, plants, vintage and globally-sourced decor, floor cushions, and an eclectic mix of furniture that feels collected and personal.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'industrial',
    label: 'Industrial',
    description: 'Exposed brick, metal accents, and urban loft vibes.',
    promptFragment: 'Transform this into an industrial-style interior with exposed brick walls, metal light fixtures and furniture accents, concrete or distressed wood floors, Edison bulbs, leather furniture, and a neutral palette with black metal frames.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'midcentury',
    label: 'Mid-Century Modern',
    description: 'Retro 1950s-60s design with organic curves.',
    promptFragment: 'Transform this room into a mid-century modern interior with iconic furniture pieces featuring organic curves, tapered legs, warm wood tones (walnut, teak), bold accent colors, statement lighting, and a clean yet warm aesthetic.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'japanese',
    label: 'Japanese Zen',
    description: 'Serene, natural, and balanced design.',
    promptFragment: 'Transform this into a Japanese-inspired Zen interior with natural materials, a muted earth-tone palette, low furniture, shoji screens or paper elements, indoor plants, clean lines, and an emphasis on tranquility and balance.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'coastal',
    label: 'Coastal',
    description: 'Beach-inspired with whites, blues, and natural textures.',
    promptFragment: 'Transform this into a coastal-style interior with a white and blue color palette, natural textures like rattan and jute, light-washed wood, nautical accents, airy fabrics, and a relaxed beach house atmosphere.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'farmhouse',
    label: 'Modern Farmhouse',
    description: 'Rustic charm meets contemporary comfort.',
    promptFragment: 'Transform this into a modern farmhouse interior with shiplap accent walls, rustic wood elements, white and neutral palette, comfortable upholstered furniture, vintage-inspired light fixtures, and cozy textiles.',
    isDefault: false,
    category: 'style'
  },

  // Colors & Paint
  {
    id: 'warm_neutrals',
    label: 'Warm Neutrals',
    description: 'Beige, cream, taupe, and warm gray tones.',
    promptFragment: 'Repaint the walls and update the color scheme to warm neutrals - think creamy whites, soft beiges, warm taupes, and gentle warm grays. Ensure furniture and decor complement this cozy, inviting palette.',
    isDefault: true,
    category: 'colors'
  },
  {
    id: 'cool_tones',
    label: 'Cool Tones',
    description: 'Soft blues, grays, and sage greens.',
    promptFragment: 'Update the color palette to cool, calming tones - soft blues, cool grays, sage greens, and crisp whites. Create a serene, refreshing atmosphere throughout the space.',
    isDefault: false,
    category: 'colors'
  },
  {
    id: 'bold_accent',
    label: 'Bold Accent Wall',
    description: 'Add a dramatic statement wall.',
    promptFragment: 'Add a bold, dramatic accent wall in a deep color like navy blue, forest green, terracotta, or charcoal. Keep other walls neutral to let the accent wall be the focal point.',
    isDefault: false,
    category: 'colors'
  },
  {
    id: 'earthy_palette',
    label: 'Earthy Palette',
    description: 'Terracotta, olive, rust, and natural browns.',
    promptFragment: 'Transform the color scheme to an earthy, natural palette featuring terracotta, olive green, rust orange, ochre, and warm browns. Create a grounded, organic feel.',
    isDefault: false,
    category: 'colors'
  },
  {
    id: 'monochromatic',
    label: 'Monochromatic',
    description: 'Sophisticated single-color scheme with varying shades.',
    promptFragment: 'Create a sophisticated monochromatic color scheme using varying shades and tones of a single color family. Layer textures to add visual interest within the single color palette.',
    isDefault: false,
    category: 'colors'
  },

  // Furniture & Decor
  {
    id: 'modern_furniture',
    label: 'Modern Furniture',
    description: 'Update to contemporary, stylish pieces.',
    promptFragment: 'Replace existing furniture with modern, contemporary pieces featuring clean lines, quality materials, and stylish design. Update sofas, chairs, tables, and storage to current trends while maintaining functionality.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'cozy_textiles',
    label: 'Cozy Textiles',
    description: 'Add throw pillows, blankets, and rugs.',
    promptFragment: 'Layer in cozy textiles throughout the room - add plush throw pillows, soft blankets, area rugs, and curtains. Create warmth and comfort through fabric textures and patterns.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'declutter',
    label: 'Declutter',
    description: 'Remove excess items for a clean look.',
    promptFragment: 'Remove visual clutter, excess furniture, and unnecessary items. Organize what remains neatly, clear surfaces, and create a clean, spacious feel. Keep only essential and decorative pieces.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'indoor_plants',
    label: 'Add Indoor Plants',
    description: 'Bring life with greenery and botanicals.',
    promptFragment: 'Add an appropriate variety of indoor plants - large floor plants, hanging plants, shelf plants, and small potted plants. Include options like fiddle leaf fig, monstera, pothos, snake plant, and fresh flowers to bring life and color.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'upgrade_lighting',
    label: 'Upgrade Lighting',
    description: 'Add ambient, task, and accent lighting.',
    promptFragment: 'Upgrade the lighting with a layered approach - add statement pendant lights or chandeliers, stylish table and floor lamps for ambient lighting, and accent lights. Create warm, inviting illumination.',
    isDefault: false,
    category: 'furniture'
  },
  {
    id: 'rearrange_furniture',
    label: 'Rearrange Furniture',
    description: 'Optimize layout for better flow and function.',
    promptFragment: 'Rearrange the existing furniture to create a more optimal layout. Improve traffic flow, create better conversation areas, ensure proper spacing between pieces, and maximize the functionality of the space. Keep the same furniture but position it for better aesthetics and usability.',
    isDefault: false,
    category: 'furniture'
  },

  // Architectural Changes
  {
    id: 'open_concept',
    label: 'Open Floor Concept',
    description: 'Remove visual barriers between spaces.',
    promptFragment: 'Transform the space into a more open concept layout by visually removing or minimizing walls between living areas. Create a flowing, connected space while maintaining defined zones for different activities.',
    isDefault: false,
    category: 'architectural'
  },
  {
    id: 'add_windows',
    label: 'Add Natural Light',
    description: 'More windows and brighter atmosphere.',
    promptFragment: 'Add larger windows or additional windows to flood the space with natural light. Include sheer curtains and ensure the room feels bright, airy, and connected to the outdoors.',
    isDefault: false,
    category: 'architectural'
  },
  {
    id: 'change_flooring',
    label: 'Upgrade Flooring',
    description: 'New hardwood, tile, or modern flooring.',
    promptFragment: 'Replace the flooring with premium materials - warm hardwood, elegant tile, or modern luxury vinyl. Choose a finish that complements the overall design style and adds value to the space.',
    isDefault: false,
    category: 'architectural'
  },
  {
    id: 'upgrade_kitchen',
    label: 'Kitchen Upgrade',
    description: 'Modern cabinets, countertops, and appliances.',
    promptFragment: 'If this is a kitchen or shows a kitchen area, upgrade with modern cabinetry, quartz or marble countertops, a stylish backsplash, updated stainless steel appliances, and contemporary fixtures.',
    isDefault: false,
    category: 'architectural'
  },
  {
    id: 'upgrade_bathroom',
    label: 'Bathroom Upgrade',
    description: 'Spa-like with modern fixtures.',
    promptFragment: 'If this is a bathroom, transform it into a spa-like retreat with updated vanity, modern fixtures, elegant tile work, good lighting, and luxurious touches like rainfall showerhead or freestanding tub.',
    isDefault: false,
    category: 'architectural'
  }
];

// Helper to get filter category labels
export const FILTER_CATEGORY_LABELS: Record<FilterCategory, string> = {
  style: '✨ Style Presets',
  colors: '🎨 Colors & Paint',
  furniture: '🛋️ Furniture & Decor',
  architectural: '🏗️ Architectural'
};

// Legacy export for backward compatibility
export const FILTERS = CITY_FILTERS;