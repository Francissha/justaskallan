
import { FaChessKnight, FaTree, FaPlaneDeparture } from "react-icons/fa";

export const categories = [
  {
    id: 1,
    name: "Chess",
    icon: FaChessKnight,
    color: "bg-green-100 text-green-700",
    route: "/categories/chess",
  },
  {
    id: 2,
    name: "Survival",
    icon: FaTree,
    color: "bg-orange-100 text-orange-600",
    route: "/categories/survival",
  },
  {
    id: 3,
    name: "Travelling",
    icon: FaPlaneDeparture,
    color: "bg-blue-100 text-blue-600",
    route: "/categories/travelling",
  },
];