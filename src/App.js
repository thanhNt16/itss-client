import React from "react";
import { Layout, Typography } from "antd";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import "./App.css";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography
function App() {
  return (
    <div className="App">
      <Layout>
        
        <Layout>
          <Header
            className="site-layout-sub-header-background"
            style={{ padding: 0 }}
          >
            <Title colo>Robot warehouse system</Title>
          </Header>
          <Content style={{ height: "100vh" }}>
            <div
              className="h-full p-24 site-layout-background"
            >
              content
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
