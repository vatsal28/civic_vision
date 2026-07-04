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
  // Room Types
  {
    id: 'bedroom',
    icon: '🛏️',
    label: 'Bedroom',
    description: 'Rest and relaxation space',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, and floor. DO NOT remove any existing furniture or elements. If the room is empty, add bedroom furniture (bed, nightstands, lighting). If furniture already exists, enhance and style it as a bedroom with appropriate bedding, decor, and accessories that create a peaceful sanctuary.',
    isDefault: false,
    category: 'roomType'
  },
  {
    id: 'living_room',
    icon: '🛋️',
    label: 'Living Room',
    description: 'Gathering and entertainment',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, and floor. DO NOT remove any existing furniture or elements. If the room is empty, add living room furniture (sofa, coffee table, entertainment center). If furniture already exists, enhance and style it as a living room with appropriate decor and accessories.',
    isDefault: false,
    category: 'roomType'
  },
  {
    id: 'kitchen',
    icon: '🍳',
    label: 'Kitchen',
    description: 'Cooking and meal prep',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, and floor. DO NOT remove any existing elements, cabinets, or appliances. If the room is empty, add kitchen elements (appliances, counters, cabinets). If elements already exist, enhance and style them with modern finishes, decor, and accessories.',
    isDefault: false,
    category: 'roomType'
  },
  {
    id: 'dining_room',
    icon: '🍽️',
    label: 'Dining Room',
    description: 'Meals and hosting',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, and floor. DO NOT remove any existing furniture. If the room is empty, add dining furniture (table, chairs, buffet, lighting). If furniture already exists, enhance and style it as a dining room with appropriate table settings and decor.',
    isDefault: false,
    category: 'roomType'
  },
  {
    id: 'bathroom',
    icon: '🚿',
    label: 'Bathroom',
    description: 'Spa-like sanctuary',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and all existing fixtures. DO NOT remove any existing elements. If the room is empty, add bathroom elements (vanity, fixtures). If elements already exist, enhance them with spa-like decor, plants, towels, and accessories.',
    isDefault: false,
    category: 'roomType'
  },
  {
    id: 'home_office',
    icon: '💼',
    label: 'Home Office/Study',
    description: 'Productive workspace',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, and floor. DO NOT remove any existing furniture. If the room is empty, add office furniture (desk, chair, shelving). If furniture already exists, enhance and style it as a home office with appropriate organization and decor.',
    isDefault: false,
    category: 'roomType'
  },
  {
    id: 'media_room',
    icon: '📺',
    label: 'Media Room',
    description: 'Entertainment hub',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, and floor. DO NOT remove any existing furniture or elements. If the room is empty, add media room elements (TV, seating, sound system). If elements already exist, enhance and style them for entertainment purposes.',
    isDefault: false,
    category: 'roomType'
  },

  // Style Presets
  {
    id: 'modern',
    icon: '✨',
    label: 'Modern',
    description: 'Clean contemporary design',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture in their current positions. DO NOT remove anything. Style all existing elements in a modern contemporary aesthetic using clean lines, neutral colors with bold accents, sleek finishes, and minimalist decor. Add ONLY complementary accessories if space allows.',
    isDefault: true,
    category: 'style'
  },
  {
    id: 'scandinavian',
    icon: '🌲',
    label: 'Scandinavian',
    description: 'Cozy minimalism with natural materials',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture in their current positions. DO NOT remove anything. Style all existing elements in Scandinavian aesthetic with light wood tones, white/light gray finishes, cozy textiles, and hygge elements. Add ONLY complementary accessories if space allows.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'minimalist',
    icon: '◻️',
    label: 'Minimalist',
    description: 'Sleek and clutter-free',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture in their current positions. DO NOT remove anything. Style all existing elements in a minimalist aesthetic using a monochromatic palette, clean geometry, simple finishes, and streamlined decor that feels calm and serene.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'bohemian',
    icon: '🎨',
    label: 'Bohemian',
    description: 'Eclectic and colorful',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture in their current positions. DO NOT remove anything. Style all existing elements in bohemian aesthetic with layered textiles, rich colors and patterns, macramé, plants, and vintage-inspired decor. Add ONLY complementary accessories.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'industrial',
    icon: '🏭',
    label: 'Industrial',
    description: 'Urban loft vibes',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture in their current positions. DO NOT remove anything. Style all existing elements in industrial aesthetic with exposed brick wall treatments, metal accents, concrete or distressed wood finishes, Edison bulbs, leather upholstery, and neutral palette with black frames.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'midcentury',
    icon: '🪑',
    label: 'Mid-Century Modern',
    description: 'Retro 1950s-60s design',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture in their current positions. DO NOT remove anything. Style all existing elements in mid-century modern aesthetic with organic curves, tapered legs, warm wood tones (walnut, teak), bold accent colors, and retro statement lighting.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'japanese',
    icon: '🎋',
    label: 'Japanese Zen',
    description: 'Serene and balanced',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture in their current positions. DO NOT remove anything. Style all existing elements in Japanese Zen aesthetic with natural materials, muted earth tones, shoji-inspired elements, indoor plants, clean lines, and emphasis on tranquility.',
    isDefault: false,
    category: 'style'
  },
  {
    id: 'coastal',
    icon: '🌊',
    label: 'Coastal',
    description: 'Beach-inspired design',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture in their current positions. DO NOT remove anything. Style all existing elements in coastal aesthetic with white and blue palette, natural textures like rattan and jute, light-washed wood, nautical accents, and airy fabrics.',
    isDefault: false,
    category: 'style'
  },

  // Colors & Paint
  {
    id: 'warm_neutrals',
    icon: '🟤',
    label: 'Warm Neutrals',
    description: 'Beige, cream, and taupe tones',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture and elements. DO NOT remove anything. Repaint ONLY the walls to warm neutrals - creamy whites, soft beiges, warm taupes, and gentle warm grays. Style existing furniture and decor to complement this cozy palette.',
    isDefault: false,
    category: 'colors'
  },
  {
    id: 'cool_tones',
    icon: '🔵',
    label: 'Cool Tones',
    description: 'Soft blues and sage greens',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture and elements. DO NOT remove anything. Repaint ONLY the walls to cool, calming tones - soft blues, cool grays, sage greens, and crisp whites. Style existing furniture to complement this serene palette.',
    isDefault: false,
    category: 'colors'
  },
  {
    id: 'bold_accent',
    icon: '🎯',
    label: 'Bold Accent Wall',
    description: 'Dramatic statement wall',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture and elements. DO NOT remove anything. Paint ONE wall as a bold accent in a deep color like navy blue, forest green, terracotta, or charcoal. Keep other walls neutral.',
    isDefault: false,
    category: 'colors'
  },
  {
    id: 'earthy_palette',
    icon: '🍂',
    label: 'Earthy Palette',
    description: 'Terracotta and natural browns',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, floor, and ALL existing furniture and elements. DO NOT remove anything. Repaint ONLY the walls to an earthy palette featuring terracotta, olive green, rust orange, ochre, and warm browns. Style existing furniture to complement this organic feel.',
    isDefault: false,
    category: 'colors'
  },

  // Furniture & Decor
  {
    id: 'modern_furniture',
    icon: '🛋️',
    label: 'Modern Furniture',
    description: 'Contemporary stylish pieces',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, and ALL existing furniture in their current positions. DO NOT remove any furniture. Style all existing furniture pieces (sofas, chairs, tables, storage) with modern contemporary finishes, upholstery, and clean-lined aesthetics. Add ONLY small complementary accessories if space allows.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'indoor_plants',
    icon: '🌿',
    label: 'Add Indoor Plants',
    description: 'Bring life with greenery',
    promptFragment: 'CRITICAL: Keep ALL existing furniture and elements exactly as they are. DO NOT remove anything. Add tasteful indoor plants in available spaces - floor plants, hanging plants, shelf plants, and small potted plants like fiddle leaf fig, monstera, pothos, snake plant, and fresh flowers to bring life and color.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'warm_lighting',
    icon: '💡',
    label: 'Warm Lighting',
    description: 'Cozy ambient illumination',
    promptFragment: 'CRITICAL: Keep ALL existing furniture and elements exactly as they are. DO NOT remove anything. Enhance the lighting by styling existing fixtures and adding complementary warm-toned lamps, pendant lights, or accent lighting to create a cozy, inviting atmosphere.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'cozy_textiles',
    icon: '🧶',
    label: 'Cozy Textiles',
    description: 'Pillows, blankets, and rugs',
    promptFragment: 'CRITICAL: Keep ALL existing furniture and elements exactly as they are. DO NOT remove anything. Layer in cozy textiles - add plush throw pillows, soft blankets, area rugs, and curtains to existing furniture and spaces. Create warmth through fabric textures and patterns.',
    isDefault: true,
    category: 'furniture'
  },
  {
    id: 'declutter',
    icon: '📦',
    label: 'Declutter',
    description: 'Organize and simplify',
    promptFragment: 'CRITICAL: Keep ALL existing major furniture pieces in their current positions. DO NOT remove structural furniture. Organize small items neatly, clear surface clutter, tidy accessories, and create a clean, organized feel while maintaining all major furniture elements.',
    isDefault: false,
    category: 'furniture'
  },
  {
    id: 'wall_art',
    icon: '🖼️',
    label: 'Wall Art & Decor',
    description: 'Add artwork and mirrors',
    promptFragment: 'CRITICAL: Keep ALL existing furniture and elements exactly as they are. DO NOT remove anything. Add tasteful wall art, framed prints, mirrors, and decorative wall elements on available wall space. Create gallery walls or statement pieces that complement the existing room.',
    isDefault: false,
    category: 'furniture'
  },

  // Architectural Changes
  {
    id: 'natural_light',
    icon: '☀️',
    label: 'Natural Light',
    description: 'Brighter, airy atmosphere',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows in their EXACT current positions, doors, ceiling, floor, and ALL existing furniture. DO NOT remove anything or change window locations. DO NOT add new windows. Enhance natural light ONLY by using sheer curtains, lighter wall colors, and reflective surfaces that maximize existing light from current windows.',
    isDefault: false,
    category: 'architectural'
  },
  {
    id: 'upgrade_flooring',
    icon: '🪵',
    label: 'Upgrade Flooring',
    description: 'Hardwood or modern tiles',
    promptFragment: 'CRITICAL: Keep the EXACT same room structure, walls, windows, doors, ceiling, and ALL existing furniture in their positions. DO NOT remove anything or change the floor layout. Update ONLY the surface flooring material to premium finishes like warm hardwood, elegant tile, or modern luxury vinyl while keeping the exact same floor plan and room boundaries.',
    isDefault: false,
    category: 'architectural'
  },
  {
    id: 'open_concept',
    icon: '🚪',
    label: 'Open Floor Concept',
    description: 'Airy and flowing feel',
    promptFragment: 'CRITICAL: Keep ALL structural walls, windows, doors, ceiling, floor, and room boundaries EXACTLY as they are. DO NOT remove any walls or architectural elements. Create an open, flowing FEEL ONLY through lighter wall colors, reduced visual clutter, strategic furniture placement, and design elements while maintaining the exact existing architectural structure.',
    isDefault: false,
    category: 'architectural'
  }
];

// Helper to get filter category labels
export const FILTER_CATEGORY_LABELS: Record<FilterCategory, string> = {
  roomType: 'Room Type',
  style: 'Style Presets',
  colors: 'Colors & Paint',
  furniture: 'Furniture & Decor',
  architectural: 'Architectural'
};

// Category icons
export const FILTER_CATEGORY_ICONS: Record<FilterCategory, string> = {
  roomType: '🏠',
  style: '✨',
  colors: '🎨',
  furniture: '🛋️',
  architectural: '🏗️'
};

// Legacy export for backward compatibility
export const FILTERS = CITY_FILTERS;
