import React from 'react';
import { columnLabel } from './layout';
import '../styles/column-header-style.css';

const { useRef, useEffect } = React;

export default function ColumnHeader(props) {
  const {
    index,
    column,
    columnWidth,
    fixed,
    lastFixed,
    headColRender,
    onColumnHeaderClick,
  } = props;
  const resizing = useRef(null);
  const suppressClick = useRef(false);
  const cleanup = useRef(null);

  useEffect(() => () => cleanup.current && cleanup.current(), []);

  // handle passed to callbacks; keeps the former `component.props` shape
  const handle = { props: { index, column, columnWidth, fixed } };

  const onResizeStart = event => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const startX = event.pageX;
    const startWidth = event.currentTarget.parentElement.getBoundingClientRect()
      .width;
    resizing.current = startWidth;

    const onMove = e => {
      resizing.current = startWidth + e.pageX - startX;
      props.previewColumnWidth(index, resizing.current);
    };
    const onUp = () => {
      cleanup.current();
      if (resizing.current !== startWidth) {
        // the click following mouseup must not be taken as a header click
        suppressClick.current = true;
        setTimeout(() => {
          suppressClick.current = false;
        }, 0);
        props.commitColumnWidth(index, resizing.current, handle);
      }
      resizing.current = null;
    };

    cleanup.current = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.classList.remove('ft-resizing');
      cleanup.current = null;
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.body.classList.add('ft-resizing');
  };

  const onClick = () => {
    if (suppressClick.current) return;
    if (onColumnHeaderClick) onColumnHeaderClick(index);
  };

  const content = headColRender
    ? headColRender(column, handle)
    : columnLabel(column);

  let className = 'ft-table--cell__header';
  if (fixed) className += ' ft-fixed';
  if (lastFixed) className += ' ft-fixed--last';

  return (
    <div
      className={className}
      style={{
        width: `var(--ft-w-${index})`,
        left: fixed ? `var(--ft-l-${index})` : undefined,
      }}
      onClick={onClick}
      role='columnheader'
      title={typeof content === 'string' ? content : undefined}
    >
      {content}
      <div
        className='ft-table--cell__header--resizable'
        onMouseDown={onResizeStart}
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
}
