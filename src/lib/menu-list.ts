import {
  Users,
  Settings, LucideIcon,
  GraduationCap, HandIcon,
  Home
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
  roles: string[];
  groupLabel?: string;
  menus: Menu[];
};

export function getMenuList(): Group[] {
  return [
    {
      roles: ["admin", "student", "teacher"],
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: Home,
          submenus: []
        }
      ]
    },
    {
      roles: ["student"],
      // groupLabel: "Alunos",
      menus: [
        {
          href: "/dashboard/aulas",
          label: "Aulas",
          icon: GraduationCap,
          submenus: []
        },
        // {
        //   href: "/dashboard/consultorias",
        //   label: "Consultorias",
        //   icon: Handshake,
        //   submenus: []
        // },
        // {
        //   href: "/dashboard/projetos",
        //   label: "Projetos",
        //   icon: ListTodo,
        //   submenus: []
        // },
        // {
        //   href: "/dashboard/campanhas",
        //   label: "Campanhas",
        //   icon: TrendingUp,
        //   submenus: []
        // }
      ]
    },
    {
      roles: ["teacher"],
      // groupLabel: "Professor",
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
        },
        {
          href: "/dashboard/solicitacoes",
          label: "Solicitações",
          icon: HandIcon
        }
      ]
    },
    {
      roles: ["admin", "teacher", "student"],
      // groupLabel: "Administrativo",
      menus: [
        {
          href: "/dashboard/meu-perfil",
          label: "Meu perfil",
          icon: Settings
        }
      ]
    }
  ];
}