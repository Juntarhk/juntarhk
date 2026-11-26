import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { useSeoSettings } from "@/contexts/SeoSettingsContext";

type PartnerCategory = "all" | "kindergarten" | "primary" | "secondary" | "university" | "ngo";

const PARTNERS: { name: string; nameEn: string; category: Exclude<PartnerCategory, "all"> }[] = [
  // ─── 幼稚園 ───
  { name: "基督教香港信義會靈工幼兒學校", nameEn: "ELCHK Ling Kung Nursery School", category: "kindergarten" },
  { name: "仁濟醫院裘錦秋幼稚園幼兒中心", nameEn: "Yan Chai Hospital Ju Ching Chu Kindergarten / Child Care Centre", category: "kindergarten" },
  { name: "香港保護兒童會新航黃埔幼兒學校", nameEn: "HKSPC Flying Dragon (Whampoa) Nursery School", category: "kindergarten" },
  { name: "保良局陳黎惠蓮幼稚園暨幼兒園", nameEn: "PLK Chan Lai Wai Lin Kindergarten cum Nursery", category: "kindergarten" },
  { name: "佳寶幼稚園", nameEn: "Guideposts Kindergarten", category: "kindergarten" },
  { name: "循道衛理田灣幼稚園幼兒園", nameEn: "Methodist Tin Wan Kindergarten / Nursery", category: "kindergarten" },
  { name: "樂民太陽島幼稚園", nameEn: "Sun Island English Kindergarten (Lok Man)", category: "kindergarten" },
  { name: "荃灣幼兒學校", nameEn: "Tsuen Wan Nursery School", category: "kindergarten" },
  { name: "筲箕灣循道衛理幼稚園", nameEn: "Shaukiwan Methodist Kindergarten", category: "kindergarten" },
  { name: "香港信義會頌安幼兒學校", nameEn: "ELCHK Chung On Nursery School", category: "kindergarten" },
  { name: "宣道會上書房中英文幼稚園", nameEn: "C&MA Sunnyside Anglo-Chinese Kindergarten", category: "kindergarten" },
  { name: "基督教宣道會安泰幼稚園", nameEn: "C&MA On Tai Kindergarten", category: "kindergarten" },
  { name: "中華基督教會協和幼稚園", nameEn: "C.C.C. Heep Woh Kindergarten", category: "kindergarten" },
  { name: "保良局莊啟程夫人(華貴)幼稚園暨幼兒園", nameEn: "PLK Mrs. Vicwood K.T. Chong (Wah Kwai) Kindergarten cum Nursery", category: "kindergarten" },
  { name: "保良局呂錦泰幼稚園暨幼兒園", nameEn: "PLK Lui Kam Tai Kindergarten cum Nursery", category: "kindergarten" },
  { name: "真理浸信會何袁惠鯨幼稚園", nameEn: "Truth Baptist Church Ho Yuen Wai King Kindergarten", category: "kindergarten" },
  { name: "天主教大埔幼稚園", nameEn: "Tai Po Catholic Kindergarten", category: "kindergarten" },
  { name: "仁愛堂田家炳幼稚園", nameEn: "Yan Oi Tong Tin Ka Ping Kindergarten", category: "kindergarten" },
  { name: "基督教小樹苗幼稚園", nameEn: "Little Saplings Christian Kindergarten", category: "kindergarten" },
  { name: "合一堂單家傳紀念幼稚園", nameEn: "Hop Yat Church Chan Pak Hong Memorial Kindergarten", category: "kindergarten" },
  { name: "麥理浩夫人中心幼稚園", nameEn: "HKSKH Lady MacLehose Centre Kindergarten", category: "kindergarten" },
  { name: "港九街坊婦女會丁毓珠幼稚園", nameEn: "Kowloon & HK Island Kaifong Women's Association Ting Yuk Chu Kindergarten", category: "kindergarten" },
  { name: "佛教慈慧幼稚園", nameEn: "Buddhist Chi Wai Kindergarten", category: "kindergarten" },
  { name: "神召會華人同工聯會景盛幼稚園", nameEn: "Assemblies of God HK Association King Shing Kindergarten", category: "kindergarten" },
  { name: "天主教聖雅各伯幼稚園", nameEn: "St. James' Catholic Kindergarten", category: "kindergarten" },
  { name: "啟思幼稚園幼兒園(屯門)", nameEn: "Creative Kindergarten / Nursery (Tuen Mun)", category: "kindergarten" },
  { name: "保良局黃樹雄幼稚園暨幼兒園", nameEn: "PLK Wong Shu Hung Kindergarten cum Nursery", category: "kindergarten" },
  { name: "呂陳慧貞幼稚園暨幼兒園", nameEn: "Lui Chan Wai Ching Kindergarten cum Nursery", category: "kindergarten" },
  { name: "聖雅各福群會麥潔蓮幼稚園", nameEn: "St. James' Settlement Belcher Kindergarten", category: "kindergarten" },
  { name: "大埔禮賢會幼稚園", nameEn: "Rhenish Church Grace School (Tai Po) Kindergarten", category: "kindergarten" },
  { name: "保安局張潘美意幼稚園", nameEn: "B.O.A. Cheung Poon Mei Yee Kindergarten", category: "kindergarten" },
  { name: "圓玄富善幼稚園", nameEn: "Yuen Yuen Fu Shin Kindergarten", category: "kindergarten" },
  { name: "明愛鯉魚門幼兒學校", nameEn: "Caritas Lei Yue Mun Nursery School", category: "kindergarten" },
  { name: "聖斯德望天主教幼稚園", nameEn: "St. Stephen's Catholic Kindergarten", category: "kindergarten" },
  { name: "東華三院王胡麗明幼稚園", nameEn: "TWGHs Wong Wu Lai Ming Kindergarten", category: "kindergarten" },
  { name: "聖公會聖基道幼兒園", nameEn: "S.K.H. St. Christopher's Nursery", category: "kindergarten" },
  { name: "中華基督教會沙田堂博康幼稚園", nameEn: "C.C.C. Shatin Church Pok Hong Kindergarten", category: "kindergarten" },
  { name: "漢師幼稚園（龍總）", nameEn: "Hon Wah Kindergarten (Kowloon Central)", category: "kindergarten" },
  { name: "圓玄幼兒中心(天逸邨)", nameEn: "Yuen Yuen Child Care Centre (Tin Yat Estate)", category: "kindergarten" },
  { name: "保良局葉吳彬彬幼稚園", nameEn: "PLK Yeh Ng Bun Bun Kindergarten", category: "kindergarten" },
  { name: "九龍迦南幼稚園", nameEn: "Canaan Kindergarten (Kowloon)", category: "kindergarten" },
  { name: "福來邨錦全幼稚園", nameEn: "Fuk Loi Estate Kam Chuen Kindergarten", category: "kindergarten" },
  { name: "香港保護兒童會深井幼兒學校", nameEn: "HKSPC Sham Tseng Nursery School", category: "kindergarten" },

  // ─── 小學 ───
  { name: "基慧小學", nameEn: "Kei Wai Primary School", category: "primary" },
  { name: "佛教中華康山學校", nameEn: "Buddhist Chung Wah Kornhill Primary School", category: "primary" },
  { name: "荃灣官立小學", nameEn: "Tsuen Wan Government Primary School", category: "primary" },
  { name: "樂華天主教小學", nameEn: "Lok Wah Catholic Primary School", category: "primary" },
  { name: "宣道會葉紹蔭紀念小學", nameEn: "C&MA Ip Shiu Yin Memorial Primary School", category: "primary" },
  { name: "仁愛堂田家炳小學", nameEn: "Yan Oi Tong Tin Ka Ping Primary School", category: "primary" },
  { name: "聖公會仁立小學", nameEn: "S.K.H. Yan Laap Primary School", category: "primary" },
  { name: "聖伯多祿天主教小學", nameEn: "St. Peter's Catholic Primary School", category: "primary" },
  { name: "聖公會基榮小學", nameEn: "S.K.H. Kei Wing Primary School", category: "primary" },
  { name: "聖公會偉倫小學", nameEn: "S.K.H. Wei Lun Primary School", category: "primary" },
  { name: "南元朗官立小學", nameEn: "South Yuen Long Government Primary School", category: "primary" },
  { name: "優才(楊殷有娣)書院小學部", nameEn: "G.T. (Ellen Yeung) College (Primary Section)", category: "primary" },
  { name: "崇真小學暨幼稚園", nameEn: "Tsung Tsin Primary School and Kindergarten", category: "primary" },
  { name: "曾梅千禧學校", nameEn: "Tsang Mui Millennium School", category: "primary" },
  { name: "匡智松嶺第三校", nameEn: "Hong Chi Pinehill No. 3 School", category: "primary" },
  { name: "伊斯蘭脫維善紀念學校", nameEn: "Islamic Kasim Tuet Memorial College", category: "primary" },
  { name: "香港朝陽小學", nameEn: "Hong Kong Chiu Yang Primary School", category: "primary" },
  { name: "八鄉中心小學", nameEn: "Pat Heung Central Primary School", category: "primary" },
  { name: "東華三院冼次雲小學", nameEn: "TWGHs Sin Chu Wan Primary School", category: "primary" },
  { name: "協恩中學附屬小學", nameEn: "Heep Yunn Primary School", category: "primary" },
  { name: "新界婦孺福利會基督教銘恩小學", nameEn: "NTW&JWA Christian Remembrance Primary School", category: "primary" },
  { name: "聖公會嘉福榮真小學", nameEn: "S.K.H. Ka Fuk Wing Chun Primary School", category: "primary" },
  { name: "嘉諾撒聖方濟各學校", nameEn: "St. Francis' Canossian School", category: "primary" },
  { name: "香港紅卍字會屯門卍慈小學", nameEn: "HKRSS Tuen Mun Primary School", category: "primary" },
  { name: "保良局莊啓程第二小學", nameEn: "PLK Vicwood K.T. Chong No.2 Primary School", category: "primary" },
  { name: "仁愛堂劉皇發夫人小學", nameEn: "Yan Oi Tong Madam Lau Wong Fat Primary School", category: "primary" },
  { name: "路德會沙崙學校", nameEn: "Sharon Lutheran School", category: "primary" },
  { name: "香港仔聖伯多祿天主教小學", nameEn: "Aberdeen St. Peter's Catholic Primary School", category: "primary" },
  { name: "金巴崙長老會耀道小學", nameEn: "Cumberland Presbyterian Church Yao Dao Primary School", category: "primary" },
  { name: "基督教香港信義會啟信學校", nameEn: "ELCHK Lutheran School", category: "primary" },
  { name: "黃埔宣道小學", nameEn: "Alliance Primary School, Whampoa", category: "primary" },
  { name: "筲箕灣崇真學校", nameEn: "Shaukiwan Tsung Tsin School", category: "primary" },
  { name: "保良局陳南昌夫人小學", nameEn: "PLK Mrs. Chan Nam Chong Memorial Primary School", category: "primary" },
  { name: "元朗公立中學友會鄧英業小學", nameEn: "YLPMS Alumni Association Tang Ying Yip Primary School", category: "primary" },
  { name: "路德會呂祥光小學", nameEn: "Lui Cheung Kwong Lutheran Primary School", category: "primary" },
  { name: "中華基督教會基法小學", nameEn: "C.C.C. Kei Faat Primary School", category: "primary" },
  { name: "香港紅十字會瑪嘉烈戴麟趾學校", nameEn: "HK Red Cross Margaret Anne Luk Memorial School", category: "primary" },
  { name: "地利亞（潤橋）英文小學", nameEn: "Delia English Primary School (Mei Foo)", category: "primary" },
  { name: "德望學校附屬小學", nameEn: "Good Hope Primary School cum Kindergarten", category: "primary" },
  { name: "樂善堂梁銶琚學校", nameEn: "LST Leung Kau Kui School", category: "primary" },
  { name: "香港耀能協會高福耀紀念學校", nameEn: "SAHK Ko Fook Iu Memorial School", category: "primary" },

  // ─── 中學 ───
  { name: "青年會書院", nameEn: "YMCA College", category: "secondary" },
  { name: "喇沙書院", nameEn: "La Salle College", category: "secondary" },
  { name: "嘉諾撒聖心書院", nameEn: "Sacred Heart Canossian College", category: "secondary" },
  { name: "救恩書院", nameEn: "Kau Yan College", category: "secondary" },
  { name: "李求恩紀念中學", nameEn: "Lee Kau Yan Memorial School", category: "secondary" },
  { name: "仁濟書院第二中學", nameEn: "Yan Chai Hospital No.2 Secondary School", category: "secondary" },
  { name: "福建中學(小西灣)", nameEn: "Fukien Secondary School (Siu Sai Wan)", category: "secondary" },
  { name: "香港神託會培基書院", nameEn: "Stewards Pooi Kei College", category: "secondary" },
  { name: "瑪利諾中學", nameEn: "Maryknoll Secondary School", category: "secondary" },
  { name: "東華三院鄺錫坤伉儷中學", nameEn: "TWGHs Mr. & Mrs. Kwong Sik Kwan College", category: "secondary" },
  { name: "東華三院黃笏南中學", nameEn: "TWGHs Wong Fut Nam College", category: "secondary" },
  { name: "沙田培英中學", nameEn: "Shatin Pui Ying College", category: "secondary" },
  { name: "聖言中學", nameEn: "Sun Yin College", category: "secondary" },
  { name: "保良局姚連生中學", nameEn: "PLK Yao Ling Sun College", category: "secondary" },
  { name: "保良局馬錦明夫人章馥仙中學", nameEn: "PLK Mrs. Ma Kam Ming-Cheung Fook Sien College", category: "secondary" },
  { name: "保良局胡忠中學", nameEn: "PLK Wu Chung College", category: "secondary" },
  { name: "香港道教聯合會雲泉學校", nameEn: "HKTA Wun Tsuen School", category: "secondary" },
  { name: "西貢崇真天主教學校(中學部)", nameEn: "Sai Kung Sung Tsun Catholic School (Secondary Section)", category: "secondary" },
  { name: "聖公會林護紀念中學", nameEn: "S.K.H. Lam Woo Memorial Secondary School", category: "secondary" },
  { name: "聖公會李炳中學", nameEn: "S.K.H. Li Ping Secondary School", category: "secondary" },
  { name: "聖公會聖匠中學", nameEn: "S.K.H. Holy Carpenter Secondary School", category: "secondary" },
  { name: "聖貞德中學", nameEn: "St. Joan of Arc Secondary School", category: "secondary" },
  { name: "香港正覺蓮社佛教普光學校", nameEn: "HHCKLA Buddhist Po Kwong School", category: "secondary" },
  { name: "中華傳道會劉永生中學", nameEn: "ECA Lau Wing Sang Secondary School", category: "secondary" },
  { name: "中華基督教會燕京書院", nameEn: "C.C.C. Yenching College", category: "secondary" },
  { name: "新界喇沙中學", nameEn: "New Territories La Salle Secondary School", category: "secondary" },
  { name: "天主教鳴遠中學", nameEn: "St. Ming Yuen Catholic Secondary School", category: "secondary" },
  { name: "天主教普照中學", nameEn: "Newman Catholic College", category: "secondary" },
  { name: "天主教母佑會蕭明中學", nameEn: "Siu Ming Catholic Secondary School", category: "secondary" },
  { name: "鳳溪廖萬石堂中學", nameEn: "Fung Kai Liu Man Shek Tong Secondary School", category: "secondary" },
  { name: "賽馬會體藝中學", nameEn: "Jockey Club Ti-I College", category: "secondary" },
  { name: "九龍塘學校(中學部)", nameEn: "Kowloon Tong School (Secondary Section)", category: "secondary" },
  { name: "柏立基教育學院校友會盧光輝紀念學校", nameEn: "ASBKEC Lau Kwong Fai Memorial School", category: "secondary" },
  { name: "香港浸會大學附屬學校王錦輝中小學", nameEn: "HKBU Affiliated School Wong Kam Fai Secondary and Primary School", category: "secondary" },
  { name: "循道衛理聯合教會李惠利中學", nameEn: "Methodist Lee Wai Lee College", category: "secondary" },
  { name: "深培中學", nameEn: "Semple Memorial Secondary School", category: "secondary" },
  { name: "衛理中學", nameEn: "Methodist College", category: "secondary" },
  { name: "嘉諾撒聖家書院", nameEn: "Holy Family Canossian College", category: "secondary" },
  { name: "將軍澳官立中學", nameEn: "Tseung Kwan O Government Secondary School", category: "secondary" },
  { name: "英華女書院", nameEn: "Ying Wa Girls' School", category: "secondary" },
  { name: "高雷中學", nameEn: "Kowloon Technical School", category: "secondary" },
  { name: "新界鄉議局大埔區中學", nameEn: "N.T. Heung Yee Kuk Tai Po District Secondary School", category: "secondary" },
  { name: "聖保祿中學", nameEn: "St. Paul's Secondary School", category: "secondary" },
  { name: "香港道教聯合會青松中學", nameEn: "HKTA Ching Chung Secondary School", category: "secondary" },
  { name: "心光盲人院暨學校", nameEn: "Ebenezer School & Home for the Visually Impaired", category: "secondary" },
  { name: "獅子會蔣翠琼中學", nameEn: "Lions College", category: "secondary" },
  { name: "九龍三育中學", nameEn: "Kowloon Sam Yuk Secondary School", category: "secondary" },
  { name: "香港航海學校", nameEn: "Hong Kong Sea School", category: "secondary" },
  { name: "嗇色園主辦可藝中學", nameEn: "Ho Ngai College (Sponsored by Sik Sik Yuen)", category: "secondary" },
  { name: "元朗天主教中學", nameEn: "Yuen Long Catholic Secondary School", category: "secondary" },
  { name: "長洲官立中學", nameEn: "Cheung Chau Government Secondary School", category: "secondary" },
  { name: "加拿大神召會嘉智中學", nameEn: "PAOC Ka Chi Secondary School", category: "secondary" },
  { name: "高主教書院", nameEn: "Raimondi College", category: "secondary" },
  { name: "德貞女子中學", nameEn: "Tack Ching Girls' Secondary School", category: "secondary" },
  { name: "筲箕灣東官立中學", nameEn: "Shau Kei Wan East Government Secondary School", category: "secondary" },
  { name: "筲箕灣官立中學", nameEn: "Shau Kei Wan Government Secondary School", category: "secondary" },
  { name: "港九潮州公會中學", nameEn: "HK & KLN Chiu Chow Public Association Secondary School", category: "secondary" },
  { name: "香港管理專業協會羅桂祥中學", nameEn: "HKMA Lo Kwai Cheung Secondary School", category: "secondary" },
  { name: "香港管理專業協會李國寶中學", nameEn: "HKMA David Li Kwok Po College", category: "secondary" },
  { name: "保良局朱敬文中學", nameEn: "PLK Chu Ching Wan Secondary School", category: "secondary" },
  { name: "聖母無玷聖心書院", nameEn: "Immaculate Heart of Mary College", category: "secondary" },
  { name: "中華基督教會協和書院", nameEn: "C.C.C. Heep Woh College", category: "secondary" },
  { name: "天主教崇德英文書院", nameEn: "Shung Tak Catholic English College", category: "secondary" },
  { name: "粉嶺禮賢會中學", nameEn: "Fanling Rhenish Church Secondary School", category: "secondary" },
  { name: "瑪利諾修院學校(中學部)", nameEn: "Maryknoll Convent School (Secondary Section)", category: "secondary" },
  { name: "中華傳道會李賢堯紀念中學", nameEn: "ECA Lee Iau Yao Memorial Secondary School", category: "secondary" },
  { name: "天主教伍少梅中學", nameEn: "Ng Siu Mui Catholic Secondary School", category: "secondary" },
  { name: "天主教南華中學", nameEn: "South China Catholic Secondary School", category: "secondary" },
  { name: "德望學校", nameEn: "Good Hope School", category: "secondary" },
  { name: "順德聯誼總會李兆基中學", nameEn: "Shun Tak Fraternal Association Lee Shau Kee College", category: "secondary" },

  // ─── 大學及專上院校 ───
  { name: "香港大學", nameEn: "The University of Hong Kong (HKU)", category: "university" },
  { name: "浸會大學", nameEn: "Hong Kong Baptist University (HKBU)", category: "university" },
  { name: "嶺南大學", nameEn: "Lingnan University", category: "university" },
  { name: "香港都會大學", nameEn: "Hong Kong Metropolitan University (HKMU)", category: "university" },
  { name: "香港恒生大學", nameEn: "The Hang Seng University of Hong Kong (HSUHK)", category: "university" },
  { name: "高科院 THEi", nameEn: "Technological and Higher Education Institute of Hong Kong (THEi)", category: "university" },
  { name: "宏恩基督教學院", nameEn: "Gratia Christian College", category: "university" },

  // ─── 機構 / NGO ───
  { name: "香港青年協會", nameEn: "The Hong Kong Federation of Youth Groups (HKFYG)", category: "ngo" },
  { name: "鄰舍輔導會", nameEn: "The Neighbourhood Advice-Action Council (NAAC)", category: "ngo" },
  { name: "新家園協會", nameEn: "New Home Association", category: "ngo" },
  { name: "兒童發展基金", nameEn: "Child Development Fund", category: "ngo" },
  { name: "香港課外活動主任協會", nameEn: "Hong Kong Association of Extra-curricular Activities Masters", category: "ngo" },
  { name: "聯合國兒童基金會", nameEn: "UNICEF Hong Kong", category: "ngo" },
  { name: "香港青少年輔導會", nameEn: "Hong Kong Youth Counseling Association", category: "ngo" },
  { name: "騁志發展基金", nameEn: "U-Hearts Development Fund", category: "ngo" },
  { name: "香港遊樂場協會", nameEn: "Hong Kong Playground Association", category: "ngo" },
  { name: "聖公會聖基道兒童院", nameEn: "S.K.H. St. Christopher's Children's Home", category: "ngo" },
  { name: "香港聾人子女協會", nameEn: "Children of Deaf Adults Hong Kong (CODA HK)", category: "ngo" },
  { name: "自在社", nameEn: "Be Free", category: "ngo" },
  { name: "生命教育訓練", nameEn: "Life Education Training", category: "ngo" },
  { name: "兩地一心", nameEn: "U-Hearts", category: "ngo" },
  { name: "MAD Charity Fund Limited", nameEn: "MAD Charity Fund Limited", category: "ngo" },
  { name: "香港婦女中心協會", nameEn: "Hong Kong Women's Centre Association", category: "ngo" },
  { name: "香港小童群益會", nameEn: "The Boys' & Girls' Clubs Association of Hong Kong (BGCA)", category: "ngo" },
  { name: "香港中華基督教青年會", nameEn: "Chinese YMCA of Hong Kong", category: "ngo" },
  { name: "保良局", nameEn: "Po Leung Kuk", category: "ngo" },
  { name: "聖公會", nameEn: "Sheng Kung Hui (Anglican Church)", category: "ngo" },
  { name: "香港明愛", nameEn: "Caritas Hong Kong", category: "ngo" },
  { name: "聖雅各福群會", nameEn: "St. James' Settlement", category: "ngo" },
  { name: "地球拯救隊", nameEn: "Earth Rescue Team", category: "ngo" },
  { name: "香港傷健共融網絡", nameEn: "Hong Kong Shared Goodness Network", category: "ngo" },
  { name: "愛心工程", nameEn: "Love Project", category: "ngo" },
  { name: "香港賽馬會", nameEn: "The Hong Kong Jockey Club", category: "ngo" },
  { name: "香港工商總會", nameEn: "Hong Kong Federation of Commerce and Industry", category: "ngo" },
  { name: "深水埗民政事務處", nameEn: "Sham Shui Po District Office", category: "ngo" },
  { name: "萱草園家庭教育中心", nameEn: "Hemerocallis Garden Family Education Centre", category: "ngo" },
  { name: "AIA International Ltd", nameEn: "AIA International Ltd", category: "ngo" },
  { name: "Manulife (International) Ltd", nameEn: "Manulife (International) Ltd", category: "ngo" },
  { name: "FWD Financial Planning Ltd", nameEn: "FWD Financial Planning Ltd", category: "ngo" },
  { name: "Prudential Hong Kong Ltd", nameEn: "Prudential Hong Kong Ltd", category: "ngo" },
  { name: "Sun Life Hong Kong Ltd", nameEn: "Sun Life Hong Kong Ltd", category: "ngo" },
  { name: "Branford Ltd", nameEn: "Branford Ltd", category: "ngo" },
];

