import React from 'react';
import classNames from '@pansy/classnames';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useFullscreen, useToggle } from '@pansy/hooks';
import './screen-full.less';

interface IProps {
  prefixCls?: string;
  className?: string;
}

const FullScreenIcon: React.FC<IProps> = (props) => {
  const { prefixCls, className } = props;
  const [show, toggle] = useToggle(false);
  const isFullScreen = useFullscreen(null, show, {
    onClose: () => toggle(false)
  });

  return (
    <span
      className={classNames(className, {
        [`${prefixCls}`]: true
      })}
      onClick={() => {
        toggle();
      }}
    >
      {!isFullScreen && <FullscreenOutlined />}
      {isFullScreen && <FullscreenExitOutlined />}
    </span>
  );
};

FullScreenIcon.defaultProps = {
  prefixCls: 'lotus-screen-full'
};

export default FullScreenIcon;
