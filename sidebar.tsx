import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import type { CSSObject, DrawerProps as MuiDrawerProps, Theme } from '@mui/material';
import { Drawer, styled, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { ZTooltip } from '@zoox/ops-ui';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { TriggerTwilioTask } from '../../components/TriggerTwilioTask';
import { AppBar } from '../AppBar';
import { Versions } from '../AppShell/Versions';
import { PageNavigation } from '../PageNavigation';

const defaultDrawerOpenedWidth = '216px';
const defaultDrawerClosedWidth = '72px';

const defaultOpenedMixin = (theme: Theme): CSSObject => ({
  width: defaultDrawerOpenedWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.easeInOut,
    duration: 500,
  }),
  backgroundColor: theme.palette.status.unknown.contrast,
  overflowX: 'hidden',
});

const defaultClosedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create(['width', 'opacity'], {
    easing: theme.transitions.easing.easeInOut,
    duration: 200,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.status.unknown.contrast,
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

interface ZSidebarProps extends MuiDrawerProps {
  openedMixin?: (theme: Theme) => CSSObject;
  closedMixin?: (theme: Theme) => CSSObject;
  togglekeybind?: string;
}

export const CollapsibleSidebar = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<ZSidebarProps>(
  ({ theme, open, openedMixin = defaultOpenedMixin, closedMixin = defaultClosedMixin }) => ({
    width: defaultDrawerOpenedWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open
      ? { ...openedMixin(theme), '& .MuiDrawer-paper': openedMixin(theme) }
      : { ...closedMixin(theme), '& .MuiDrawer-paper': closedMixin(theme) }),
  })
);

export function ZSidebar(props: ZSidebarProps) {
  const { togglekeybind = 'c' } = props;
  const storedOpen = localStorage.getItem('sidebarOpen');
  const initialOpen = storedOpen ? JSON.parse(storedOpen) : true;
  const [open, setOpen] = useState(initialOpen);
  const { palette } = useTheme();

  const closeSidebar = () => {
    setOpen(!open);
  };

  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === togglekeybind.toLowerCase()) {
        closeSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div>
      <Box>
        <CollapsibleSidebar variant="permanent" open={open} togglekeybind={togglekeybind}>
          <PageNavigation sx={{ flex: '1' }} open={open} title="RiderDash" />
          <Box>
            <div>
              {open ? <TriggerTwilioTask /> : null}
              <div
                css={{
                  display: 'flex',
                  flexDirection: open ? 'row' : 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {open ? (
                  <Versions />
                ) : (
                  <ZTooltip title={<Versions />} arrow placement="right">
                    <InfoOutlinedIcon sx={{ color: palette.secondary.light }} fontSize="small" />
                  </ZTooltip>
                )}
                <IconButton onClick={closeSidebar} sx={{ color: palette.secondary.light }}>
                  {!open ? (
                    <ZTooltip title="Expand Menu (C)" arrow placement="right">
                      <ChevronRightIcon />
                    </ZTooltip>
                  ) : (
                    <ZTooltip title="Collapse Menu (C)" arrow placement="right">
                      <ChevronLeftIcon />
                    </ZTooltip>
                  )}
                </IconButton>
              </div>
            </div>
          </Box>
        </CollapsibleSidebar>
      </Box>
      {/* default mixin values for opened and closed drawer widths */}
      <Box
        sx={{
          paddingLeft: open ? defaultDrawerOpenedWidth : defaultDrawerClosedWidth,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <AppBar />
        <Outlet />
      </Box>
    </div>
  );
}
