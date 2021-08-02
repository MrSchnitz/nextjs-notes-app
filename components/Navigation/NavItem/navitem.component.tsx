import React from "react";
import {NavItem, NavItemContent, NavItemIcon} from "./navitem.styles";
import {useRouter} from "next/router";

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

  const handleOnClick = () => {
    onClick && onClick();
    url && push(url);
  };

  return (
    <NavItem
      active={isActive ?? false}
      open={isOpen ?? true}
      onClick={handleOnClick}
      isTag={isTag}
    >
      <NavItemIcon>{icon}</NavItemIcon>
      <NavItemContent isTag={!!isTag}>{name}</NavItemContent>
    </NavItem>
  );
};

export default NavigationItem;
