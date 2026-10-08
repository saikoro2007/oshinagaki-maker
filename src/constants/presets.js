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
  version: 'v7_mozu_recommend_2026',
  title: '本日のおすすめ',
  subtitle: '',
  footerNote: '※価格はすべて税込表示となっております。\n　仕入れ状況により売り切れの際はご容赦ください。',
  footerNoteAlign: 'bottom', // 'bottom' (下寄せ・標準) | 'center' | 'top'
  storeName: '',
  dateText: '本日のお品書き',
  layout: 'vertical', // 'vertical' | 'horizontal'
  fontFamily: 'brush', // 'brush' | 'mincho' | 'gothic'
  frameStyle: 'none', // 写真実物はフレーム枠線なし
  showEnglish: false,
  showNotes: false,
  showDotPrefix: true, // 品名の頭に中黒「・」をつける（実物写真同様）
  priceFormat: 'kanji', // 'kanji' (例: 三八〇円)
  paperSize: 'A4', // 'A4' | 'B5'
  paperOrientation: 'landscape', // 横置き
  density: 'spacious', // 'auto' | 'spacious' | 'normal' | 'compact'
  fontScale: 115, // 文字サイズスケール (%): 11品に最適化された迫力サイズ
  showDividers: false, // 区切り線なし（実物同様）
  bgColor: '#ffffff', // 背景色（純白）
  bgPattern: 'none', // 無地
  textColor: '#1c1917', // 墨色
  items: [
    { id: '1', name: '豚巻きキムチ串', price: '380', note: '', translation: '' },
    { id: '2', name: '豚巻きにんにく串 （十勝産にんにく）', price: '380', note: '', translation: '' },
    { id: '3', name: 'やげんなんこつ串', price: '330', note: '', translation: '' },
    { id: '4', name: '牛すじ煮込み', price: '880', note: '', translation: '' },
    { id: '5', name: 'ミノポン', price: '660', note: '', translation: '' },
    { id: '6', name: 'ガーリックシュリンプ', price: '680', note: '', translation: '' },
    { id: '7', name: '焼きなす', price: '680', note: '', translation: '' },
    { id: '8', name: '炭火焼イカマヨネーズ', price: '770', note: '', translation: '' },
    { id: '9', name: '揚げ出しなす', price: '770', note: '', translation: '' },
    { id: '10', name: 'カスベ一夜干し', price: '880', note: '', translation: '' },
    { id: '11', name: 'サバ串', price: '980', note: '', translation: '' },
  ]
};

