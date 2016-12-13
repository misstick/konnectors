import DiscoveryList from './components/discovery_list'
import CategoryList from './components/category_list'
import ConnectedList from './components/connected_list'

export default [{
  name: 'categoryHome',
  path: '/category',
  redirect: '/category/all',
  component: CategoryList
},{
  name: 'categoryList',
  path: '/category/:id',
  component: CategoryList
},
{
  name: 'discoveryList',
  path: '/discovery',
  component: DiscoveryList
},
{
  name: 'connectedList',
  path: '/connected',
  component: ConnectedList
},
{
  name: 'create-account-success',
  path: '/',
  query: { 'success': 'account-was-successfully-created' }
},
{
  name: 'default',
  path: '/',
  redirect: '/category'
}]
