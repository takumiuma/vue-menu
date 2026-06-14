export interface MockMenu {
  menuId: number
  menuName: string
  genreIds: number[]
  categoryIds: number[]
}

// ジャンル: 1=和食, 2=中華料理, 3=洋食, 4=韓国料理, 5=ファーストフード, 6=その他
// カテゴリ: 1=肉, 2=魚, 3=野菜, 4=ご飯もの, 5=麺類, 6=パン, 7=スープ・汁物, 8=その他
export const MOCK_MENUS: MockMenu[] = [
  { menuId: 1, menuName: 'カレーライス', genreIds: [3], categoryIds: [1, 4] },
  { menuId: 2, menuName: 'ラーメン', genreIds: [2], categoryIds: [5] },
  { menuId: 3, menuName: '寿司', genreIds: [1], categoryIds: [2] },
  { menuId: 4, menuName: '焼肉', genreIds: [4], categoryIds: [1] },
  { menuId: 5, menuName: 'ハンバーガー', genreIds: [5], categoryIds: [1, 6] },
  { menuId: 6, menuName: '親子丼', genreIds: [1], categoryIds: [1, 4] },
  { menuId: 7, menuName: 'パスタ', genreIds: [3], categoryIds: [5] },
  { menuId: 8, menuName: 'チャーハン', genreIds: [2], categoryIds: [4] },
  { menuId: 9, menuName: 'うどん', genreIds: [1], categoryIds: [5] },
  { menuId: 10, menuName: 'ビビンバ', genreIds: [4], categoryIds: [4] },
  { menuId: 11, menuName: 'ピザ', genreIds: [3], categoryIds: [6] },
  { menuId: 12, menuName: '豚汁', genreIds: [1], categoryIds: [1, 7] },
  { menuId: 13, menuName: '餃子', genreIds: [2], categoryIds: [1] },
  { menuId: 14, menuName: 'フライドチキン', genreIds: [5], categoryIds: [1] },
  { menuId: 15, menuName: '天ぷら', genreIds: [1], categoryIds: [2, 3] },
  { menuId: 16, menuName: 'サンドイッチ', genreIds: [3], categoryIds: [6] },
  { menuId: 17, menuName: 'チゲ鍋', genreIds: [4], categoryIds: [7] },
  { menuId: 18, menuName: '野菜炒め', genreIds: [2], categoryIds: [3] },
  { menuId: 19, menuName: 'カツ丼', genreIds: [1], categoryIds: [1, 4] },
  { menuId: 20, menuName: 'タコス', genreIds: [6], categoryIds: [1, 6] },
]