// やきとりもず 実店舗グランドメニュー（定番メニュー）初期データ（写真完全再現版）
export const MOZU_GRAND_MENU_STATE = {
  version: 'v3_kaitei_pdf_2026',
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
  sectionSpacing: 'spacious', // 'spacious' (広め・ゆったり標準) | 'auto' | 'normal' | 'compact'
  itemFontSize: 'large', // 'large' (大・ゆったり標準) | 'normal' | 'small'
  logoSize: 140, // px (40 - 280)
  logoPosition: 'bottom-left', // 'bottom-left' (常に左下・PDF原本スタイル) | 'center' | 'top'
  logoImage: '', // ユーザー登録画像または空
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
        { id: 'y2', name: 'ハツ', price: '220', note: '' },
        { id: 'y3', name: 'レバー', price: '220', note: '' },
        { id: 'y4', name: 'すなぎも', price: '220', note: '' },
        { id: 'y5', name: 'かわ', price: '220', note: '' },
        { id: 'y6', name: '小肉', price: '250', note: '' },
        { id: 'y7', name: 'ぽんじり', price: '220', note: '' },
        { id: 'y8', name: 'ささみ', price: '220', note: '' },
        { id: 'y9', name: '手羽先（二ヶ）', price: '380', note: '' },
        { id: 'y10', name: 'つくね（月見・チーズ・梅）', price: '440', note: '' },
        { id: 'y11', name: '豚', price: '250', note: '' },
        { id: 'y12', name: '豚ハラミ', price: '350', note: '' },
        { id: 'y13', name: '豚タン', price: '280', note: '' },
        { id: 'y14', name: 'ガツ', price: '280', note: '' },
        { id: 'y15', name: 'ねぎ塩ホルモン', price: '250', note: '' },
        { id: 'y16', name: '合がも', price: '350', note: '' },
        { id: 'y17', name: '明太子（二本）', price: '440', note: '' },
        { id: 'y18', name: '長ねぎ（二本）', price: '350', note: '' },
        { id: 'y19', name: 'しいたけ（二本）', price: '350', note: '' },
        { id: 'y20', name: 'ししとう（二本）', price: '350', note: '' },
        { id: 'y21', name: 'トマト（二本）', price: '350', note: '' },
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
        { id: 'i4', name: '塩こぶピーマン', price: '550', note: '' },
        { id: 'i5', name: '揚げ出し豆腐', price: '770', note: '' },
        { id: 'i6', name: 'なす田楽', price: '680', note: '' },
        { id: 'i7', name: '赤ウインナーケチャップ炒め', price: '680', note: '' },
        { id: 'i8', name: 'だし巻き卵', price: '660', note: '' },
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

// やきとりもず ドリンクメニュー初期データ（写真実物完全再現版）
export const MOZU_DRINK_MENU_STATE = {
  version: 'v1_drink_menu_2026',
  menuType: 'drink', // 2段組エンジンを使用 (お飲み物)
  title: 'やきとりもず お飲み物',
  bgColor: '#ffffff', // ドリンクメニュー実物の白背景
  bgPattern: 'none',
  textColor: '#1a1f1b',
  fontFamily: 'brush', // 筆文字
  paperSize: 'A4',
  paperOrientation: 'landscape',
  priceFormat: 'kanji',
  showDotPrefix: true, // 品名の頭に中黒「・」をつける（実物同様）
  frameStyle: 'none', // フレーム枠線なし
  storeName: '',
  sectionSpacing: 'auto', // 用紙に合わせて自動均等配置
  itemFontSize: 'large', // ゆったり標準
  logoSize: 140,
  logoPosition: 'bottom-left',
  logoImage: '',
  noticeBlock: {
    show: false, // 写真実物は店舗案内なし
    logoText: '',
    logoImage: '',
    lines: []
  },
  sections: [
    {
      id: 'beer',
      name: 'ビール',
      subtitle: '',
      placement: 'top',
      uniformPrice: '',
      items: [
        { id: 'b1', name: 'サッポロクラシック樽生', price: '650', note: '' },
        { id: 'b2', name: 'ノンアルコールビール', price: '450', note: '' },
      ]
    },
    {
      id: 'highball',
      name: 'ハイボール',
      subtitle: '',
      placement: 'top',
      uniformPrice: '',
      items: [
        { id: 'hb1', name: 'デュワーズ樽詰', price: '600', note: '' }
      ]
    },
    {
      id: 'sour',
      name: 'サワー',
      subtitle: 'ノンアル可',
      placement: 'top',
      uniformPrice: '580',
      items: [
        { id: 'sr1', name: 'レモン', price: '' },
        { id: 'sr2', name: 'ライム', price: '' },
        { id: 'sr3', name: 'グレープフルーツ', price: '' },
        { id: 'sr4', name: 'うめ', price: '' },
        { id: 'sr5', name: 'カルピス', price: '' },
        { id: 'sr6', name: '巨峰', price: '' },
        { id: 'sr7', name: 'パンチレモン', price: '' },
        { id: 'sr8', name: '男梅', price: '' },
        { id: 'sr9', name: 'パイン', price: '' },
        { id: 'sr10', name: 'シークワーサー', price: '' },
        { id: 'sr11', name: 'オレンジ', price: '' },
        { id: 'sr12', name: 'マスカット', price: '' },
        { id: 'sr13', name: 'ラムネ', price: '' },
        { id: 'sr14', name: 'カシス', price: '' },
        { id: 'sr15', name: '緑茶割り', price: '' },
        { id: 'sr16', name: 'ウーロン割り', price: '' },
      ]
    },
    {
      id: 'shochu_mugi',
      name: '焼酎 麦',
      subtitle: 'ロック・水割り・ソーダ',
      placement: 'top',
      uniformPrice: '',
      items: [
        { id: 'sc1', name: '銀座のすずめ 琥珀', price: '700', note: '' },
        { id: 'sc2', name: '薩州 呂布', price: '700', note: '' },
      ]
    },
    {
      id: 'shochu_imo',
      name: '焼酎 芋',
      subtitle: 'ロック・水割り・ソーダ',
      placement: 'top',
      uniformPrice: '',
      items: [
        { id: 'sc3', name: 'だいやめ〜DAIYAME〜', price: '700', note: '' },
        { id: 'sc4', name: '薩州 赤兎馬', price: '700', note: '' },
        { id: 'sc5', name: '三岳', price: '800', note: '' },
      ]
    },
    {
      id: 'nihonshu',
      name: '日本酒',
      subtitle: '',
      placement: 'bottom',
      uniformPrice: '',
      items: [
        { id: 'ns1', name: '十勝碧雲蔵 純米(冷酒一合)', price: '750', note: '' },
        { id: 'ns2', name: '北の勝(冷酒300ml)', price: '1000', note: '' },
        { id: 'ns3', name: '賀茂鶴(冷酒300ml)', price: '1200', note: '' },
        { id: 'ns4', name: '酔鯨(冷酒300ml)', price: '1500', note: '' },
        { id: 'ns5', name: '菊正宗(熱燗一合)', price: '700', note: '' },
      ]
    },
    {
      id: 'kajitsushu',
      name: '果実酒',
      subtitle: 'ロック・水割り・ソーダ',
      placement: 'bottom',
      uniformPrice: '',
      items: [
        { id: 'kj1', name: '黒梅酒', price: '600', note: '' },
        { id: 'kj2', name: 'あらごしみかん酒', price: '800', note: '' },
        { id: 'kj3', name: 'あらごしもも酒', price: '800', note: '' },
        { id: 'kj4', name: 'あらごしパイン酒', price: '800', note: '' },
      ]
    },
    {
      id: 'wine',
      name: 'ボトルワイン',
      subtitle: '',
      placement: 'bottom',
      uniformPrice: '',
      items: [
        { id: 'wn1', name: 'クロード・ヴァル(赤)', price: '2500', note: '' },
        { id: 'wn2', name: 'プリモ・フィオーレロンガネージ(白)', price: '3000', note: '' },
      ]
    },
    {
      id: 'softdrink',
      name: 'ソフトドリンク',
      subtitle: '',
      placement: 'bottom',
      uniformPrice: '300',
      items: [
        { id: 'sd1', name: '緑茶', price: '' },
        { id: 'sd2', name: 'ウーロン茶', price: '' },
        { id: 'sd3', name: 'オレンジ', price: '' },
        { id: 'sd4', name: 'アップル', price: '' },
        { id: 'sd5', name: 'コーラ', price: '' },
        { id: 'sd6', name: 'サイダー', price: '' },
        { id: 'sd7', name: 'カルピス', price: '' },
      ]
    }
  ]
};
