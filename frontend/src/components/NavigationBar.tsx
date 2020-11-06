import React, { CSSProperties, ReactElement, useState } from 'react';
import { Menu } from 'antd';

enum Pages {
  Home = 'Home',
  Login = 'Login',
  UploadPromotion = 'UploadPromotion'
}

const styles: { [identifier: string]: CSSProperties } = {
  header: {
    backgroundColor: '#eee',
    display: 'inline-flex',
    padding: 10,
    width: '100%',
    verticalAlign: 'center'
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
    </header>
  )
}