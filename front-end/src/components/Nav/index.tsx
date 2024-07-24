import * as React from 'react';
import { styled } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const user = {
  isAdmin: true,
};

const Nav = () => {
  const [showMenu, setShowMenu] = React.useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <NavContainer>
      <DesktopNavList>
        <DesktopNavItem onClick={() => window.location.href='/home'}>Home</DesktopNavItem>
        <DesktopNavItem>Perfil</DesktopNavItem>
        <DesktopNavItem>Inscrições</DesktopNavItem>
        {user.isAdmin && (
          <>
              <DesktopNavItem onClick={() => window.location.href='/gerenciamento-de-ongs'}>Gerenciar ONGs</DesktopNavItem>
              <DesktopNavItem>Gerenciar Usuários</DesktopNavItem>
          </>
        )}
        <DesktopNavItem>Logout</DesktopNavItem>
      </DesktopNavList>
      <MobileMenuButton onClick={toggleMenu}>
        <MenuIcon />
      </MobileMenuButton>
      <NavMenu showMenu={showMenu}>
        <MobileNavList>
          <MobileNavItem onClick={() => window.location.href='/home'}>Home</MobileNavItem>
          <MobileNavItem>Perfil</MobileNavItem>
          <MobileNavItem>Inscrições</MobileNavItem>
          {user.isAdmin && (
            <>
              <MobileNavItem onClick={() => window.location.href='/gerenciamento-de-ongs'}>Gerenciar ONGs</MobileNavItem>
              <MobileNavItem>Gerenciar Usuários</MobileNavItem>
            </>
          )}
          <MobileNavItem>Logout</MobileNavItem>
        </MobileNavList>
      </NavMenu>
    </NavContainer>
  );
};

export default Nav;

const NavContainer = styled('nav')({
  width: '100%',
  height: '20px',
  backgroundColor: '#FECABF',
  padding: '10px 0',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  position: 'relative',
  zIndex: 2,
});

const DesktopNavList = styled('ul')({
  listStyle: 'none',
  display: 'flex',
  justifyContent: 'center',
  margin: 0,
  padding: 0,
  '@media (max-width: 600px)': {
    display: 'none',
  },
});

const DesktopNavItem = styled('li')({
  margin: '0 20px',
  color: '#FFFFFF',
  fontSize: '1.2em',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const MobileMenuButton = styled(IconButton)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  zIndex: 3,
  display: 'none',
  '@media (max-width: 600px)': {
    display: 'block',
    marginTop: '-8px'
  },
});

const NavMenu = styled('div')(({ showMenu }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  position: 'fixed',
  top: 0,
  left: 0,
  display: showMenu ? 'block' : 'none',
  zIndex: 1,
}));

const MobileNavList = styled('ul')({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  backgroundColor: '#FECABF',
  position: 'absolute',
  top: '0px',
  left: 0,
  right: 0,
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  zIndex: 1,
});

const MobileNavItem = styled('li')({
  margin: '10px 0',
  padding: '10px 20px',
  color: '#FFFFFF',
  fontSize: '1.2em',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});
