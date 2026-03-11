#!/usr/bin/env node
/**
 * Icon discovery script for builder-sandbox project.
 * Scans the project for any installed icon libraries and SVG assets.
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

// Known icon library packages to check
const iconPackages = [
  "lucide-react",
  "@heroicons/react",
  "react-icons",
  "@phosphor-icons/react",
  "@tabler/icons-react",
  "feather-icons",
  "@radix-ui/react-icons",
  "react-feather",
];

// Check which icon packages are installed
const installedPackages = iconPackages.filter((pkg) => {
  const pkgPath = path.join(projectRoot, "node_modules", pkg);
  return fs.existsSync(pkgPath);
});

// Collect SVG files from public directory (these are static assets, not an icon library)
const publicDir = path.join(projectRoot, "public");
const publicSvgs = fs
  .readdirSync(publicDir)
  .filter((f) => f.endsWith(".svg"))
  .map((f) => f.replace(".svg", ""));

const output = {
  icons: [],
  usage: "",
};

if (installedPackages.length === 0) {
  output.icons = [];
  output.usage = `# Icons

This project has **no icon library installed**.

The following SVG files exist in \`/public\` but are Next.js boilerplate assets, not an icon library:

${publicSvgs.map((name) => `- \`${name}.svg\``).join("\n")}

## Adding an Icon Library

To add icons, install one of the following libraries:

\`\`\`bash
# Option A: lucide-react (recommended, tree-shakable)
npm install lucide-react

# Option B: @heroicons/react
npm install @heroicons/react

# Option C: react-icons (massive collection, many icon sets)
npm install react-icons
\`\`\`

### Example: lucide-react

\`\`\`tsx
import { Search, Bell, User, ChevronRight } from "lucide-react";

// Basic usage
<Search />

// With size and color
<Bell size={24} color="currentColor" />

// Inside a Button (leftIcon / rightIcon props)
import { Button } from "@/components/design-system";

<Button leftIcon={<Search />}>Search</Button>
<Button rightIcon={<ChevronRight />}>Next</Button>
\`\`\`

### Example: @heroicons/react

\`\`\`tsx
// Variants: outline, solid, mini (16px), micro (12px)
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon as MagnifyingGlassIconSolid } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon as MagnifyingGlassIconMini } from "@heroicons/react/20/solid";

<MagnifyingGlassIcon className="size-6" />
<MagnifyingGlassIconSolid className="size-6" />
<MagnifyingGlassIconMini className="size-5" />
\`\`\`
`;
} else {
  // If packages are found, enumerate their icons (extend as needed)
  console.log("Found installed icon packages:", installedPackages);
  // Placeholder for actual enumeration logic per library
}

const outputPath = path.join(__dirname, "icons.json");
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`Written to ${outputPath}`);
console.log(`Icons found: ${output.icons.length}`);
console.log(`Installed icon packages: ${installedPackages.length > 0 ? installedPackages.join(", ") : "none"}`);
