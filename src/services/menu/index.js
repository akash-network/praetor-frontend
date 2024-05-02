export default async function getMenuData() {
  return [
    // VB:REPLACE-START:MENU-CONFIG
    {
      title: 'Dashboard',
      key: '__dashboard',
      url: '/dashboard',
      icon: 'fe fe-home',
    },
    {
      title: 'Provider Settings',
      key: '__provider_settings',
      url: '/provider-settings',
      icon: 'fe fe-settings',
    },
    {
      title: 'Provider Deployments',
      key: '__provider_deployments',
      url: '/provider-deployments',
      icon: 'fe fe-list',
    },
    // VB:REPLACE-END:MENU-CONFIG
  ]
}
