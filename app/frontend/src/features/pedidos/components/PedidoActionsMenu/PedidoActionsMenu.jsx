import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './PedidoActionsMenu.module.css';

const MENU_WIDTH = 220;
const VIEWPORT_PADDING = 12;
const GAP = 6;

function PedidoActionsMenu({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);

  const updateMenuPosition = () => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.bottom + GAP;
    let left = rect.right - MENU_WIDTH;

    let openUpward = false;

    const estimatedMenuHeight = Math.max(actions.length * 40 + 16, 80);

    if (top + estimatedMenuHeight > viewportHeight - VIEWPORT_PADDING) {
      top = rect.top - estimatedMenuHeight - GAP;
      openUpward = true;
    }

    if (left < VIEWPORT_PADDING) {
      left = rect.left;
    }

    if (left + MENU_WIDTH > viewportWidth - VIEWPORT_PADDING) {
      left = viewportWidth - MENU_WIDTH - VIEWPORT_PADDING;
    }

    if (top < VIEWPORT_PADDING) {
      top = VIEWPORT_PADDING;
    }

    setMenuStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${MENU_WIDTH}px`,
      zIndex: 99999,
      transformOrigin: openUpward ? 'bottom right' : 'top right',
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, actions.length]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      const clickedWrapper = wrapperRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);

      if (!clickedWrapper && !clickedMenu) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleReposition = () => {
      updateMenuPosition();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, actions.length]);

  const portalMenu =
    open &&
    createPortal(
      <div
        ref={menuRef}
        className={styles.menu}
        style={menuStyle}
        role="menu"
      >
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={`${styles.menuItem} ${
              action.variant === 'danger' ? styles.menuItemDanger : ''
            }`}
            onClick={() => {
              action.onClick();
              setOpen(false);
            }}
            role="menuitem"
          >
            {action.label}
          </button>
        ))}
      </div>,
      document.body
    );

  return (
    <>
      <div className={styles.wrapper} ref={wrapperRef}>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="menu"
        >
          Acciones
        </button>
      </div>

      {portalMenu}
    </>
  );
}

export default PedidoActionsMenu;