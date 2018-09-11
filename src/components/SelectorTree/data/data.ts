const data = [
  {
    label: '食品生鲜',
    value: '食品生鲜',

    // hasChildSelect: false, // 是否有子节点被选中
    //
    // isChoose: false, // 只有 叶子节点 才会有 choose 状态
    // isActive: true, // 不是 叶子节点 才会active状态
    // index: [0, 1] // 该元素在树中的位置

    children: [
      {
        label: '主食',
        value: '主食',
        children: [
          {label: '主食1', value: '主食1'},
          {label: '主食2', value: '主食2'},
          {label: '主食3', value: '主食3'},
          {label: '主食4', value: '主食4'},
          {label: '主食5', value: '主食5'},
          {label: '主食6', value: '主食6'},
          {label: '主食7', value: '主食7', isChoose: true},
          {label: '主食8', value: '主食8', isChoose: true},
        ]
      },
      {
        label: '南北干货',
        value: '南北干货',
        children: [
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
          {label: '干货1', value: '干货1'},
        ]
      },
      {
        label: '休闲食品',
        value: '休闲食品',
        children: [
          {label: '休闲食品1', value: '休闲食品1'},
          {label: '休闲食品2', value: '休闲食品2'},
          {label: '休闲食品3', value: '休闲食品3'},
          {label: '休闲食品4', value: '休闲食品4'},
          {label: '休闲食品5', value: '休闲食品5'},
          {label: '休闲食品6', value: '休闲食品6'},
          {label: '休闲食品7', value: '休闲食品7'},
          {label: '休闲食品8', value: '休闲食品8'},
          {label: '休闲食品9', value: '休闲食品9'},
          {label: '休闲食品10', value: '休闲食品10'},
          {label: '休闲食品11', value: '休闲食品11'},
          {label: '休闲食品12', value: '休闲食品12'},
          {label: '休闲食品13', value: '休闲食品13'},
        ]
      },
      {
        label: '进口零食',
        value: '进口零食',
        children: [
          {label: '进口零食1', value: '进口零食1'},
          {label: '进口零食2', value: '进口零食2'},
          {label: '进口零食3', value: '进口零食3'},
          {label: '进口零食4', value: '进口零食4'},
          {label: '进口零食5', value: '进口零食5'},
          {label: '进口零食6', value: '进口零食6'},
          {label: '进口零食7', value: '进口零食7'},
          {label: '进口零食8', value: '进口零食8'},
          {label: '进口零食9', value: '进口零食9'},
          {label: '进口零食10', value: '进口零食10'},
        ]
      },
      {
        label: '食用油',
        value: '食用油',
        children: [
          {label: '食用油1', value: '食用油1'},
          {label: '食用油2', value: '食用油2'},
          {label: '食用油3', value: '食用油3'},
          {label: '食用油4', value: '食用油4'},
          {label: '食用油5', value: '食用油5'},
          {label: '食用油6', value: '食用油6'},
          {label: '食用油7', value: '食用油7'},
          {label: '食用油8', value: '食用油8'},
          {label: '食用油9', value: '食用油9'},
          {label: '食用油10', value: '食用油10'},
        ]
      },
      {
        label: '新鲜水产',
        value: '主食',
        children: [
          {label: '新鲜水产1', value: '新鲜水产1'},
          {label: '新鲜水产2', value: '新鲜水产2'},
          {label: '新鲜水产3', value: '新鲜水产3'},
          {label: '新鲜水产4', value: '新鲜水产4'},
        ]
      },
    ],
  },
  {
    label: '时尚服饰',
    value: '时尚服饰',
    children: [
      {label: '时尚时尚最时尚', value: '123123'},
    ],
  },
  {
    label: '个护',
    value: '个护',
    children: [
      {label: '个护1', value: '个护1'},
      {label: '个护2', value: '个护2'},
      {label: '个护3', value: '个护3'},
      {label: '个护4', value: '个护4'},
      {label: '个护5', value: '个护5'},
      {label: '个护6', value: '个护6'},
      {label: '个护7', value: '个护7'},
      {label: '个护8', value: '个护8'},
      {label: '个护9', value: '个护9'},
      {label: '个护10', value: '个护10'},
      {label: '个护11', value: '个护11'},
      {label: '个护12', value: '个护12'},
      {label: '个护13', value: '个护13'},
    ],
  },
  {
    label: '家电',
    value: '家电',
    children: [
      {
        label: '智能家电',
        value: '智能',
        children: [
          {label: '手机', value: '手机'},
          {label: '手机1', value: '手机1'},
          {label: '手机2', value: '手机2'},
          {label: '手机3', value: '手机3'},
          {label: '手机4', value: '手机4'},
          {label: '手机5', value: '手机5'},
          {label: '手机6', value: '手机6'},
          {label: '手机7', value: '手机7'},
          {label: '手机8', value: '手机8'},
          {label: '手机9', value: '手机9'},
          {label: '手机10', value: '手机10'},
          {label: '手机11', value: '手机11'},
          {label: '手机12', value: '手机12'},
          {label: '手机13', value: '手机13'},
        ],
      },
      {
        label: '不智能家电',
        value: '不智能',
        children: [
          {label: '没得', value: '没得'}
        ]
      },
    ],
  },
];

export default data;

export const asyncData = [
  {label: '1级'},
  {label: '2级'},
  {label: '3级'},
  {label: '4级'},
];
