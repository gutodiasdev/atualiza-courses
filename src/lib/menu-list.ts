import {
  Users,
  Settings, LayoutGrid,
  LucideIcon,
  GraduationCap,
  Handshake,
  ListTodo,
  TrendingUp
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

export function getMenuList(): Group[] {
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
      groupLabel: "Alunos",
      menus: [
        {
          href: "/dashboard/aulas",
          label: "Aulas",
          icon: GraduationCap,
          submenus: []
        },
        {
          href: "/dashboard/consultorias",
          label: "Consultorias",
          icon: Handshake,
          submenus: []
        },
        {
          href: "/dashboard/projetos",
          label: "Projetos",
          icon: ListTodo,
          submenus: []
        },
        {
          href: "/dashboard/campanhas",
          label: "Campanhas",
          icon: TrendingUp,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Professor",
      menus: [
        {
          href: "/dashboard/alunos",
          label: "Alunos",
          icon: Users,
          submenus: []
        },
        {
          href: "/dashboard/cursos",
          label: "Cursos",
          icon: GraduationCap
        }
      ]
    },
    {
      groupLabel: "Administrativo",
      menus: [
        {
          href: "/dashboard/minha-conta",
          label: "Minha Conta",
          icon: Settings
        }
      ]
    }
  ];
}