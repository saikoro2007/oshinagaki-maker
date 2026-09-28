export const RESTAURANT_PRESETS = [
  {
    category: '串焼き・焼き鳥',
    items: [
      { name: 'とり精肉', price: '180', note: '塩・タレ', translation: 'Chicken Thigh' },
      { name: 'ねぎま', price: '190', note: '塩・タレ', translation: 'Chicken & Scallion' },
      { name: '自家製つくね', price: '220', note: '特製タレ', translation: 'Handmade Meatballs' },
      { name: '鶏皮', price: '160', note: '香ばしパリパリ', translation: 'Crispy Chicken Skin' },
      { name: '砂肝', price: '170', note: 'コリコリ食感', translation: 'Chicken Gizzard' },
      { name: '鶏レバー', price: '180', note: '濃厚とろける', translation: 'Chicken Liver' },
      { name: 'せせり', price: '200', note: 'ジューシー首肉', translation: 'Chicken Neck' },
      { name: 'ぽんじり', price: '180', note: '希少部位', translation: 'Chicken Tail' },
      { name: '手羽先', price: '230', note: '炭火塩焼き', translation: 'Chicken Wings' },
      { name: '軟骨串', price: '180', note: 'ヤゲン軟骨', translation: 'Cartilage' },
      { name: '豚精肉', price: '190', note: '北海道産豚肉', translation: 'Pork Skewer' },
      { name: '豚バラ串', price: '200', note: '旨味ジューシー', translation: 'Pork Belly' },
      { name: 'アスパラ巻き串', price: '250', note: '新鮮野菜巻き', translation: 'Asparagus Pork Wrap' },
      { name: 'しいたけ串', price: '180', note: '炭火醤油', translation: 'Shiitake Mushroom' },
    ]
  },
  {
    category: '居酒屋・一品料理',
    items: [
      { name: '名物もつ煮込み', price: '520', note: 'じっくり仕込み', translation: 'Simmered Tripe Stew' },
      { name: '出汁巻き玉子', price: '480', note: '焼きたてふわふわ', translation: 'Japanese Rolled Omelette' },
      { name: '自家製ポテトサラダ', price: '450', note: 'ほくほく手作り', translation: 'Potato Salad' },
      { name: '塩だれキャベツ', price: '380', note: 'スピードおつまみ', translation: 'Salt & Sesame Cabbage' },
      { name: '枝豆', price: '350', note: 'ビールのお供', translation: 'Boiled Edamame' },
      { name: '冷やしトマト', price: '400', note: '特製ドレッシング', translation: 'Chilled Fresh Tomato' },
      { name: '鶏の唐揚げ', price: '580', note: '秘伝醤油仕込み', translation: 'Japanese Fried Chicken' },
      { name: '揚げ出し豆腐', price: '480', note: '生姜と鰹節', translation: 'Deep-fried Tofu in Broth' },
    ]
  },
  {
    category: '鮮魚・刺身',
    items: [
      { name: '本日のお造り盛り合わせ', price: '1280', note: '産地直送・三品', translation: 'Assorted Sashimi Platter' },
      { name: '本まぐろ刺身', price: '880', note: '極上赤身', translation: 'Bluefin Tuna Sashimi' },
      { name: '炙りしめさば', price: '680', note: '脂のってます', translation: 'Seared Cured Mackerel' },
      { name: '海鮮ユッケ', price: '650', note: '卵黄と特製タレ', translation: 'Seafood Tartare with Egg' },
    ]
  },
  {
    category: '麺処・そば・うどん',
    items: [
      { name: 'ざる蕎麦', price: '680', note: '喉越し十割', translation: 'Chilled Soba Noodles' },
      { name: '天ぷら蕎麦', price: '1080', note: '揚げたて海老天', translation: 'Tempura Soba' },
      { name: '鴨南蛮蕎麦', price: '1150', note: '合鴨と焼き葱', translation: 'Duck & Leek Soba' },
      { name: '讃岐ぶっかけうどん', price: '620', note: 'コシのある生麺', translation: 'Sanuki Udon Noodles' },
    ]
  },
  {
    category: '〆・お食事・汁物',
    items: [
      { name: '香ばし焼きおにぎり', price: '300', note: '炭火醤油香る', translation: 'Grilled Rice Ball' },
      { name: '特製出汁茶漬け', price: '520', note: '鮭・梅・明太子', translation: 'Dashi Rice Soup' },
      { name: '鶏スープ雑炊', price: '550', note: '濃厚鶏出汁', translation: 'Chicken Porridge' },
      { name: '濃厚鶏ガラスープ', price: '200', note: 'お食事の〆に', translation: 'Hot Chicken Broth' },
    ]
  },
  {
    category: '甘味・デザート',
    items: [
      { name: '濃厚抹茶アイス', price: '350', note: '宇治抹茶使用', translation: 'Matcha Green Tea Ice Cream' },
      { name: '白玉ぜんざい', price: '450', note: '北海道産小豆', translation: 'Sweet Red Bean Soup' },
      { name: '黒蜜きなこわらび餅', price: '420', note: '本わらび粉使用', translation: 'Warabi Mochi' },
    ]
  }
];

