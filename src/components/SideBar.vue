<template>
  <el-aside width="200px">
    <el-menu :router="true">
      <el-menu-item index="0" route="/"> 首页 </el-menu-item>
      <el-sub-menu index="1">
        <template #title> 用户 </template>
        <el-menu-item index="1-1" route="/users"> 用户 </el-menu-item>
        <el-menu-item index="1-2" route="/user-donate-summaries"> 献血数据 </el-menu-item>
        <el-menu-item index="1-3" route="/identity-update-applies"> 信息更正申请 </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title> 活动 </template>
        <el-menu-item index="2-1" route="/events"> 活动 </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title> Banner </template>
        <el-menu-item index="3-2" route="/banners">Banner </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4">
        <template #title> 征名活动 </template>
        <el-menu-item index="4-1" route="/namings?title=天津征名&type=1"> 天津征名 </el-menu-item>
        <el-menu-item index="4-2" route="/namings?title=郑州征名&type=0"> 郑州征名 </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="5">
        <template #title> 系统管理 </template>
        <el-menu-item index="5-1" route="/stations"> 血站管理 </el-menu-item>
        <el-menu-item index="5-2" route="/organizers"> 机构管理 </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="6">
        <template #title> 圈子系统 </template>
        <el-menu-item index="6-1" route="/groups"> 创建圈子 </el-menu-item>
        <el-menu-item index="6-2" route="/posts"> 帖子管理 </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="7">
        <template #title> 布拉得文创馆 </template>
        <el-menu-item index="7-1" route="/commodity-management"> 商品管理 </el-menu-item>
        <el-menu-item index="7-2" route="/category"> 产品类别字典 </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>
