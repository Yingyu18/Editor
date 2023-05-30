//import dotenv from 'dotenv';
import CreateButtonfrom from './components/create'
import axios from 'axios';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import './App.css';
import CreateButton from './components/create';
// const fs = require('fs');
// const path = require('path');
// const os = require('os');
const {Editor} = require('./components/editor');

// require('dotenv').config()
const BASE_URL = 'http://localhost:8000/api'
// const {BASE_URL} = process.env

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];
const pageList : string[] = []
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  onClick?: (event: React.MouseEvent) => void
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    onClick
  } as MenuItem;
}

// const items: MenuItem[] = [
//   getItem('All pages', '6' ),
//   getItem('Option 2', '2'),
//   getItem('User', 'sub1', ' ', [
//     getItem('Tom', '3'),
//     getItem('Bill', '4'),
//     getItem('Alex', '5'),
//   ]),
//   getItem('Pages', 'sub2', ' ', menuItems),
// ];

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {token: { colorBgContainer },} = theme.useToken();
  //const colorBgContainer = theme.useToken().token.colorBgContainer;
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editorPage, setEditorPage] = useState('');
  const [refresh, setRefresh] = useState(0)


  const handleItemClick = (label: string) => {
    setEditorPage(label);
  };

  useEffect(() => {
    console.log("editor page:", editorPage);
  }, [editorPage]);

  useEffect(() => {
    let menuItems: MenuItem[] = [];
    axios.get(`${BASE_URL}/page/listPage`)
      .then( function (response) {
      // Handle the API response data
        console.log(response.data);
        let data = response.data.pages
        for (let i: number = 0; i < data.length; i++) {
          pageList[i] = data[i].name
          const menuItemLabel = data[i].name; // Assign each string as the label
          console.log("onclick parameter: ", menuItemLabel)
          const menuItem = getItem(menuItemLabel, i.toString(), undefined, undefined, () => handleItemClick(menuItemLabel));
          // Add the menuItem to the menuItems array
          menuItems.push(menuItem);
        }
        const updatedItems: MenuItem[] = [
          getItem('All pages', 'All pages'),
          getItem('Graph', 'Graph'),
          getItem('Pages', 'sub2', ' ', menuItems),
          
        ];
        setItems(updatedItems); // Update the value of items
      })
      .catch(function (error) {
        // Handle the error
        console.error(error);
      });
  }, [refresh]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <CreateButton pageList={pageList}/>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} >Editor </Header> */}
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} >
              <Editor pageName={editorPage}/>
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          {/* <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            Bill is a cat.
          </div> */}
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  );
};

export default App;