export const INITIAL_MENU_STATE = {
  title: '本日のおすすめ',
  subtitle: '炭火焼き・季節の一品',
  footerNote: '※価格はすべて税込表示となっております。仕入れ状況により売り切れの際はご容赦ください。',
  storeName: '',
  dateText: '本日のお品書き',
  layout: 'vertical', // 'vertical' | 'horizontal'
  fontFamily: 'brush', // 'brush' | 'mincho' | 'gothic'
  frameStyle: 'traditional', // 'traditional' | 'minimal' | 'none'
  showEnglish: false,
  showNotes: true,
  priceFormat: 'kanji', // 'kanji' (例: 一八〇円・和風標準) | 'number' (例: 180円)
  paperSize: 'A4', // 'A4' | 'B5'
  paperOrientation: 'landscape', // 'landscape' (横長用紙・おすすめ・定番) | 'portrait' (縦長用紙)
  density: 'auto', // 'auto' (品数に応じて自動) | 'spacious' (ゆったり大) | 'normal' (標準中) | 'compact' (すっきり小)
  showDividers: false, // 区切り線（デフォルトOFFで無駄な線を排除）
  bgColor: '#ffffff', // 背景色（デフォルト純白）
  bgPattern: 'none', // 'none' (無地) | 'cloud' (雲竜繊維) | 'washi' (和紙粒) | 'grid' (和風格子)
  textColor: '#1c1917', // 文字色（デフォルト墨色）
  items: [
    { id: '1', name: 'とり精肉', price: '180', note: '塩・タレ', translation: 'Chicken Thigh' },
    { id: '2', name: '豚精肉', price: '190', note: '北海道産豚', translation: 'Pork Skewer' },
    { id: '3', name: '自家製つくね', price: '220', note: '秘伝ダレ', translation: 'Chicken Meatballs' },
    { id: '4', name: 'ねぎま', price: '190', note: '香ばしネギ', translation: 'Chicken & Scallion' },
    { id: '5', name: '鶏皮', price: '160', note: 'パリッと香ばしい', translation: 'Crispy Skin' },
    { id: '6', name: '鶏レバー', price: '180', note: 'とろける濃厚', translation: 'Chicken Liver' },
    { id: '7', name: '名物もつ煮込み', price: '520', note: '自慢の一品', translation: 'Simmered Tripe Stew' },
  ]
};

