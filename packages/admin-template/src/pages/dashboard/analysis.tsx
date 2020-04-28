/**
 * @author wangxingkang
 * @date 2019-07-15 22:20
 * @description Analysis页面
 *
 * @last-modified-by wangxingkang
 * @last-modified-time 2019-07-15 22:20
 */
import React from 'react';
import { PFC } from '@/common/types';
import IntroduceRow from './components/introduce-row';
import SalesCard from './components/sales-card';

interface AnalysisProps {

}

const Analysis: PFC<AnalysisProps> = () => {
  let data = undefined;

  return (
    <div>
      <IntroduceRow />
      <SalesCard />
    </div>
  );
};

export default Analysis;
