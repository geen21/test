import React from 'react';
import classNames from '@pansy/classnames';
import { GlobalOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { formatMessage, getLocale, setLocale } from 'umi';
import HeaderDropdown from '@/components/header-dropdown';
import './select-lang.less';

interface SelectLangProps {
  className?: string;
  prefixCls?: string;
}

const locales = {
  'zh-CN': { label: '简体中文', icon: '🇨🇳' },
  'en-US': { label: 'English', icon: '🇬🇧' }
};

export const SelectLang: React.FC<SelectLangProps> = (props) => {
  const { className, prefixCls } = props;
  const selectedLang = getLocale();

  const changeLang = ({ key }) => {
    setLocale(key, true);
  };

  const langMenu = (
    <Menu className={`${prefixCls}__menu`} selectedKeys={[selectedLang]} onClick={changeLang}>
      {Object.keys(locales).map((locale) => {
        const data = locales[locale];
        return (
          <Menu.Item key={locale}>
            <span role="img" aria-label={data.label}>
              {data.icon}
            </span>{' '}
            {data.label}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span
        className={classNames(className, {
          [`${prefixCls}__dropdown`]: true
        })}
      >
        <GlobalOutlined
          title={formatMessage({
            id: 'navBar.lang'
          })}
        />
      </span>
    </HeaderDropdown>
  );
};

SelectLang.defaultProps = {
  prefixCls: 'lotus-select-lang'
};
