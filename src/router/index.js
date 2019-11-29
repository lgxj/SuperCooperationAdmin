import Vue from 'vue'
import Router from 'vue-router'
import { wordLimit } from '@/utils'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* dev router */
import devRouter from '@/router/modules/dev'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/pages/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '控制面板', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '账户资料', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock'
    },
    children: [
      {
        path: 'api-group',
        component: () => import('@/pages/permission/api-group'),
        name: 'PermissionApiGroup',
        meta: {
          title: '接口分组',
          roles: ['dev']
        }
      },
      {
        path: 'api',
        component: () => import('@/pages/permission/api'),
        name: 'PermissionApiAll',
        meta: {
          title: '接口列表',
          roles: ['dev']
        }
      },
      {
        path: 'api/:group_id/:name',
        component: () => import('@/pages/permission/api'),
        name: 'PermissionApi',
        hidden: true,
        meta: {
          dynamicTitle: route => `接口列表：${route.params['name']}`,
          roles: ['dev']
        }
      },
      {
        path: 'resource',
        component: () => import('@/pages/permission/resource'),
        name: 'PermissionResource',
        meta: {
          title: '资源',
          roles: ['dev']
        }
      },
      {
        path: 'role',
        component: () => import('@/pages/permission/role'),
        name: 'PermissionRole',
        meta: {
          title: '角色'
        }
      },
      {
        path: 'admin',
        component: () => import('@/pages/permission/admin'),
        name: 'PermissionAdmin',
        meta: {
          title: '管理员'
        }
      },
      {
        path: 'admin-log',
        component: () => import('@/pages/permission/admin-log'),
        name: 'PermissionAdminLogAll',
        meta: {
          title: '操作日志'
        }
      },
      {
        path: 'admin-log/:id/:name',
        component: () => import('@/pages/permission/admin-log'),
        name: 'PermissionAdminLog',
        hidden: true,
        meta: {
          dynamicTitle: route => `操作日志：${route.params['name']}`
        }
      }
    ]
  },

  {
    path: '/content',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true, // will always show the root menu
    name: 'Content',
    meta: {
      title: '内容管理',
      icon: 'list'
    },
    children: [
      {
        path: 'article-category',
        component: () => import('@/pages/content/article-category'),
        name: 'ContentArticleCategory',
        meta: {
          title: '文章分类'
        }
      },
      {
        path: 'article-category-add',
        component: () => import('@/pages/content/article-category-detail'),
        name: 'ContentArticleCategoryAdd',
        hidden: true,
        meta: {
          title: '添加文章分类'
        }
      },
      {
        path: 'article-category/:id/:name',
        component: () => import('@/pages/content/article-category-detail'),
        name: 'ContentArticleCategoryEdit',
        hidden: true,
        meta: {
          dynamicTitle: route => `编辑文章分类：${route.params['name']}`
        }
      },
      {
        path: 'article',
        component: () => import('@/pages/content/article'),
        name: 'ContentArticle',
        meta: {
          title: '文章列表'
        }
      },
      {
        path: 'article/add',
        component: () => import('@/pages/content/article-detail'),
        name: 'ContentArticleAdd',
        hidden: true,
        meta: {
          title: '添加文章'
        }
      },
      {
        path: 'article/:id/:name',
        component: () => import('@/pages/content/article-detail'),
        name: 'ContentArticleEdit',
        hidden: true,
        meta: {
          dynamicTitle: route => `编辑文章：${wordLimit(route.params['name'])}`
        }
      }
    ]
  },

  ...devRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
