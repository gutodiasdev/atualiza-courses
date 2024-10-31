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
      groupLabel: "Alunos",
      menus: [
        {
          href: pathname + "/aulas",
          label: "Aulas",
          icon: GraduationCap,
          submenus: []
        },
        {
          href: pathname + "/consultorias",
          label: "Consultorias",
          icon: Handshake,
          submenus: []
        },
        {
          href: pathname + "/projetos",
          label: "Projetos",
          icon: ListTodo,
          submenus: []
        },
        {
          href: pathname + "/campanhas",
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
          href: pathname + "/alunos",
          label: "Alunos",
          icon: Users,
          submenus: []
        },
        {
          href: pathname + "/cursos",
          label: "Cursos",
          icon: GraduationCap
        }
      ]
    },
    {
      groupLabel: "Administrativo",
      menus: [
        {
          href: pathname + "/minha-conta",
          label: "Minha Conta",
          icon: Settings
        }
      ]
    }
  ];
}