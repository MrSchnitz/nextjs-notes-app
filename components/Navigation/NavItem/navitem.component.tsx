import React from "react";
import { useDispatch } from "react-redux";
import { NavItem, NavItemContent, NavItemIcon } from "./navitem.styles";
import { IconButton } from "@material-ui/core";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import {useRouter} from "next/router";

interface NavigationItemProps {
  name: string;
  icon: any;
  url?: string;
  onClick?: () => void;
  onDelete?: () => void;
  isActive?: boolean;
  isTag?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({
  name,
  url,
  icon,
  onClick,
  onDelete,
  isActive,
  isTag,
}: NavigationItemProps) => {
  const handleDelete = (e: any) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const {push} = useRouter();

  return (
    <NavItem
      active={isActive ?? false}
      onClick={onClick ? onClick : () => push(url!)}
    >
      <NavItemIcon>
        {icon}
      </NavItemIcon>
      <NavItemContent>{name}</NavItemContent>
      {onDelete && (
        <IconButton onClick={onDelete}>
          <DeleteForeverOutlinedIcon />{" "}
        </IconButton>
      )}
    </NavItem>
  );
};

export default NavigationItem;
