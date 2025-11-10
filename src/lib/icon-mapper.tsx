/**
 * Icon Mapper Utility
 *
 * Maps icon string names from database to actual Lucide React icon components
 */

import {
  BarChart,
  Camera,
  Cloud,
  Code,
  Cpu,
  Database,
  FileText,
  Globe,
  Layout,
  Lock,
  type LucideIcon,
  Mail,
  Megaphone,
  MessageSquare,
  Package,
  Palette,
  Search,
  Server,
  Settings,
  ShoppingCart,
  Smartphone,
  TrendingUp,
  Users,
  Video,
  Zap,
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