const CATEGORY_COLORS: Record<Exclude<PartnerCategory, "all">, string> = {
  kindergarten: "bg-amber-50 text-amber-800 border-amber-200",
  primary:      "bg-sky-50 text-sky-800 border-sky-200",
  secondary:    "bg-violet-50 text-violet-800 border-violet-200",
  university:   "bg-rose-50 text-rose-800 border-rose-200",
  ngo:          "bg-emerald-50 text-emerald-800 border-emerald-200",
};

const PHOTOS = [
  "/event-kinball-2.jpg", "/event-photo-13.jpg", "/event-photo-23.jpg", "/event-photo-15.jpg",
  "/event-dodgebee.jpg",  "/event-photo-16.jpg", "/event-photo-24.jpg", "/event-sportsday.jpg",
  "/event-photo-18.jpg",  "/event-photo-25.jpg", "/event-kubb.jpg",     "/event-cornhole.jpg",
];

export default function Partners() {
  const { t, lang } = useLanguage();
  const seoSettings = useSeoSettings();
  const pl = t.partnerList;
  const [active, setActive] = useState<PartnerCategory>("all");

  const tabs: { key: PartnerCategory; label: string }[] = [
    { key: "all",         label: pl.all },
    { key: "kindergarten",label: pl.kindergarten },
    { key: "primary",     label: pl.primary },
    { key: "secondary",   label: pl.secondary },
    { key: "university",  label: pl.university },
    { key: "ngo",         label: pl.ngo },
  ];

  const filtered = active === "all" ? PARTNERS : PARTNERS.filter(p => p.category === active);

  return (
    <AppLayout darkHero={false}>
      <SEO
        title={lang === "en"
          ? (seoSettings["seo_page_partners_title_en"] || "Partner Schools & Organisations | JuntarHK Photography & AI Education")
          : (seoSettings["seo_page_partners_title_zh"] || "合作學校及機構｜香港中小學信賴 JuntarHK 攝影及 AI 教育課程")}
        description={lang === "en"
          ? (seoSettings["seo_page_partners_description_en"] || "JuntarHK partners with Hong Kong kindergartens, primary and secondary schools and NGOs to deliver photography education, school media, AI creation and adventure learning programmes.")
          : (seoSettings["seo_page_partners_description_zh"] || "JuntarHK 與香港多所幼稚園、小學、中學及社福機構合作，提供攝影教育、校園媒體及 AI 創作課程，以及歷奇及體驗學習活動。")}
        keywords={seoSettings["seo_page_partners_keywords"] || "JuntarHK合作學校,攝影教育合作,AI教育合作,校園媒體,香港中小學合作機構,school photography partner HK,AI education partner Hong Kong,school media programme"}
        path="/partners"
        lang={lang}
      />
      <div className="bg-background pt-24">

        {/* Contained content */}
        <div className="container mx-auto px-4 max-w-5xl pb-10">

          {/* Back link */}
          <div className="mb-8">
            <Link href="/about">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-[#1A3D4A] text-sm font-medium transition-colors">
                {pl.backLink}
              </button>
            </Link>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl font-extrabold text-[#1A3D4A] mb-4">{pl.sectionTitle}</h1>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto">{pl.sectionSub}</p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  active === tab.key
                    ? "bg-[#1A3D4A] text-white border-[#1A3D4A] shadow-md"
                    : "bg-white text-[#1A3D4A] border-[#1A3D4A]/20 hover:border-[#1A3D4A]/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* School Name Pills */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap justify-center gap-2.5"
          >
            {filtered.map((p, idx) => (
              <div
                key={idx}
                className={`px-3.5 py-1.5 rounded-full border text-sm font-medium ${CATEGORY_COLORS[p.category]}`}
              >
                {lang === "en" ? p.nameEn : p.name}
              </div>
            ))}
            {/* etc. tag */}
            <div className="px-3.5 py-1.5 rounded-full border text-sm font-medium bg-gray-50 text-gray-400 border-gray-200">
              {lang === "en" ? "and more…" : "等等…"}
            </div>
          </motion.div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted-foreground mt-6">＊{pl.disclaimer}</p>
        </div>

        {/* Static photo grid — full bleed */}
        <div className="px-4 pb-16 pt-10">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-w-6xl mx-auto">
            {PHOTOS.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="aspect-square rounded-xl overflow-hidden shadow-sm"
              >
                <img src={src} alt={`JuntarHK 校園活動實況 ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
