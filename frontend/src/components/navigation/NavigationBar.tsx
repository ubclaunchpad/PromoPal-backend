import React, { CSSProperties, ReactElement, useState } from 'react';
import { Menu } from 'antd';

import SearchBar from "./SearchBar";

enum Pages {
  Home = 'Home',
  Login = 'Login',
  UploadPromotion = 'UploadPromotion'
}

const styles: { [identifier: string]: CSSProperties } = {
  header: {
    alignItems: 'center',
    backgroundColor: '#eee',
    display: 'inline-flex',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
  logo: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 0,
    marginBottom: 0
  },
  menu: {
    backgroundColor: '#eee',
  },
  menuItem: {
    borderBottom: 0,
    color: 'black'
  },
  navigation: {
    display: 'inline-flex',
    verticalAlign: 'center'
  }
}

export default function NavigationBar(): ReactElement {
  const [current, setCurrent] = useState<Pages>(Pages.Home);

  const isActive = (key: Pages): CSSProperties => ({
    ...styles.menuItem,
    fontWeight: current === key ? 'bold' : 'normal'
  });

  return (
    <header style={styles.header}>
      <div style={styles.navigation}>
        <h1 style={styles.logo}>
          Logo
        </h1>
        <Menu
          onClick={({ key }) => setCurrent(key as Pages)}
          selectedKeys={[current]}
          mode="horizontal"
          style={styles.menu}>
          <Menu.Item key={Pages.Home} style={isActive(Pages.Home)}>
            Home
          </Menu.Item>
          <Menu.Item key={Pages.Login} style={isActive(Pages.Login)}>
            Login
          </Menu.Item>
          <Menu.Item key={Pages.UploadPromotion} style={isActive(Pages.UploadPromotion)}>
            Upload Promotion
          </Menu.Item>
        </Menu>
      </div>
      <SearchBar />
    </header>
  )
}