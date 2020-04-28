import React from 'react';
import classNames from '@pansy/classnames';
import './pattern-lock.less';

interface PatternLockProps {
  prefixCls: string;
  className?: string;
  matrix: [number, number];
  margin: number;
  radius: number;
  // 绘图时图案是否可见
  patternVisible: boolean;
  lineOnMove: boolean;
  delimiter: string;
  allowRepeat: boolean;
}

const PatternLock: React.FC<PatternLockProps> = (props) => {
  const { prefixCls, className } = props;
  return <div></div>;
};

PatternLock.defaultProps = {
  matrix: [3, 3],
  patternVisible: true,
  allowRepeat: false
};

export default PatternLock;
