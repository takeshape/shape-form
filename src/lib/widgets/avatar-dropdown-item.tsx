import React from 'react';
import {Avatar as MuiAvatar, MenuItem, ListItemAvatar, ListItemText} from '@material-ui/core';
import {styled} from '@material-ui/styles';

// @ts-ignore
import LogoSvg from '../../../common/components/logo/takeshape-logo-small';
// @ts-ignore
import getImageUrl from '../../../common/utils/get-image-url';

export interface DropdownItemProps {
  name: string;
  avatar?: string;
  value: string;
}

const Avatar = styled(MuiAvatar)({
  '&&': {
    backgroundColor: '#eee',
    height: '3rem',
    width: '3rem'
  }
});

const AvatarDropdownItem: React.FC<DropdownItemProps> = props => {
  const {name, avatar, ...rest} = props;
  const avatarUrl = avatar ? getImageUrl(avatar, {w: 40, h: 40}) : null;
  const avatarDisplay = avatarUrl ? (
    <Avatar src={avatarUrl} />
  ) : (
    <Avatar>
      <LogoSvg />
    </Avatar>
  );
  return (
    <MenuItem button={false} {...rest}>
      <ListItemAvatar>{avatarDisplay}</ListItemAvatar>
      <ListItemText primary={name} />
    </MenuItem>
  );
};

export default AvatarDropdownItem;
