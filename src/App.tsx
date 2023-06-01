//import dotenv from 'dotenv';
import axios from 'axios';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import './App.css';
import CreateButton from './components/create';
import Cited from './components/cited';
import Delete from './components/delete';
const {Editor} = require('./components/editor');

// require('dotenv').config()
const BASE_URL = 'http://localhost:8000/api'
const HOME = 'http://localhost:3000'
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

  const handlePage = (pageName) => {
      console.log("handlePage")
      setEditorPage(pageName)
  }
  const handleRefresh = () => {
    setRefresh(refresh+1)
  }
  const handleItemClick = (label: string) => {
    //setEditorPage(label);
    window.location.href = `${HOME}/?page=${label}`
  };

  const deletePage = () => {
    axios.delete(`${BASE_URL}/page/delete/${editorPage}`)
    .then( function (response) {
      console.log(response)
      window.location.href = `${HOME}`
      //setRefresh(refresh+1)
      setEditorPage('')
    })
    .catch(function (error) {
      // Handle the error
      console.error(error)
    });
  };

  useEffect(() => {
    console.log("editor page:", editorPage);
  }, [editorPage]);

  useEffect(() => {
    // Get the query string from the current URL
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    // Get the value of a specific query parameter
    const page = params.get('page');
    if (page !== null) {
      console.log(page);
      setEditorPage(page)
    }
  }, []);

  //refresh Menu
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
          const menuItem = getItem(menuItemLabel, menuItemLabel, undefined, undefined, () => handleItemClick(menuItemLabel));
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
        <CreateButton pageList={pageList} changePage={handlePage} refresh={handleRefresh}/>
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} >Editor </Header> */}
        {/* <Button type="primary" danger onClick={deletePage}>
          Delete page
        </Button> */}
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} >
              <Editor pageName={editorPage}/>
          </Breadcrumb>
        </Content>
      </Layout>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} >Editor </Header> */}
        {/* <Button type="primary" danger onClick={deletePage}>
          Delete page
        </Button> */}
        <Delete deletePage={deletePage} pageName={editorPage}/>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} >
              <Cited pageName={editorPage} />
          </Breadcrumb>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;