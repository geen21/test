import React from 'react';
import { Link } from 'umi';
import classNames from '@pansy/classnames';
import { PageHeader } from 'antd';
import { PageHeaderProps } from 'antd/es/page-header';
import { pathToRegexp } from 'path-to-regexp';
import MenuContext from '@/layouts/menu-context';
import { urlToList } from '@pansy/url-utils';
import './page-header-wrapper.less';

interface PageHeaderWrapperProps extends PageHeaderProps {
  wrapperClassName?: string;
}

const PageHeaderWrapper: React.FC<PageHeaderWrapperProps> = (props) => {
  const { wrapperClassName, prefixCls, ...restProps } = props;
  const { location, breadcrumbNameMap } = React.useContext(MenuContext);

  const getRoutes = (pathname, breadcrumbNameMap) => {
    const pathSnippets = urlToList(pathname);
    const routes = [];

    pathSnippets.forEach((url) => {
      const list = Object.keys(breadcrumbNameMap).filter((item) => {
        return pathToRegexp(item).test(url);
      });
      if (list && list.length) {
        const menuData = breadcrumbNameMap[list[0]];
        if (menuData) {
          routes.push({
            path: menuData.path,
            breadcrumbName: menuData.name
          });
        }
      }
    });

    return routes;
  };

  const pathname = location!.pathname;
  const routes = getRoutes(pathname, breadcrumbNameMap);

  const handleItemRender = (route, params, routes) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link to={route.path}>{route.breadcrumbName}</Link>
    );
  };

  return (
    <div
      className={classNames(wrapperClassName, {
        [`${prefixCls}`]: true
      })}
    >
      <PageHeader
        breadcrumb={{
          itemRender: handleItemRender,
          routes
        }}
        {...restProps}
      />
    </div>
  );
};

PageHeaderWrapper.defaultProps = {
  prefixCls: 'lotus-page-header-wrapper'
};

export default PageHeaderWrapper;
