/**
 * Icon Mapper Utility
 *
 * Maps icon string names from database to actual Lucide React icon components
 */

import {
  Code,
  Palette,
  TrendingUp,
  Users,
  Database,
  Cloud,
  Smartphone,
  Layout,
  Search,
  Mail,
  ShoppingCart,
  Lock,
  Zap,
  Globe,
  MessageSquare,
  FileText,
  Camera,
  Video,
  Megaphone,
  BarChart,
  Settings,
  Package,
  Server,
  Cpu,
  type LucideIcon,
} from "lucide-react";

/**
 * Map of icon names (as stored in database) to Lucide icon components
 */
const iconMap: Record<string, LucideIcon> = {
  // Development
  code: Code,
  cpu: Cpu,
  server: Server,

  // Design
  palette: Palette,
  layout: Layout,
  camera: Camera,
  video: Video,

  // Business
  trendingup: TrendingUp,
  barchart: BarChart,
  shoppingcart: ShoppingCart,

  // Infrastructure
  database: Database,
  cloud: Cloud,
  package: Package,

  // Communication
  users: Users,
  mail: Mail,
  messagesquare: MessageSquare,
  megaphone: Megaphone,

  // Other
  smartphone: Smartphone,
  search: Search,
  lock: Lock,
  zap: Zap,
  globe: Globe,
  filetext: FileText,
  settings: Settings,
};

/**
 * Get icon component from string name
 * @param iconName - Name of the icon (lowercase, no spaces or hyphens)
 * @returns Lucide icon component or default Code icon
 */
export function getIconComponent(iconName: string): LucideIcon {
  const normalizedName = iconName.toLowerCase().replace(/[-_\s]/g, "");
  return iconMap[normalizedName] || Code; // Default to Code icon if not found
}

export default iconMap;