// やきとりもず 実店舗グランドメニュー（定番メニュー）初期データ（写真完全再現版）
export const MOZU_GRAND_MENU_STATE = {
  version: 'v2_photo_matched',
  menuType: 'grand',
  title: 'やきとりもず 定番お品書き',
  bgColor: '#dde6d5', // 実写真の若草色・淡緑和紙
  bgPattern: 'washi',
  textColor: '#1a1f1b',
  fontFamily: 'brush', // 筆文字
  paperSize: 'A4',
  paperOrientation: 'landscape',
  priceFormat: 'kanji',
  showDotPrefix: true, // 品名の頭に中黒「・」をつける（実写真スタイル）
  frameStyle: 'none', // 写真実物はフレーム枠線なし（用紙周囲の余白のみ）
  storeName: '',
  logoImage: '', // ユーザー「ロゴは無くていい」のため空
  noticeBlock: {
    show: true,
    logoText: '',
    logoImage: '',
    lines: [
      'お通し代として',
      'お一人様四〇〇円をいただいております。',
      '混雑時はお席のご利用を',
      '二時間までとさせていただきます。',
      'お会計はテーブルにて承ります。',
      'スタッフまでお声がけください。'
    ]
  },
  sections: [
    {
      id: 'yakimono',
      name: '焼き物',
      subtitle: '一本 塩・タレ',
      placement: 'top', // 上段（右側）
      uniformPrice: '',
      items: [
        { id: 'y1', name: 'とりもも', price: '250', note: '' },
        { id: 'y2', name: 'レバー', price: '220', note: '' },
        { id: 'y3', name: 'ハツ', price: '220', note: '' },
        { id: 'y4', name: 'すなぎも', price: '220', note: '' },
        { id: 'y5', name: 'かわ', price: '220', note: '' },
        { id: 'y6', name: '小肉', price: '220', note: '' },
        { id: 'y7', name: 'ぼんじり', price: '250', note: '' },
        { id: 'y8', name: 'ささみ', price: '220', note: '' },
        { id: 'y9', name: '手羽先（二ヶ）', price: '220', note: '' },
        { id: 'y10', name: 'つくね（月見・チーズ・梅）', price: '380', note: '' },
        { id: 'y11', name: '豚ハラミ', price: '440', note: '' },
        { id: 'y12', name: '豚タン', price: '350', note: '' },
        { id: 'y13', name: 'ガツ', price: '280', note: '' },
        { id: 'y14', name: 'ねぎ塩ホルモン', price: '280', note: '' },
        { id: 'y15', name: '合がも', price: '350', note: '' },
        { id: 'y16', name: '明太子（二本）', price: '440', note: '' },
        { id: 'y17', name: '長ねぎ（二本）', price: '350', note: '' },
        { id: 'y18', name: 'しいたけ（二本）', price: '350', note: '' },
        { id: 'y19', name: 'ししとう（二本）', price: '350', note: '' },
        { id: 'y20', name: 'トマト（二本）', price: '350', note: '' },
      ]
    },
    {
      id: 'topping',
      name: 'トッピング',
      subtitle: '',
      placement: 'top', // 上段（中央寄り）
      uniformPrice: '50', // 一括「各五〇円」
      items: [
        { id: 't1', name: '梅', price: '' },
        { id: 't2', name: 'チーズ', price: '' },
        { id: 't3', name: '山わさび', price: '' },
      ]
    },
    {
      id: 'salad',
      name: 'サラダ',
      subtitle: '',
      placement: 'top', // 上段（中央左寄り）
      uniformPrice: '',
      items: [
        { id: 's1', name: 'シーザーサラダ', price: '750', note: '' },
        { id: 's2', name: '和風サラダ', price: '750', note: '' },
      ]
    },
    {
      id: 'gohan',
      name: 'ご飯もの',
      subtitle: '',
      placement: 'top', // 上段（左側）
      uniformPrice: '',
      items: [
        { id: 'g1', name: 'ライス', price: '250', note: '' },
        { id: 'g2', name: 'おにぎり（梅・かつお）', price: '300', note: '' },
        { id: 'g3', name: '焼きおにぎり（二ヶ）', price: '550', note: '' },
        { id: 'g4', name: '特製納豆めし', price: '600', note: '' },
        { id: 'g5', name: '山わさびめし', price: '550', note: '' },
        { id: 'g6', name: '海苔茶漬け', price: '550', note: '' },
      ]
    },
    {
      id: 'ippin',
      name: '一品',
      subtitle: '',
      placement: 'bottom', // 下段（右側〜中央）
      uniformPrice: '',
      items: [
        { id: 'i1', name: 'ねぎ山わさび', price: '350', note: '' },
        { id: 'i2', name: '冷やっこ', price: '480', note: '' },
        { id: 'i3', name: 'えだまめ', price: '440', note: '' },
        { id: 'i4', name: '塩こぶピーマン', price: '450', note: '' },
        { id: 'i5', name: '揚げ出し豆腐', price: '700', note: '' },
        { id: 'i6', name: 'なす田楽', price: '680', note: '' },
        { id: 'i7', name: '赤ウインナーケチャップ炒め', price: '680', note: '' },
        { id: 'i8', name: 'だし巻き卵', price: '800', note: '' },
        { id: 'i9', name: 'ポテトフライ', price: '550', note: '' },
        { id: 'i10', name: 'モッツァレラわさび醤油漬け', price: '770', note: '' },
        { id: 'i11', name: '鶏のから揚げ', price: '800', note: '' },
        { id: 'i12', name: '手羽から揚げ', price: '980', note: '' },
        { id: 'i13', name: 'とり天', price: '1200', note: '' },
        { id: 'i14', name: 'たこから揚げ', price: '660', note: '' },
        { id: 'i15', name: 'たこわさ', price: '550', note: '' },
        { id: 'i16', name: '合がもスモーク', price: '550', note: '' },
        { id: 'i17', name: 'エイヒレ炙り', price: '550', note: '' },
      ]
    }
  ]
};
