import React from "react";
import { useDispatch } from "react-redux";
import { NavItem, NavItemContent, NavItemIcon } from "./navitem.styles";
import { IconButton } from "@material-ui/core";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import { useRouter } from "next/router";

export interface NavigationItemProps {
  name: string;
  icon: any;
  url?: string;
  onClick?: () => void;
  isActive?: boolean;
  isOpen?: boolean;
  isTag?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  name,
  url,
  icon,
  onClick,
  isActive,
  isOpen,
  isTag,
}: NavigationItemProps) => {
  const { push } = useRouter();

  return (
    <NavItem
      active={isActive ?? false}
      open={isOpen ?? true}
      onClick={onClick ? onClick : () => push(url!)}
      isTag={isTag}
    >
      <NavItemIcon>{icon}</NavItemIcon>
      <NavItemContent isTag={!!isTag}>{name}</NavItemContent>
    </NavItem>
  );
};

export default NavigationItem;
