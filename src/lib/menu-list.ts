import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Posts",
          icon: SquarePen,
          submenus: [
            {
              href: pathname + "/posts",
              label: "All Posts"
            },
            {
              href: pathname + "/posts/new",
              label: "New Post"
            }
          ]
        },
        {
          href: pathname + "/categories",
          label: "Categories",
          icon: Bookmark
        },
        {
          href: pathname + "/tags",
          label: "Tags",
          icon: Tag
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: pathname + "/users",
          label: "Users",
          icon: Users
        },
        {
          href: pathname + "/account",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}