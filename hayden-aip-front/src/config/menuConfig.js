const menuList = [
    {
        title: 'Home', 
        key: '/home', 
        icon: 'home', 
        isPublic: true 
    },
    {
        title: 'Record',
        key: '/record',
        icon: 'coffee',
    },
    {
        title: 'Request',
        key: '/request',
        icon: 'heart',
    },
    {
        title: 'User Manage',
        key: '/user',
        icon: 'usergroup-add'
    },
    {
        title: 'Role Manage',
        key: '/role',
        icon: 'apartment',
    },
    {
        title: 'Charts',
        key: '/charts',
        icon: 'area-chart',
        children: [
            {
                title: 'Bar Chart',
                key: '/charts/bar',
                icon: 'bar-chart'
            },
            {
                title: 'Line Chart',
                key: '/charts/line',
                icon: 'line-chart'
            },
            {
                title: 'Pie Chart',
                key: '/charts/pie',
                icon: 'pie-chart'
            },
        ]
    },
]
export default menuList