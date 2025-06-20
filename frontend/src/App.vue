<script setup>
import MetaDashboard from './components/MetaDashboard.vue'
</script>

<template>
  <el-container class="main-layout">
    <el-aside width="180px" class="sidebar">
      <div class="logo">TLC Insights</div>
      <el-menu default-active="1" class="el-menu-vertical-demo">
        <el-menu-item index="1">Meta Dashboard</el-menu-item>
        <!-- Future: Add more dashboards here -->
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <h2>Internal Analytics Tool</h2>
      </el-header>
      <el-main class="main-content">
        <MetaDashboard />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: #222;
}
.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #409EFF;
  margin: 2rem 0 1rem 1rem;
}
.header {
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  color: #222;
}
.sidebar {
  background: #f5f7fa;
  min-height: 100vh;
  border-right: 1px solid #eee;
}
.main-content {
  background: #f9f9f9;
  padding: 2.5rem 3.5rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  box-sizing: border-box;
}
@media (max-width: 900px) {
  .main-content {
    padding: 1rem;
    max-width: 100vw;
  }
  .sidebar {
    width: 100px !important;
  }
}
</style>
