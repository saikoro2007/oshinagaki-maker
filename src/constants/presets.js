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
  stampText: '名物', // 伝統的な赤印鑑テキスト（名物、厳選、もず、など）
  dateText: '本日のお品書き',
  layout: 'vertical', // 'vertical' | 'horizontal'
  fontFamily: 'brush', // 'brush' | 'mincho' | 'gothic'
  frameStyle: 'traditional', // 'traditional' | 'minimal' | 'none'
  showEnglish: false,
  showNotes: true,
  priceFormat: 'number', // 'number' (例: 180円) | 'kanji' (例: 一八〇円)
  paperSize: 'A4', // 'A4' | 'B5'
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
